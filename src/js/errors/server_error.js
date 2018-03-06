import { ExtendableError } from './extendable_error'

export class ServerError extends ExtendableError {
  constructor () {
    super('Server error')
    this.errorType = 'Server error'
  }
}
