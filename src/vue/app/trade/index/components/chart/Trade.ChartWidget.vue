<template>
  <div class="app__card">
    <template v-if="!assets">
      <div class="app__no-data-msg">
        <div class="app__card-content">
          <md-icon class="md-size-4x">send</md-icon>
          <h2>{{ i18n.trd_no_pairs() }}</h2>
          <p>{{ i18n.trd_no_pairs_exp() }}</p>
        </div>
      </div>
    </template>

    <div v-else>
      <div class="chart-container__header">
        <div class="md-title chart-container__title">{{ i18n.trd_market_price() }}</div>
      </div>

      <div class="app__card-content">
        <div class="chart-container">

          <div class="md-layout md-alignment-center-space-between chart-container__tabs">
            <scale-tabs
              class="md-layout-item md-size-70 md-small-size-100"
              :asset="assets"
              v-model="scale"
              :is-pending="isPending"
            />
          </div>

          <d3-chart
            :data="history"
            :currency="assets.split('/')[1]"
            :scale="scale"
            :is-pending="isPending"
            :precision="precision"
            v-if="history.length"
            :required-ticks="requiredTicks" />
          <div
            class="chart-container__loader"
            v-else>Loading...</div>

        </div>
      </div>
    </div>
  </div>

</template>

<script>
import D3Chart from './ChartWidget.ChartRenderer'
import ScaleTabs from './ChartWidget.DateTabs'
import { i18n } from '../../../../../../js/i18n'
import { mapGetters } from 'vuex'
import { vuexTypes } from '../../../../../../vuex/types'

export default {
  name: 'chart',

  components: {
    ScaleTabs,
    D3Chart
  },

  props: {
    data: { type: Object, required: true },
    assets: { type: String, required: false },
    action: { type: String, default: 'issued' },
    currentCap: { type: [String, Number], required: false },
    hardCap: { type: [String, Number], required: false },
    softCap: { typ: [String, Number], required: false },
    precision: { type: Number, default: 0 }
  },

  data () {
    return {
      scale: 'month',
      isPending: false,
      i18n,
      tokenCode: null,
      baseAmount: '',
      quoteAmount: ''
    }
  },

  created () {
    this.tokenCode = this.tokenCodes[0] || null
  },

  computed: {
    ...mapGetters([
      vuexTypes.userWithdrawableTokens,
      vuexTypes.accountBalances
    ]),
    tokenCodes () {
      return this.userWithdrawableTokens.map(token => token.code)
    },
    history () {
      if (!this.data[this.scale]) return []
      return this.data[this.scale]
    },
    requiredTicks () {
      return [this.softCap, this.hardCap].filter(value => value)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../../../../scss/mixins";
  @import "../../../../../../scss/variables";

  .chart-container__loader {
    text-align: center;
  }

.chart-container__tabs {
    margin-bottom: 4.5 * $point;
    @include respond-to-custom(1000px) {
      flex-direction: column-reverse;
      align-items: flex-start;
    }
  }

  .chart-container__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 1rem 1rem 0;
  }

  .chart-container__title {
    .chart-container__header &:first-child {
      margin-top: 0;
    }
  }

  .chart-container__user-balance {
    font-size: 0.75rem;
    color: $col-text-secondary;
  }
</style>
