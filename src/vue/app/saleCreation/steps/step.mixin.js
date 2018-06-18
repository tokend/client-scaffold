import FileField from '../../../common/fields/FileField'
import FormMixin from '../../../common/mixins/form.mixin'

import _pick from 'lodash/pick'
import { ErrorHandler } from '../../../../js/errors/error_handler'
import { EventDispatcher } from '../../../../js/events/event_dispatcher'
import { commonEvents } from '../../../../js/events/common_events'
import { fileService } from '../../../../js/services/file.service'
import { i18n } from '../../../../js/i18n'
import { documentTypes } from '../../../../js/const/documents.const'
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
    console.log(this.schema)
    if (this.schema) {
      this.form = _pick(this.sale, Object.keys(this.schema.form))
      delete this.form.docs
      // this.documents = _pick(this.sale, Object.keys(this.schema.form.docs || {}))
      this.documents = {
        [documentTypes.fundLogo]: this.sale.logo
      }
    }
    this.form = this.sale
  },

  methods: {
    async submit () {
      if (!await this.isValid()) return
      if (!this.form.quoteAssets.length) {
        EventDispatcher.dispatchShowErrorEvent(i18n.sale_accept_investments())
        return
      }
      this.disable()
      try {
        await this.uploadDocuments()
        console.log(this.form)
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
