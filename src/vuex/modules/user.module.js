import { Keypair } from 'swarm-js-sdk'
import { vuexTypes } from '../types'
import { usersService } from '../../js/services/users.service'
import { blobFilters, blobTypes } from '../../js/const/documents.const'
import get from 'lodash/get'

export const state = {
  email: '',
  keys: {
    accountId: '',
    seed: '',
    publicKey: ''
  },
  wallet: {
    id: ''
  },
  details: {
    type: '',
    state: '',
    kyc_sequence: 0,
    reject_reason: '',
    airdrop_state: '',
    created_at: ''
  },
  individual_data: {
    first_name: '',
    last_name: ''
  },
  favorites: []
}

export const mutations = {
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_KEYS: (state, keys) => {
    state.keys = keys
  },
  SET_WALLET_ID: (state, id) => {
    state.wallet.id = id
  },
  SET_USER_DETAILS: (state, details) => {
    state.details = details
  },
  SET_INDIVIDUAL_DATA: (state, data) => {
    state.individual_data = data[0] || { first_name: '', last_name: '' }
  },
  SET_FAVORITES: (state, favorites) => {
    state.favorites = favorites
  }
}

export const actions = {
  STORE_LOGIN_DATA: ({ commit }, { accountId, email, publicKey, seed, walletId }) => {
    commit(vuexTypes.SET_KEYS, { accountId, seed, publicKey })
    commit(vuexTypes.SET_WALLET_ID, walletId)
    commit(vuexTypes.SET_EMAIL, email)
  },
  SET_USER_DETAILS: ({ commit }, { type, state, kyc_sequence, reject_reason }) => {
    commit(vuexTypes.SET_USER_DETAILS, { type, state, kyc_sequence, reject_reason })
  },

  async GET_INDIVIDUAL_DATA ({ commit, getters }) {
    commit('SET_INDIVIDUAL_DATA', await usersService.blobsOf().getAll({
      [blobFilters.type]: blobTypes.kycForm.num,
      [blobFilters.kycSequence]: getters.userKycSequence
    }))
  },

  async GET_FAVORITES ({ commit }) {
    const response = await usersService.loadUserFavorites()
    const favorites = response
      .data()
      .map(item => ({id: get(item, 'data.id'), key: get(item, 'data.attributes.key')}))
    commit(vuexTypes.SET_FAVORITES, favorites)
  },

  async GET_USER_DETAILS ({ commit }) {
    const userDetails = await usersService.loadUser()
    commit(vuexTypes.SET_USER_DETAILS, {
      kyc_sequence: userDetails.attribute('kyc_sequence'),
      reject_reason: userDetails.attribute('reject_reason'),
      type: userDetails.data('type'),
      state: userDetails.attribute('state')
    })
  }
}

export const getters = {
  userEmail: state => state.email,
  keypair: state => state.keys.seed ? Keypair.fromSecret(state.keys.seed) : {},
  userAccountId: state => state.keys.accountId,
  publicKey: state => state.keys.publicKey,
  seed: state => state.keys.seed,
  walletId: state => state.wallet.id,
  userState: state => state.details.state,
  userType: state => state.details.type,
  userAirdropState: state => state.details.airdrop_state,
  userKycSequence: state => state.details.kyc_sequence,
  rejectReason: state => state.details.reject_reason,
  firstName: state => state.individual_data.first_name,
  lastName: state => state.individual_data.last_name,
  userCreatedAt: state => state.details.created_at,
  userFavorites: state => state.favorites
}

export default {
  actions,
  getters,
  mutations,
  state
}
