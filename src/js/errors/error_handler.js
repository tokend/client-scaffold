import _get from 'lodash/get'
import { i18n } from '../i18n'
import { EventDispatcher } from '../events/event_dispatcher'

export class ErrorHandler {
  static processUnexpected (error) {
    console.error(error)
    if (error.showBanner) {
      error.showBanner(i18n.unexpected_error())
      return
    }
    EventDispatcher.dispatchShowErrorEvent(
      this.tryGetNewSdkErrorMessage(error) ||
      i18n.unexpected_error()
    )
  }

  static deriveTxErrorMessages (rawError) {
    return _get(rawError, 'response.data.extras.result_codes.messages', [])
  }

  static tryGetNewSdkErrorMessage (e) {
    const message = _get(e, 'originalError.response.data.extras.result_codes.messages[0]')
    if (message === 'Entry already exists') {
      return i18n.doc_exist_in_the_system()
    }
    return message
  }
}
