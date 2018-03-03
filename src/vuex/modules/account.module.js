import { vuexTypes } from '../types'
import { StateHelper } from '../helpers/state.helper'
import { RecordFactory } from '../../js/factories/records/record_factory'
import { accountsService } from '../../js/services/accounts.service'
import { Keypair } from 'swarm-js-sdk'

export const state = {
  account: {
    external_system_accounts: []
  },
  balances: [],
  keys: {
    accountId: '',
    publicKey: '',
    seed: ''
  }
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
  }
}

export const actions = {
  async GET_ACCOUNT_DETAILS ({ commit }) {
    commit(vuexTypes.SET_ACCOUNT_DETAILS, await accountsService.loadAccount())
  },
  async GET_ACCOUNT_BALANCES ({ commit }) {
    commit(vuexTypes.SET_ACCOUNT_BALANCES, await accountsService.loadDetailsForEachBalance())
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
  accountExternalAddresses: state =>
    state.account.external_system_accounts
      .map(account => RecordFactory.createExternalAccountRecord(account))
      .reduce((accounts, account) => { accounts[account.asset] = account.address; return accounts }, {})
}

export default {
  actions,
  getters,
  mutations,
  state
}
