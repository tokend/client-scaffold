import { vuexTypes } from '../types'
import { StateHelper } from '../helpers/state.helper'
import { RecordFactory } from '../../js/factories/records/record_factory'
import { accountsService } from '../../js/services/accounts.service'
import {Keypair} from 'swarm-js-sdk'

export const state = {
  keys: {
    accountId: '',
    publicKey: '',
    seed: ''
  },

  account: {},
  balances: [],
  external_accounts: {}
}

export const mutations = {
  SET_ACCOUNT_KEYS (state, keys) {
    state.keys = keys
  },

  SET_ACCOUNT_DATA (state, account) {
    state.account = account
  },

  SET_BALANCES (state, balances) {
    state.balances = balances
  },

  SET_EXTERNAL_ACCOUNTS (state, externalAccounts) {
    externalAccounts
      .map(account => RecordFactory.createExternalAccountRecord(account))
      .forEach(account => { state.external_accounts[account.asset] = account.address })
  }
}

export const actions = {
  SET_ACCOUNT_DETAILS ({ commit }, account) {
    commit(vuexTypes.SET_ACCOUNT_DATA, account)
    commit(vuexTypes.SET_EXTERNAL_ACCOUNTS, account.external_system_accounts)
  },
  async GET_ACCOUNT_DETAILS ({ dispatch }) {
    dispatch(vuexTypes.SET_ACCOUNT_DETAILS, await accountsService.loadAccount())
  },
  async GET_BALANCES ({ commit }) {
    commit(vuexTypes.SET_BALANCES, await accountsService.loadDetailsForEachBalance())
  }
}

export const getters = {
  account: state => state.account,
  createdAt: state => state.account.createdAt,

  userAccountId: state => state.keys.accountId,
  userPublicKey: state => state.keys.publicKey,
  userSeed: state => state.keys.seed,
  keypair: state => state.keys.seed ? Keypair.fromSecret(state.keys.seed) : {},

  assets: state => state.balances.map(balance => balance.asset),
  externalAccounts: state => ({
    ...state.external_accounts,
    SWM: state.external_accounts.ETH
  }),
  balances: state => StateHelper.groupBalances(state.balances),
  rawBalances: state => state.balances
}

export default {
  actions,
  getters,
  mutations,
  state
}
