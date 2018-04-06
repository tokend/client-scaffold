<template>

  <md-card>
    <md-card-header>
      <div class="md-title">Market price</div>
    </md-card-header>

    <md-card-content>
      <div class="chart-container">

        <div class="md-layout md-alignment-center-space-between">
          <scale-tabs class="md-layout-item md-size-50" v-model="scale" :isPending="isPending"/>
          <assets-select class="md-layout-item md-size-35"/>
        </div>

        <statistics-widget v-if="needStats"
          :data="history.map(item => item.value)"
          :asset="assets.quote"
          :action="action"
          :currentCap="currentCap"
          :scale="scale" :isPending="isPending"
        />

        <d3-chart :data="history" :currency="assets.quote" :scale="scale" :isPending="isPending" :precision="precision" v-if="history.length" :requiredTicks="requiredTicks"/>
        <div class="chart-container__loader" v-else>Loading...</div>

      </div>
    </md-card-content>
  </md-card>

</template>

<script>
  import D3Chart from './D3ChartRenderer'
  import StatisticsWidget from './StatisticsWidget'
  import ScaleTabs from './DateTabs'
  import AssetsSelect from './AssetsSelect'

  export default {
    name: 'chart',

    components: {
      ScaleTabs,
      D3Chart,
      StatisticsWidget,
      AssetsSelect
    },

    props: {
      data: {
        type: Object,
        required: true
      },
      assets: {
        type: Object,
        required: false
      },
      action: {
        type: String,
        default: 'issued'
      },
      currentCap: {
        type: [String, Number],
        required: false
      },
      needStats: {
        type: Boolean,
        default: true
      },
      hardCap: {
        type: [String, Number],
        required: false
      },
      softCap: {
        typ: [String, Number],
        required: false
      },
      precision: {
        type: Number,
        default: 0
      }
    },

    data () {
      return {
        scale: 'month',
        isPending: false
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
