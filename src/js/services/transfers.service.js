import { PaymentV2Builder } from 'swarm-js-sdk'
import { Service } from './service'

export class TransferService extends Service {
  /**
   * @param {object} opts
   * @param {string} opts.amount
   * @param {string} opts.asset
   * @param {string} opts.destinationAccountId
   * @param {string} opts.sourceFixedFee
   * @param {string} opts.sourcePercentFee
   * @param {string} opts.sourceFeeAsset
   * @param {string} opts.destinationFixedFee
   * @param {string} opts.destinationPercentFee
   * @param {string} opts.destinationFeeAsset
   * @param {string} opts.sourceBalanceId
   * @param {string} opts.destinationBalanceId
   * @param {string} opts.subject
   * @param {boolean} opts.feeFromSource
   * @return {Object} transferBuilders
   * @return {Function} transferBuilders.V1
   * @return {Function} transferBuilders.V2
   */
  createTransfer (opts) {
    const operation = PaymentV2Builder.paymentV2(_opts())
    return this._operationBuilder
      .operation()
      .add(operation)
      .submit(this._accountId, this._keypair)

    function _opts () {
      return {
        sourceBalanceId: opts.sourceBalanceId,
        destination: opts.destinationAccountId,
        amount: opts.amount,
        feeData: {
          sourceFee: {
            maxPaymentFee: +opts.sourcePercentFee,
            fixedFee: +opts.sourceFixedFee,
            feeAsset: opts.sourceFeeAsset
          },
          destinationFee: {
            maxPaymentFee: +opts.destinationPercentFee,
            fixedFee: +opts.destinationFixedFee,
            feeAsset: opts.destinationFeeAsset
          },
          sourcePaysForDest: opts.feeFromSource
        },
        subject: opts.subject
      }
    }
  }
}

export const transferService = new TransferService()
