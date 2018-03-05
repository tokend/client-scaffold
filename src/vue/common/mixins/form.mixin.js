import InputField from '../fields/InputField.vue'
import SelectField from '../fields/SelectField.vue'

import InputDateField from '../DEPRECATED.inputs/InputDateField.vue'
import ImageInput from '../DEPRECATED.inputs/ImageInput.vue'
import FileInput from '../DEPRECATED.inputs/FileInput'
import SubmitterMixin from './submitter.mixin'

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
    ImageInput,
    FileInput
  },

  methods: {
    isValid () {
      return this.$validator.validateAll()
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
