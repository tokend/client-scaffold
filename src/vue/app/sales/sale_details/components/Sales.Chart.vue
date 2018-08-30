<template>
  <div class="sale-chart-container">
    <template v-if="chartData">
      <chart
        class="sale-chart"
        :data="chartData"
        :precision="common.precision"
        :asset="sale.defaultQuoteAsset"
      />
    </template>

    <template v-else>
      <p class="text danger">
        {{ i18n.cm_error_occured() }}
      </p>
    </template>
  </div>
</template>

<script>
import Chart from './chart/ChartWidget.Index'
import { chartsService } from '../../../../../js/services/charts.service'
import { i18n } from '../../../../../js/i18n'
import { ErrorHandler } from '../../../../../js/errors/error_handler'
import { errors } from '../../../../../js/errors/factory'
import config from '../../../../../config'
export default {
  components: {
    Chart
  },
  props: ['sale'],
  data: _ => ({
    chartData: {},
    common: {
      precision: config.DECIMAL_POINTS
    },
    i18n
  }),
  async created () {
    await this.loadData(this.sale.baseAsset)
  },
  methods: {
    async loadData (asset) {
      try {
        this.chartData = (await chartsService.loadChartsForToken(asset)).data()
      } catch (error) {
        if (error instanceof errors.NotFoundError) {
          console.log('error')
          ErrorHandler.processUnexpected(error)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../../../../scss/variables';
  @import '../../../../../scss/mixins';
</style>
