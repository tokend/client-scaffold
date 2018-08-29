import FileField from '@/vue/common/fields/FileField'
import FormMixin from '@/vue/common/mixins/form.mixin'

import { fileService } from '@/js/services/file.service'
import { i18n } from '@/js/i18n'
export default {
  mixins: [FormMixin],
  components: { FileField },
  props: ['schema', 'sale'],
  data: _ => ({
    i18n,
    form: {},
    documents: {}
  }),

  methods: {
    async uploadDocuments () {
      await Promise.all(Object.values(this.documents).map(document => uploadSingleDocument.apply(this, [document])))

      async function uploadSingleDocument (document) {
        if (document.isUploaded) return
        this.documents[document.type] = await fileService.uploadSingleDocument(document)
      }
    }
  }
}
