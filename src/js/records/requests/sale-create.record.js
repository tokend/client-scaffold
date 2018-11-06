import { RequestRecord } from '../request-record'
import { DateUtil } from '../../utils/date.util'
import _get from 'lodash/get'

export class SaleRequestRecord extends RequestRecord {
  constructor (record, details = {}) {
    super(record)

    this.baseAsset = _get(this._record, 'details.sale.baseAsset')
    this.name = _get(this._record, 'details.sale.details.name')
    this.defaultQuoteAsset = _get(
      this._record, 'details.sale.defaultQuoteAsset'
    )
    this.startTime = _get(
      this._record, 'details.sale.startTime'
    )
    this.endTime = _get(this._record, 'details.sale.endTime')
    this.softCap = _get(this._record, 'details.sale.softCap')
    this.hardCap = _get(this._record, 'details.sale.hardCap')
    this.baseAssetForHardCap = _get(
      this._record, 'details.sale.baseAssetForHardCap'
    )
    this.saleTypeStr = _get(this._record, 'details.sale.saleType.name')
    this.saleType = _get(this._record, 'details.sale.saleType.value')
    this.saleState = _get(this._record, 'details.sale.state.value')
    this.saleStateStr = _get(this._record, 'details.sale.state.name')

    this.details = _get(this._record, 'details.sale.details')
    this.description = _get(
      this._record, 'details.sale.details.description'
    )
    this.logo = _get(this._record, 'details.sale.details.logo')
    this.logoKey = _get(this._record, 'details.sale.details.logo.key')
    this.logoName = _get(this._record, 'details.sale.details.logo.name')
    this.logoType = _get(this._record, 'details.sale.details.logo.type')
    this.shortDescription = _get(
      this._record, 'details.sale.details.shortDescription'
    )
    this.youtubeVideoId = _get(
      this._record, 'details.sale.details.youtubeVideoId'
    )

    this.returnOfInvestment = _get(
      record, 'details.sale.details.returnOfInvestment'
    )
    this.returnOfInvestmentFrom = _get(
      record, 'details.sale.details.returnOfInvestment.from'
    )
    this.returnOfInvestmentTo = _get(
      record, 'details.sale.details.returnOfInvestment.to'
    )

    this.quoteAssets = this._getQuoteAssets()
  }

  get returnOfInvestmentStr () {
    if (!this.returnOfInvestmentFrom && !this.returnOfInvestmentTo) {
      return ''
    }

    if (this.returnOfInvestmentFrom && !this.returnOfInvestmentTo) {
      return `${this.returnOfInvestmentFrom}%+`
    }

    if (!this.returnOfInvestmentFrom && this.returnOfInvestmentTo) {
      return `under ${this.returnOfInvestmentTo}%`
    }

    if (this.returnOfInvestmentFrom && this.returnOfInvestmentTo) {
      return `${this.returnOfInvestmentFrom}—${this.returnOfInvestmentTo}`
    }
  }

  logoUrl (storageUrl) {
    return this.logoKey ? `${storageUrl}/${this.logoKey}` : ''
  }

  _getQuoteAssets () {
    return _get(this._record, 'details.sale.quoteAssets', [])
      .map(asset => asset.quoteAsset)
  }

  opts () {
    return {
      requestID: this.id,
      baseAsset: this.baseAsset,
      defaultQuoteAsset: this.defaultQuoteAsset,
      startTime: DateUtil.toTimestamp(this.startTime),
      endTime: DateUtil.toTimestamp(this.endTime),
      softCap: this.softCap,
      hardCap: this.hardCap,
      saleState: this.saleState,
      baseAssetForHardCap: this.baseAssetForHardCap,
      details: {
        name: this.name,
        short_description: this.shortDescription,
        description: this.description,
        logo: this.logo,
        return_of_investment: {
          to: this.returnOfInvestmentTo,
          from: this.returnOfInvestmentFrom
        }
      },
      quoteAssets: this.quoteAssets.map(asset => ({ asset, price: '1' })),
      saleType: this.saleType
    }
  }
}
