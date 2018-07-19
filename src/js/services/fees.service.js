import { Service } from './service'
import { PAYMENT_FEE_SUBTYPES } from '../const/xdr.const'
import { xdr } from 'swarm-js-sdk'

const feeTypes = {
  PAYMENT_FEE: 'paymentFee',
  WITHDRAWAL_FEE: 'withdrawalFee',
  OFFER_FEE: 'offerFee'
}

export class FeeService extends Service {
  loadPaymentFeeByAmount (asset, amount, accountId = this._accountId, subtype = PAYMENT_FEE_SUBTYPES.outgoing) {
    const feeType = xdr.FeeType.fromName(feeTypes.PAYMENT_FEE).value

    return this._horizonRequestBuilder.fees()
      .fee(feeType, asset, accountId, amount, subtype)
      .call()
      .then(result => ({ fixed: result.fixed, percent: result.percent, feeAsset: result.fee_asset }))
  }

  loadWithdrawalFeeByAmount (asset, amount, accountId = this._accountId) {
    const feeType = xdr.FeeType.fromName(feeTypes.WITHDRAWAL_FEE).value

    return this._horizonRequestBuilder.fees()
      .fee(feeType, asset, accountId, amount)
      .call()
      .then(result => ({ fixed: result.fixed, percent: result.percent }))
  }

  loadOfferFeeByAmount (asset, amount, accountId = this._accountId) {
    const feeType = xdr.FeeType.fromName(feeTypes.OFFER_FEE).value

    return this._horizonRequestBuilder.fees()
      .fee(feeType, asset, accountId, amount)
      .call()
      .then(result => ({ fixed: result.fixed, percent: result.percent }))
  }
}

export const feeService = new FeeService()
