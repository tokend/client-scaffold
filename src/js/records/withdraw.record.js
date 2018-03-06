import { TxRecord } from './tx.record'
import store from '../../vuex'
import get from 'lodash/get'
import { PricesHelper } from '../../vuex/helpers/prices.helper'
import { RECORDS_VERBOSE, DIRECTION_VERBOSE } from './help/records.const'

export class WithdrawalRecord extends TxRecord {
  constructor (record) {
    super(record, RECORDS_VERBOSE.withdrawal)
    this._parse()
  }

  _parse () {
    this.amount = this._record.amount
    this.asset = this._getAsset(this._record.balance)
    this.amountSUN = this._getSUNAmount()
    this.fixedFee = this._record.fee_fixed
    this.percentFee = this._record.fee_percent
    this.counterparty = get(this._record, 'external_details.address')
    this.direction = DIRECTION_VERBOSE.out
    this.destinationAsset = this._record.dest_asset
    this.destinationAmount = this._record.dest_amount
  }

  _getSUNAmount () {
    return PricesHelper.baseToQuote(this.amount, this.asset, 'SUN')
  }

  _getAsset (balanceId) {
    for (const entry of Object.entries(store.getters.balances)) {
      const asset = entry[0]
      const balance = entry[1]
      if (balance.balance_id === balanceId) {
        return asset
      }
    }
  }
}
