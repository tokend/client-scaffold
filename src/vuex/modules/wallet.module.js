import { walletService } from '../../js/services/wallet.service'
import { WalletHelper } from '../../js/helpers/wallet.helper'
import { vuexTypes } from '../types'

export const state = {
  wallet: {
    id: ''
  }
}

export const mutations = {
  SET_WALLET_ID (state, walletId) {
    state.wallet.id = walletId
  }
}

export const actions = {
  async PROCESS_USER_WALLET ({ dispatch }, credentials) {
    const kdf = await walletService.loadKdfParamsForEmail(credentials.email)
    const { walletId, walletKey } = WalletHelper.calculateWalletParams(
      credentials.password,
      credentials.email,
      kdf.attributes().salt,
      kdf.attributes()
    )
    const wallet = walletService.loadWallet(walletId)
    const userData = WalletHelper.deriveUserDataFromWallet(wallet, walletKey)
    dispatch(vuexTypes.STORE_USER_DATA_FROM_WALLET, userData)
  },

  STORE_USER_DATA_FROM_WALLET ({ commit }, userData) {
    commit(vuexTypes.SET_WALLET_ID, userData.walletId)
    commit(vuexTypes.SET_USER_EMAIL, userData.email)
    commit(vuexTypes.SET_ACCOUNT_KEYS, {
      accountId: userData.accountId,
      publicKey: userData.publicKey,
      seed: userData.seed
    })
  }
}

export const getters = {
  userWalletId: state => state.wallet.id
}

export default {
  state,
  actions,
  getters,
  mutations
}
