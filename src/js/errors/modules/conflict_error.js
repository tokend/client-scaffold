import { ExtendableError } from '../parents/extendable_error'

export class ConflictError extends ExtendableError {
  constructor () {
    super('Conflict')
    this.errorType = 'Conflict'
  }
}
