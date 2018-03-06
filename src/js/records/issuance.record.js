import { TxRecord } from './tx.record'

import store from '../../../../../vuex'

import { PricesHelper } from '../../../../../vuex/helpers/prices.helper'
import { RECORDS_VERBOSE, DIRECTION_VERBOSE } from './help/records.const'

import get from 'lodash/get'

export class IssuanceRecord extends TxRecord {
  constructor (record) {
    super(record, RECORDS_VERBOSE.issuance)
    this._parse()
  }

  _parse () {
    this.amount = this._record.amount
    this.asset = this._record.asset
    this.amountSUN = this._getSUNAmount()
    this.counterparty = this._getCounterparty()
    this.direction = this._getDirection()
    this.fixedFee = this._record.fee_fixed
    this.percentFee = this._record.fee_percent
    this.id = this._record.id
    this.subject = this._record.reference
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

  _getSUNAmount () {
    return PricesHelper.baseToQuote(this.amount, this.asset, 'SUN')
  }
}
