<template>
  <div class="docs-manager app__page-content-wrp">
    <form
      @submit.prevent="updateView(VIEW_MODES.confirm)"
      id="upload-form"
      v-if="view.mode === VIEW_MODES.submit
      || view.mode === VIEW_MODES.confirm"
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
        </div>
      </div>

      <h3 class="app__form-heading">{{ i18n.doc_upload() }}</h3>

      <div class="app__form-row">
        <file-field
          v-model="document"
          v-validate="'required'"
          label="Select File(s)"
          class="docs-manager__upload-field"
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
</template>

<script>
import FormConfirmation from '@/vue/common/form-confirmation/FormConfirmation'
import FormMixin from '@/vue/common/mixins/form.mixin'
import FileField from '@/vue/common/fields/FileField'

import { i18n } from '../../../js/i18n'
import InputFieldUnchained from '../../common/fields/InputFieldUnchained'

const VIEW_MODES = Object.freeze({
  submit: 'submit',
  confirm: 'confirm',
  success: 'success'
})

const DOC_TYPE_VALUES = Object.freeze(['Passport', 'Tax identification', 'Other'])

export default {
  components: {
    InputFieldUnchained,
    FormConfirmation,
    FileField
  },
  mixins: [FormMixin],
  data: _ => ({
    form: {
      firstName: '',
      lastName: '',
      taxId: '',
      mobilePhone: '',
      serialNumber: '',
      dateOfBirth: '',
      documentType: DOC_TYPE_VALUES[0]
    },
    document: null,
    view: {
      mode: VIEW_MODES.submit
    },
    DOC_TYPE_VALUES,
    VIEW_MODES,
    i18n
  }),
  methods: {
    submit () {
      // wip
    },
    updateView (mode, clear = false) {
      this.view.mode = mode
      if (clear) {
        this.clear()
        this.setTokenCode()
      }
    }
  }
}
</script>

<style scoped>

</style>
