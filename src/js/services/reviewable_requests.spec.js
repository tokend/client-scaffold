import { ReviewableRequestsService } from './reviewable_requests.service'
import { mockAccountId, mockResponses } from './test/default.mocks'
import { ServiceTestHelper } from './test/service_test_helper'
import { Keypair } from 'tokend-js-sdk'
import { mockReviewableRequestId, mockReviewableRequestTokenCode } from './test/reviewable_requests.mocks'
import config from '../../config'

ServiceTestHelper.letVueResourseRespondFrom(mockResponses)

describe('reviewable_requests.service test', () => {
  let reviewableRequestsService

  beforeEach(() => {
    reviewableRequestsService = new ReviewableRequestsService({accountId: mockAccountId, keypair: Keypair.random()})

  })

  /** requests to horizon: **/

  it('loadTokensReviewableRequests() should properly build request url', () => {
    const prefix = `request/assets?requestor=${mockAccountId}&order=desc&limit=${config.TRANSACTIONS_PER_PAGE}`
    return ServiceTestHelper.doAxiosMockedRequest(
      () => reviewableRequestsService.loadTokensReviewableRequests(),
      prefix,
      mockResponses[prefix]
    )
  })

  it('loadWithdrawalsReviewableRequests() should properly build request url', () => {
    const prefix = `request/withdrawals?requestor=${mockAccountId}&order=desc&limit=${config.TRANSACTIONS_PER_PAGE}`
    return ServiceTestHelper.doAxiosMockedRequest(
      () => reviewableRequestsService.loadWithdrawalsReviewableRequests(),
      prefix,
      mockResponses[prefix]
    )
  })

  it('loadReviewableRequestById() should properly build request url', () => {
    const prefix = `requests/${mockReviewableRequestId}`
    return ServiceTestHelper.doAxiosMockedRequest(
      () => reviewableRequestsService.loadReviewableRequestById(mockReviewableRequestId),
      prefix,
      mockResponses[prefix]
    )
  })

  it('loadSalesReviewableRequestByTokenCode() should properly build request url', () => {
    const prefix = `request/sales?base_asset=${mockReviewableRequestTokenCode}&requestor=${mockAccountId}`
    return ServiceTestHelper.doAxiosMockedRequest(
      () => reviewableRequestsService.loadSalesReviewableRequestByTokenCode(mockReviewableRequestTokenCode),
      prefix,
      mockResponses[prefix]
    )
  })

})
