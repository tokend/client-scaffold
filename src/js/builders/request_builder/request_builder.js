import Vue from 'vue'
import store from '../../../vuex'

import { parseError } from '../../parsers/error.parser'
import { createTfaDialog } from '../../modals/tfa_dalog.modal'
import { createPasswordDialog } from '../../modals/password_dialog.modal'
import { showStatusMessage } from '../../modals/status_message.modal'
import { initHorizonServer } from '../../../../src/js/helpers/server.helper'
import { errors } from '../../errors/error_factory'
import common from '../../services/common/common'

import response from '../response_builder/index'

export class RequestBuilder {
  constructor (serverUrl) {
    this.url = `${serverUrl}/`
    this.segment = ''
    this.filters = []
    this.params = {}
    this.method = ''
    this.httpClient = Vue.http
    this.query = []
    this.config = {}
    this.messages = {
      success: {
        text: ''
      }
    }
  }

  sign (keypair) {
    const server = initHorizonServer()
    this.config = server._getConfig(this._getPrefix(), keypair)
    return this
  }

  success (text) {
    this.messages.success.text = text
    return this
  }

  header (header, value) {
    if (!this.config.headers) this.config.headers = {}
    this.config.headers[header] = value
    return this
  }

  setParams (params) {
    this.params = params
    return this
  }

  data (data) {
    this.params = { data }
    return this
  }

  dataItem (key, item) {
    if (!this.params) this.params = {}
    if (!this.params.data) this.params.data = {}
    this.params.data[key] = item
  }

  attributes (attributes) {
    if (!this.params) this.params = {}
    if (!this.params.data) this.params.data = {}
    this.params.data.attributes = attributes
    return this
  }

  attribute (key, attribute) {
    if (!this.params) this.params = {}
    if (!this.params.data) this.params.data = {}
    if (!this.params.data.attributes) this.params.data.attributes = {}
    this.params.data.attributes[key] = attribute
    return this
  }

  relationships (relationships) {
    if (!this.params) this.params = {}
    if (!this.params) this.params = {}
    if (!this.params.data) this.params.data = {}
    this.params.data.relationships = relationships
    return this
  }

  relationship (key, attribute) {
    if (!this.params) this.params = {}
    if (!this.params.data) this.params.data = {}
    if (!this.params.data.relationships) this.params.data.relationships = {}
    this.params.data.relationships[key] = attribute
    return this
  }

  type (type) {
    if (!this.params) this.params = {}
    if (!this.params.data) this.params.data = {}
    this.params.data.type = type
    return this
  }

  json () {
    return this.header('Content-Type', 'application/json')
  }

  segment (segment) {
    this.segment = segment
    return this
  }

  get () {
    this.method = 'get'
    return this.httpClient.get(this._composeURL(), this.config)
      .then(response => this._handleSuccess(response))
      .catch(err => this._handleError(err))
  }

  post () {
    this.method = 'post'
    return this.httpClient.post(this._composeURL(), this.params, this.config)
      .then(response => this._handleSuccess(response))
      .catch(err => this._handleError(err))
  }

  put () {
    this.method = 'put'
    return this.httpClient.put(this._composeURL(), this.params, this.config)
      .then(response => this._handleSuccess(response))
      .catch(err => this._handleError(err))
  }

  patch () {
    this.method = 'patch'
    return this.httpClient.patch(this._composeURL(), this.params, this.config)
      .then(response => this._handleSuccess(response))
      .catch(err => this._handleError(err))
  }

  delete () {
    this.method = 'delete'
    return this.httpClient.delete(this._composeURL(), this.config)
      .then(response => this._handleSuccess(response))
      .catch(err => this._handleError(err))
  }

  addQuery (key, value) {
    this.query.push({ key, value })
    return this
  }

  _getQuery () {
    if (this.query.length === 0) return ''
    return `?${this.query.map(param => `${param.key}=${param.value}`).join('&')}`
  }

  _composeURL () {
    return `${this.url}${this.filters.reduce((url, filter) => url.concat(`/${filter}`), this.segment)}${this._getQuery()}`
  }

  _getPrefix () {
    return `/${this.filters.reduce((url, filter) => url.concat(`/${filter}`), this.segment)}${this._getQuery()}`
  }

  _handleSuccess (response) {
    const text = this.messages.success.text
    if (this.messages.success.text) {
      showStatusMessage({ text, type: 'success' })
    }
    return this._parseResponse(response)
  }

  async _handleError (error) {
    const parsedError = parseError(error)
    if (parsedError.message === 'TFA required') {
      return createTfaDialog(this.repeat.bind(this), parsedError.meta)
    } else if (parsedError instanceof errors.PasswordFactorError) {
      const kdf = await common.getWalletKDF(store.getters.email)
      return createPasswordDialog(this.repeat.bind(this), { ...parsedError.meta, kdf: kdf.attributes() })
    } else {
      return Promise.reject(parsedError)
    }
  }

  _parseResponse (rawResponse) {
    return response.getCommonResponse(rawResponse)
  }

  repeat () {
    if (this.method === 'get' || this.method === 'delete') {
      return this.httpClient[this.method](this._composeURL(), this.config)
        .then(response => this._handleSuccess(response))
        .catch(err => this._handleError(err))
    }
    return this.httpClient[this.method](this._composeURL(), this.params, this.config)
      .then(response => this._handleSuccess(response))
      .catch(err => this._handleError(err))
  }
}
