import { parseTransaction } from './tx.parser'
import {
  transferRecord,
  issuanceRecord
} from '../../../test/unit/mock_data/records'

import { TransferRecord } from '../records/transfer.record'
import { IssuanceRecord } from '../records/issuance.record'

import { ErrorFactory, errorTypes } from '../errors/factory'

import { UnknownTransactionError } from '../errors/unknown_transaction.error'

describe('correctly parses transactions', () => {
  it('should correctly define transfer entity', () => {
    expect(parseTransaction(transferRecord).constructor)
      .to.equal(TransferRecord)
  })

  it('should correctly define issuance entity', () => {
    expect(parseTransaction(issuanceRecord).constructor)
      .to.equal(IssuanceRecord)
  })

  // eslint-disable-next-line
  it ('UnknownTransactionError constructor should be a UnknownTransactionError', () => {
    const newInstance = new UnknownTransactionError()
    expect(newInstance.constructor).to.equal(UnknownTransactionError)
  })

  // eslint-disable-next-line
  it ('UnknownTransactionError constructor should be a UnknownTransactionError', () => {
    // eslint-disable-next-line
    expect(ErrorFactory.throwError(errorTypes.UnknownTransactionError).constructor)
      .to.throw(UnknownTransactionError)
  })
})
