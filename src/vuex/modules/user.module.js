import { vuexTypes } from '../types'
import { usersService } from '../../js/services/users.service'
import { fileService } from '../../js/services/file.service'
import { blobFilters, blobTypes } from '../../js/const/documents.const'
import { userTypes, userStates } from '../../js/const/user.const'
import { DocumentContainer } from '../../js/helpers/DocumentContainer'
import get from 'lodash/get'

export const state = {
  email: '',
  type: '',
  state: '',
  rejectReason: '',
  createdAt: '',
  kycSequence: '',
  details: {
    favorites: []
  },
  kycDetails: {},
  kycDocuments: {}
}

export const mutations = {
  SET_USER_EMAIL (state, email) {
    state.email = email
  },
  SET_USER_TYPE (state, type) {
    state.type = type
  },
  SET_USER_STATE (state, userState) {
    state.state = userState
  },
  SET_USER_REJECT_REASON (state, rejectReason) {
    state.rejectReason = rejectReason
  },
  SET_USER_CREATED_AT (state, createdAt) {
    state.createdAt = createdAt
  },
  SET_FAVORITES: (state, favorites) => {
    state.details.favorites = favorites
  },
  SET_USER_KYC_SEQUENCE: (state, sequence) => {
    state.kycSequence = sequence
  },
  SET_USER_KYC_DETAILS: (state, details) => {
    state.kycDetails = details
  },
  SET_USER_KYC_DOCUMENTS: (state, documents) => {
    state.kycDocuments = Object.entries(documents)
      .reduce((kycDocuments, [type, document]) => {
        kycDocuments[type] = new DocumentContainer(document)
        return kycDocuments
      }, {})
  }
}

export const actions = {
  async GET_USER_DETAILS ({ commit }) {
    const userDetails = await usersService.loadUser()

    commit(vuexTypes.SET_USER_TYPE, userDetails.data('type'))
    commit(vuexTypes.SET_USER_STATE, userDetails.attribute('state'))
    commit(vuexTypes.SET_USER_REJECT_REASON, userDetails.attribute('reject_reason'))
    commit(vuexTypes.SET_USER_CREATED_AT, userDetails.attribute('created_at'))
    commit(vuexTypes.SET_USER_KYC_SEQUENCE, userDetails.attribute('kyc_sequence'))
  },

  async GET_USER_KYC ({ commit }, sequence) {
    const blobs = await usersService.blobsOf()
      .getAll({
        [blobFilters.type]: blobTypes.kycForm.num,
        [blobFilters.kycSequence]: sequence
      })
    const kycAll = blobs[0] || {}
    const kycDetails = kycAll.details || { address: {} }
    const kycDocuments = kycAll.documents || {}
    commit(vuexTypes.SET_USER_KYC_DETAILS, kycDetails)
    commit(vuexTypes.SET_USER_KYC_DOCUMENTS, kycDocuments)
  },

  async UPDATE_USER_KYC_DETAILS ({ commit }, opts) {
    await Promise.all([
      await usersService.blobsOf().create(
        blobTypes.kycForm.str, {
          details: opts.details,
          documents: opts.documents,
          kyc_sequence: opts.sequence
        },
        { [blobFilters.kycSequence]: opts.sequence }
      ),
      usersService.patchUserDetails(
        userTypes.general,
        userStates.waitingForApproval,
        +opts.sequence
      )
    ])
  },

  async UPDATE_USER_KYC_DOCUMENTS ({ commit }, documents) {
    return Promise.all(
      Object.entries(documents)
        .filter(([type, document]) => document.file)
        .map(([type, document]) => fileService.uploadFile({
          type: type,
          file: document.file,
          mimeType: document.mimeType
        })
          .then(key => ({ key, type, name: document.name, mimeType: document.mimeType }))
        ))
        .then(responses => responses
          .reduce((newDocuments, document) => {
            newDocuments[document.type] = {
              type: document.type,
              mimeType: document.mimeType,
              name: document.name,
              key: document.key
            }
            return newDocuments
          }, {}))
  },

  async GET_USER_FAVORITES ({ commit }) {
    const response = await usersService.loadUserFavorites()
    const favorites = response
      .data()
      .map(item => ({id: get(item, 'data.id'), key: get(item, 'data.attributes.key')}))
    commit(vuexTypes.SET_FAVORITES, favorites)
  }
}

export const getters = {
  userEmail: state => state.email,
  userState: state => state.state,
  userType: state => state.type,
  userRejectReason: state => state.rejectReason,
  userCreatedAt: state => state.createdAt,
  userKycSequence: state => state.kycSequence,
  userKycDetails: state => state.kycDetails,
  userKycDocuments: state => state.kycDocuments,
  userFavorites: state => state.details.favorites
}

export default {
  actions,
  getters,
  mutations,
  state
}
