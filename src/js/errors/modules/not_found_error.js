import { ExtendableError } from '../parents/extendable_error'

export class NotFoundError extends ExtendableError {
  constructor () {
    super('Not found')
    this.errorType = 'Not found'
  }
}
