import {mutations, actions, getters} from './wallet.module'
import {} from '../test/default.mocks'
import {testAction} from '../test/vuex-test.helper'
import {mockWalletId, mockUserData} from '../test/wallet.mocks'

const {SET_WALLET_ID} = mutations
const { walletId } = getters
const { STORE_USER_DATA_FROM_WALLET } = actions

describe('module.wallet', () => {
  it('SET_WALLET_ID', () => {
    const state = {id: ''}
    SET_WALLET_ID(state, mockWalletId)
    expect(state.id).to.equal(mockWalletId)
  })


  it('STORE_USER_DATA_FROM_WALLET', (done) => {
    testAction({
      action: STORE_USER_DATA_FROM_WALLET,
      actionPayload: mockUserData,
      expectedMutations: [
        {type: 'SET_WALLET_ID'},
        {type: 'SET_USER_EMAIL'},
        {type: 'SET_ACCOUNT_KEYS'},
      ],
      expectedMutationPayloads: [
        mockUserData.walletId,
        mockUserData.email,
        {
          accountId: mockUserData.accountId,
          publicKey: mockUserData.publicKey,
          seed: mockUserData.seed
        }
      ],
      state: {}
    }, done)
  })

  it ('walletId getter', () => {
    const state = { id: mockWalletId }
    expect(walletId(state)).to.equal(mockWalletId)
  })
})
