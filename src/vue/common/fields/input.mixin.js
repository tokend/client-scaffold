import { commonEvents } from '../../../js/events/common_events'

const fieldClasses = Object.freeze({
  hasValidationError: 'md-invalid'
})

export default {
  props: {
    inline: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false },
    togglePassword: { type: Boolean, default: false },
    errorMessage: { type: String, default: '' }
  },

  computed: {
    fieldClass () {
      const classes = []
      if (this.errorMessage) classes.push(fieldClasses.hasValidationError)
      return classes.join(' ')
    }
  },

  methods: {
    onInput (value) {
      this.$emit(commonEvents.inputEvent, value)
    },
    onKeypress (event) {
      if (this.type !== 'number') return
      this.$number.testNumber(event)
    },
    onBlur () {
      //
    }
  }
}
