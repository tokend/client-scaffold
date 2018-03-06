import { mutations } from './account.module'
import {
  mockAccountId,
  mockPublicKey,
  mockSeed
} from '../test/default.mocks'
import { accountResponse, balancesResponse } from '../test/account.mocks'
import { testAction } from '../test/vuex-test.helper'

const moduleInjector = require('inject-loader!./account.module')

const module = moduleInjector({
  '../../js/services/accounts.service': {
    accountsService: {
      loadAccount: () =>  Promise.resolve(accountResponse),
      loadDetailsForEachBalance: () => Promise.resolve(balancesResponse)
    }
  }
})
const { SET_ACCOUNT_KEYS, SET_ACCOUNT_DETAILS, SET_ACCOUNT_BALANCES } = mutations

describe('module.account', () => {
  it('SET_ACCOUNT_KEYS', () => {
    const state = {
      keys: {
        accountId: '',
        publicKey: '',
        seed: ''
      }
    }
    SET_ACCOUNT_KEYS(state, {
      accountId: mockAccountId,
      publicKey: mockPublicKey,
      seed: mockSeed
    })
    expect(state.keys.accountId).to.equal(mockAccountId)
    expect(state.keys.publicKey).to.equal(mockPublicKey)
    expect(state.keys.seed).to.equal(mockSeed)
  })

  it ('SET_ACCOUNT_DETAILS', () => {
    const state = { account: { external_system_accounts: [] } }
    SET_ACCOUNT_DETAILS(state, accountResponse)
    expect(state.account).to.deep.equal(accountResponse)
  })

  it ('SET_ACCOUNT_BALANCES', () => {
    const state = { balances: [] }
    SET_ACCOUNT_BALANCES(state, balancesResponse)
    expect(state.balances).to.deep.equal(balancesResponse)
  })
  //
  it ('GET_ACCOUNT_DETAILS', (done) => {
    testAction({
      action: module.actions.GET_ACCOUNT_DETAILS,
      actionPayload: null,
      expectedMutations: [{ type: 'SET_ACCOUNT_DETAILS' }],
      expectedMutationPayloads: [accountResponse],
      state: []
    }, done)
  })

  it ('GET_ACCOUNT_BALANCES', (done) => {
    testAction({
      action: module.actions.GET_ACCOUNT_BALANCES,
      actionPayload: null,
      expectedMutations: [{ type: 'SET_ACCOUNT_BALANCES' }],
      expectedMutationPayloads: [balancesResponse],
      state: []
    }, done)
  })
})
