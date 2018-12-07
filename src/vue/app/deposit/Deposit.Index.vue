<template>
  <div class="app__page-content-wrp">
    <h2 class="app__page-heading">{{ i18n.dep_heading_cp() }}</h2>
    <p class="app__page-explanations">
      {{ i18n.dep_how_to_cp() }}<br>
    </p>

    <template v-if="tokenCode">
      <div class="app__form">
        <div class="app__form-row">
          <div class="app__form-field">
            <select-field-unchained
              :values="tokenCodes"
              v-model="tokenCode"
              :label="i18n.lbl_asset()"
            />
          </div>
        </div>

        <deposit-coinpayments :token="selectedToken" v-if="isCoinayments" />
        <deposit-bind :token="selectedToken" v-else />
      </div>
    </template>

    <template v-else>
      <h2 class="app__page-heading">
        {{ i18n.deposit_no_assets_heading() }}
      </h2>
      <p
        class="app__page-explanations
               app__page-explanations--secondary"
      >
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
import DepositCoinpayments from '@/vue/app/deposit/Deposit.Coinpayments'
import DepositBind from './Deposit.Bind'
import SelectFieldUnchained from '../../common/fields/SelectFieldUnchained'

import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex/types'

import { i18n } from '../../../js/i18n'

export default {
  components: {
    DepositCoinpayments,
    DepositBind,
    SelectFieldUnchained
  },
  data: _ => ({
    tokenCode: '',
    i18n
  }),
  computed: {
    ...mapGetters([
      vuexTypes.userAcquiredTokens
    ]),
    tokenCodes () {
      return this.userAcquiredTokens
        .filter(token => token.isCoinpayments || token.isDepositable)
        .map(token => token.code)
    },
    selectedToken () {
      return this.userAcquiredTokens
        .find(token => token.code === this.tokenCode) || null
    },
    isCoinayments () {
      if (!this.selectedToken) {
        return false
      }

      return !!this.selectedToken.isCoinpayments
    }
  },
  watch: {
    tokenCodes: {
      handler: 'setTokenCode',
      immediate: true
    }
  },
  created () {
    this.loadAccount()
  },
  methods: {
    ...mapActions({
      loadAccount: vuexTypes.GET_ACCOUNT_DETAILS
    }),
    setTokenCode () {
      this.tokenCode = this.tokenCodes[0] || null
    }
  }
}
</script>

<style lang="scss">
@import '~@scss/variables';
@import '~@scss/mixins';
</style>
