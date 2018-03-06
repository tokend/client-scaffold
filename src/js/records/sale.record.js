import moment from 'moment'
import get from 'lodash/get'

import config from '../../config'

import { tokensService } from '../services/tokens.service'
import { accountsService } from '../services/accounts.service'
import { usersService } from '../services/users.service'

import { RecordFactory } from './factory'
import { blobFilters, blobTypes } from '../const/const'

const STATES = {
  Open: 1,
  Closed: 2,
  Cancelled: 4
}

export class SaleRecord {
  constructor (record, userAccountId) {
    this._record = record
    this.userAccountId = userAccountId

    this.id = record.id
    this.owner = record.owner_id
    this.baseAsset = record.base_asset
    this.defaultQuoteAsset = record.default_quote_asset
    this.quoteAssets = get(record, 'quote_assets.quote_assets') || []
    this.baseHardCap = record.base_hard_cap
    this.startTime = record.start_time
    this.endTime = record.end_time
    this.price = record.price
    this.softCap = record.soft_cap
    this.hardCap = record.hard_cap
    this.currentCap = record.current_cap
    this.name = get(record, 'details.name')
    this.descriptionID = get(record, 'details.description')
    this.shortDescription = get(record, 'details.short_description')
    this.youTubeVideoId = get(record, 'details.youtube_video_id')
    this.statistics = record.statistics
    this.investors = get(record, 'statistics.investors')
    this.averageInvestment = get(record, 'statistics.average_amount')
    this.syndicate = ''
    this.syndicateDetails = { members: [] }
    this.token = { details: { logo: '' } }
    this.description = ''
  }

  get quoteAssetCodes () {
    return this.quoteAssets.map(asset => asset.asset)
  }

  get quoteAssetPrices () {
    return this.quoteAssets.reduce((prices, asset) => { prices[asset.asset] = asset.price; return prices }, {})
  }

  get currentCaps () {
    return this.quoteAssets.reduce((caps, asset) => { caps[asset.asset] = asset.current_cap; return caps }, {})
  }

  get totalCurrentCaps () {
    return this.quoteAssets.reduce((caps, asset) => { caps[asset.asset] = asset.total_current_cap; return caps }, {})
  }

  get hardCaps () {
    return this.quoteAssets.reduce((caps, asset) => { caps[asset.asset] = asset.hard_cap; return caps }, {})
  }

  get acceptsBTC () {
    return this.quoteAssetCodes.indexOf('BTC') !== -1
  }

  get acceptsETH () {
    return this.quoteAssetCodes.indexOf('ETH') !== -1
  }

  get daysToGo () {
    const now = moment()
    const ends = moment(this.endTime)
    if (ends.isBefore(now)) return -1
    return ends.diff(now, 'days')
  }

  get hardCapProgress () {
    return Math.round(this.currentCap / this.hardCap / 100) * 10000
  }

  get softCapProgress () {
    return Math.round(this.currentCap / this.softCap / 100) * 10000
  }

  get image () {
    const key = this._record.details.logo.key
    return `${config.FILE_STORAGE}/${key}`
  }

  get attachedToken () {
    return this.token
  }

  get isOpened () {
    return this._record.state.value === STATES.Open
  }

  get isClosed () {
    return this._record.state.value === STATES.Closed
  }

  get isCanceled () {
    return this._record.state.value === STATES.Cancelled
  }

  get state () {
    return this._record.state.name
  }

  get isUpcoming () {
    const now = moment()
    return moment(this.startTime).isAfter(now)
  }

  get startsIn () {
    const now = moment().startOf('day')
    const starts = moment(this.startTime)
    return starts.diff(now, 'days')
  }

  get isMy () {
    return this.owner === this.userAccountId
  }

  // api:

  async loadDescriptionIfExists () {
    if (!this.descriptionID) return
    const blobDetails = await usersService.blobsOf().get(this.descriptionID)
    this.descriptionBlob = blobDetails.attribute('value')
  }

  async loadToken () {
    if (!this.baseAsset) return
    this.token = RecordFactory.createTokenRecord(await tokensService.loadTokenByCode(this.baseAsset))
  }

  async loadSyndicateDetails () {
    if (!this.owner) return
    const details = await accountsService.loadEmailByAccountId(this.owner)
    const filters = {
      [blobFilters.fundOwner]: this.owner,
      [blobFilters.type]: blobTypes.syndicate_kyc.num
    }
    const syndicateDetails = (await usersService.blobsOf(this.owner).getAll(filters))[0]
    this.syndicate = details.email
    this.syndicateDetails = syndicateDetails
  }
}
