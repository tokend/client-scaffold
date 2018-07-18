<template>
  <div class="dashboard-cart">
    <template v-if="isActualData && historyHasValue">
      <chart :scale="scale" :currency="currency" :data="history" :precision="common.precision"/>
    </template>
    <template v-else>
      <div class="dashboard-cart__no-message">Current asset doesn't have volume yet</div>
    </template>
  </div>
</template>

<script>
  import { chartsService } from '../../../../js/services/charts.service'
  import { errors } from '../../../../js/errors/factory'
  import { ErrorHandler } from '../../../../js/errors/error_handler'
  import config from '../../../../config'
  import { commonEvents } from '../../../../js/events/common_events'

  import Chart from './Dashboard.ChartRenderer'

  export default {
    name: 'dashboard-chart',
    components: {
      Chart
    },
    props: {
      currency: { type: String, default: 'USD' },
      scale: { type: String, required: true }
    },
    data: _ => ({
      data: {},
      isActualData: false,
      common: {
        precision: config.DECIMAL_POINTS
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
          if (!valueIsPresent) item.value > 0 ? valueIsPresent = true : valueIsPresent = false
        })
        return valueIsPresent
      }
    },
    async created () {
      await this.loadPrices(this.currency)
    },
    methods: {
      async loadPrices (asset) {
        try {
          this.isActualData = true
          this.data = (await chartsService.loadChartsForToken(asset)).data()
        } catch (error) {
          if (error instanceof errors.NotFoundError) {
            this.isActualData = false
            console.log('error')
            ErrorHandler.processUnexpected(error)
          }
        }
      }
    },
    watch: {
      async currency (value) {
        await this.loadPrices(value)
      },
      historyHasValue (value) {
        this.$emit(commonEvents.checkDashboardChartHasValue, this.isActualData && value)
      },
      isActualData (value) {
        this.$emit(commonEvents.checkDashboardChartHasValue, this.historyHasValue && value)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@scss/variables';

  .dashboard-cart__no-message {
    text-align: center;
    font-size: 24px;
    margin: 24px 0;
    color: $col-md-primary;
  }
</style>
