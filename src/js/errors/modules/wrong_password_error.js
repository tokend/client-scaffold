import { ExtendableError } from '../parents/extendable_error'

export class WrongPasswordError extends ExtendableError {
  constructor () {
    super('Wrong password')
    this.errorType = 'WRONG_PASSWORD'
  }
}
