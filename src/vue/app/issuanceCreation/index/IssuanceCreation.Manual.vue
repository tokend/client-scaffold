<template>
   <div class="md-layout md-alignment-center-center">
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
          <div class="md-title">{{ i18n.lbl_manual_emission() }}</div>
        </md-card-header>
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
                <select-field :label="i18n.lbl_default_quote_asset()"
                              v-model="request.code"
                              :values="accountOwnedTokens" />
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
  </div>
</template>

<script>
import FormMixin from '../../../common/mixins/form.mixin'
import SelectField from '../../../common/fields/SelectField'
import { i18n } from '../../../../js/i18n'
import { mapGetters } from 'vuex'
import { vuexTypes } from '../../../../vuex/types'
// import { EventDispatcher } from '../../../../js/events/event_dispatcher'
import { ErrorHandler } from '../../../../js/errors/error_handler'
import { issuanceService } from '../../../../js/services/issuances.service'
import { accountsService } from '../../../../js/services/accounts.service'

export default {
  mixins: [FormMixin],
  components: { SelectField },
  data: _ => ({
    request: {},
    i18n,
    mapGetters
  }),

  created () {
    this.setTokenCode()
  },

  computed: {
    ...mapGetters([
      vuexTypes.accountOwnedTokens
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
          reference: this.request.reference
        })
      } catch (error) {
        console.log(error)
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
