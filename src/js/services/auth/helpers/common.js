import request from '../../../builders/request_builder/index'
import wallet from '@tokend/wallet.js'
import store from '../../../../vuex'

export default {
  getWalletKDF (email, isRecovery = false) {
    return request.kdf()
      .forEmail(email)
      .isRecovery(isRecovery)
      .get()
  },

  calculateWalletParams (password, email, salt, kdfParams) {
    return wallet.calculateWalletParams(...arguments)
  },

  decryptKeychainData (encryptedKeychainData, walletKey) {
    return wallet.decryptKeychainData(...arguments)
  },

  storeLoginData (data) {
    store.dispatch('STORE_LOGIN_DATA', data)
    return Promise.resolve(true)
  }
}
