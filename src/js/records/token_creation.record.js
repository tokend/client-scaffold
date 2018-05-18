import config from '../../config'
import get from 'lodash/get'

export class TokenCreationRecord {
  constructor (record, attachedDetails = {}) {
    this._record = record
    this.requestID = record.id
    this.tokenCode = record.reference
    this.tokenName = this._getTokenName()
    this.preissuedAssetSigner = this._getPreissuedAssetSigner()
    this.maxIssuanceAmount = this._getMaxIssuanceAmount()
    this.initialPreissuedAmount = this._getInitialPreissuedAmount()
    this.policy = record.policy
    this.policies = this._getPolicies()
    this.terms = this._getTerms()
    this.termsUrl = this._getTermsUrl()
    this.logo = this._getLogo()
    this.logoUrl = this._getLogoUrl()

    this.attachedDetails = attachedDetails
  }

  get logoURL () {
    const key = get(this._record, 'details.asset_create.details.logo.key')
    if (!key) return ''
    return `${config.FILE_STORAGE}/${key}`
  }

  _getTokenName () {
    return get(this._record, 'details.asset_create.details.name')
  }

  _getPreissuedAssetSigner () {
    return get(this._record, 'details.asset_create.pre_issued_asset_signer')
  }

  _getMaxIssuanceAmount () {
    return get(this._record, 'details.asset_create.max_issuance_amount')
  }

  _getInitialPreissuedAmount () {
    return get(this._record, 'details.asset_create.initial_preissued_amount')
  }

  _getTerms () {
    return get(this._record, 'details.asset_create.details.terms')
  }

  _getTermsUrl () {
    const key = get(this._record, 'details.asset_create.details.terms.key')
    if (!key) return ''
    return `${config.FILE_STORAGE}/${key}`
  }

  _getLogo () {
    return get(this._record, 'details.asset_create.details.logo')
  }

  _getLogoUrl () {
    const key = get(this._record, 'details.asset_create.details.logo.key')
    if (!key) return ''
    return `${config.FILE_STORAGE}/${key}`
  }

  _getPolicies () {
    return this._record.policies ? [] : get(this._record, 'details.asset_create.policies').map(policy => policy.value)
  }

  attachDetails (details) {
    this.attachedDetails = { ...this.attached, ...details }
  }
}
