import InputField from '../fields/InputField.vue'
import SelectField from '../fields/SelectField.vue'
import TextareaField from '../fields/TextareaField'
import DateField from '../fields/DateField'
import SelectFieldCustom from '@/vue/common/fields/SelectFieldCustom'
import SelectFieldUnchained from '@/vue/common/fields/SelectFieldUnchained'
import InputFieldUnchained from '@/vue/common/fields/InputFieldUnchained'

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
    SelectFieldCustom,
    InputFieldUnchained,
    SelectFieldUnchained,
    TextareaField,
    DateField,
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
    clear (exeptions = []) {
      this.errors.clear()
      for (const key in this.form) {
        if (!exeptions.includes(key)) {
          this.form[key] = ''
        }
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
