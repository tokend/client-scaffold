import config from '../../config'
import get from 'lodash/get'
import { xdr } from '../../../../js-sdk/lib/index'
import { ASSET_POLICIES } from '../const/xdr.const'

export class TokenRecord {
  constructor (record, attachedDetails = {}) {
    this._record = record

    this.code = record.code
    this.owner = record.owner
    this.available = record.available_for_issuance
    this.name = record.details.name
    this.signer = record.preissued_asset_signer
    this.max = record.max_issuance_amount
    this.issued = record.issued
    this.policy = record.policy
    this.policies = this._getPolicies()
    this.terms = this._getTerms()

    this.attachedDetails = attachedDetails
  }

  get logoURL () {
    const key = get(this._record, 'details.logo.key')
    if (!key) return ''
    return `${config.FILE_STORAGE}/${key}`
  }

  get requiresKYC () {
    return this._record.policies && this._record.policies.map(policy => policy.value).indexOf(xdr.AssetPolicy.requiresKyc().value) !== -1
  }

  get isWalletToken () {
    return !!(this.policy & ASSET_POLICIES.baseAsset)
  }

  _getTerms () {
    get(this._record, 'details.terms')
  }

  _getPolicies () {
    return this._record.policies ? this._record.policies.map(policy => policy.value) : []
  }

  attachDetails (details) {
    this.attachedDetails = { ...this.attached, ...details }
  }
}
