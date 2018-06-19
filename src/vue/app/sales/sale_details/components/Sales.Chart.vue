<template>
  <div class="fund-chart">
    <template v-if="chartData">
      <chart class="trade__chart"
        :data="chartData"
        :precision="common.precision"
        :asset="sale.baseAsset"
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
    name: 'chart-tab',

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

  .fund-chart {
    margin-top: 1.65rem;
    border: 1px solid rgba(0, 0, 0, .26);
    @include respond-to(medium) {
      margin-top: 0;
    }
  }
</style>
