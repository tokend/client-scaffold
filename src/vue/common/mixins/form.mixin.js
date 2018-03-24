import InputField from '../fields/InputField.vue'
import SelectField from '../fields/SelectField.vue'
import TextareaField from '../fields/TextareaField'

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
    TextareaField,
    ImageInput,
    FileInput
  },

  methods: {
    isValid () {
      return this.$validator.validateAll()
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
