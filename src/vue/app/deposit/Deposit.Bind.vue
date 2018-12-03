<template>
  <div class="deposit">
    <template v-if="form.tokenCode">
      <h2 class="app__page-heading">
        {{ i18n.dep_heading() }}
      </h2>

      <p class="app__page-explanations">
        {{ i18n.dep_how_to({ asset: form.tokenCode }) }}<br>
      </p>

      <div class="app__form-row">
        <select-field-unchained
          :values="tokenCodes"
          v-model="form.tokenCode"
          :label="i18n.lbl_asset()" />
      </div>

      <template v-if="address">
        <p class="app__page-explanations deposit__warn-msg">
          <strong>{{ i18n.dep_asset_only_prefix() }}</strong>
          {{ i18n.dep_asset_only({ asset: form.tokenCode }) }}
        </p>

        <div class="app__form-row">
          <clipboard-field
            :value="address"
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
            :text="address"
            :size="225"
            color="#3f4244"
          />
        </div>
      </template>

      <template v-else-if="isPending">
        <!-- TODO: add a spinner -->
        <p class="app__page-explanations app__page-explanations--secondary">
          {{ i18n.dep_binding_address() }}
        </p>
      </template>

      <template v-else>
        <p class="app__page-explanations app__page-explanations--secondary">
          {{ i18n.dep_no_address() }}
        </p>
      </template>
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

import { mapGetters } from 'vuex'
import { vuexTypes } from '../../../vuex/types'
import { i18n } from '../../../js/i18n'

import { issuanceService } from '../../../js/services/issuances.service'

export default {
  name: 'deposit-make',
  mixins: [DepositMakerMixin],
  data: _ => ({
    i18n
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountDepositAddresses
    ]),
    tokenCodes () {
      return this.userAcquiredTokens
        .filter(token => token.isDepositable)
        .map(token => token.code)
    },
    address () {
      if (!this.selectedToken) return ''
      const externalSystemType = this.selectedToken.externalSystemType
      return this.accountDepositAddresses[externalSystemType]
    }
  },
  watch: {
    selectedToken: {
      handler: 'tryBindAddress',
      immediate: true
    }
  },
  methods: {
    async tryBindAddress (token) {
      if (!token || !token.externalSystemType) {
        return
      }
      this.isPending = true
      try {
        await issuanceService.bindExternalAccount({
          externalSystemType: +token.externalSystemType
        })
        await this.loadAccount()
      } catch (e) {
        console.error(e)
      }
      this.isPending = false
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "./deposit";
</style>
