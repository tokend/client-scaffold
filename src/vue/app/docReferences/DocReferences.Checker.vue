<template>
  <div class="ref-checker">
    <h3 class="app__form-heading">{{ i18n.docs_check_file() }}</h3>

    <div class="app__form-row">
      <file-field
        v-model="document"
        v-validate="'required'"
        :type="DOCUMENT_TYPES.delta"
        label="Select File(s)"
        class="ref-checker__upload-field"
        name="file-to-upload"
        id="file-to-upload"
      />
    </div>

    <div class="app__form-actions">
      <button
        v-ripple
        @click="submit"
        class="app__form-submit-btn"
        :disabled="isPending"
        form="upload-form"
      >
        {{ i18n.transfer_continue_btn() }}
      </button>
    </div>
  </div>
</template>

<script>
import DocumentManager from './document-manager'
import ReferenceGetter from './reference-getter'

import FileField from '@/vue/common/fields/FileField'
import FormMixin from '@/vue/common/mixins/form.mixin'

import { i18n } from '../../../js/i18n'
import { documentTypes as DOCUMENT_TYPES } from '../../../js/const/const'

import { EventDispatcher } from '../../../js/events/event_dispatcher'

export default {
  components: {
    FileField
  },
  mixins: [
    FormMixin,
    DocumentManager,
    ReferenceGetter
  ],
  data: _ => ({
    i18n,
    document: null,
    DOCUMENT_TYPES
  }),
  methods: {
    async submit () {
      this.disable()
      try {
        const reference = await this.getFileHash(this.document.file)
        await this.getReference(reference)
        this.$router.push({
          name: 'documents.view',
          params: {
            id: reference
          }
        })
      } catch (e) {
        EventDispatcher.dispatchShowErrorEvent('There is no such document in the system')
      }
      this.enable()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
