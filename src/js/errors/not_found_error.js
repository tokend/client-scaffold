import { ExtendableError } from './extendable_error'

export class NotFoundError extends ExtendableError {
  constructor () {
    super('Not found')
    this.errorType = 'Not found'
  }
}
