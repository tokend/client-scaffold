import { xdr, Operation } from 'swarm-js-sdk'
import { ErrorFactory, errorTypes } from '../errors/factory'
import { Service } from './service'

/**
 * @module accounts
 * Service to load account details
 */
export class AccountsService extends Service {
  /**
   * Loads user account details
   * @return {Promise<object>} - promise object representing account details
   */
  loadAccount () {
    return this._horizonRequestBuilder.accounts()
      .accountId(this._accountId)
      .callWithSignature(this._keypair)
  }

  /**
   * Creates balance for provided token code
   * @param {string} code
   * @returns {@link TransactionResponseBuilder} default transaction response
   */
  createBalance (code) {
    const operation = Operation.manageBalance({
      asset: code,
      action: xdr.ManageBalanceAction.create(),
      destination: this._accountId
    })

    return this._operationBuilder
      .operation()
      .add(operation)
      .submit(this._accountId, this._keypair)
  }

  /**
   * Loads details for each balance, including asset_details and opened sales for each asset
   * @return {Promise<array>} Promise object representing user balances
   */
  loadDetailsForEachBalance () {
    return this._horizonRequestBuilder.accounts()
      .details(this._accountId)
      .callWithSignature(this._keypair)
  }

  /**
   * Loads balance id by provided account id
   * @param {string} email
   * @param {string} assetCode
   * @returns {string} balance_id
   */
  loadBalanceIdByEmail (email, assetCode) {
    return this.loadAccountIdByEmail(email)
      .then(record => Promise.resolve(record.data('account_id')))
      .then(this.loadAccountBalancesById)
      .then(allBalances => {
        const balance = allBalances.find(balance => balance.asset === assetCode)
        if (!balance) ErrorFactory.throwError(errorTypes.NotFoundError)
        return balance.balance_id
      })
  }

  /**
   * Loads all account balances by account id
   * @param {string} accountId
   * @returns {Promise <balances>} Promise object represents account balances
   */
  loadAccountBalancesById (accountId) {
    return this._horizonRequestBuilder.accounts()
      .balances(accountId)
      .callWithSignature(this._keypair)
  }

  /**
   * Loads account id for provided email
   * @param {string} email
   * @returns {Promise} Promise object representing account id
   */
  loadAccountIdByEmail (email) {
    return this._apiRequestBuilder.userId()
      .forEmail(email)
      .get()
  }

  /**
   * Loads email address by provided account id
   * @param accountId
   * @returns {string} email
   */
  // TODO: for now, this does not return email string, but { email: 'qqq@wqe.com }. Need to fix
  loadEmailByAccountId (accountId) {
    const params = { addresses: [accountId] }
    return this._apiRequestBuilder.details()
      .setParams(params)
      .sign(this._keypair)
      .json()
      .post()
      .then(response => Object.values(response.data('users'))[0])
  }

  /**
   * Loads array of emails by provided array of account id's
   * @param {array} addresses
   * @returns {object} details
   */
  loadMultipleAccountDetails (addresses) {
    const params = { addresses }

    return this._apiRequestBuilder.details()
      .setParams(params)
      .sign(this._keypair)
      .json()
      .post()
  }

  /**
   * Loads account id by provided balance id
   * @param balanceId
   * @return {Promise} Promise object representing account id
   */
  loadAccountIdByBalanceId (balanceId) {
    return this._horizonRequestBuilder.balances()
      .account(balanceId)
      .callWithSignature(this._keypair)
  }
}

export const accountsService = new AccountsService()
