import { blobTypes } from '../../js/const/documents.const'
import { DocumentContainer } from '../../js/helpers/DocumentContainer'
import { usersService } from '../../js/services/users.service'
import { StateHelper } from '../helpers/state.helper'
import { vuexTypes } from '../types'
import { Keypair } from 'swarm-js-sdk'
import { RecordFactory } from '../../js/records/factory'

import { accountsService } from '../../js/services/accounts.service'
import { reviewableRequestsService } from '../../js/services/reviewable_requests.service'
import { fileService } from '../../js/services/file.service'

import { ACCOUNT_STATES } from '../../js/const/account.const'

import { kycIndividualSchema } from '../../vue/app/verification/spec/kyc-individual.schema'

export const state = {
  account: {
    external_system_accounts: []
  },
  balances: [],
  keys: {
    accountId: '',
    publicKey: '',
    seed: ''
  },
  // kyc:
  kycRequests: [],
  kycData: {
    address: {},
    documents: {}
  },
  kycDocuments: {}
}

export const mutations = {
  SET_ACCOUNT_KEYS (state, keys) {
    state.keys = keys
  },

  SET_ACCOUNT_DETAILS (state, account) {
    state.account = account
  },

  SET_ACCOUNT_BALANCES (state, balances) {
    state.balances = balances
  },

  SET_ACCOUNT_KYC_REQUESTS (state, requests) {
    state.kycRequests = requests
  },

  SET_ACCOUNT_KYC_DATA (state, data) {
    state.kycData = data
  },

  SET_ACCOUNT_KYC_DOCUMENTS (state, documents) {
    state.kycDocuments = kycIndividualSchema.docs
      .reduce((kycDocuments, doc) => {
        if (!kycDocuments[doc.type]) {
          kycDocuments[doc.type] = {}
        }
        kycDocuments[doc.type][doc.side] = new DocumentContainer(documents[doc.type][doc.side])
        return kycDocuments
      }, {})
  }
}

export const actions = {
  async GET_ACCOUNT_DETAILS ({ commit }) {
    commit(vuexTypes.SET_ACCOUNT_DETAILS, await accountsService.loadAccount())
  },

  async GET_ACCOUNT_BALANCES ({ commit }) {
    commit(vuexTypes.SET_ACCOUNT_BALANCES, await accountsService.loadDetailsForEachBalance())
  },

  async GET_ACCOUNT_KYC_REQUESTS ({ commit }) {
    const requests = await reviewableRequestsService.loadKycReviewableRequests()
    commit(vuexTypes.SET_ACCOUNT_KYC_REQUESTS, requests.records.map(record => RecordFactory.createKycRequestRecord(record)))
  },

  async GET_ACCOUNT_KYC_DATA ({ commit }, blobId) {
    const kycData = await usersService
      .blobsOf()
      .get(blobId)
    commit(vuexTypes.SET_ACCOUNT_KYC_DATA, kycData)
    commit(vuexTypes.SET_ACCOUNT_KYC_DOCUMENTS, kycData.documents)
  },

  async UPDATE_ACCOUNT_KYC_DOCUMENTS ({ commit }, documents) {
    async function uploadBothDocSides ({ front, back }) {
      if (front && !front.isUploaded) {
        front.setKey(await fileService.uploadFile(front.getDetailsForUpload()))
      }
      if (back && !back.isUploaded) {
        back.setKey(await fileService.uploadFile(back.getDetailsForUpload()))
      }
    }

    await Promise.all(Object.values(documents).map(document => uploadBothDocSides(document)))
  },

  /**
   * @param commit
   * @param {object} opts
   * @param {object} opts.details - KYC details from form
   * @param {documents} opts.documents - Containers instances with uploaded documents
   * (separate for document.front/document.back) {@link DocumentContainer.getDetailsForSave}
   * @returns {Promise<string>} - blobId
   * @constructor
   */
  async UPDATE_ACCOUNT_KYC_DATA ({ commit }, opts) {
    const data = {
      ...opts.details,
      documents: opts.documents
    }
    return (await usersService.blobsOf()
      .create(blobTypes.kycForm.str, data))
      .data('id')
  }
}

export const getters = {
  account: state => state.account,
  accountId: state => state.keys.accountId,
  accountType: state => state.account.account_type,
  accountBlocked: state => state.account.is_blocked,
  accountSeed: state => state.keys.seed,
  accountPublicKey: state => state.keys.publicKey,
  accountKeypair: state => state.keys.seed ? Keypair.fromSecret(state.keys.seed) : {},
  accountCreatedAt: state => state.account.createdAt,
  accountTokens: state => state.balances.map(balance => balance.asset),
  accountBalances: state => StateHelper.groupBalances(state.balances),
  accountRawBalances: state => state.balances,
  accountDepositAddresses: state =>
    state.account.external_system_accounts
      .map(account => RecordFactory.createExternalAccountRecord(account))
      .reduce((accounts, account) => { accounts[account.asset] = account.address; return accounts }, {}),
  // kyc:
  accountKycRequests: state => state.kycRequests,
  accountKycLatestRequest: state => StateHelper.defineLatestKycRequest(state),
  accountState: (state, getters) => ACCOUNT_STATES[getters.accountKycLatestRequest.state] || ACCOUNT_STATES.nil,
  accountLatestBlobId: (state, getters) => getters.accountKycLatestRequest.blobId,
  accountKycData: state => state.kycData,
  accountKycDocuments: state => state.kycDocuments
}

export default {
  actions,
  getters,
  mutations,
  state
}
