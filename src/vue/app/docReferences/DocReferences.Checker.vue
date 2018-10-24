<template>
  <div class="ref-checker app__page-content-wrp">
    <h3 class="app__form-heading">{{ i18n.docs_check_file() }}</h3>

    <div class="app__form-section">
      <div class="app__form-row">
        <file-field
          :value="document"
          @input="checkFile"
          v-model="document"
          v-validate="'required'"
          :type="DOCUMENT_TYPES.delta"
          :label="i18n.fi_select_file()"
          class="ref-checker__upload-field"
          name="file-to-upload"
          id="file-to-upload"
        />
      </div>

      <transition name="app__fade-in">
        <template v-if="fileSearchFailed">
          <p class="ref-checker__not-found-error">
            {{ 'docs_check_not_found' | translate }}
          </p>
        </template>
      </transition>
    </div>

    <h3 class="app__form-heading">
      {{ i18n.docs_check_meta() }}
    </h3>

    <form
      class="app__form-section"
      id="meta-search-form"
      @submit.prevent="checkMeta"
    >
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field-unchained
            v-model="form.lastName"
            :label="i18n.doc_lbl_last_name()"
            :required="false"
          />
        </div>
        <div class="app__form-field">
          <input-field-unchained
            v-model="form.taxId"
            :label="i18n.doc_lbl_tax_id()"
            :required="false"
          />
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field-unchained
            v-model="form.mobilePhone"
            :label="i18n.doc_lbl_mobile_phone()"
            :required="false"
          />
        </div>
        <div class="app__form-field">
          <input-field-unchained
            v-model="form.serialNumber"
            :label="i18n.doc_lbl_serial_number()"
            :required="false"
          />
        </div>
      </div>
    </form>

    <div class="app__form-actions">
      <button
        v-ripple
        class="app__form-submit-btn"
        :disabled="isPending"
        form="meta-search-form"
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
    fileSearchFailed: false,
    document: null,
    DOCUMENT_TYPES
  }),
  methods: {
    async checkFile () {
      if (!this.document) { // deprecated if
        EventDispatcher.dispatchShowErrorEvent(i18n.doc_please_upload())
        return
      }
      this.fileSearchFailed = false
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
        this.fileSearchFailed = true
        EventDispatcher.dispatchShowErrorEvent(i18n.doc_no_such_file())
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
        EventDispatcher.dispatchShowErrorEvent(i18n.doc_please_fill_one_field())
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
        } else {
          throw new Error('Not found')
        }
      } catch (e) {
        EventDispatcher.dispatchShowErrorEvent(i18n.doc_no_such_file())
      }
      this.enable()
    }
  }
}
</script>

<style lang="scss" scoped>
.ref-checker__not-found-error {
  color: crimson;
  font-size: 14px;
  font-weight: 600;
}

.ref-checker .app__form-section:first-of-type {
  margin-bottom: 60px;
}
</style>
