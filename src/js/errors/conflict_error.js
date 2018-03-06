import { ExtendableError } from './extendable_error'

export class ConflictError extends ExtendableError {
  constructor () {
    super('Conflict')
    this.errorType = 'Conflict'
  }
}
