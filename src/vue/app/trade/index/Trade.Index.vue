<template>
  <div class="trade">
    <div class="md-layout">
      <chart class="trade__chart md-size-50 md-medium-size-45 md-small-size-100 md-layout-item"
        :data="history"
        :pairs="formattedPairs"
        :precision="common.precision"
        :assets="customAssetPair"
        v-on:assets-base-changed="handleAssetChange"
        v-on:assets-quote-changed="handleAssetChange"
      />
      <trade-history :assets="filters" class="md-layout-item md-size-48 md-medium-size-55 md-small-size-100"/>
    </div>

    <div class="md-layout">
      <orders :assets="filters" class="md-layout-item md-size-100"/>
    </div>

    <div class="md-layout">
      <trade-orders :assets="filters" class="md-layout-item md-size-100"/>
    </div>

    <div class="md-layout">
      <manage-orders :assets="filters" :offers="userOffers" class="md-layout-item md-size-100"/>
    </div>

  </div>
</template>

<script>
  import Chart from './components/chart/Trade.ChartWidget'
  import TradeHistory from './components/tradeHistory/Trade.TradeHistory'
  import TradeOrders from './components/tradeOrders/Trade.TradeOrders'
  import Orders from './components/orders/Trade.Orders'
  import ManageOrders from './components/manageOrders/Trade.ManageOrders'

  import { chartsService } from '../../../../js/services/charts.service'
  import { errors } from '../../../../js/errors/factory'
  import config from '../../../../config'

  import { mapGetters, mapActions } from 'vuex'
  import { vuexTypes } from '../../../../vuex/types'
  import { attachEventHandler } from '../../../../js/events/helpers'
  import { commonEvents } from '../../../../js/events/common_events'
  import { ErrorHandler } from '../../../../js/errors/error_handler'

  export default {
    name: 'trade-index',
    components: {
      Chart,
      TradeHistory,
      TradeOrders,
      Orders,
      ManageOrders
    },
    data: _ => ({
      history: {},
      tokenCode: '',
      filters: {
        base: '',
        quote: ''
      },
      customAssetPair: '',
      common: {
        precision: config.DECIMAL_POINTS
      }
    }),
    async created () {
      await this.loadPairs()
      await this.loadData(this.tradablePairs[0])
      attachEventHandler(commonEvents.changePairsAsset, this.handleAssetChange)
      attachEventHandler(commonEvents.cancelOrder, this.handleCancelOrder)
      attachEventHandler(commonEvents.createdOrder, this.handleCreatedOffer)
      this.filters.base = this.formattedPairs[0].split('/')[0]
      this.filters.quote = this.formattedPairs[0].split('/')[1]
      this.customAssetPair = this.formattedPairs[0]
    },
    computed: {
      ...mapGetters([
        vuexTypes.tradablePairs,
        vuexTypes.userOffers
      ]),
      formattedPairs () {
        return this.tradablePairs.map((el) => {
          return `${el.base}/${el.quote}`
        })
      }
    },
    methods: {
      ...mapActions({
        loadPairs: vuexTypes.GET_ASSET_PAIRS,
        loadOrders: vuexTypes.GET_SM_OFFERS,
        loadTrades: vuexTypes.GET_TRADES,
        loadUserOffers: vuexTypes.GET_USER_OFFERS
      }),
      async loadData (pair) {
        await Promise.all([
          this.loadOrders(pair),
          this.loadPrices(pair),
          this.loadTrades(pair),
          this.loadUserOffers(pair)
        ])
      },
      async loadPrices ({base, quote}) {
        try {
          this.history = (await chartsService.loadChartsForTokenPair(base, quote)).data()
        } catch (error) {
          if (error instanceof errors.NotFoundError) {
            console.log('error')
            ErrorHandler.processUnexpected(error)
          }
        }
      },
      handleAssetChange (payload) {
        this.filters.base = payload.split('/')[0]
        this.filters.quote = payload.split('/')[1]
        this.customAssetPair = payload
        this.loadData(this.filters)
      },
      handleCancelOrder () {
        this.loadData(this.filters)
      },
      handleCreatedOffer () {
        this.loadData(this.filters)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../scss/variables';
  @import '../../../../scss/mixins';

  .transfer__success-msg {
    text-align: center;
  }

  .md-layout {
    &:not(:last-child) {
      margin-bottom: 24px;
    }
  }

  .transfer__success-amount {
    color: $col-md-primary;
    font-size: $fs-heading;
    margin: 1rem 0 .5rem;
  }
</style>
