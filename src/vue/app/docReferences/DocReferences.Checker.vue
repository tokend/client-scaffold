<template>
  <div class="ref-checker app__page-content-wrp">
    <md-divider class="ref-checker__divider" />

    <h3 class="app__form-heading">{{ i18n.docs_check_file() }}</h3>

    <div class="app__form-section">
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
          @click="checkFile"
          class="app__form-submit-btn"
          :disabled="isPending"
          form="upload-form"
        >
          {{ i18n.docs_search_btn() }}
        </button>
      </div>
    </div>

    <md-divider class="ref-checker__divider" />

    <h3 class="app__form-heading">{{ i18n.docs_check_meta() }}</h3>

    <div class="app__form-section">
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field-unchained
            v-model="form.lastName"
            :label="i18n.doc_lbl_last_name()"
          />
        </div>
        <div class="app__form-field">
          <input-field-unchained
            v-model="form.taxId"
            :label="i18n.doc_lbl_tax_id()"
          />
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field-unchained
            v-model="form.mobilePhone"
            :label="i18n.doc_lbl_mobile_phone()"
          />
        </div>
        <div class="app__form-field">
          <input-field-unchained
            v-model="form.serialNumber"
            :label="i18n.doc_lbl_serial_number()"
          />
        </div>
      </div>
    </div>

    <div class="app__form-actions">
      <button
        v-ripple
        @click="checkMeta"
        class="app__form-submit-btn"
        :disabled="isPending"
        form="upload-form"
      >
        {{ i18n.docs_search_btn() }}
      </button>
    </div>
  </div>
</template>

<script>
import DocumentManager from './document-manager'
import ReferenceGetter from './reference-getter'
import ReferenceListGetter from './reference-list-getter'

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
    ReferenceGetter,
    ReferenceListGetter
  ],
  data: _ => ({
    i18n,
    form: {
      lastName: '',
      taxId: '',
      mobilePhone: '',
      serialNumber: ''
    },
    document: null,
    DOCUMENT_TYPES
  }),
  methods: {
    async checkFile () {
      if (!this.document) {
        EventDispatcher.dispatchShowErrorEvent('Please upload the file first')
        return
      }
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
    },
    async checkMeta () {
      if (
        !this.form.lastName &&
        !this.form.taxId &&
        !this.form.mobilePhone &&
        !this.form.serialNumber
      ) {
        EventDispatcher.dispatchShowErrorEvent(
          'Please fill at leas one form field'
        )
        return
      }
      this.disable()
      try {
        const list = await this.getReferenceList()
        const item = list.slice().reverse().find(i =>
          (!this.form.lastName || i.lastName === this.form.lastName) &&
          (!this.form.taxId || i.taxId === this.form.taxId) &&
          (!this.form.mobilePhone ||
            i.mobilePhone === this.form.mobilePhone) &&
          (!this.form.serialNumber ||
            i.serialNumber === this.form.serialNumber)
        )
        if (item) {
          this.$router.push({
            name: 'documents.view',
            params: {
              id: item.reference
            }
          })
        }
      } catch (e) {
        console.error(e)
        EventDispatcher.dispatchShowErrorEvent('There is no such document in the system')
      }
      this.enable()
    }
  }
}
</script>

<style lang="scss" scoped>
  .ref-checker__divider {
    margin-bottom: 20px;
  }
</style>
