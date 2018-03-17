import { TransactionsService } from './transactions.service'
import { mockAccountId, mockBalanceId, mockEmail, mockResponses } from './test/default.mocks'
import { ServiceTestHelper } from './test/service_test_helper'
import { Keypair} from 'swarm-js-sdk'
import config from '../../config'
import { mockTxTokenCode } from './test/transactions.mocks'

ServiceTestHelper.letVueResourseRespondFrom(mockResponses)

describe('transactions.service test', () => {
  let transactionsService

  beforeEach(() => {
    transactionsService = new TransactionsService({accountId: mockAccountId, keypair: Keypair.random()})

  })

  /** requests to horizon: **/

  it('loadTransactionHistory() should properly build request url', () => {
    const prefix = `accounts/${mockAccountId}/payments?asset=${mockTxTokenCode}&order=desc&limit=${config.TRANSACTIONS_PER_PAGE}`
    console.log(prefix)
    console.log(mockResponses[prefix])
    return ServiceTestHelper.doAxiosMockedRequest(
      () => transactionsService.loadTransactionHistory(mockTxTokenCode),
      prefix,
      mockResponses[prefix]
    )
  })

})
