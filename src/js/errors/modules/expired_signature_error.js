import { ExtendableError } from '../parents/extendable_error'
import { EventDispatcher } from '../../events/event_dispatcher'
import i18n from '../../i18n/auth'

export class ExpiredSignatureError extends ExtendableError {
  constructor () {
    super('EmailNotVerifiedError')
    this.errorType = 'Email not verified'
    this.message = i18n.expired_signature
  }

  showBanner () {
    EventDispatcher.dispatchShowErrorEvent(this.message)
    return true
  }
}
