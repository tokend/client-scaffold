import {${CLASS_NAME}} from './prices.service'
import {mockAccountId, mockBalanceId, mockEmail, mockResponses} from './test/default.mocks'
import {ServiceTestHelper} from './test/service_test_helper'
import {Keypair} from 'swarm-js-sdk'

ServiceTestHelper.letVueResourseRespondFrom(mockResponses)

describe('prices.service test', () => {
  let pricesService

  beforeEach(() => {
    pricesService = new ${CLASS_NAME}Service({accountId: mockAccountId, keypair: Keypair.random()})

  })

  /** requests to horizon: **/

  it('someService() should properly build request', () => {

  })

  /** requests to api: **/

  it('someService() should properly build request', () => {

  })
})
