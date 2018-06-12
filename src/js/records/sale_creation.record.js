import config from '../../config'
import get from 'lodash/get'

export class SaleCreationRecord {
  constructor (record, attachedDetails = {}) {
    this._record = record
    this.requestID = record.id
    this.tokenCode = this._getTokenCode()
    this.saleName = this._getSaleName()
    this.defaultQuoteAsset = this._getDefaultQuoteAsset()
    this.startTime = this._getStartTime()
    this.endTime = this._getEndTime()
    this.createdAt = record.created_at
    this.updatedAt = record.updated_at
    this.requestState = record.request_state
    this.requestType = this._getRequestType()
    this.saleLogoUrl = this._getSaleLogoUrl()
    this.softCap = this._getSoftCap()
    this.hardCap = this._getHardCap()
    this.baseAssetForHardCap = this._getBaseAssetForHardCap()
    this.shortDescription = this._getShortDescription()
    this.youtubeVideoId = this._getYoutubeVideoId()
    this.youtubeVideoUrl = this._getYoutubeVideoUrl()
    this.quoteAssets = this._getQuoteAssets()
    this.rejectReason = record.reject_reason
  }

  _getSaleName () {
    return get(this._record, 'details.sale.details.name')
  }

  _getTokenCode () {
    return get(this._record, 'details.sale.base_asset')
  }

  _getDefaultQuoteAsset () {
    return get(this._record, 'details.sale.default_quote_asset')
  }

  _getStartTime () {
    return get(this._record, 'details.sale.start_time')
  }

  _getEndTime () {
    return get(this._record, 'details.sale.end_time')
  }

  _getRequestType () {
    return get(this._record, 'details.request_type').replace('_', ' ')
  }

  _getSaleLogoUrl () {
    const key = get(this._record, 'details.sale.details.logo.key')
    if (!key) return ''
    return `${config.FILE_STORAGE}/${key}`
  }

  _getSoftCap () {
    return get(this._record, 'details.sale.soft_cap')
  }

  _getHardCap () {
    return get(this._record, 'details.sale.hard_cap')
  }

  _getBaseAssetForHardCap () {
    return get(this._record, 'details.sale.base_asset_for_hard_cap')
  }

  _getShortDescription () {
    return get(this._record, 'details.sale.details.short_description')
  }

  _getYoutubeVideoId () {
    return get(this._record, 'details.sale.details.youtube_video_id')
  }

  _getYoutubeVideoUrl () {
    const youtubeId = get(this._record, 'details.sale.details.youtube_video_id')
    return `https://www.youtube.com/watch?v=${youtubeId}`
  }

  _getQuoteAssets () {
    const quoteAssets = get(this._record, 'details.sale.quote_assets')
    return quoteAssets.map(asset => asset.quote_asset)
  }
}
