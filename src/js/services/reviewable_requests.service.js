import { Service } from './service'
import { ReviewableRequestFactory } from '../factories/reviewable_requests/reviewable_request_factory'
import { xdr } from 'swarm-js-sdk'
import { ErrorFactory, errorTypes } from '../errors/error_factory'
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

  async loadAssetsReviewableRequestsWithCorrespondingFund (nextPageCaller) {
    const requestor = nextPageCaller || this.loadTokensReviewableRequests

    const response = await requestor()
    const tokenRequests = response.records.map(record => createRequestEntity(record))
    const next = response.next

    const map = tokenRequests.map(request => this.loadSalesReviewableRequestByTokenCode(request.code))
    return Promise.all(map)
      .then(saleRequests => {
        const requestPairs = tokenRequests.map((tokenRequest, i) => ({ tokenRequest, saleRequest: saleRequests[i] }))
        return Promise.resolve({ requestPairs, next })
      })
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
      .then(result => Promise.resolve(createRequestEntity(result)))
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
      .then(response => Promise.resolve(createRequestEntity(response.records[0])))
  }
}

export const reviewableRequestsService = new ReviewableRequestsService()

function createRequestEntity (record) {
  if (!record) return null
  switch (record.details.request_type_i) {
    case xdr.ReviewableRequestType.assetCreate().value:
      return ReviewableRequestFactory.createTokenCreationRequest(record)
    case xdr.ReviewableRequestType.sale().value:
      return ReviewableRequestFactory.createSaleCreationRequest(record)
    default:
      ErrorFactory.throwError(errorTypes.UnknownReviewableRequestError, record)
  }
}
