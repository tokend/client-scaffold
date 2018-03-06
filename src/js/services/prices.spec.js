import { PricesService } from './prices.service'
import { mockAccountId, mockResponses } from './test/default.mocks'
import { mockConvertAmount } from './test/prices.mocks'
import { mockBaseTokenCode, mockQuoteTokenCode } from './test/offers.mocks'
import { ServiceTestHelper } from './test/service_test_helper'
import { Keypair } from 'swarm-js-sdk'

ServiceTestHelper.letVueResourseRespondFrom(mockResponses)

describe('prices.service test', () => {
  let pricesService

  beforeEach(() => {
    pricesService = new PricesService({accountId: mockAccountId, keypair: Keypair.random()})

  })

  /** requests to horizon: **/

  it('loadAssetPairs() should properly build request url', () => {
    const prefix = `asset_pairs`
    return ServiceTestHelper.doAxiosMockedRequest(
      () => pricesService.loadAssetPairs(),
      prefix,
      mockResponses[prefix]
    )
  })

  it('loadConvertedAmount() should properly build request url', () => {
    const prefix = `asset_pairs/convert?amount=${mockConvertAmount}&source_asset=${mockBaseTokenCode}&dest_asset=${mockQuoteTokenCode}`
    // pricesService.loadConvertedAmount('1000', 'a', 'b')
    return ServiceTestHelper.doAxiosMockedRequest(
      () => pricesService.loadConvertedAmount(mockConvertAmount, mockBaseTokenCode, mockQuoteTokenCode),
      prefix,
      mockResponses[prefix]
    )
  })
})
