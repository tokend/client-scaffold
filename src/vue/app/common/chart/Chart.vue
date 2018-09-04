<template>
  <div class="chart">
    <scale-tabs
      v-if="isActualData && historyHasValue"
      class="chart__tabs"
      v-model="scale"
      :value="scale"
      :is-pending="isLoading"
    />
    <chart-renderer
      class="chart__renderer"
      :scale="scale"
      :has-value="isActualData && historyHasValue"
      :is-loading="isLoading"
      :data="history"
      :precision="common.precision"
    />
  </div>
</template>

<script>
import ChartRenderer from './Chart.Renderer'
import ScaleTabs from './Chart.Tabs'

import { chartsService } from '@/js/services/charts.service'
import { errors } from '@/js/errors/factory'
import config from '@/config'

export default {
  name: 'chart',

  components: {
    ChartRenderer,
    ScaleTabs
  },
  props: {
    baseAsset: { type: String, required: true },
    quoteAsset: { type: String, required: true },
    initialScale: { type: String, default: 'month' }
  },
  data: _ => ({
    data: {},
    isActualData: false,
    isLoading: false,
    scale: 'month',
    common: {
      precision: config.DECIMAL_POINTS,
      defaultQuoteAsset: config.DEFAULT_QUOTE_ASSET
    }
  }),
  computed: {
    history () {
      if (!this.data[this.scale]) return []
      return this.data[this.scale]
    },
    historyHasValue () {
      let valueIsPresent = false
      this.history.map(item => {
        if (!valueIsPresent) {
          item.value > 0
            ? valueIsPresent = true
            : valueIsPresent = false
        }
      })
      return valueIsPresent
    },
    lockedAssets () {
      return { base: this.baseAsset, quote: this.quoteAsset }
    }
  },
  watch: {
    async lockedAssets (value) {
      await this.loadPrices()
    }
  },
  async created () {
    await this.loadPrices()
    this.scale = this.initialScale
  },
  methods: {
    async loadPrices () {
      this.isLoading = true
      try {
        this.isActualData = true
        this.data = (await chartsService.loadChartsForTokenPair(
          this.lockedAssets.base,
          this.lockedAssets.quote)
        ).data()
      } catch (error) {
        if (error instanceof errors.NotFoundError) {
          this.isActualData = false
          this.data = {
            day: this.generateRandomData(),
            week: this.generateRandomData(),
            hour: this.generateRandomData(),
            month: this.generateRandomData(),
            year: this.generateRandomData()
          }
        }
      }
      this.isLoading = false
    },
    generateRandomData () {
      return [{ value: '0', timestamp: new Date().toString() }]
    }
  }
}
</script>

<style lang="scss">
  .chart {
    flex: 1;
  }

  .chart__tabs {
    margin-bottom: 24px;
    display: flex;
    justify-content: flex-end;
  }
</style>
