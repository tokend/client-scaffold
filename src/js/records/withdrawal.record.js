import { TxRecord } from './tx.record'
import get from 'lodash/get'
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
    this.asset = record.dest_asset
  }

  get listView () {
    return {
      email: 'raw',
      amount: 'formatAmount',
      type: 'translate',
      direction: 'raw'
    }
  }

  get detailsView () {
    return {
      counterparty: { type: 'raw' },
      destinationAsset: { type: 'raw' },
      amount: { type: 'formatAmount', asset: this.asset },
      fixedFee: { type: 'formatAmount', asset: this.asset },
      percentFee: { type: 'formatAmount', asset: this.asset },
      destinationAmount: { type: 'formatAmount', asset: this.destinationAmount },
      date: { type: 'formatDate' }
    }
  }
}
