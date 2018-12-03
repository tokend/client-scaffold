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
      .params(params)
      .sign()
      .post()
  }
}
