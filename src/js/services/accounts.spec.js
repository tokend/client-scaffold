import { mockAccountId, mockBalanceId, mockEmail, mockResponses } from './test/default.mocks'
import { ServiceTestHelper } from './test/service_test_helper'
import { AccountsService } from './accounts.service'
import { Keypair } from 'tokend-js-sdk'

ServiceTestHelper.letVueResourseRespondFrom(mockResponses)

describe('service.accounts', () => {
  let accountsService

  beforeEach(() => {
    accountsService = new AccountsService({ accountId: mockAccountId, keypair: Keypair.random() })
  })

  /** requests to horizon: **/

  it ('loadAccount() should properly build request', () => {
    const prefix = `accounts/${mockAccountId}`
    return ServiceTestHelper.doAxiosMockedRequest(
      accountsService.loadAccount.bind(accountsService),
      prefix,
      mockResponses[prefix]
    )
    .then(r => expect(r).to.equal(mockResponses[prefix]))
  })

  it ('loadAccountBalancesById() should properly build request', () => {
    const prefix = `accounts/${mockAccountId}/balances`
    return ServiceTestHelper.doAxiosMockedRequest(
      () => accountsService.loadAccountBalancesById(mockAccountId),
      prefix,
      mockResponses[prefix]
    )
    .then(r => expect(r).to.equal(mockResponses[prefix]))
  })

  it ('loadDetailsForEachBalance() should properly build request', () => {
    const prefix = `accounts/${mockAccountId}/balances/details`
    return ServiceTestHelper.doAxiosMockedRequest(
      accountsService.loadDetailsForEachBalance.bind(accountsService),
      prefix,
      mockResponses[prefix]
    )
    .then(r => expect(r).to.equal(mockResponses[prefix]))
  })

  it ('loadAccountIdByBalanceId() should properly build request', () => {
    const prefix = `balances/${mockBalanceId}/account`
    return ServiceTestHelper.doAxiosMockedRequest(
      () => accountsService.loadAccountIdByBalanceId(mockBalanceId),
      prefix,
      mockResponses[prefix]
    )
    .then(r => expect(r).to.equal(mockResponses[prefix]))
  })

  /** requests to api: **/

  it ('loadAccountIdByEmail() should properly build request', () => {
    const prefix = `user_id?email=${mockEmail}`
    return accountsService
      .loadAccountIdByEmail(mockEmail)
      .then(r => expect(r.data()).to.equal(mockResponses[prefix]))
  })

  it ('loadEmailByAccountId() should properly build request', () => {
    const prefix = `details`
    return accountsService
      .loadEmailByAccountId(mockAccountId)
      .then(r => expect(r.email).to.equal(mockEmail))
  })

  it ('loadMultipleAccountDetails() should properly build request', () => {
    const prefix = `details`
    return accountsService
      .loadMultipleAccountDetails(mockEmail)
      .then(r => expect(r.data()).to.equal(mockResponses[prefix]))
  })
})
