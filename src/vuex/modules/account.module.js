import { StateHelper } from '../helpers/state.helper'
import { vuexTypes } from '../types'
import { Keypair } from 'swarm-js-sdk'
import { RecordFactory } from '../../js/records/factory'

import { accountsService } from '../../js/services/accounts.service'
import { reviewableRequestsService } from '../../js/services/reviewable_requests.service'

import { ACCOUNT_STATES } from '../../js/const/account.const'

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
  kycRequests: []
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
  }
}

export const getters = {
  account: state => state.account,
  accountId: state => state.keys.accountId,
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
  accountState: (state, getters) => ACCOUNT_STATES[getters.accountKycLatestRequest.state] || ACCOUNT_STATES.nil
}

export default {
  actions,
  getters,
  mutations,
  state
}
