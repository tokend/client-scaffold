<template>
  <div class="docs-manager">
    <div class="docs-manager__inner">
      <div class="docs-manager__form-wrp app__page-content-wrp">
        <form
          @submit.prevent="updateView(VIEW_MODES.confirm)"
          id="upload-form"
          v-if="view.mode === VIEW_MODES.submit ||
          view.mode === VIEW_MODES.confirm"
        >
          <h3 class="app__form-heading">{{ i18n.doc_fill_meta() }}</h3>

          <div class="app__form-section">
            <div class="app__form-row">
              <div class="app__form-field">
                <input-field-unchained
                  name="firstName"
                  v-model.trim="form.firstName"
                  v-validate="'required'"
                  :label="i18n.doc_lbl_first_name()"
                  :error-message="errorMessage('firstName')"
                  :readonly="view.mode === VIEW_MODES.confirm"
                />
              </div>

              <div class="app__form-field">
                <input-field-unchained
                  name="lastName"
                  v-model.trim="form.lastName"
                  v-validate="'required'"
                  :label="i18n.doc_lbl_last_name()"
                  :error-message="errorMessage('lastName')"
                  :readonly="view.mode === VIEW_MODES.confirm"
                />
              </div>
            </div>

            <div class="app__form-row">
              <div class="app__form-field">
                <input-field-unchained
                  name="taxId"
                  v-model.trim="form.taxId"
                  v-validate="'required'"
                  :label="i18n.doc_lbl_tax_id()"
                  :error-message="errorMessage('taxId')"
                  :readonly="view.mode === VIEW_MODES.confirm"
                />
              </div>

              <div class="app__form-field">
                <input-field-unchained
                  name="mobilePhone"
                  v-model.trim="form.mobilePhone"
                  v-validate="'required'"
                  :label="i18n.doc_lbl_mobile_phone()"
                  :error-message="errorMessage('mobilePhone')"
                  :readonly="view.mode === VIEW_MODES.confirm"
                />
              </div>
            </div>

            <div class="app__form-row">
              <div class="app__form-field">
                <input-field-unchained
                  name="serialNumber"
                  v-model.trim="form.serialNumber"
                  v-validate="'required'"
                  :label="i18n.doc_lbl_serial_number()"
                  :error-message="errorMessage('serialNumber')"
                  :readonly="view.mode === VIEW_MODES.confirm"
                />
              </div>

              <div class="app__form-field">
                <date-field-flatpickr
                  v-model="form.dateOfBirth"
                  v-validate="'required'"
                  name="dateOfBirth"
                  id="sale-start-time"
                  :label="i18n.doc_lbl_date_of_birth()"
                  :disable-after="new Date().toString()"
                  :error-message="errorMessage('dateOfBirth')"
                  :readonly="view.mode === VIEW_MODES.confirm"
                />
              </div>
            </div>

            <div class="app__form-row">
              <div class="app__form-field">
                <select-field-unchained
                  name="documentType"
                  v-model="form.documentType"
                  v-validate="'required'"
                  :values="DOC_TYPE_VALUES"
                  :title="i18n.doc_lbl_document_type"
                  :label="i18n.doc_lbl_document_type()"
                  :readonly="view.mode === VIEW_MODES.confirm"
                  :error-message="errorMessage('documentType')"
                />
              </div>
              <div class="app__form-field">
                <input-field-unchained
                  name="counterparty"
                  v-model.trim="form.counterparty"
                  v-validate="'required'"
                  :label="i18n.doc_lbl_counterparty()"
                  :error-message="errorMessage('counterparty')"
                  :readonly="view.mode === VIEW_MODES.confirm"
                />
              </div>
            </div>
          </div>

          <h3 class="app__form-heading">{{ i18n.doc_upload() }}</h3>

          <div class="app__form-row">
            <file-field
              v-model="document"
              v-validate="'required'"
              :type="DOCUMENT_TYPES.delta"
              label="Select File(s)"
              class="docs-manager__upload-field"
              name="file-to-upload"
              id="file-to-upload"
            />
          </div>

          <div class="app__form-actions">
            <button
              v-ripple
              v-if="view.mode === VIEW_MODES.submit"
              type="submit"
              class="app__form-submit-btn"
              :disabled="isPending"
              form="upload-form"
            >
              {{ i18n.transfer_continue_btn() }}
            </button>

            <form-confirmation
              v-if="view.mode === VIEW_MODES.confirm"
              :pending="isPending"
              :message="i18n.docs_recheck_form()"
              :ok-button="i18n.docs_submit()"
              @cancel="updateView(VIEW_MODES.submit)"
              @ok="submit"
            />
          </div>
        </form>
      </div>

      <!--<div class="docs-manager__reference-list-wrp">-->
      <!--<reference-list :list="references" />-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
import FormConfirmation from '@/vue/common/form-confirmation/FormConfirmation'
// import ReferenceList from './DocReferences.List'
import FileField from '@/vue/common/fields/FileField'

import FormMixin from '@/vue/common/mixins/form.mixin'
import ReferenceCreator from './reference-creator.mixin'
import DocumentManager from './document-manager'
import ReferenceListLoader from './reference-list-loader'

import { i18n } from '../../../js/i18n'

import { documentTypes as DOCUMENT_TYPES } from '../../../js/const/const'

import { ErrorHandler } from '../../../js/errors/error_handler'
import { EventDispatcher } from '../../../js/events/event_dispatcher'

import { mapGetters } from 'vuex'
import { vuexTypes } from '../../../vuex/types'

const VIEW_MODES = Object.freeze({
  submit: 'submit',
  confirm: 'confirm',
  success: 'success'
})

const DOC_TYPE_VALUES = Object.freeze([
  'Passport',
  'Tax identification',
  'Other'
])

export default {
  components: {
    // ReferenceList,
    FormConfirmation,
    FileField
  },
  mixins: [
    FormMixin,
    ReferenceCreator,
    ReferenceListLoader,
    DocumentManager
  ],
  data: _ => ({
    form: {
      firstName: '',
      lastName: '',
      taxId: '',
      mobilePhone: '',
      serialNumber: '',
      dateOfBirth: '',
      counterparty: '',
      documentType: DOC_TYPE_VALUES[0]
    },
    document: null,
    view: {
      mode: VIEW_MODES.submit
    },
    DOC_TYPE_VALUES,
    DOCUMENT_TYPES,
    VIEW_MODES,
    i18n
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountId
    ])
  },
  async created () {
    await this.loadReferenceList()
  },
  methods: {
    async submit () {
      this.disable()
      try {
        await this.uploadDocuments(this.document)
        const reference = await this.getFileHash(this.document.file)
        await this.createReference(reference, {
          key: this.document.key,
          file_name: this.document.name,
          document_type: this.form.documentType,
          mimeType: this.document.mimeType,
          creator: this.accountId,
          ...this.form
        })
        EventDispatcher.dispatchShowSuccessEvent(i18n.doc_uploaded())
      } catch (e) {
        ErrorHandler.processUnexpected(e)
      }
      this.view.mode = VIEW_MODES.submit
      this.enable()
    },
    async updateView (mode, clear = false) {
      if (mode === VIEW_MODES.confirm &&
        !await this.isValid()) {
        return
      }
      this.view.mode = mode
      if (clear) {
        this.clear()
        this.setTokenCode()
      }
    }
  }
}
</script>

<style scoped lang="scss">
  @import "~@scss/variables";

  .docs-manager__inner {
    display: flex;
  }

  .docs-manager__form-wrp {
    margin-right: 5 * $point !important;
  }
</style>
