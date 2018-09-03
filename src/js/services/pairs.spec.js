import { PairsService } from './pairs.service'
import { mockAccountId, mockResponses } from './test/default.mocks'
import { mockConvertAmount } from './test/prices.mocks'
import { mockBaseTokenCode, mockQuoteTokenCode } from './test/offers.mocks'
import { ServiceTestHelper } from './test/service_test_helper'
import { Keypair } from 'swarm-js-sdk'

ServiceTestHelper.letVueResourseRespondFrom(mockResponses)

describe('pairs.service test', () => {
  let pairsService

  beforeEach(() => {
    pairsService = new PairsService({accountId: mockAccountId, keypair: Keypair.random()})

  })

  /** requests to horizon: **/

  it('loadAssetPairs() should properly build request url', () => {
    const prefix = `asset_pairs`
    return ServiceTestHelper.doAxiosMockedRequest(
      () => pairsService.loadAssetPairs(),
      prefix,
      mockResponses[prefix]
    )
  })

  it('loadConvertedAmount() should properly build request url', () => {
    const prefix = `asset_pairs/convert?amount=${mockConvertAmount}&source_asset=${mockBaseTokenCode}&dest_asset=${mockQuoteTokenCode}`
    return ServiceTestHelper.doAxiosMockedRequest(
      () => pairsService.loadConvertedAmount(mockConvertAmount, mockBaseTokenCode, mockQuoteTokenCode),
      prefix,
      mockResponses[prefix]
    )
  })
})
