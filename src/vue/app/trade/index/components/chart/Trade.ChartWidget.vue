<template>

  <md-card>
    <md-card-header>
      <div class="md-title">{{ i18n.trd_market_price() }}</div>
    </md-card-header>

    <md-card-content>
      <div class="chart-container">

        <div class="md-layout md-alignment-center-space-between">
          <scale-tabs class="md-layout-item md-size-50"
            :asset="assets"
            v-model="scale"
            :isPending="isPending"
          />
          <assets-select class="md-layout-item md-size-35"
            :pairs="pairs"
            :assets="assets"
          />
        </div>

        <d3-chart :data="history" :currency="assets.split('/')[1]" :scale="scale" :isPending="isPending" :precision="precision" v-if="history.length" :requiredTicks="requiredTicks"/>
        <div class="chart-container__loader" v-else>Loading...</div>

      </div>
    </md-card-content>
  </md-card>

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
  .chart-container__loader {
    text-align: center;
  }
</style>
