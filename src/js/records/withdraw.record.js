import { TxRecord } from './tx.record'
import store from '../../vuex'
import get from 'lodash/get'
import { PricesHelper } from '../../vuex/helpers/prices.helper'
import { RECORDS_VERBOSE, DIRECTION_VERBOSE } from './help/records.const'

export class WithdrawalRecord extends TxRecord {
  constructor (record) {
    super(record, RECORDS_VERBOSE.withdrawal)
    this.amount = record.amount
    this.fixedFee = record.fee_fixed
    this.percentFee = record.fee_percent
    this.counterparty = get(record, 'external_details.address')
    this.direction = DIRECTION_VERBOSE.out
    this.destinationAsset = record.dest_asset
    this.destinationAmount = record.dest_amount
    this.asset = this._getAsset(record.balance)
    this.amountSUN = this._getSUNAmount()
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
