import { ExtendableError } from '../parents/extendable_error'

export class UnknownTransactionError extends ExtendableError {
  constructor () {
    super('Unknown transaction')
    this.errorType = 'UnknownTransactionError'
  }
}
