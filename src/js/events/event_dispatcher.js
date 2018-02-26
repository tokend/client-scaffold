import { ShowErrorEvent, ShowSuccessEvent } from './event_types'

import { dispatchEvent, attachEventHandler } from './helpers'

export class EventDispatcher {
  static dispatchShowErrorEvent (message) {
    dispatchEvent(new ShowErrorEvent(message))
  }

  static attachToShowErrorEvent (handler) {
    attachEventHandler(new ShowErrorEvent(), handler)
  }

  static dispatchShowSuccessEvent (message) {
    dispatchEvent(new ShowSuccessEvent(message))
  }

  static attachToShowSuccessEvent (handler) {
    attachEventHandler(new ShowSuccessEvent(), handler)
  }
}
