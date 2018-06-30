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
                  </div>
                </template>
              </div>
            </template>

          </template>
        </md-card-content>
        <md-card-actions>
          <md-button type="submit" class="md-primary"
            :disabled="isPending || accountState === ACCOUNT_STATES.pending"
          >{{ i18n.lbl_submit() }}</md-button>
        </md-card-actions>
      </md-card>
    </form>
  </div>
</template>

<script>
  import FormMixin from '../../../common/mixins/form.mixin'

  import { mapGetters, mapActions } from 'vuex'
  import { ErrorHandler } from '../../../../js/errors/error_handler'
  import { EventDispatcher } from '../../../../js/events/event_dispatcher'
  import { vuexTypes } from '../../../../vuex/types'
  import { i18n } from '../../../../js/i18n'

  import { kycSyndicateSchema as schema } from '../spec/kyc-syndicate.schema'
  import { KycTemplateParser } from '../spec/kyc-template-parser'
  import { accountsService } from '../../../../js/services/accounts.service'

  import { ACCOUNT_STATES } from '../../../../js/const/account.const'
  import { ACCOUNT_TYPES } from '../../../../js/const/xdr.const'

  const KYC_LEVEL_TO_SET = 0

  export default {
    name: 'verification-syndicate',
    mixins: [FormMixin],
    components: { },
    data: _ => ({
      form: {
        name: '',
        company: '',
        headquarters: '',
        industry: '',
        found_date: null,
        team_size: '',
        homepage: ''
      },
      isDialogOpened: false,
      i18n,
      schema,
      ACCOUNT_STATES
    }),
    created () {
      if (this.accountKycData) {
        this.stubData()
      }
    },
    computed: {
      ...mapGetters([
        vuexTypes.accountLatestBlobId,
        vuexTypes.accountId,
        vuexTypes.accountKycData,
        vuexTypes.accountState,
        vuexTypes.accountKycLatestRequest
      ])
    },
    methods: {
      ...mapActions({
        loadKycRequests: vuexTypes.GET_ACCOUNT_KYC_REQUESTS,
        updateKycData: vuexTypes.UPDATE_ACCOUNT_KYC_DATA
      }),
      async submit () {
        if (!await this.isValid()) return
        this.disable()
        try {
          const blobId = await this.updateKycData({
            details: KycTemplateParser.toSyndicateTemplate(this.form)
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
          accountTypeToSet: ACCOUNT_TYPES.syndicate,
          kycLevelToSet: KYC_LEVEL_TO_SET,
          kycData: { blob_id: blobId }
        })
      },
      stubData () {
        this.form = KycTemplateParser.fromSyndicateTemplate(this.accountKycData)
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
