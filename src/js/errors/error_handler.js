import { i18n } from '../i18n'
import { EventDispatcher } from '../events/event_dispatcher'

export class ErrorHandler {
  static processUnexpected (error) {
    console.error(error)
    if (error.showBanner) {
      error.showBanner(i18n.unexpected_error())
      return
    }
    EventDispatcher.dispatchShowErrorEvent(i18n.unexpected_error())
  }
}
