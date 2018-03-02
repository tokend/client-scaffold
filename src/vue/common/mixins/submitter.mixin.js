import { dispatchAppEvent } from '../../../js/events/helpers'
import { commonEvents } from '../../../js/events/common_events'

export default {
  data () {
    return {
      isButtonDisabled: false,
      isPending: false
    }
  },
  methods: {
    disable () {
      this.isButtonDisabled = true
      this.isPending = true
      dispatchAppEvent(commonEvents.showLoadIndicator)
      return Promise.resolve(true)
    },
    enable () {
      this.isButtonDisabled = false
      this.isPending = false
      dispatchAppEvent(commonEvents.hideLoadIndicator)
      return Promise.resolve(true)
    },
    disableLong () {
      this.isPending = true
      this.isButtonDisabled = true
      dispatchAppEvent(commonEvents.showLoadIndicator)
      return Promise.resolve(true)
    }
  }
}
