import { offersService } from '../../../services/offer.service'
import { SECONDARY_MARKET_ORDER_BOOK_ID } from '../../../const/const'
import { RECORDS_VERBOSE } from './help/records.const'

export class OfferRecord {
  constructor (record) {
    this._record = record
    this.id = this._record.offer_id
    this.owner = this._record.owner_id
    this.baseAmount = this._record.base_amount
    this.baseAssetCode = this._record.base_asset_code
    this.quoteAssetCode = this._record.quote_asset_code
    this.baseBalanceId = this._record.base_balance_id
    this.quoteBalanceId = this._record.quote_balance_id
    this.quoteAmount = this._record.quote_amount
    this.fee = this._record.fee
    this.isBuy = this._record.is_buy
    this.price = this._record.price
    this.createdAt = this._record.created_at
    this.orderBookId = this._record.order_book_id
  }

  get offerType () {
    return +this.orderBookId === 0 ? RECORDS_VERBOSE.offer : RECORDS_VERBOSE.investment
  }

  get isInvestment () {
    return +this.orderBookId !== +SECONDARY_MARKET_ORDER_BOOK_ID
  }

  cancelSelf () {
    return offersService.cancelOffer(this._composeCancelOpts())
  }

  _composeCancelOpts () {
    return {
      baseBalance: this.baseBalanceId,
      quoteBalance: this.quoteBalanceId,
      offerId: this.id,
      price: this.price,
      orderBookId: SECONDARY_MARKET_ORDER_BOOK_ID
    }
  }
}
