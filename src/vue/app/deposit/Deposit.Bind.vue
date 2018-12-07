<template>
  <div class="deposit">
    <template v-if="address">
      <p class="app__page-explanations deposit__warn-msg">
        <strong>{{ i18n.dep_asset_only_prefix() }}</strong>
        {{ i18n.dep_asset_only({ asset: token.code }) }}
      </p>

      <div class="app__form-row">
        <clipboard-field
          :value="address"
          :label="i18n.dep_where_to({ asset: token.code })"
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
  </div>
</template>

<script>
import ClipboardField from '../../common/fields/ClipboardField'
import Qrcode from 'vue-qrcode-component'

import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '../../../vuex/types'
import { i18n } from '../../../js/i18n'

import { issuanceService } from '../../../js/services/issuances.service'

export default {
  name: 'deposit-bind',
  components: {
    ClipboardField,
    Qrcode
  },
  props: {
    token: {
      type: Object,
      required: true
    }
  },
  data: _ => ({
    i18n,
    isPending: false
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountDepositAddresses
    ]),
    address () {
      if (!this.token) return ''
      const externalSystemType = this.token.externalSystemType
      return this.accountDepositAddresses[externalSystemType]
    }
  },
  created () {
    this.tryBindAddress(this.token)
  },
  methods: {
    ...mapActions({
      loadAccount: vuexTypes.GET_ACCOUNT_DETAILS
    }),
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
