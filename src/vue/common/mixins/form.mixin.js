import InputField from '../fields/InputField.vue'
import SelectField from '../inputs/SelectField.vue'
import InputDateField from '../inputs/InputDateField.vue'
import ImageInput from '../inputs/ImageInput.vue'
import FileInput from '../inputs/FileInput'

import SubmitterMixin from './submitter.mixin'
import { validationMixin } from 'vuelidate'

const validationMessages = Object.freeze({
  required: (field) => `${field} field is required`
})

export default {
  mixins: [SubmitterMixin, validationMixin],

  data () {
    return {
      form: {}
    }
  },

  components: {
    InputField,
    SelectField,
    InputDateField,
    ImageInput,
    FileInput
  },

  methods: {
    isValid () {
      this.$v.$touch()
      return (this.$v.$invalid)
    },
    clear () {
      this.$v.reset()
      for (const key in this.form) {
        this.form[key] = ''
      }
    },
    hasError (field, validator = 'required') {
      return !this.$v.form[field][validator]
    },
    errorMessage (field, validator = 'required') {
      if (!this.hasError(field, validator)) return ''
      const msg = validationMessages[validator](field)
      return msg
        .charAt(0)
        .toUpperCase()
        .concat(msg.slice(1))
    }
  }
}
