import moment from 'moment'
import get from 'lodash/get'

import config from '../../../../config'
import store from '../../../../vuex'

import { tokensService } from '../../../services/tokens.service'
import { accountsService } from '../../../services/accounts.service'
import { usersService } from '../../../services/users.service'

import { RecordFactory } from '../record_factory'
import { blobFilters, blobTypes } from '../../../const/const'

const STATES = {
  Open: 1,
  Closed: 2,
  Cancelled: 4
}

export class SaleRecord {
  constructor (record) {
    record ? this._record = record : this._fillEmpty()

    this._fill()
    this.syndicate = ''
    this.syndicateDetails = { members: [] }
    this.token = { details: { logo: '' } }
    this.description = ''
  }

  _fill () {
    this.id = this._record.id
    this.owner = this._record.owner_id
    this.baseAsset = this._record.base_asset
    this.defaultQuoteAsset = this._record.default_quote_asset
    this.quoteAssets = get(this._record, 'quote_assets.quote_assets') || []
    this.baseHardCap = this._record.base_hard_cap
    this.startTime = this._record.start_time
    this.endTime = this._record.end_time
    this.price = this._record.price
    this.softCap = this._record.soft_cap
    this.hardCap = this._record.hard_cap
    this.currentCap = this._record.current_cap
    this.name = get(this._record, 'details.name')
    this.descriptionID = get(this._record, 'details.description')
    this.shortDescription = get(this._record, 'details.short_description')
    this.youTubeVideoId = get(this._record, 'details.youtube_video_id')
    this.statistics = this._record.statistics
    this.investors = get(this._record, 'statistics.investors')
    this.averageInvestment = get(this._record, 'statistics.average_amount')
  }

  _fillEmpty () {
    this._record = {
      details: {},
      state: {},
      statistics: {}
    }
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
    return this.owner === store.getters.userAccountId
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

  async followSelf () {
    if (!this.baseAsset) return
    await accountsService.createBalance(this.baseAsset)
  }

  async isFollowing () {
    return Boolean(store.getters.balances[this.baseAsset])
  }
}
