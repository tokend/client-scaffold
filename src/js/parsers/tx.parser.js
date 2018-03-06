import {RecordFactory} from '../records/factory'
import {ErrorFactory, errorTypes} from '../errors/factory'

export function parseTransaction (transaction, asset) {
  switch (transaction.type_i) {
    case 1:
      return RecordFactory.createTransferRecord(transaction)
    case 3:
      return RecordFactory.createIssuanceRecord(transaction)
    case 7:
      return RecordFactory.createWithdrawRecord(transaction)
    case 20:
      return RecordFactory.createMatchRecord(transaction, asset)
    case 16:
      return RecordFactory.createMatchRecord(transaction, asset)
    default:
      ErrorFactory.throwError(errorTypes.UnknownTransactionError)
  }
}
