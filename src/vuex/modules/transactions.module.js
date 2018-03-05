import { transactionsService } from '../../js/services/transactions.service'
import { accountsService } from '../../js/services/accounts.service'
import { Keypair } from 'swarm-js-sdk'
import { parseTransaction } from '../../js/parsers/tx.parser'
import { Paginator } from '../../js/helpers/paginator'
import { vuexTypes } from '../types'
import cloneDeep from 'lodash/cloneDeep'

const state = {
  next: () => {},
  tokens: {}
}

export const mutations = {
  CREATE_TRANSACTION_CONTAINERS (state, tokenCodes) {
    tokenCodes.forEach(code => {
      state.tokens[code] = new Paginator({
        recordWrp: (record) => parseTransaction(record, code)
      })
    })
  },

  SET_TX_PAGINATOR (state, { code, paginator }) {
    const tokens = cloneDeep(state.tokens)
    tokens[code] = paginator
    state.tokens = tokens
  }
}

export const actions = {
  async GET_TOKEN_TRANSACTION_HISTORY ({ state, commit, dispatch }, code) {
    const paginator = state.tokens[code]
    paginator.attachInitLoader(() => transactionsService.loadTransactionHistory(code))
    const transactions = await paginator.init()
    commit(vuexTypes.SET_TX_PAGINATOR, paginator)
    dispatch(vuexTypes.GET_COUNTERPARTIES, transactions)
  },

  async NEXT_TOKEN_TRANSACTION_HISTORY ({ state, commit, dispatch }, code) {
    const paginator = state.tokens[code]
    const transactions = await paginator.next()
    commit(vuexTypes.SET_TX_PAGINATOR, paginator)
    dispatch(vuexTypes.GET_COUNTERPARTIES, transactions)
  },

  async GET_COUNTERPARTIES ({ commit }, transactions) {
    const counterparties = transactions
      .map(transaction => transaction.counterparty)
      .filter(counterparty => Keypair.isValidPublicKey(counterparty))
    const details = (await accountsService.loadMultipleAccountDetails(counterparties)).data('users')
    transactions.forEach(transaction => {
      const counterparty = transaction.counterparty
      if (details[counterparty]) {
        transaction.counterparty = details[counterparty].email
      }
    })
    return Promise.resolve(true)
  },

  INITIALIZE_TRANSACTION_MODULE ({ commit, getters }) {
    const balances = Object.keys(getters.balances)
    commit(vuexTypes.CREATE_TRANSACTION_CONTAINERS, balances)
  }
}

export const getters = {
  transactions: state => state.tokens
}

export default {
  actions,
  getters,
  mutations,
  state
}
