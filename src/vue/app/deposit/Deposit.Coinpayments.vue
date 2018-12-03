<template>
  <div class="deposit">
    <template v-if="form.tokenCode">
      <h2 class="app__page-heading">{{ i18n.dep_heading_cp() }}</h2>

      <p class="app__page-explanations">
        {{ i18n.dep_how_to_cp() }}<br>
      </p>

      <form class="app__form" @submit.prevent="submit">
        <div class="app__form-row">
          <div class="app__form-field">
            <select-field-unchained
              :values="tokenCodes"
              v-model="form.tokenCode"
              :label="i18n.lbl_asset()"
            />
          </div>
          <div class="app__form-field">
            <input-field-unchained
              id="deposit-amount"
              v-model="form.amount"
              v-validate="'required|amount'"
              :label="i18n.lbl_amount()"
              name="deposit amount"
              :disabled="isPending"
              :error-message="errorMessage('deposit amount')"
            />
          </div>
        </div>

        <template v-if="resultDetails.address">
          <p class="app__page-explanations deposit__warn-msg">
            {{
              i18n.dep_ready_cp({
                asset: form.tokenCode,
                amount: i18n.c(resultDetails.amount)
              })
            }}
          </p>

          <div class="app__form-row">
            <clipboard-field
              :value="resultDetails.address"
              :label="i18n.dep_where_to({ asset: form.tokenCode })"
              :monospaced="true"
            />
          </div>

          <div class="deposit__qr-outer">
            <span class="deposit__qr-code-hint">
              {{ i18n.deposit_qr_code_hint() }}
            </span>
            <!--TODO: use vue-qr instead for consistency-->
            <qrcode
              class="deposit__qr-code"
              :text="resultDetails.address"
              :size="225"
              color="#3f4244"
            />
          </div>

          <div class="deposit__timeout-ticker-wrp">
            <timeout-ticker
              class="deposit__timeout-ticker"
              :timeout="resultDetails.timeout"
            />

            <p class="deposit__timeout-warn">
              {{ i18n.dep_timeout_warn() }}
            </p>
          </div>
        </template>

        <template v-else-if="!isFailed">
          <div class="app__form-actions">
            <button
              class="app__button-raised"
              type="submit"
              :disabled="isPending"
            >
              {{ i18n.dep_request_cp() }}
            </button>
          </div>
        </template>

        <template v-else>
          <p class="app__page-explanations app__page-explanations--secondary">
            {{ i18n.dep_no_address() }}
          </p>
        </template>
      </form>
    </template>

    <template v-else>
      <h2 class="app__page-heading">{{ i18n.deposit_no_assets_heading() }}</h2>
      <p class="app__page-explanations app__page-explanations--secondary">
        {{ i18n.deposit_no_assets() }}
      </p>
      <router-link
        to="/tokens"
        tag="button"
        class="app__button-raised">
        {{ i18n.deposit_discover_assets_btn() }}
      </router-link>
    </template>
  </div>
</template>

<script>
import DepositMakerMixin from './deposit-maker.mixin'
import FormMixin from '@/vue/common/mixins/form.mixin'
import InputFieldUnchained from '@/vue/common/fields/InputFieldUnchained'
import TimeoutTicker from './TimeoutTicker'

import { i18n } from '@/js/i18n'
import { depositService } from '@/js/services/deposit.service'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex/types'

export default {
  components: {
    InputFieldUnchained,
    TimeoutTicker
  },
  mixins: [DepositMakerMixin, FormMixin],
  data: _ => ({
    i18n,
    form: {
      tokenCode: '',
      amount: ''
    },
    resultDetails: {
      address: '',
      amount: '',
      confirmsNeeded: '',
      timeout: '',
      txId: ''
    },
    isFailed: false
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountBalances
    ]),
    tokenCodes () {
      return this.userAcquiredTokens
        .filter(token => token.isCoinpayments)
        .map(token => token.code)
    }
  },
  watch: {
    selectedToken: {
      handler: 'resetForm',
      immediate: true
    }
  },
  methods: {
    async submit () {
      if (!await this.isValid()) {
        return
      }
      this.disable()
      try {
        const response = await depositService.requestDeposit({
          amount: this.form.amount,
          balance: this.accountBalances[this.form.tokenCode].balance_id
        })
        const resultDetails = response.data().extras

        this.resultDetails.address = resultDetails.address
        this.resultDetails.amount = resultDetails.amount
        this.resultDetails.confirmsNeeded = resultDetails.confirms_needed
        this.resultDetails.timeout = resultDetails.timeout
        this.resultDetails.txId = resultDetails.txn_id
      } catch (e) {
        console.error(e)
        this.isFailed = true
      }
      this.enable()
    },
    resetForm () {
      this.form.amount = ''
      this.resultDetails.address = ''
      this.resultDetails.amount = ''
      this.resultDetails.confirmsNeeded = ''
      this.resultDetails.timeout = ''
      this.resultDetails.txId = ''
      this.isFailed = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./deposit";

.deposit__timeout-ticker {
  text-align: center;
  margin: 2.5 * $point auto 0;
  font-size: 2 * $point;
  color: $col-pending;
  font-weight: 500;
}

.deposit__timeout-warn {
  text-align: center;
  color: $col-pending;
  font-size: 1 * $point;
}
</style>
