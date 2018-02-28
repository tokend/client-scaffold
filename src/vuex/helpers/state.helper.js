import store from '../index'
import { vuexTypes } from '../types'
import { accountsService } from '../../js/services/accounts.service'
import { RecordFactory } from '../../js/factories/records/record_factory'
import get from 'lodash/get'

export class StateHelper {
  /**
   * Groups balances by asset code
   * @param {array} balances
   * @returns {object} groupedBalances
   */
  static groupBalances (balances) {
    return balances.reduce((groupedBalances, balance) => {
      groupedBalances[balance.asset] = balance
      return groupedBalances
    }, {})
  }

  /**
   * Gives you balance id by token code, if exitsts, otherwise - creates new
   *
   * @async
   * @param code
   * @return {string} balanceId
   */
  static async getBalanceId (code) {
    const balance = store.getters.balances[code]
    const balanceId = get(balance, 'balance_id')
    if (balanceId) return balanceId

    await accountsService.createBalance(code)
    await Promise.all([
      store.dispatch(vuexTypes.GET_ACCOUNT_DETAILS),
      store.dispatch(vuexTypes.GET_BALANCES)
    ])
    return store.getters.balances[code].balance_id
  }

  static getSaleIdWhereUSerParticipated () {
    return store.getters.rawBalances
      .map(balance => get(balance, 'asset_details.sales[0].id'))
      .filter(id => id)
  }

  static deriveTokensFromBalancesDetails () {
    return store.getters.rawBalances
      .map(balance => {
        const token = RecordFactory.createTokenRecord(get(balance, 'asset_details'))
        const sale = RecordFactory.createSaleRecord(get(balance, 'asset_details.sales[0]'))
        token.attachSale(sale)
        token.attachDetails({
          convertedBalance: balance.converted_balance,
          convertedLocked: balance.converted_locked
        })
        return token
      })
  }

  static storeLoginData (opts) {
    const data = {
      accountId: opts.accountId || store.getters.userAccountId,
      email: opts.email || store.getters.userEmail,
      publicKey: opts.publicKey,
      seed: opts.seed,
      walletId: opts.walletId
    }

    store.dispatch(vuexTypes.STORE_LOGIN_DATA, data)
    return Promise.resolve(true)
  }
}
