<template>
   <div class="app__page-content-wrp">
      <template v-if="accountTypeI !== ACCOUNT_TYPES.syndicate">
        <h2 class="app__page-heading">{{ i18n.iss_not_available_heading() }}</h2>
        <p class="app__page-explanations app__page-explanations--secondary">
          {{ i18n.iss_not_available() }}
        </p>
        <router-link to="/verification" tag="button" class="app__button-raised">
          {{ i18n.iss_kyc_btn() }}
        </router-link>
      </template>

      <template v-else-if="!accountOwnedTokens.length">
        <h2 class="app__page-heading">{{ i18n.iss_no_assets_heading() }}</h2>
        <p class="app__page-explanations app__page-explanations--secondary">
          {{ i18n.iss_no_assets() }}
        </p>
        <router-link to="/token-creation" tag="button" class="app__button-raised">
          {{ i18n.iss_create_assets_btn() }}
        </router-link>
      </template>

      <template v-else>
        <form novalidate @submit.prevent="submit" v-if="formShown">

        <h2 class="app__page-heading">
          Issuance form
        </h2>

        <div class="app__form-row">
          <select-field-unchained :values="accountOwnedTokens"
            v-model="request.code"
            :label="i18n.lbl_asset()"/>
        </div>

        <div class="app__form-row">
          <input-field-unchained name="amount"
            v-model="request.amount"
            v-validate="'required|amount'"
            :label="i18n.lbl_amount()"
            :errorMessage="errorMessage('amount')"
          />
        </div>

        <div class="app__form-row">
          <input-field-unchained id="token-name"
                      name="issuance email"
                      v-model="request.receiver"
                      v-validate="'required|email'"
                      :label="i18n.lbl_email()"
                      :errorMessage="errorMessage('issuance email')"
          />
        </div>

        <div class="app__form-row">
          <input-field-unchained name="reference"
            v-model="request.reference"
            v-validate="'required'"
            :label="i18n.lbl_reference()"
            :errorMessage="errorMessage('reference')"
          />
        </div>

        <div class="app__form-actions">
          <button v-ripple
                  type="submit"
                  class="app__form-submit-btn"
                  :disabled="isPending">
            {{ i18n.iss_issue_btn() }}
          </button>
        </div>
      </form>
    </template>
  </div>
</template>

<script>
import FormMixin from '@/vue/common/mixins/form.mixin'
import SelectFieldUnchained from '@/vue/common/fields/SelectFieldUnchained'
import InputFieldUnchained from '@/vue/common/fields/InputFieldUnchained'
import { i18n } from '@/js/i18n'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex/types'
import { EventDispatcher } from '@/js/events/event_dispatcher'
import { ErrorHandler } from '@/js/errors/error_handler'
import { issuanceService } from '@/js/services/issuances.service'
import { accountsService } from '@/js/services/accounts.service'
import { ACCOUNT_TYPES } from '@/js/const/const'
import { errors } from '@/js/errors/factory'

export default {
  mixins: [FormMixin],
  components: { SelectFieldUnchained, InputFieldUnchained },
  data: _ => ({
    request: {},
    formShown: true,
    unissued: '', // TODO: unissued amount label, exceeding check
    i18n,
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
        this.rerenderForm()
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
    },

    rerenderForm () {
      this.formShown = false
      this.request = {}
      this.setTokenCode()
      setTimeout(() => (this.formShown = true), 1)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
