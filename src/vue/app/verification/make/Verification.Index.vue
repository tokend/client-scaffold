<template>
  <div class="create-sale md-layout md-alignment-center-center">
    <div class="md-layout-item
                    md-size-50
                    md-medium-size-65
                    md-small-size-95
                    md-xsmall-size-100">
      <md-card>
        <md-progress-bar md-mode="indeterminate" v-if="isPending"/>
        <md-card-header>
          <div class="md-title">{{ i18n.kyc_form_submit() }}</div>
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
                        :kyc="kyc"
                        @kyc-update="handleKycUpdate($event, { step, i })"
                        @kyc-edit-end="handleKycEditEnd"
              />
            </md-step>
          </md-steppers>
        </md-card-content>
      </md-card>
    </div>
  </div>
</template>

<script>
  import FormMixin from '../../../common/mixins/form.mixin'
  import steps from '../spec/steps.schema'
  import { i18n } from '../../../../js/i18n'
  import { mapGetters, mapActions } from 'vuex'
  import { vuexTypes } from '../../../../vuex/types'
  import { accountsService } from '../../../../js/services/accounts.service'
  import { ACCOUNT_TYPES, ACCOUNT_STATES } from '../../../../js/const/const'
  import { confirmAction } from '../../../../js/modals/confirmation_message'
  import { EventDispatcher } from '../../../../js/events/event_dispatcher'
  import { ErrorHandler } from '../../../../js/errors/error_handler'
  import { KycCorporateTemplateParser } from '../spec/kyc-corporate-template-parser'
  import { KycCorporateRequestRecord } from '../../../../js/records/kyc_corporate_request.record'

  const KYC_LEVEL_TO_SET = 0
  export default {
    name: 'verification-index',
    components: {},
    mixins: [FormMixin],
    data: _ => ({
      activeStep: steps[0].name,
      kyc: new KycCorporateRequestRecord(),
      i18n,
      steps,
      ACCOUNT_TYPES
    }),
    async created () {
      await Promise.all([
        this.loadTokens(),
        this.loadBalances()
      ])
      this.kyc = new KycCorporateRequestRecord(this.accountKycData)
    },

    computed: {
      ...mapGetters([
        vuexTypes.accountId,
        vuexTypes.accountTypeI,
        vuexTypes.accountKycLatestRequest,
        vuexTypes.accountKycData
      ])
    },

    methods: {
      ...mapActions({
        loadTokens: vuexTypes.GET_ALL_TOKENS,
        loadBalances: vuexTypes.GET_ACCOUNT_BALANCES,
        loadKycRequests: vuexTypes.GET_ACCOUNT_KYC_REQUESTS,
        updateKycData: vuexTypes.UPDATE_ACCOUNT_KYC_DATA,
        updateDocuments: vuexTypes.UPDATE_ACCOUNT_KYC_DOCUMENTS
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
            details: KycCorporateTemplateParser.fromTemplate(this.kyc),
            documents: KycCorporateTemplateParser.getSaveableDocuments(this.kyc.documents)
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
          accountTypeToSet: ACCOUNT_TYPES.syndicate,
          kycLevelToSet: KYC_LEVEL_TO_SET,
          kycData: { blob_id: blobId }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
