import { OffersService } from './offer.service'
import { mockAccountId, mockBalanceId, mockEmail, mockResponses, offerPrefixes } from './test/default.mocks'
import { ServiceTestHelper}  from './test/service_test_helper'
import { Keypair } from 'tokend-js-sdk'
import { mockOrderBookId, mockBaseTokenCode, mockQuoteTokenCode  } from './test/offers.mocks'

ServiceTestHelper.letVueResourseRespondFrom(mockResponses)

describe('offers.service test', () => {
  let offersService

  beforeEach(() => {
    offersService = new OffersService({accountId: mockAccountId, keypair: Keypair.random()})
  })

  it('loadUserOffers() should properly build request url', () => {
    const prefix = offerPrefixes.smOffers
    return ServiceTestHelper.doAxiosMockedRequest(
      () => offersService.loadUserOffers(),
      prefix,
      mockResponses[prefix]
    )
      .then(r => expect(r).to.deep.equal(mockResponses[prefix]))
  })

  it('loadUserSaleOffers() should properly build request url', () => {
    const prefix = offerPrefixes.saleOffers
    console.log(prefix)
    return ServiceTestHelper.doAxiosMockedRequest(
      () => offersService.loadUserSaleOffers(mockOrderBookId),
      prefix,
      mockResponses[prefix]
    )
      .then(r => expect(r).to.deep.equal(mockResponses[prefix]))
  })

  it('loadTradeOffers() should properly build request url', () => {
    const prefix = offerPrefixes.currentOffers
    console.log(prefix)
    const opts = {
      base: mockBaseTokenCode,
      quote: mockQuoteTokenCode,
      isBuy: true
    }
    return ServiceTestHelper.doAxiosMockedRequest(
      () => offersService.loadTradeOffers(opts),
      prefix,
      mockResponses[prefix]
    )
      .then(r => expect(r).to.deep.equal(mockResponses[prefix]))
  })

  it('loadCompletedTrades() should properly build request url', () => {
    const prefix = offerPrefixes.trades
    console.log(prefix)
    const opts = {
      base: mockBaseTokenCode,
      quote: mockQuoteTokenCode
    }
    return ServiceTestHelper.doAxiosMockedRequest(
      () => offersService.loadCompletedTrades(opts),
      prefix,
      mockResponses[prefix]
    )
      .then(r => expect(r).to.deep.equal(mockResponses[prefix]))
  })
})
