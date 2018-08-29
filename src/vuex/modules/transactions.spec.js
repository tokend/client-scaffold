// TODO: deal with not-working tests

import { mutations } from './transactions.module'
import { mockAccountId } from '../test/default.mocks'
import { testAction } from '../test/vuex-test.helper'
import { transactionsResponse, detailsResponse } from '../test/transactions.mocks'
import { Paginator } from '../../js/helpers/paginator'
import { parseTransaction } from '../../js/parsers/tx.parser'

const moduleInjector = require('inject-loader!./transactions.module')

const loadMultipleAccountDetails = () => Promise.resolve(detailsResponse)
const loadTransactionHistory = () => Promise.resolve(transactionsResponse)

const module = moduleInjector({
  '../../js/services/accounts.service': {
  accountsService: {
      loadMultipleAccountDetails
    }
  },
  '../../js/services/transactions.service': {
    transactionsService: {
      loadTransactionHistory
    }
  }
})

const {UPDATE_TX_LIST, UPDATE_TX_LIST_ITEM, SET_TX_LIST_INITIALIZED} = mutations

describe('module.transactions', () => {
  it('UPDATE_TX_LIST', () => {
    const state = { lists: {} }
    const tokenCodes = ['BTC', 'QTK', 'ETH']
    UPDATE_TX_LIST(state, tokenCodes)
    expect(state.lists).to.have.property('BTC')
    expect(state.lists).to.have.property('QTK')
    expect(state.lists).to.have.property('ETH')
  })

  it('SET_TX_LIST_INITIALIZED', () => {
    const state = { isInitialized: false }
    SET_TX_LIST_INITIALIZED(state)
    expect(state.isInitialized).to.equal(true)
  })

  it ('INIT_TX_LIST', (done) => {
    testAction({
      action: module.actions.INIT_TX_LIST,
      actionPayload: null,
      expectedMutations: [
        { type: 'UPDATE_TX_LIST' },
        { type: 'SET_TX_LIST_INITIALIZED' }
      ],
      expectedMutationPayloads: [
        ['BTC', 'ETH', 'QTK']
      ],
      state: {},
      rootGetters: {
        accountBalances: {
          'BTC': 'btcBalanceId',
          'ETH': 'ethBalanceId',
          'QTK': 'qtkBalanceId'
        }
      },
    }, done)
  })
})
