import { ReviewableRequest } from '../parents/reviewable_request'

import config from '../../../../config'

import users from '../../../services/OLD.users.service'
import { fileService } from '../../../services/file.service'
import { salesService } from '../../../services/sales.service'
import { usersService } from '../../../services/users.service'

import moment from 'moment'

import { walletTokens } from '../../../const/const'

export class SaleCreationRequest extends ReviewableRequest {
  constructor (record) {
    super(record)
    this.imageBlob = ''
    this.descriptionBlob = ''
    if (!record) {
      this.isEmpty = true
      this.operationDetails = {
        details: {
          logo: {},
          description: '',
          youtube_video_id: ''
        }
      }
      this.baseAsset = ''
      this.quoteAsset = ''
      this.startTime = ''
      this.endTime = ''
      this.price = ''
      this.softCap = ''
      this.hardCap = ''
      this.name = ''
      this.description = ''
      this.shortDescription = ''
      this.quoteAssets = walletTokens.map(code => ({ code, price: '1', isAllowed: true }))
    } else {
      this.quoteAssets = this._mapQuoteAssets()
    }

    if (!this.operationDetails.details) {
      this.operationDetails.details = {}
    }

    if (!this.operationDetails.details.logo) {
      this.operationDetails.details.logo = {}
    }

    if (!this.operationDetails.details.youtube_video_id) {
      this.operationDetails.details.youtube_video_id = ''
    }

    this._loadImageIfExists()
    this._loadDescriptionIfExists()
  }

  get type () {
    return 'Create sale'
  }

  // required:

  get baseAsset () {
    return this.operationDetails.base_asset
  }

  set baseAsset (asset) {
    this.operationDetails.base_asset = asset
  }

  get quoteAsset () {
    return this.operationDetails.quote_asset
  }

  set quoteAsset (asset) {
    this.operationDetails.quote_asset = asset
  }

  _mapQuoteAssets () {
    const assets = this.operationDetails.quote_assets.map(asset => ({ code: asset.quote_asset, price: asset.price, isAllowed: true }))
    const abcentAssets = walletTokens.filter(walletTokenCode => !assets.find(asset => asset.code === walletTokenCode))
    abcentAssets.forEach(code => {
      assets.push({ code, price: '1', isAllowed: false })
    })
    return assets
  }

  _parseQuoteAssets (assets) {
    return this.quoteAssets
      .filter(asset => asset.isAllowed)
      .filter(asset => asset.price)
      .map(asset => ({ asset: asset.code, price: asset.price }))
  }

  get startTime () {
    return this.operationDetails.start_time
  }

  set startTime (time) {
    this.operationDetails.start_time = time
  }

  get endTime () {
    return this.operationDetails.end_time
  }

  set endTime (time) {
    this.operationDetails.end_time = time
  }

  get price () {
    return this.operationDetails.price
  }

  set price (price) {
    this.operationDetails.price = price
  }

  get softCap () {
    return this.operationDetails.soft_cap
  }

  set softCap (cap) {
    this.operationDetails.soft_cap = cap
  }

  get hardCap () {
    return this.operationDetails.hard_cap
  }

  set hardCap (cap) {
    this.operationDetails.hard_cap = cap
  }

  get defaultAsset () {
    return 'SUN'
  }

  // details:

  get logoURL () {
    const url = this.operationDetails.details.logo.key || this.operationDetails.details.logo.url
    if (!url) return ''
    if (url.indexOf(config.FILE_STORAGE) !== -1) return url
    return `${config.FILE_STORAGE}/${url}`
  }

  get logoKey () {
    return this.operationDetails.details.logo.key || this.operationDetails.details.logo.url
  }

  set logoURL (key) {
    this.operationDetails.details.logo.key = key
  }

  get descriptionID () {
    return this.operationDetails.details.description
  }

  set descriptionID (description) {
    this.operationDetails.details.description = description
  }

  get logoContentType () {
    return this.operationDetails.details.logo.type
  }

  set logoContentType (type) {
    this.operationDetails.details.logo.type = type
  }

  get name () {
    return this.operationDetails.details.name
  }

  set name (name) {
    this.operationDetails.details.name = name
  }

  get youTubeVideoId () {
    return this.operationDetails.details.youtube_video_id
  }

  set youTubeVideoId (id) {
    this.operationDetails.details.youtube_video_id = id
  }

  // are being called from external code:

  get image () {
    return this.imageBlob
  }

  set image (blob) {
    this.imageBlob = blob
  }

  get description () {
    return this.descriptionBlob
  }

  set description (blob) {
    this.descriptionBlob = blob
  }

  get shortDescription () {
    return this.operationDetails.details.short_description
  }

  set shortDescription (description) {
    this.operationDetails.details.short_description = description
  }

  createSelfWithToken (tokenRequest) {
    return salesService.createSaleCreationRequestWithTokenRequestUpdate(this.composeData(), tokenRequest.composeData())
  }

  updateSelfWithToken (tokenRequest) {
    return salesService.createSaleCreationRequestWithTokenRequestUpdate(this.composeData(), tokenRequest.composeData())
  }

  updateSelf () {
    return salesService.createSaleCreationRequest(this.composeData())
  }

  async updateSelfWithImageUpload (tokenRequest) {
    this.logoURL = await this._sendImage()
    return this.updateSelfWithToken(tokenRequest)
  }

  async updateSelfWithDescriptionUpload (tokenRequest) {
    await this._sendDescription()
    return this.updateSelfWithToken(tokenRequest)
  }

  composeData () {
    return {
      defaultQuoteAsset: 'SUN',
      price: this.price,
      startTime: getStartSeconds(this.startTime),
      endTime: getEndSeconds(this.endTime),
      softCap: this.softCap,
      hardCap: this.hardCap,
      requestID: this.requestID,
      baseAsset: this.baseAsset,
      quoteAssets: this._parseQuoteAssets(),
      details: {
        name: this.name,
        short_description: this.shortDescription,
        description: this.descriptionID,
        logo: {
          key: this.logoKey,
          url: this.logoURL,
          type: this.logoContentType
        },
        youtube_video_id: this.youTubeVideoId
      },
      isCrowdfunding: true
    }
  }

  _sendImage () {
    const params = {
      type: 'fund_logo',
      mimeType: this.logoContentType,
      file: this.image
    }
    return fileService.uploadFile(params)
  }

  async _sendDescription () {
    const blobDetails = await users.uploadBlob('fund_overview', this.description)
    this.descriptionID = blobDetails.data('id')
  }

  async _loadImageIfExists () {
    if (!this.logoURL) return
    this.image = await fileService.loadFileByURL(this.logoURL)
  }

  async _loadDescriptionIfExists () {
    if (!this.descriptionID) return
    const blobDetails = await usersService.blobsOf().get(this.descriptionID)
    this.descriptionBlob = blobDetails.attribute('value')
  }
}

function getStartSeconds (date) {
  return '' + moment(date).utc().format('X')
  // .add(1, 'hour')
}

function getEndSeconds (date) {
  return '' + moment(date).utc().format('X')
  // .endOf('day')
}
