import { FileService  } from './file.service'
import {mockAccountId, mockBalanceId, mockEmail, mockResponses, mockWalletId} from './test/default.mocks'
import { mockDocumentId, mockMimeType, mockDocumentType } from './test/files.mocks'
import { ServiceTestHelper } from './test/service_test_helper'
import { Keypair } from 'tokend-js-sdk'

ServiceTestHelper.letVueResourseRespondFrom(mockResponses)

describe('service.files test', () => {
  let fileService

  beforeEach(() => {
    fileService = new FileService({accountId: mockAccountId, keypair: Keypair.random()})
  })

  /** requests to api: **/

  it('loadDocumentDetailsById() should properly build request url', () => {
    const prefix = `users/${mockAccountId}/documents/${mockDocumentId}`
    return fileService
      .loadDocumentDetailsById(mockDocumentId)
      .then(r => expect(r.data()).to.equal(mockResponses[prefix]))
  })

  it('_loadUploadConfig() should properly build request url', () => {
    const prefix = `users/${mockAccountId}/documents`
    return fileService
      ._loadUploadConfig(mockDocumentType, mockMimeType)
      .then(r => expect(r.data()).to.equal(mockResponses[prefix]))
  })

  it('_loadUploadConfig() should make POST request', () => {
    return fileService
      ._loadUploadConfig(mockDocumentType, mockMimeType)
      .then(r => expect(r.meta('method')).to.equal('POST'))
  })

  it('_loadUploadConfig() should properly compose payload', () => {
    const validPayload = {
      data: {
        type: mockDocumentType,
        attributes: {
          content_type: mockMimeType
        }
      }
    }

    return fileService
      ._loadUploadConfig(mockDocumentType, mockMimeType)
      .then(r => expect(r.meta('payload')).to.deep.equal(validPayload))
  })
})
