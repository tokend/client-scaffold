<template>
  <div class="dashboard-cart">
    <chart :scale="scale"
          :has-value="isActualData && historyHasValue"
          :currency="currency"
          :data="history"
          :precision="common.precision"/>
  </div>
</template>

<script>
  import { chartsService } from '../../../../js/services/charts.service'
  import { errors } from '../../../../js/errors/factory'
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
      if (this.currency) await this.loadPrices(this.currency)
    },
    methods: {
      async loadPrices (asset) {
        try {
          this.isActualData = true
          this.data = (await chartsService.loadChartsForToken(asset)).data()
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
      },
      generateRandomData () {
        return [{ value: '0', timestamp: new Date().toString() }]
      }
    },
    watch: {
      async currency (value) {
        if (value) await this.loadPrices(value)
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
