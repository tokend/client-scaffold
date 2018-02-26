import request from '../../../builders/request_builder/index'
import wallet from '@tokend/wallet.js'
import { Keypair } from 'swarm-js-sdk'
import store from '../../../../vuex'

export default {
  getDefaultKDF () {
    return request.kdf().get()
  },

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

  generateKeychainData () {
    const keys = Keypair.random()
    const rawKeychainData = JSON.stringify({ seed: keys.secret(), accountId: keys.accountId() })
    const accountId = keys.accountId()
    return { rawKeychainData, accountId }
  },

  generateRecoveryData (recoverySeed, email, kdfParams, rawKeychainData, accountId) {
    return wallet.generateRecoveryData(...arguments)
  },

  generateFactorData (password, email, kdfAttributes) {
    return wallet.generateFactorData(...arguments)
  },

  generateWalletData (password, email, kdfAttributes, rawKeychainData, accountId) {
    return wallet.generateWalletData(...arguments)
  },

  signToken (token, encryptedKeychain, key) {
    const keychainData = this.decryptKeychainData(encryptedKeychain, key)
    const data = token
    const rawKeypair = Keypair.fromSecret(keychainData.seed)
    const keypair = Keypair.fromRawSeed(rawKeypair._secretSeed)

    const signed = keypair.sign(data)
    return _arrayBufferToBase64(signed)
  },

  storeLoginData (data) {
    store.dispatch('STORE_LOGIN_DATA', data)
    return Promise.resolve(true)
  }
}

function _arrayBufferToBase64 (buffer) {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}
