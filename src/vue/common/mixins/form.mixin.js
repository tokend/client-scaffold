import InputField from '../fields/InputField.vue'
import SelectField from '../fields/SelectField.vue'
import TextareaField from '../fields/TextareaField'

import InputDateField from '../DEPRECATED.inputs/InputDateField.vue'
import ImageInput from '../DEPRECATED.inputs/ImageInput.vue'
import SubmitterMixin from './submitter.mixin'

import { EventDispatcher } from '../../../js/events/event_dispatcher'
import { i18n } from '../../../js/i18n'

export default {
  mixins: [SubmitterMixin],

  data () {
    return {
      form: {}
    }
  },

  components: {
    InputField,
    SelectField,
    InputDateField,
    TextareaField,
    ImageInput
  },

  methods: {
    async isValid () {
      if (!await this.$validator.validateAll()) {
        EventDispatcher.dispatchShowErrorEvent(i18n.cm_complete_validation())
        return false
      }
      return true
    },
    clear () {
      this.errors.clear()
      for (const key in this.form) {
        this.form[key] = ''
      }
    },
    hasError (field) {
      return this.errors.has(field)
    },
    errorMessage (field) {
      return this.errors.first(field)
    }
  }
}
