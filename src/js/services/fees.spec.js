import { FeeService } from './fees.service'
import { mockAccountId, mockResponses } from './test/default.mocks'
import { ServiceTestHelper } from './test/service_test_helper'
import { Keypair } from 'swarm-js-sdk'
import { FEE_TYPES } from '../const/xdr.const'
import { mockFeeAmount, mockFeeAsset } from './fees.mocks'

ServiceTestHelper.letVueResourseRespondFrom(mockResponses)

describe('service.fees', () => {
  let feesService

  beforeEach(() => {
    feesService = new FeeService({accountId: mockAccountId, keypair: Keypair.random()})
  })

  it ('loadPaymentFeeByAmount() should properly build request url', () => {
    const prefix = `fees/${FEE_TYPES.paymentFee}?asset=${mockFeeAsset}&account=${mockAccountId}&amount=${mockFeeAmount}&subtype=0`
    return ServiceTestHelper.doAxiosMockedRequest(
      () => feesService.loadPaymentFeeByAmount(mockFeeAsset, mockFeeAmount),
      prefix,
      mockResponses[prefix]
    )
    .then(r => expect(r).to.deep.equal(mockResponses[prefix]))
  })

  it ('loadWithdrawalFeeByAmount() should properly build request url', () => {
    const prefix = `fees/${FEE_TYPES.withdrawalFee}?asset=${mockFeeAsset}&account=${mockAccountId}&amount=${mockFeeAmount}&subtype=0`
    return ServiceTestHelper.doAxiosMockedRequest(
      () => feesService.loadWithdrawalFeeByAmount(mockFeeAsset, mockFeeAmount),
      prefix,
      mockResponses[prefix]
    )
    .then(r => expect(r).to.deep.equal(mockResponses[prefix]))
  })

  it ('loadOfferFeeByAmount() should properly build request url', () => {
    const prefix = `fees/${FEE_TYPES.offerFee}?asset=${mockFeeAsset}&account=${mockAccountId}&amount=${mockFeeAmount}&subtype=0`
    return ServiceTestHelper.doAxiosMockedRequest(
      () => feesService.loadOfferFeeByAmount(mockFeeAsset, mockFeeAmount),
      prefix,
      mockResponses[prefix]
    )
    .then(r => expect(r).to.deep.equal(mockResponses[prefix]))
  })
})
