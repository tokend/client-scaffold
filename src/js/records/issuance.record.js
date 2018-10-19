import { TxRecord } from './tx.record'
import { RECORDS_VERBOSE, DIRECTION_VERBOSE } from './help/records.const'
import get from 'lodash/get'

export class IssuanceRecord extends TxRecord {
  constructor (record, userAccountId) {
    super(record, RECORDS_VERBOSE.issuance)
    this.userAccountId = userAccountId

    this.amount = record.amount
    this.asset = record.asset
    this.fixedFee = record.fee_fixed
    this.percentFee = record.fee_percent
    this.subject = record.reference
    this.counterparty = this._getCounterparty()
    this.direction = this._getDirection()
  }

  _getCounterparty () {
    const counterparty =
      this._record
        .participants
        .find(participant => participant.account_id !== this.userAccountId)
    return get(counterparty, 'account_id') || ''
  }

  _getDirection () {
    return DIRECTION_VERBOSE.in
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
      amount: { type: 'formatAmount', asset: '' },
      fixedFee: { type: 'formatAmount', asset: '' },
      percentFee: { type: 'formatAmount', asset: '' },
      asset: { type: 'raw' },
      date: { type: 'formatDate' }
    }
  }
}
