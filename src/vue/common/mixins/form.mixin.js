import InputField from '../inputs/InputField.vue'
import SelectField from '../inputs/SelectField.vue'
import InputDateField from '../inputs/InputDateField.vue'
import ImageInput from '../inputs/ImageInput.vue'
import FileInput from '../inputs/FileInput'
import SubmitterMixin from './submitter.mixin'

export default {
  mixins: [SubmitterMixin],

  components: {
    InputField,
    SelectField,
    InputDateField,
    ImageInput,
    FileInput
  },
  methods: {
    validateParams () {
      return this.$validator.validateAll()
        .then(ok => {
          return ok ? Promise.resolve(ok) : Promise.reject(new Error('Validation failed'))
        })
    }
  }
}
