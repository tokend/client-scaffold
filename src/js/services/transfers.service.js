import { Operation, PaymentV2Builder } from 'swarm-js-sdk'
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
    const _this = this
    return {
      V1 () {
        const operation = Operation.payment(_opts())
        return _this._operationBuilder
          .operation()
          .add(operation)
          .submit(_this._accountId, _this._keypair)

        function _opts () {
          return {
            destinationBalanceId: opts.destinationBalanceId,
            sourceBalanceId: opts.sourceBalanceId,
            feeData: {
              sourcePaysForDest: opts.feeFromSource,
              sourceFee: {
                fixedFee: +opts.sourceFixedFee,
                paymentFee: +opts.sourcePercentFee
              },
              destinationFee: {
                fixedFee: +opts.destinationFixedFee,
                paymentFee: +opts.destinationPercentFee
              }
            },
            subject: opts.subject,
            amount: opts.amount,
            asset: opts.asset
          }
        }
      },
      V2 () {
        const operation = PaymentV2Builder.paymentV2(_opts())
        return _this._operationBuilder
          .operation()
          .add(operation)
          .submit(_this._accountId, _this._keypair)

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
  }
}

export const transferService = new TransferService()
