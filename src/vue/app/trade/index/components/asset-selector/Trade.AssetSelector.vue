<template>
  <div class="assets-select">
    <template v-if="pairs.length">
      <select-field-custom
        class="assets-select__select"
        v-model="currentAsset"
        :label="i18n.lbl_asset()"
        :values="pairs"
        :key="currentAsset"/>
    </template>

    <div class="asset-select__balances">
      <p class="asset-select__balances-label">
        {{ i18n.trd_balance_label() }}
      </p>
      <p class="asset-select__balances-value">
        {{ i18n.trd_balance({base: baseAmount, quote: quoteAmount}) }}
      </p>
    </div>
  </div>
</template>

<script>
import SelectFieldCustom from '@/vue/common/fields/SelectFieldCustom'

import { dispatchAppEvent } from '../../../../../../js/events/helpers'
import { commonEvents } from '../../../../../../js/events/common_events'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex/types'
import { i18n } from '@/js/i18n'

export default {
  components: { SelectFieldCustom },
  props: {
    // assets: { type: String, required: false },
    pairs: { type: Array, require: true, default: [] }
  },
  data () {
    return {
      currentAsset: '',
      baseAmount: '',
      quoteAmount: '',
      i18n
    }
  },
  created () {
    this.currentAsset = this.currentAsset || this.pairs[0] || null
    // console.log(this.currentAsset)
  },
  mounted () {
  },
  computed: {
    // computedPropAssets () {
    //   return this.assets
    // },
    ...mapGetters([
      // vuexTypes.userWithdrawableTokens,
      vuexTypes.accountBalances
    ])
  },
  watch: {
    'currentAsset' (value) {
      dispatchAppEvent(commonEvents.changePairsAsset, value)
      this.handleAssetChange(value)
    }
    // computedPropAssets (val) {
    //   this.currentAsset = val
    // }
  },
  methods: {
    handleAssetChange (payload) {
      const base = payload.split('/')[0]
      const quote = payload.split('/')[1]
      const baseBalance = this.accountBalances[base]
      this.baseAmount = baseBalance ? `${i18n.c(baseBalance.balance)} ${base}` : `${i18n.c(0)} ${base}`
      this.quoteAmount = `${i18n.c(this.accountBalances[quote].balance)} ${quote}`
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
.assets-select__select {
  display: inline-block;
  width: auto;
  &:not(:last-child) {
    margin-right: 1.5 * $point;
  }
}

.asset-select__balances {
  margin: 2 * $point 0 4 * $point;

  .asset-select__balances-label {
    font-size: 1.2 * $point;
    color: $col-md-primary-inactive;
  }

  .asset-select__balances-value {
    font-size: 1.8 * $point;
    color: $col-md-primary;
  }
}
</style>
