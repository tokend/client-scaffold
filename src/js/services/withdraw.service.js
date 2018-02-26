import { Service } from './service'
import { CreateWithdrawRequestBuilder } from 'swarm-js-sdk'

export class WithdrawService extends Service {
  createWithdrawalRequest (opts) {
    const operation = CreateWithdrawRequestBuilder.createWithdrawWithAutoConversion(opts)

    return this._operationBuilder
      .operation()
      .add(operation)
      .submit(this._accountId, this._keypair)
  }
}

export const withdrawService = new WithdrawService()
