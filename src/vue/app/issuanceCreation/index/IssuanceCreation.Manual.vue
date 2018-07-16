<template>
   <div class="create-issuance md-layout md-alignment-center-center">
      <div class="md-layout-item
                    md-size-50
                    md-medium-size-65
                    md-small-size-95
                    md-xsmall-size-100">
      <template v-if="accountTypeI !== ACCOUNT_TYPES.syndicate">
        <not-available-card icon='work'
                          :title="i18n.lbl_not_available()"
                          :descr="i18n.lbl_issuance_not_available_exp()"/>
      </template>
      <template v-else-if="!accountOwnedTokens.length">
        <not-available-card icon='work'
                          :title="i18n.lbl_not_available()"
                          :descr="i18n.lbl_issuance_not_available_yet()"/>
      </template>
      <template v-else>
      <form novalidate @submit.prevent="submit">
      <md-card>
        <md-progress-bar md-mode="indeterminate" v-if="isPending"/>
        <md-card-content>
          <div class="md-card-content-item">
            <div class="md-layout md-gutter">
              <div class="md-layout-item md-small-size-100">
                <input-field id="token-name"
                            name="issuance email"
                            v-model="request.receiver"
                            v-validate="'required|email'"
                            :label="i18n.lbl_email()"
                            :errorMessage="errorMessage('issuance email')"
                />
              </div>
              <div class="md-layout-item md-small-size-100">
                <select-field-custom :values="accountOwnedTokens"
                                     v-model="request.code"
                                     :label="i18n.lbl_asset()"/>
              </div>
            </div>
            <div class="md-layout md-gutter">
              <div class="md-layout-item md-small-size-100">
                <input-field id="token-max-issuance-amount"
                            name="reference"
                            v-model="request.reference"
                            v-validate="'required'"
                            :label="i18n.lbl_reference()"
                            :errorMessage="errorMessage('reference')"
                />
              </div>
              <div class="md-layout-item md-small-size-100">
                <input-field id="token-max-issuance-amount"
                            name="amount"
                            v-model="request.amount"
                            v-validate="'required|amount'"
                            :label="i18n.lbl_amount()"
                            :errorMessage="errorMessage('amount')"
                />
              </div>
            </div>
          </div>
        </md-card-content>
        <md-card-actions>
          <md-button type="submit" class="md-primary"
            :disabled="isPending"
          >{{ i18n.lbl_submit() }}</md-button>
        </md-card-actions>
      </md-card>
    </form>
    </template>
    </div>
  </div>
</template>

<script>
import FormMixin from '../../../common/mixins/form.mixin'
import SelectFieldCustom from '@/vue/common/fields/SelectFieldCustom'
import NotAvailableCard from '../../common/NotAvailableCard'
import { i18n } from '../../../../js/i18n'
import { mapGetters } from 'vuex'
import { vuexTypes } from '../../../../vuex/types'
import { EventDispatcher } from '../../../../js/events/event_dispatcher'
import { ErrorHandler } from '../../../../js/errors/error_handler'
import { issuanceService } from '../../../../js/services/issuances.service'
import { accountsService } from '../../../../js/services/accounts.service'
import { ACCOUNT_TYPES } from '../../../../js/const/const'
import { errors } from '../../../../js/errors/factory'

export default {
  mixins: [FormMixin],
  components: { SelectFieldCustom, NotAvailableCard },
  data: _ => ({
    request: {},
    i18n,
    mapGetters,
    ACCOUNT_TYPES
  }),

  created () {
    this.setTokenCode()
  },

  computed: {
    ...mapGetters([
      vuexTypes.accountOwnedTokens,
      vuexTypes.accountTypeI
    ])
  },

  methods: {
    async submit () {
      if (!await this.isValid()) return
      this.disable()
      try {
        const receiver = await accountsService.loadBalanceIdByEmail(this.request.receiver, this.request.code)
        await issuanceService.createIssuanceRequest({
          token: this.request.code,
          amount: this.request.amount,
          receiver: receiver,
          reference: this.request.reference,
          externalDetails: {}
        })
        EventDispatcher.dispatchShowSuccessEvent(i18n.iss_submit_success())
      } catch (error) {
        console.log(error)
        console.log(error.constructor)
        console.log(error.constructor === errors.NotFoundError)
        if (error.constructor === errors.NotFoundError) {
          EventDispatcher.dispatchShowErrorEvent(i18n.iss_no_balance({ asset: this.request.code }))
          this.enable()
          return
        }
        ErrorHandler.processUnexpected(error)
      }
      this.enable()
    },

    setTokenCode () {
      this.request.code = this.accountOwnedTokens[0] || null
    }
  }
}
</script>

<style lang="scss" scoped>
  .md-card-content-item:not(:last-child) {
    margin-bottom: 24px;
  }
</style>
