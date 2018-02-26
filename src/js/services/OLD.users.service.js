import Vue from 'vue'
import config from '../../config'
import store from '../../vuex'

import request from '../builders/request_builder/index'

import { errors } from '../errors/error_factory'
import { blobTypes } from '../const/const'
import { initHorizonServer } from '../helpers/server.helper'

export default {
  checkIfUserExists () {
    const accountId = store.getters.userAccountId
    const keypair = store.getters.keypair
    return sendGetUserRequest(accountId, keypair)
      .then(_ => Promise.resolve({ exists: true }))
      .catch(error => error instanceof errors.NotFoundError ? Promise.resolve({ exists: false }) : Promise.reject(error))
  },

  getRootParams () {
    return sendRootRequest()
      .then(setRootParams)
  },

  getUserDetails () {
    return sendUserAndAccountInfoRequest()
      .then(storeUserDetails)
  },

  uploadBlob (type, value) {
    const accountId = store.getters.userAccountId

    return request.users()
      .accountId(accountId)
      .blobs()
      .data({ type })
      .attributes({ value })
      .sign(store.getters.keypair)
      .json()
      .post()
  },

  uploadFundBlob ({ type, fundID, data }) {
    const accountId = store.getters.userAccountId

    return request.users()
      .accountId(accountId)
      .blobs()
      .data({ type })
      .attributes({ value: JSON.stringify(data) })
      .relationships({ fund_id: {
        data: {
          id: fundID
        }}
      })
      .sign(store.getters.keypair)
      .json()
      .post()
  },

  uploadTokenBlob ({ type, tokenCode, data }) {
    const accountId = store.getters.userAccountId
    if (!type) type = 'fund_document'

    return request.users()
      .accountId(accountId)
      .blobs()
      .data({ type })
      .attributes({ value: JSON.stringify(data) })
      .relationships({ token_code: {
        data: {
          id: tokenCode
        }}
      })
      .sign(store.getters.keypair)
      .json()
      .post()
  },

  getTokenBlobs (tokenCode, owner = store.getters.userAccountId) {
    return request.users()
      .accountId(owner)
      .blobs()
      .addQuery('token_code', tokenCode)
      .sign(store.getters.keypair)
      .json()
      .get()
      .then(response => Promise.resolve(
        response.attributes()
          .map(attribute => JSON.parse(attribute.value))))
  },

  getFundBlobs (fundID, owner = store.getters.userAccountId) {
    return request.users()
      .accountId(owner)
      .blobs()
      .addQuery('fund_id', fundID)
      .addQuery('type', blobTypes.fundUpdate.num)
      .sign(store.getters.keypair)
      .json()
      .get()
      .then(response => Promise.resolve(
        response.attributes()
          .map(attribute => JSON.parse(attribute.value))))
  },

  loadEnums () {
    return request.commonData()
      .enums()
      .sign(store.getters.keypair)
      .get()
  }
}

function sendRootRequest () {
  return Vue.http.get(config.HORIZON_SERVER)
}

function sendUserAndAccountInfoRequest () {
  const accountId = store.getters.userAccountId
  const keypair = store.getters.keypair
  const map = [sendGetAccountRequest(accountId, keypair), sendGetUserRequest(accountId, keypair)]
  return Promise.all(map)
}

function sendGetUserRequest (accountId, keypair) {
  return request.users()
    .accountId(accountId)
    .sign(store.getters.keypair)
    .get()
}

export function sendGetAccountRequest (accountId = store.getters.userAccountId, keypair = store.getters.keypair) {
  const server = initHorizonServer()

  return server.accounts()
    .accountId(accountId)
    .callWithSignature(keypair)
}

function setRootParams (response) {
  const networkPassphrase = response.body.network_passphrase
  store.dispatch('SET_ROOT_PARAMS', { networkPassphrase })
  return Promise.resolve(true)
}

function storeUserDetails ([ accountDetails, userDetails ]) {
  // const accountDetails = details[0]
  // const userDetails = details[1]
  store.dispatch('SET_ACCOUNT_DETAILS', accountDetails)
  store.dispatch('SET_USER_DETAILS', {
    type: userDetails.data('type'),
    state: userDetails.attribute('state'),
    kyc_sequence: userDetails.attribute('kyc_sequence'),
    reject_reason: userDetails.attribute('reject_reason')
  })
  return Promise.resolve(true)
}
