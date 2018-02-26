import { ReviewableRequest } from '../parents/reviewable_request'
import { documentTypes } from '../../../const/const'
import config from '../../../../config'

import store from '../../../../vuex'

import { fileService } from '../../../services/file.service'
import { tokensService } from '../../../services/tokens.service'
import { salesService } from '../../../services/sales.service'

import get from 'lodash/get'
import set from 'lodash/set'

export class TokenCreationRequest extends ReviewableRequest {
  constructor (record) {
    super(record)
    this.imageBlob = ''
    this.termsBlob = ''
    if (!record) {
      this.operationDetails = {
        details: {
          logo: {},
          terms: {}
        }
      }

      this.code = ''
      this.name = ''
      this.policies = []
      this.maxAmount = '0'
      this.initialAmount = '0'
      this.signer = store.getters.userAccountId

      return
    }

    if (!this.operationDetails.details) {
      this.operationDetails.details = {}
    }

    if (!this.operationDetails.details.logo) {
      this.operationDetails.details.logo = {}
    }

    this._loadImageIfExists()
    this._loadTermsIfExists()
  }

  get type () {
    return 'Create token'
  }

  // required:

  get code () {
    return this.operationDetails.code
  }

  set code (code) {
    this.operationDetails.code = code
  }

  get policies () {
    return this.operationDetails.policies.map(policy => policy.value)
  }

  set policies (policies) {
    this.operationDetails.policies = policies.map(value => ({ name: '', value }))
  }

  get policy () {
    return this.operationDetails.policies.map(policy => policy.value).reduce((sum, policy) => sum + policy, 0)
  }

  get signer () {
    return this.operationDetails.pre_issued_asset_signer
  }

  set signer (signer) {
    this.operationDetails.pre_issued_asset_signer = signer
  }

  get maxAmount () {
    return this.operationDetails.max_issuance_amount
  }

  set maxAmount (amount) {
    this.operationDetails.max_issuance_amount = amount
  }

  get initialAmount () {
    return this.operationDetails.initial_preissued_amount
  }

  set initialAmount (amount) {
    this.operationDetails.initial_preissued_amount = amount
  }

  // details:

  get name () {
    return this.operationDetails.details.name
  }

  set name (name) {
    this.operationDetails.details.name = name
  }

  set logoURL (key) {
    this.operationDetails.details.logo.key = key
  }

  get termsKey () {
    return get(this, 'operationDetails.details.terms.key')
  }

  set termsKey (key) {
    set(this, 'operationDetails.details.terms.key', key)
  }

  get termsURL () {
    const key = this.termsKey
    if (!key) return ''
    return `${config.FILE_STORAGE}/${key}`
  }

  get logoKey () {
    return this.operationDetails.details.logo.key
  }

  set logoKey (key) {
    set(this, 'operationDetails.details.logo.key', key)
  }

  get logoURL () {
    const key = this.logoKey
    if (!key) return ''
    return `${config.FILE_STORAGE}/${key}`
  }

  get logoContentType () {
    return this.operationDetails.details.logo.type
  }

  set logoContentType (type) {
    this.operationDetails.details.logo.type = type
  }

  get termsContentType () {
    return get(this, 'operationDetails.details.terms.type')
  }

  set termsContentType (type) {
    set(this, 'operationDetails.details.terms.type', type)
  }

  get termsDocumentName () {
    return get(this, 'operationDetails.details.terms.name')
  }

  set termsDocumentName (name) {
    set(this, 'operationDetails.details.terms.name', name)
  }

  // are being called from external code:
  get image () {
    return this.imageBlob
  }

  set image (blob) {
    this.imageBlob = blob
  }

  get terms () {
    return this.termsBlob
  }

  set terms (blob) {
    this.termsBlob = blob
  }

  updateSelf () {
    return tokensService.createTokenCreationRequest(this.composeData())
  }

  updateSelfWithSale (saleRequest) {
    return salesService.createSaleCreationRequestWithTokenRequestUpdate(saleRequest.composeData(), this.composeData())
  }

  async updateSelfWithImageUpload () {
    this.logoKey = await this._sendImage()
    this.termsKey = await this._sendTerms()
    return this.updateSelf()
  }

  async updateSelfWithSaleWithImageUpload (saleRequest) {
    this.logoKey = await this._sendImage()
    this.termsKey = await this._sendTerms()
    return this.updateSelfWithSale(saleRequest)
  }

  resendSelf () {
    this._setRequestID('0')
    return this.updateSelf(this.composeData())
  }

  cancelSelf () {
    const opts = { requestID: this.requestID }
    return tokensService.cancelTokenCreationRequest(opts)
  }

  composeData () {
    return {
      requestID: this.requestID,
      code: this.code,
      policies: this.policy,
      details: {
        name: this.name,
        logo: {
          key: this.logoKey,
          type: this.logoContentType
        },
        terms: {
          key: this.termsKey,
          type: this.termsContentType,
          name: this.termsDocumentName
        }
      },
      maxIssuanceAmount: this.maxAmount,
      // TODO: remove || later
      initialPreissuedAmount: this.initialAmount || '0',
      preissuedAssetSigner: this.signer
    }
  }

  _sendImage () {
    const params = {
      type: 'asset_logo',
      mimeType: this.logoContentType,
      file: this.image
    }
    return fileService.uploadFile(params)
  }

  _sendTerms () {
    const params = {
      type: documentTypes.tokenTerms,
      mimeType: this.termsContentType,
      file: this.terms
    }
    return fileService.uploadFile(params)
  }

  _setRequestID (id) {
    this.record.id = id
  }

  async _loadImageIfExists () {
    if (!this.logoURL) return
    this.image = await fileService.loadFileByURL(this.logoURL)
  }

  async _loadTermsIfExists () {
    if (!this.termsURL) return
    this.image = await fileService.loadFileByURL(this.termsURL)
  }
}
