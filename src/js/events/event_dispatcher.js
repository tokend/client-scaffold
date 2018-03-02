import { ShowErrorEvent, ShowSuccessEvent } from './event_types'

import { dispatchAppEvent, attachEventHandler } from './helpers'

export class EventDispatcher {
  static dispatchShowErrorEvent (message) {
    dispatchAppEvent(new ShowErrorEvent(message))
  }

  static attachToShowErrorEvent (handler) {
    attachEventHandler(new ShowErrorEvent(), handler)
  }

  static dispatchShowSuccessEvent (message) {
    dispatchAppEvent(new ShowSuccessEvent(message))
  }

  static attachToShowSuccessEvent (handler) {
    attachEventHandler(new ShowSuccessEvent(), handler)
  }
}
