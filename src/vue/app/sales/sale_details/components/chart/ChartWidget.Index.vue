<template>
  <div class="chart-container">
    <md-card-header class="chart-container__header">
      <div class="md-title chart-container__title">{{ i18n.trd_market_price() }}</div>
    </md-card-header>

    <md-card-content>
      <div class="chart-container__main">

        <div class="md-layout md-alignment-center-space-between chart-container__labels">
          <scale-tabs
            :asset="asset"
            v-model="scale"
            :isPending="isPending"
          />
        </div>

        <d3-chart :data="history" :currency="asset" :scale="scale" :isPending="isPending" :precision="precision" v-if="history.length" :requiredTicks="requiredTicks"/>
        <div class="chart-container__loader" v-else>Loading...</div>

      </div>
    </md-card-content>
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
      asset: { type: String, required: false },
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
        tokenCode: null
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
      },
      balance () {
        return this.accountBalances[this.tokenCode]
      }
    },
    methods: {
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../../../../scss/mixins";
  @import "../../../../../../scss/variables";

  .chart-container__loader {
    text-align: center;
  }

  .chart-container__labels {
    margin-bottom: 1rem;
    @include respond-to-custom(1000px) {
      flex-direction: column-reverse;
      align-items: flex-start;
    }
  }

  .chart-container__assets-select {
    @include respond-to-custom(1220px) {
      position: absolute;
      top: 8px;
      right: 30px;
    }
  }

  .chart-container__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .chart-container__title {
    .chart-container__header &:first-child {
      margin-top: 0;
    }
  }

  .chart-container__user-balance {
    color: $col-text-secondary;
  }
</style>
