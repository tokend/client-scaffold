import InputField from '@/vue/common/fields/InputField.vue'
import SelectField from '@/vue/common/fields/SelectField.vue'
import TextareaField from '@/vue/common/fields/TextareaField'
import TextareaFieldUnchained from '@/vue/common/fields/TextareaFieldUnchained'
import DateField from '@/vue/common/fields/DateField'
import SelectFieldCustom from '@/vue/common/fields/SelectFieldCustom'
import SelectFieldUnchained from '@/vue/common/fields/SelectFieldUnchained'
import InputFieldUnchained from '@/vue/common/fields/InputFieldUnchained'
import DateFieldFlatpickr from '@/vue/common/fields/DateFieldFlatpickr'
import TickField from '@/vue/common/fields/TickField'
import RadioField from '@/vue/common/fields/RadioField'

import ImageInput from '../DEPRECATED.inputs/ImageInput.vue'
import SubmitterMixin from './submitter.mixin'

import { EventDispatcher } from '@/js/events/event_dispatcher'
import { i18n } from '@/js/i18n'

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
    ImageInput,
    DateFieldFlatpickr,
    TickField,
    RadioField,
    TextareaFieldUnchained
  },

  methods: {
    async isValid () {
      if (!await this.$validator.validateAll()) {
        EventDispatcher.dispatchShowErrorEvent(i18n.cm_complete_validation())
        return false
      }
      return true
    },
    isValidDocs (types) {
      const docs = this.docs || this.documents
      if (!docs) return true
      for (const type of types) {
        if (!docs[type] || (!docs[type].file && !docs[type].key)) {
          EventDispatcher.dispatchShowErrorEvent(i18n.cm_upload_documents())
          return false
        }
      }
      return true
    },
    clear (exeptions = []) {
      this.$validator.reset()
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
