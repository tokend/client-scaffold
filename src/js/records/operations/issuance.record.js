import { OpRecord } from '../op-record'
import _get from 'lodash/get'

const NAMES_BY_CAUSE = {
  'airdrop': 'Registration Promo Airdrop',
  'airdrop-for-kyc': 'KYC verification bonus',
  'airdrop-telegram': 'Telegram airdrop',
  'none': 'Deposit'
}

export class IssuanceRecord extends OpRecord {
  constructor (record) {
    super(record)

    this.amount = record.amount
    this.asset = record.asset
    this.direction = 'in'
    this.feeAsset = record.asset
    this.fixedFee = record.feeFixed
    this.percentFee = record.feePercent
    this.id = record.id
    this.subject = record.reference

    this.externalDetails = record.externalDetails

    this.blockNumber = _get(record, 'externalDetails.blockNumber')
    this.outIndex = _get(record, 'externalDetails.outIndex')
    this.txHash = _get(record, 'externalDetails.txHash')
  }

  get name () {
    return NAMES_BY_CAUSE[_get(this._record, 'externalDetails.cause')] ||
           NAMES_BY_CAUSE.none
  }

  get counterparty () {
    return _get(this._record.participants.find(p => !p.balance_id), 'accountId')
  }

  get isDeposit () {
    return this.name === NAMES_BY_CAUSE.none
  }
}
