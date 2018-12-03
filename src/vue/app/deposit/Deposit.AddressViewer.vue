<template>
  <div class="deposit.address-viewer">
    <p class="app__page-explanations deposit__warn-msg">
      {{
        i18n.dep_ready_cp({
          asset: asset,
          amount: i18n.c(amount)
        })
      }}
    </p>

    <div class="app__form-row">
      <clipboard-field
        :value="address"
        :label="i18n.dep_where_to({ asset })"
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

    <div class="deposit__timeout-ticker-wrp">
      <timeout-ticker
        class="deposit__timeout-ticker"
        :timeout="timeout"
      />

      <p class="deposit__timeout-warn">
        {{ i18n.dep_timeout_warn() }}
      </p>
    </div>
  </div>
</template>

<script>
import TimeoutTicker from './TimeoutTicker'
import ClipboardField from '../../common/fields/ClipboardField'
import Qrcode from 'vue-qrcode-component'

import { i18n } from '@/js/i18n'

export default {
  components: {
    TimeoutTicker,
    ClipboardField,
    Qrcode
  },
  props: {
    asset: {
      type: String,
      required: true
    },
    amount: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    timeout: {
      type: [String, Number],
      required: true
    }
  },
  data: _ => ({
    i18n
  })
}
</script>

<style lang="scss" scoped>
@import "./deposit";
</style>
