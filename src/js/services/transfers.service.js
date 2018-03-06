import { ErrorFactory, errorTypes } from '../errors/factory'
import { Operation } from 'swarm-js-sdk'
import { Service } from './service'
import { initHorizonServer } from '../helpers/server.helper'
import store from '../../vuex'

export class TransferService extends Service {
  /**
   * @async
   * @borrows _composeTransferOptions
   * @return {TransactionResponseBuilder}
   */
  async createTransfer (opts) {
    const operation = Operation.payment(await this._composeTransferOptions(opts))
    return this._operationBuilder
      .operation()
      .add(operation)
      .submit(this._accountId, this._keypair)
  }

  /**
   *
   * @private
   * @async
   *
   * @param {object} opts
   * @param {string} opts.amount
   * @param {string} opts.asset
   * @param {string} opts.destinationAccountId
   * @param {string} opts.sourceFixedFee
   * @param {string} opts.sourcePercentFee
   * @param {string} opts.destinationFixedFee
   * @param {string} opts.destinationPercentFee
   * @param {string} opts.subject
   * @param {boolean} opts.feeFromSource
   */
  async _composeTransferOptions (opts) {
    const sourceAccountId = store.getters.userAccountId
    const { sourceBalanceId, destinationBalanceId } = await this._findBalancesByAccounts(sourceAccountId, opts.destinationAccountId, opts.asset)
    return {
      amount: opts.amount,
      asset: opts.asset,
      destinationBalanceId,
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
      source: sourceAccountId,
      sourceBalanceId,
      subject: opts.subject
    }
  }

  async _findBalancesByAccounts (sourceAccountId, destinationAccountId, asset) {
    const map = [getBalanceIdByAccountId(sourceAccountId, asset), getBalanceIdByAccountId(destinationAccountId, asset)]
    const balances = await Promise.all(map)
    return Promise.resolve({
      sourceBalanceId: balances[0],
      destinationBalanceId: balances[1]
    })
  }
}

export const transferService = new TransferService()

// TODO: move to store helpers
function getBalanceIdByAccountId (accountId, asset) {
  const server = initHorizonServer()
  const keypair = store.getters.keypair
  return server.accounts()
    .balances(accountId)
    .callWithSignature(keypair)
    .then(balances => filterBalanceByAsset(balances, asset))
}

function filterBalanceByAsset (balances, asset) {
  const neededBalance = balances.filter(balance => balance.asset === asset)[0]
  if (neededBalance) return Promise.resolve(neededBalance.balance_id)
  else ErrorFactory.throwError(errorTypes.NotFoundError)
}
