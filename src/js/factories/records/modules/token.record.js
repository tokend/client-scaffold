import { RecordFactory } from '../record_factory'
import config from '../../../../config'
import get from 'lodash/get'
import { salesService } from '../../../services/sales.service'
import { xdr } from 'swarm-js-sdk'

export class TokenRecord {
  constructor (record) {
    this._record = record || { details: { logo: {} } }
    this.attachedSale = { details: { logo: {} } }
    this.additionalDetails = {}

    this.code = this._record.code
    this.owner = this._record.owner
    this.available = this._record.available_for_issuance
    this.name = this._record.details.name
    this.signer = this._record.preissued_asset_signer
    this.link = this._record.external_resource_link
    this.description = this._record.description
    this.max = this._record.max_issuance_amount
    this.issued = this._record.issued
    this.policies = this._getPolicies()
    this.policy = this._record.policy
  }

  _getPolicies () {
    return this._record.policies ? this._record.policies.map(policy => policy.value) : []
  }

  get char () {
    return this.code[0]
  }

  get logoURL () {
    const url = this._record.details.logo.key || this._record.details.logo.url
    if (!url) return ''
    if (url.indexOf(config.FILE_STORAGE) !== -1) return url
    return `${config.FILE_STORAGE}/${url}`
  }

  get termsDetails () {
    get(this._record, 'details.terms')
  }

  attachSale (sale) {
    this.attachedSale = sale
  }

  attachDetails (details) {
    this.additionalDetails = details
  }

  get requiresKYC () {
    return this._record.policies && this._record.policies.map(policy => policy.value).indexOf(xdr.AssetPolicy.requiresKyc().value) !== -1
  }

  // async:
  async loadAttachedSale () {
    this.attachedSale = RecordFactory.createSaleRecord(await salesService.loadSaleByTokenCode(this.code), true)
  }
}
