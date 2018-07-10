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
          <md-steppers md-vertical :md-active-step.sync="activeStep">
            <md-step v-for="(step, i) in steps"
                    :key="i"
                    :id="step.name"
                    :md-label="step.label"
                    :md-done.sync="step.done"
            >
              <component :is="step.component"
                        :schema="step.schema"
                        :activeStep="activeStep"
                        :finalStep="finalStep"
                        :kyc="kyc"
                        @kyc-update="handleKycUpdate($event, { step, i })"
                        @kyc-edit-end="handleKycEditEnd"
              />
            </md-step>
          </md-steppers>
          <!-- <template v-for="row in schema.rows">

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
          </template> -->
        </md-card-content>
        <!-- <md-card-actions>
          <md-button type="submit" class="md-primary"
            :disabled="isPending || accountState === ACCOUNT_STATES.pending"
          >{{ i18n.lbl_submit() }}</md-button>
        </md-card-actions> -->
      </md-card>
    </form>
  </div>
</template>

<script>
  import FormMixin from '../../../common/mixins/form.mixin'
  import FileField from '../../../common/fields/FileField'
  import steps from '../spec/kyc-steps.general.schema'

  import { mapGetters, mapActions } from 'vuex'
  import { ErrorHandler } from '../../../../js/errors/error_handler'
  import { EventDispatcher } from '../../../../js/events/event_dispatcher'
  import { vuexTypes } from '../../../../vuex/types'
  import { i18n } from '../../../../js/i18n'

  import { KycTemplateParser } from '../spec/kyc-template-parser'
  import { accountsService } from '../../../../js/services/accounts.service'

  import { userTypes, ACCOUNT_TYPES, ACCOUNT_STATES } from '../../../../js/const/const'
  import { confirmAction } from '../../../../js/modals/confirmation_message'

  import { VerificationRequestRecord } from '../../../../js/records/verification.record'

  const KYC_LEVEL_TO_SET = 0

  export default {
    name: 'verification-individual',
    mixins: [FormMixin],
    components: { FileField },
    data: _ => ({
      isDialogOpened: false,
      kyc: null,
      activeStep: steps[0].name,
      finalStep: steps[steps.length - 1].name,
      i18n,
      steps,
      ACCOUNT_STATES,
      userTypes
    }),
    created () {
      this.kyc = new VerificationRequestRecord(this.accountKycData)
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

      handleKycUpdate ({ form, documents }, { step, i }) {
        form = form || {}
        documents = documents || {}
        Object.entries(form).forEach(([key, value]) => {
          this.kyc[key] = value
        })
        Object.entries(documents).forEach(([key, value]) => {
          this.kyc.documents[key] = value
        })
        if (this.activeStep === steps[steps.length - 1].name) {
          this.handleKycEditEnd()
        }
        step.done = true
        this.activeStep = (steps[i + 1] || steps[0]).name
      },
      async handleKycEditEnd () {
        if (!await confirmAction()) return
        this.disable()
        try {
          await this.updateDocuments(this.kyc.documents)
          const blobId = await this.updateKycData({
            details: KycTemplateParser.toTemplate(this.kyc, userTypes.general),
            documents: KycTemplateParser.getSaveableDocuments(this.kyc.documents)
          })
          await this.submitRequest(blobId)
          await this.loadKycRequests()
          EventDispatcher.dispatchShowSuccessEvent(i18n.sale_create_request_success())
        } catch (error) {
          console.error(error)
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
