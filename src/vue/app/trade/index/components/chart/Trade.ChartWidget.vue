<template>
  <div>
    <md-card>
      <md-card-header class="chart-container__header">
        <div class="md-title chart-container__title">{{ i18n.trd_market_price() }}</div>
        <div class="chart-container__user-balance">
          {{ i18n.withdraw_balance({ balance: balance.balance, token: tokenCode }) }}
        </div>
      </md-card-header>

      <md-card-content>
        <div class="chart-container">

          <div class="md-layout md-alignment-center-space-between chart-container__labels">
            <scale-tabs class="md-layout-item md-size-70 md-small-size-100"
              :asset="assets"
              v-model="scale"
              :isPending="isPending"
            />
            <div class="md-layout-item md-size-25 md-medium-size-30 chart-container__assets-select">
              <assets-select
                :pairs="pairs"
                :assets="assets"
              />
            </div>
          </div>

          <d3-chart :data="history" :currency="assets.split('/')[1]" :scale="scale" :isPending="isPending" :precision="precision" v-if="history.length" :requiredTicks="requiredTicks"/>
          <div class="chart-container__loader" v-else>Loading...</div>

        </div>
      </md-card-content>
    </md-card>
  </div>

</template>

<script>
  import D3Chart from './ChartWidget.ChartRenderer'
  import ScaleTabs from './ChartWidget.DateTabs'
  import AssetsSelect from './ChartWidget.AssetsSelect'
  import { i18n } from '../../../../../../js/i18n'
  import { mapGetters } from 'vuex'
  import { vuexTypes } from '../../../../../../vuex/types'

  export default {
    name: 'chart',

    components: {
      ScaleTabs,
      D3Chart,
      AssetsSelect
    },

    props: {
      data: { type: Object, required: true },
      assets: { type: String, required: false },
      action: { type: String, default: 'issued' },
      currentCap: { type: [String, Number], required: false },
      hardCap: { type: [String, Number], required: false },
      softCap: { typ: [String, Number], required: false },
      precision: { type: Number, default: 0 },
      pairs: { type: Array, require: true, default: [] }
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
