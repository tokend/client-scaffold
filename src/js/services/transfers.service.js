import { Operation } from 'swarm-js-sdk'
import { Service } from './service'

export class TransferService extends Service {
  /**
   * @param {object} opts
   * @param {string} opts.amount
   * @param {string} opts.asset
   * @param {string} opts.destinationAccountId
   * @param {string} opts.sourceFixedFee
   * @param {string} opts.sourcePercentFee
   * @param {string} opts.destinationFixedFee
   * @param {string} opts.destinationPercentFee
   * @param {string} opts.sourceBalanceId
   * @param {string} opts.destinationBalanceId
   * @param {string} opts.subject
   * @param {boolean} opts.feeFromSource
   * @return {TransactionResponseBuilder}
   */
  async createTransfer (opts) {
    const operation = Operation.payment(await _opts())

    return this._operationBuilder
      .operation()
      .add(operation)
      .submit(this._accountId, this._keypair)

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
  }
}

export const transferService = new TransferService()
//
// // TODO: move to store helpers
// function getBalanceIdByAccountId (accountId, asset) {
//   const server = initHorizonServer()
//   const keypair = store.getters.keypair
//   return server.accounts()
//     .balances(accountId)
//     .callWithSignature(keypair)
//     .then(balances => filterBalanceByAsset(balances, asset))
// }
//
// function filterBalanceByAsset (balances, asset) {
//   const neededBalance = balances.filter(balance => balance.asset === asset)[0]
//   if (neededBalance) return Promise.resolve(neededBalance.balance_id)
//   else ErrorFactory.throwError(errorTypes.NotFoundError)
// }
