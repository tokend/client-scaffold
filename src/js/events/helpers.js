import Bus from './event_bus'
import { AppEvent, ShowErrorEvent, ShowSuccessEvent } from './event_types'

export function dispatchAppEvent (event, payload) {
  validateEvent(event)
  Bus.$emit(event.type, payload || event.payload || event.message || '')
}

export function attachEventHandler (event, handler) {
  validateEvent(event)
  Bus.$on(event.type, handler)
}

function validateEvent (event) {
  if (!(event instanceof ShowErrorEvent ||
        event instanceof ShowSuccessEvent ||
        event instanceof AppEvent
    )) {
    throw new Error(`Error. ${event} is not an instance of allowed events`)
  }
}
