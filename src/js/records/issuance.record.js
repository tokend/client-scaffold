import { TxRecord } from './tx.record'
import store from '../../vuex'
import { RECORDS_VERBOSE, DIRECTION_VERBOSE } from './help/records.const'
import get from 'lodash/get'

export class IssuanceRecord extends TxRecord {
  constructor (record) {
    super(record, RECORDS_VERBOSE.issuance)
    this.amount = record.amount
    this.asset = record.asset
    this.fixedFee = record.fee_fixed
    this.percentFee = record.fee_percent
    this.id = record.id
    this.subject = record.reference
    this.counterparty = this._getCounterparty()
    this.direction = this._getDirection()
  }

  _getCounterparty () {
    const counterparty =
      this._record
        .participants
        .find(participant =>
              participant.account_id !== store.getters.userAccountId
         )
    return get(counterparty, 'account_id') || ''
  }

  _getDirection () {
    return DIRECTION_VERBOSE.in
  }
}
