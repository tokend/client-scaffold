import FileField from '../../../common/fields/FileField'
import FormMixin from '../../../common/mixins/form.mixin'

import _pick from 'lodash/pick'
import { ErrorHandler } from '../../../../js/errors/error_handler'
import { commonEvents } from '../../../../js/events/common_events'
import { fileService } from '../../../../js/services/file.service'
import { i18n } from '../../../../js/i18n'

export default {
  mixins: [FormMixin],
  components: { FileField },
  props: ['schema', 'sale'],
  data: _ => ({
    i18n,
    form: {},
    documents: {}
  }),

  created () {
    if (this.schema) {
      this.form = _pick(this.sale, Object.keys(this.schema.form))
      delete this.form.docs
      this.documents = _pick(this.sale.logo, Object.keys(this.schema.form.docs || {}))
    }
    this.form = this.sale
  },

  methods: {
    async submit () {
      if (!await this.isValid()) return
      // if (!this.isValidDocs(this.schema.requiredDocs)) return
      this.disable()
      try {
        await this.uploadDocuments()
        this.$emit(commonEvents.saleUpdateEvent, {
          form: this.form,
          documents: this.documents
        })
      } catch (error) {
        ErrorHandler.processUnexpected(error)
      }
      this.enable()
    },
    async uploadDocuments () {
      await Promise.all(Object.values(this.documents).map(document => uploadSingleDocument.apply(this, [document])))

      async function uploadSingleDocument (document) {
        if (document.isUploaded) return
        this.documents[document.type] = await fileService.uploadSingleDocument(document)
      }
    }
  }
}
