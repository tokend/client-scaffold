import { Service } from '@/js/services/service'

export class DepositService extends Service {
  /**
   * @param params
   * @param params.amount
   * @param params.balance
   * @returns {*}
   */
  requestDeposit (params) {
    return this._apiRequestBuilder
      .deposit()
      .setParams(params)
      .sign(this._keypair)
      .json()
      .post()
  }
}

export const depositService = new DepositService()
