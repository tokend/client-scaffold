<template>
  <div>
    <template v-if="!assets">
      <div class="app__no-data-msg">
        <md-card class="md-layout-item
                      md-size-100">
          <md-card-content>
            <md-icon class="md-size-4x">send</md-icon>
            <h2>{{ i18n.trd_no_pairs() }}</h2>
            <p>{{ i18n.trd_no_pairs_exp() }}</p>
          </md-card-content>
        </md-card>
      </div>
    </template>

    <md-card v-else>
      <md-card-header>
        <div class="md-title">{{ i18n.trd_market_price() }}</div>
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
        i18n
      }
    },

    computed: {
      history () {
        if (!this.data[this.scale]) return []
        return this.data[this.scale]
      },
      requiredTicks () {
        return [this.softCap, this.hardCap].filter(value => value)
      }
    },
    methods: {
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../../../../scss/mixins";

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
</style>
