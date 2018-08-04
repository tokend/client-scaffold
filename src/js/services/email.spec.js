import { EmailService } from './email.service'
import {mockAccountId, mockBalanceId, mockEmail, mockWalletId, mockResponses, mockTokenCodes} from './test/default.mocks'
import { ServiceTestHelper } from './test/service_test_helper'
import { Keypair } from 'tokend-js-sdk'

ServiceTestHelper.letVueResourseRespondFrom(mockResponses)

const mockToken = 't231tnn21'

describe('service.email', () => {
  let emailService

  beforeEach(() => {
    emailService = new EmailService({ accountId: mockAccountId, keypair: Keypair.random() })
  })

  it('sendResendEmailRequest() should properly build request url', () => {
    const prefix = `wallets/${mockWalletId}/verification`
    return emailService
      .sendResendEmailRequest(mockWalletId)
      .then(r => expect(r.data()).to.equal(mockResponses[prefix]))
  })

  it('sendVerifyEmailRequest() should properly build request url', () => {
    const prefix = `wallets/${mockWalletId}/verification`
    return emailService
      .sendVerifyEmailRequest(mockToken, mockWalletId)
      .then(r => expect(r.data()).to.equal(mockResponses[prefix]))
  })

  it('sendResendEmailRequest() should make POST request', () => {
    return emailService
      .sendResendEmailRequest(mockWalletId)
      .then(r => expect(r.meta('method')).to.equal('POST'))
  })

  it('sendVerifyEmailRequest() should make PUT request', () => {
    return emailService
      .sendVerifyEmailRequest(mockToken, mockWalletId)
      .then(r => expect(r.meta('method')).to.equal('PUT'))
  })

  it('sendVerifyEmailRequest() should properly compose payload', () => {
    const validPayload = {
      data: {
        attributes: {
          token: mockToken
        }
      }
    }
    return emailService
      .sendVerifyEmailRequest(mockToken, mockWalletId)
      .then(r => expect(r.meta('payload')).to.deep.equal(validPayload))
  })
})
