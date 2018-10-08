import { mockAccountId, mockTokenCodes, mockResponses } from './test/default.mocks'
import { ServiceTestHelper } from './test/service_test_helper'
import { ChartsService } from './charts.service'
import { Keypair } from 'tokend-js-sdk'

ServiceTestHelper.letVueResourseRespondFrom(mockResponses)

describe('service.charts', () => {
  let chartsService

  beforeEach(() => {
    chartsService = new ChartsService(({
      accountId: mockAccountId,
      keypair: Keypair.random()
    }))
  })

  it('loadChartsForToken() should properly build request', () => {
    const prefix = `charts/${mockTokenCodes[0]}`
    return chartsService
      .loadChartsForToken(mockTokenCodes[0])
      .then(r => expect(r.data()).to.equal(mockResponses[prefix]))
  })

  it('loadChartsForTokenPair() should properly build request', () => {
    const prefix = `charts/${mockTokenCodes[0]}-${mockTokenCodes[1]}`
    return chartsService
      .loadChartsForTokenPair(...mockTokenCodes)
      .then(r => expect(r.data()).to.equal(mockResponses[prefix]))
  })
})
