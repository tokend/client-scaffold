import { Service } from './service'
import config from '../../config'

export class ReviewableRequestsService extends Service {
  /**
   * Loads all token creation reviewable requests for current user
   *
   * @return {Promise<object>} - Promise object representing rr
   */
  loadTokensReviewableRequests () {
    return this._horizonRequestBuilder
      .reviewableRequestsHelper()
      .assets()
      .forRequestor(this._accountId)
      .order('desc')
      .limit(config.TRANSACTIONS_PER_PAGE)
      .callWithSignature(this._keypair)
  }

  /**
   * Loads all withdrawal reviewable requests for current user
   *
   * @return {Promise<object>} - Promise object representing rr
   */
  loadWithdrawalsReviewableRequests () {
    return this._horizonRequestBuilder
      .reviewableRequestsHelper()
      .withdrawals()
      .forRequestor(this._accountId)
      .order('desc')
      .limit(config.TRANSACTIONS_PER_PAGE)
      .callWithSignature(this._keypair)
  }

  /**
   * Load token creation reviewable request by id
   *
   * @param {string} id - id of reviewable requests
   * @return {Promise<Object>}
   */
  loadReviewableRequestById (id) {
    return this._horizonRequestBuilder.reviewableRequestsHelper()
      .assets()
      .reviewableRequest(id)
      .order('desc')
      .callWithSignature(this._keypair)
  }

  /**
   * Loads all sales rr for corresponding token code
   * @param {string} code - token code
   * @return {Promise<Object>}
   */
  loadSalesReviewableRequestByTokenCode (code) {
    return this._horizonRequestBuilder.reviewableRequestsHelper()
      .sales()
      .forBaseAsset(code)
      .forRequestor(this._accountId)
      .callWithSignature(this._keypair)
      .then(response => response.records[0])
  }
}

export const reviewableRequestsService = new ReviewableRequestsService()
