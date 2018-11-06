import { OpRecord } from '../op-record'
import { MathUtil } from '../../utils/math.util'
import _get from 'lodash/get'

export class PaymentRecord extends OpRecord {
  /**
   * @param record - raw record from {@link HorizonResponse}
   * @param details
   * @param details.accountId
   */
  constructor (record, details = {}) {
    super(record)
    this.name = 'Transfer'

    this.amount = record.amount
    this.asset = record.asset
    this.direction = this._checkDirection(details.accountId)
    this.counterparty = this._parseCounterParty()
    this.fees = this._calculateFees()
    this.sourcePaysForDest = record.sourcePaysForDest
    this.sourceFeeAsset = _get(
      record, 'sourceFeeData.actualPaymentFeeAssetCode'
    )
    this.destinationFeeAsset = _get(
      record, 'destinationFeeData.actualPaymentFeeAssetCode'
    )
    this.participants = this._parseParticipants()
    this.receiver = record.to
    this.sender = record.from
    this.subject = record.subject
  }

  _checkDirection (accountId) {
    return this.sender === accountId ? 'out' : 'in'
  }

  _calculateFees () {
    return {
      source: MathUtil.add(
        _get(this._record, 'sourceFeeData.actualPaymentFee'),
        _get(this._record, 'sourceFeeData.fixedFee')),
      destination: MathUtil.add(
        _get(this._record, 'destinationFeeData.actualPaymentFee'),
        _get(this._record, 'destinationFeeData.fixedFee'))
    }
  }

  _parseParticipants () {
    return this._record.participants.map(participant => participant.account_id)
  }

  _parseCounterParty () {
    const direction = this._checkDirection()
    return direction === 'in' ? this._record.from : this._record.to
  }
}
