import { dispatchEvent } from '../../../js/events/helpers'
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
      dispatchEvent(commonEvents.showLoadIndicator)
      return Promise.resolve(true)
    },
    enable () {
      this.isButtonDisabled = false
      this.isPending = false
      dispatchEvent(commonEvents.hideLoadIndicator)
      return Promise.resolve(true)
    },
    disableLong () {
      this.isPending = true
      this.isButtonDisabled = true
      dispatchEvent(commonEvents.showLoadIndicator)
      return Promise.resolve(true)
    }
  }
}
