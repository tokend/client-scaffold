import store from '../../../../../vuex'
import { TxRecord } from './tx.record'

import { add } from '../../../../utils/math.util'
import { convertAmount } from '../../../../helpers/prices.helper'
import { RECORDS_VERBOSE, DIRECTION_VERBOSE } from '../../help/records.const'

export class TransferRecord extends TxRecord {
  constructor (record) {
    super(record, RECORDS_VERBOSE.transfer)
    this.parse()
  }

  parse () {
    this.amount = this._record.amount
    this.asset = this._record.asset
    this.amountSUN = this._getSUNAmount()
    this.counterparty = this._getCounterParty()
    this.direction = this._getDirection()
    this.fee = this._getFee() // TODO: need parse fees separately later to show in extended details
    this.id = this._record.id
    this.participants = this._getParticipants()
    this.receiver = this._record.to
    this.sender = this._record.from
    this.subject = this._record.subject
  }

  _getDirection () {
    const userAccountId = store.getters.userAccountId
    return this._record.from === userAccountId ? DIRECTION_VERBOSE.out : DIRECTION_VERBOSE.in
  }

  _getFee () {
    const sendersFee = add(this._record.source_payment_fee, this._record.source_fixed_fee)
    const recipientsFee = add(this._record.destination_payment_fee, this._record.destination_fixed_fee)
    const sourcePaysForDest = this._record.source_pays_for_dest
    const direction = this.direction

    if (direction === DIRECTION_VERBOSE.in) {
      return sourcePaysForDest ? 'Sender paid' : recipientsFee
    }
    return sourcePaysForDest ? add(sendersFee, recipientsFee) : sendersFee
  }

  _getParticipants () {
    return this._record.participants.map(participant => participant.account_id)
  }

  _getCounterParty () {
    const direction = this._getDirection()
    return direction === DIRECTION_VERBOSE.in ? this._record.from : this._record.to
  }

  _getSUNAmount () {
    return convertAmount(this.amount, this.asset, 'SUN')
  }
}
