import request from '../builders/request_builder/index'
import store from '../../vuex'

export const factorsService = {
  loadFactors () {
    return request.wallets()
      .walletId(store.getters.walletId)
      .factors()
      .sign(this._keypair)
      .get()
  },

  createFactor (type = 'totp') {
    const data = { type }

    return request.wallets()
      .walletId(store.getters.walletId)
      .factors()
      .data(data)
      .sign(this._keypair)
      .json()
      .post()
  },

  verifyFactor (id, token, otp, wallet) {
    const attributes = { token, otp }

    return request.wallets()
      .walletId(store.getters.walletId || wallet)
      .factorId(id)
      .verification()
      .attributes(attributes)
      .json()
      .put()
  },

  updateFactor (id, priority) {
    const attributes = { priority }

    return request.wallets()
      .walletId(store.getters.walletId)
      .factorId(id)
      .attributes(attributes)
      .sign(this._keypair)
      .json()
      .patch()
  },

  deleteFactor (id) {
    return request.wallets()
      .walletId(store.getters.walletId)
      .factorId(id)
      .sign(this._keypair)
      .delete()
  }
}
