<template>
  <div class="kyc-form md-layout md-alignment-center-center">
    <form novalidate @submit.prevent="submit"
          class="md-layout-item
                  md-size-100
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
                                   :disabled="accountState === ACCOUNT_STATES.pending"
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
                                  :disabled="accountState === ACCOUNT_STATES.pending"
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
                                    :disabled="accountState === ACCOUNT_STATES.pending"
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
                          v-model="documents[doc.type][doc.side]"
                          :private="doc.private"
                          :label="doc.label"
                          :type="doc.type"
                          :id="doc.id"
              />
          </template>
        </md-card-content>
        <md-card-actions>
          <md-button type="submit" class="md-primary"
            :disabled="isPending || accountState === ACCOUNT_STATES.pending"
          >{{ i18n.lbl_submit() }}</md-button>
        </md-card-actions>
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

  import { kycIndividualSchema as schema } from '../spec/kyc-individual.schema'
  import { KycTemplateParser } from '../spec/kyc-template-parser'
  import { usersService } from '../../../../js/services/users.service'
  import { accountsService } from '../../../../js/services/accounts.service'

  import { ACCOUNT_STATES } from '../../../../js/const/account.const'
  import { ACCOUNT_TYPES } from '../../../../js/const/xdr.const'

  const KYC_LEVEL_TO_SET = 0

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
      documents: schema.docs.reduce((docs, doc) => {
        if (!docs[doc.type]) {
          docs[doc.type] = {}
        }
        docs[doc.type][doc.side] = null
        return docs
      }, {}),
      values: {
        countries: []
      },
      isDialogOpened: false,
      documentTypes,
      i18n,
      schema,
      ACCOUNT_STATES
    }),
    async created () {
      this.values.countries = [ '', ...(await usersService.loadEnums()).data('countries') ]
      if (Object.keys(this.accountKycData).length) {
        this.stubData()
      }
      if (Object.keys(this.accountKycDocuments).length) {
        this.stubDocuments()
      }
    },
    computed: {
      ...mapGetters([
        vuexTypes.accountLatestBlobId,
        vuexTypes.accountId,
        vuexTypes.accountKycData,
        vuexTypes.accountKycDocuments,
        vuexTypes.accountState,
        vuexTypes.accountKycLatestRequest
      ]),
      verificationKey () {
        return this.accountId.slice(1, 6)
      }
    },
    methods: {
      ...mapActions({
        loadKycRequests: vuexTypes.GET_ACCOUNT_KYC_REQUESTS,
        updateDocuments: vuexTypes.UPDATE_ACCOUNT_KYC_DOCUMENTS,
        updateKycData: vuexTypes.UPDATE_ACCOUNT_KYC_DATA
      }),
      async submit () {
        if (!await this.isValid()) return
        if (!this.isAllDocsUploaded()) return
        this.disable()
        try {
          await this.updateDocuments(this.documents)
          const blobId = await this.updateKycData({
            details: KycTemplateParser.toTemplate(this.form),
            documents: KycTemplateParser.getSaveableDocuments(this.documents)
          })
          await this.submitRequest(blobId)
          await this.loadKycRequests()
          EventDispatcher.dispatchShowSuccessEvent(i18n.kyc_upload_success())
        } catch (error) {
          ErrorHandler.processUnexpected(error)
        }
        this.enable()
      },
      async submitRequest (blobId) {
        await accountsService.createKycRequest({
          requestID: this.accountState === ACCOUNT_STATES.rejected ? this.accountKycLatestRequest.id : '0',
          accountToUpdateKYC: this.accountId,
          accountTypeToSet: ACCOUNT_TYPES.general,
          kycLevelToSet: KYC_LEVEL_TO_SET,
          kycData: { blob_id: blobId }
        })
      },
      isAllDocsUploaded () {
        for (const doc of schema.docs) {
          if (!this.documents[doc.type][doc.side]) {
            EventDispatcher.dispatchShowErrorEvent(i18n.kyc_not_all_docs())
            return false
          }
        }
        return true
      },
      stubData () {
        this.form = KycTemplateParser.fromTemplate(this.accountKycData)
      },
      stubDocuments () {
        this.documents = this.accountKycDocuments
      }
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
