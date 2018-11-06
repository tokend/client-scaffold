import { MockWrapper } from '../../../test'
import { UpdateKycRequestRecord } from './update-kyc.record'

import mockUpdateKyc from '../../../test/mocks/update-kyc'

describe('UpdateKycRequestRecord', () => {
  let rawRecord, responseRecord, parsedRecord

  const parse = () => {
    responseRecord = MockWrapper.makeHorizonData(rawRecord)
    parsedRecord = new UpdateKycRequestRecord(responseRecord)
  }

  beforeEach(() => {
    rawRecord = mockUpdateKyc
    parse()
  })

  it('constructor should properly set all the basic fields', () => {
    expect(parsedRecord.accountToUpdateKyc)
      .to
      .equal(rawRecord.details.update_kyc.account_to_update_kyc)
    expect(parsedRecord.accountToUpdateKyc)
      .to
      .not
      .equal(undefined)
    expect(parsedRecord.accountTypeToSet)
      .to
      .equal(rawRecord.details.update_kyc.account_type_to_set.int)
    expect(parsedRecord.accountTypeToSet)
      .to
      .not
      .equal(undefined)
    expect(parsedRecord.accountTypeToSetStr)
      .to
      .equal(rawRecord.details.update_kyc.account_type_to_set.string)
    expect(parsedRecord.accountTypeToSetStr)
      .to
      .not
      .equal(undefined)
    expect(parsedRecord.kycLevel)
      .to
      .equal(rawRecord.details.update_kyc.kyc_level)
    expect(parsedRecord.kycLevel)
      .to
      .not
      .equal(undefined)
    expect(parsedRecord.blobId)
      .to
      .equal(rawRecord.details.update_kyc.kyc_data.blob_id)
    expect(parsedRecord.blobId)
      .to
      .not
      .equal(undefined)
    expect(parsedRecord.allTasks)
      .to
      .equal(rawRecord.details.update_kyc.all_tasks)
    expect(parsedRecord.allTasks)
      .to
      .not
      .equal(undefined)
    expect(parsedRecord.pendingTasks)
      .to
      .equal(rawRecord.details.update_kyc.pending_tasks)
    expect(parsedRecord.pendingTasks)
      .to
      .not
      .equal(undefined)
    expect(parsedRecord.sequenceNumber)
      .to
      .equal(rawRecord.details.update_kyc.sequence_number)
    expect(parsedRecord.sequenceNumber)
      .to
      .not
      .equal(undefined)
  })

  it('externalDetails.rejector field', () => {
    expect(parsedRecord.rejector)
      .to
      .equal(rawRecord.details.update_kyc.external_details[1].rejector)
    expect(parsedRecord.rejector)
      .to
      .not
      .equal(undefined)
  })
})
