<template>
  <div class="kyc-form md-layout md-alignment-center-center">
    <form novalidate @submit.prevent="submit"
          class="md-layout-item
                  md-size-50
                  md-medium-size-65
                  md-small-size-95
                  md-xsmall-size-100"
    >
      <md-card>
        <md-progress-bar md-mode="indeterminate" v-if="isPending"/>

        <md-card-header>
          <div class="md-title">{{ i18n.kyc_account_verification() }}</div>
        </md-card-header>

        <md-card-content>


          <template v-for="row in schema.rows">

            <template v-if="row.heading">
              <h4>{{ row.heading }}</h4>
            </template>

            <template v-if="row instanceof Array">
              <div class="md-layout md-gutter">
                  <template v-for="item in row">
                    <div class="md-layout-item md-small-size-100">
                      <input-field v-if="item.field === 'text'"
                                   v-model="form[item.model]"
                                   v-validate="item.validate"
                                   :name="item.name"
                                   :id="item.id"
                                   :required="item.required"
                                   :label="item.label"
                                   :errorMessage="errorMessage(item.name)"
                      />
                      <date-field v-if="item.field === 'date'"
                                  v-model="form[item.model]"
                                  v-validate="item.validate"
                                  :name="item.name"
                                  :id="item.id"
                                  :required="item.required"
                                  :disableBefore="item.disableBefore"
                                  :disableAfter="item.disableAfter"
                                  :label="item.label"
                                  :errorMessage="errorMessage(item.name)"
                      />
                      <select-field v-if="item.field === 'select'"
                                    v-model="form[item.model]"
                                    v-validate="item.validate"
                                    :values="values[item.values]"
                                    :name="item.name"
                                    :id="item.id"
                                    :required="item.required"
                                    :label="item.label"
                                    :errorMessage="errorMessage(item.name)"
                      />
                    </div>
                  </template>
              </div>
            </template>

          </template>

          <h4>{{ i18n.kyc_required_documents() }}</h4>

          <template v-for="doc in schema.docs">
            <template v-if="doc.type === documentTypes.kycSelfie">
              <h4>{{ i18n.kyc_photo_verification() }}</h4>
              <p>{{ i18n.kyc_photo_explain() }}</p>
              <md-button @click="isDialogOpened = true">{{ i18n.kyc_show_key() }}</md-button>
            </template>

            <file-field class="kyc-form__file-field"
                          v-model="documents[doc.type]"
                          :private="doc.private"
                          :label="doc.label"
                          :type="doc.type"
                          :id="doc.id"
              />
          </template>

          <div class="md-layout md-alignment-center-right">
            <md-button type="submit" class="md-dense md-raised md-primary" :disabled="isPending">
              {{ i18n.lbl_submit() }}
            </md-button>
          </div>
        </md-card-content>
      </md-card>
    </form>

    <md-dialog :md-active.sync="isDialogOpened">
      <md-dialog-title>
        {{ i18n.kyc_verification_key() }}
      </md-dialog-title>
      <div class="app__dialog__inner">
        <p class="kyc-form__verification-key">
          {{ verificationKey }}
        </p>
      </div>
      <md-dialog-actions class="md-layout md-alignment-center-right">
        <md-button class="md-primary" @click="isDialogOpened = false">{{ i18n.lbl_done() }}</md-button>
      </md-dialog-actions>
    </md-dialog>

  </div>
</template>

<script>
  import FormMixin from '../../../common/mixins/form.mixin'
  import FileField from '../../../common/fields/FileField'

  import { mapGetters, mapActions } from 'vuex'
  import { ErrorHandler } from '../../../../js/errors/error_handler'
  import { EventDispatcher } from '../../../../js/events/event_dispatcher'
  import { documentTypes } from '../../../../js/const/documents.const'
  import { vuexTypes } from '../../../../vuex/types'
  import { i18n } from '../../../../js/i18n'
  import isEmpty from 'lodash/isEmpty'

  import { kycIndividualSchema as schema } from '../spec/kyc-individual.schema'
  import { usersService } from '../../../../js/services/users.service'

  export default {
    name: 'verification-individual',
    mixins: [FormMixin],
    components: { FileField },
    data: _ => ({
      form: {
        first_name: '',
        last_name: '',
        date_of_birth: null,
        id_expiration_date: null,
        line_1: '',
        line_2: '',
        city: '',
        country: '',
        state: '',
        postal_code: ''
      },
      documents: {
        [documentTypes.kycIdDocument]: null,
        [documentTypes.kycProofOfAddress]: null,
        [documentTypes.kycPhoto]: null
      },
      values: {
        countries: []
      },
      isDialogOpened: false,
      documentTypes,
      i18n,
      schema
    }),
    async created () {
      this.values.countries = [ '', ...(await usersService.loadEnums()).data('countries') ]
      if (!isEmpty(this.userKycDetails)) {
        this.stubDetails()
      }
    },
    computed: {
      ...mapGetters([
        vuexTypes.accountId,
        vuexTypes.userKycDetails,
        vuexTypes.userKycDocuments,
        vuexTypes.userKycSequence
      ]),
      verificationKey () {
        return this.accountId.slice(1, 6)
      }
    },
    methods: {
      ...mapActions({
        loadUser: vuexTypes.GET_USER_DETAILS,
        loadUserKyc: vuexTypes.GET_ACCOUNT_KYC,
        updateKycDetails: vuexTypes.UPDATEACCOUNTR_KYC_DETAILS,
        updateKycDocuments: vuexTypes.UPDATE_ACCOUNT_KYC_DOCUMENTS
      }),
      async submit () {
        if (!await this.isValid()) return
        if (!this.isAllDocsUploaded()) return
        this.disable()
        try {
          const newDocuments = await this.updateKycDocuments(this.documents)
          const oldDocuments =
            Object.entries(this.documents)
              .reduce((documents, [ type, document ]) => {
                if (!newDocuments[type]) {
                  documents[type] = document.getDetailsForSave()
                }
                return documents
              }, {})
          const kycSequence = String(this.userKycSequence + 1)
          await this.updateKycDetails({
            sequence: kycSequence,
            details: this.form,
            documents: {
              ...oldDocuments,
              ...newDocuments
            }
          })
          await this.loadUser()
          await this.loadUserKyc(this.userKycSequence)
          EventDispatcher.dispatchShowSuccessEvent(i18n.kyc_upload_success())
        } catch (error) {
          ErrorHandler.processUnexpected(error)
        }
        this.enable()
      },
      isAllDocsUploaded () {
        for (const document of Object.values(this.documents)) {
          if (!document) {
            EventDispatcher.dispatchShowErrorEvent(i18n.kyc_not_all_docs())
            return false
          }
        }
        return true
      },
      stubDetails () {
        const details = this.userKycDetails
        const documents = this.userKycDocuments
        this.form = details
        Object.keys(documents)
          .forEach(documentType => {
            this.documents[documentType] = documents[documentType]
          })
      }
    },
    watch: {
      userKycDetails () { this.stubDetails() },
      userKycDocuments () { this.stubDetails() }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../scss/variables';

  .kyc-form__verification-key {
    font-size: $fs-big;
    font-weight: bold;
    margin: 2rem 0;
    text-align: center;
  }
</style>
