<template>
  <div class="trade">
    <div class="md-layout">
      <chart class="trade__chart md-size-50 md-layout-item"
        :data="history"
        :baseAssets="baseAssets"
        :quoteAssets="quoteAssets"
        :needStats="false"
        :precision="common.precision"
        :assets="filters"
        v-on:assets-base-changed="handleAssetChange"
        v-on:assets-quote-changed="handleAssetChange"
      />
      <trade-history :assets="filters" class="md-layout-item md-size-48"/>
    </div>

    <div class="md-layout">
      <trade-orders :assets="filters" class="md-layout-item"/>
    </div>

    <div class="md-layout">
      <orders :assets="filters" class="md-layout-item"/>
    </div>

    <div class="md-layout">
      <manage-orders :offers="userOffers" class="md-layout-item"/>
    </div>

  </div>
</template>

<script>
  import Chart from './components/chart/Chart'
  import TradeHistory from './components/tradeHistory/TradeHistory'
  import TradeOrders from './components/tradeOrders/TradeOrders'
  import Orders from './components/orders/Orders'
  import ManageOrders from './components/manageOrders/ManageOrders'

  import { chartsService } from '../../../../js/services/charts.service'
  import { errors } from '../../../../js/errors/factory'
  import config from '../../../../config'

  import { mapGetters, mapActions } from 'vuex'
  import { vuexTypes } from '../../../../vuex/types'
  import { attachEventHandler } from '../../../../js/events/helpers'
  import { commonEvents } from '../../../../js/events/common_events'

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
      common: {
        precision: config.DECIMAL_POINTS
      }
    }),
    async created () {
      await this.loadPairs()
      await this.loadData(this.assetPairs[0])
      await this.loadUserOffers()
      attachEventHandler(commonEvents.changePairsAsset, this.handleAssetChange)
      attachEventHandler(commonEvents.cancelOrder, this.handleCancelOrder)
      attachEventHandler(commonEvents.createdOrder, this.handleCreatedOffer)
      this.filters.base = this.baseAssets[0]
      this.filters.quote = this.quoteAssets[0]
    },
    computed: {
      ...mapGetters([
        vuexTypes.assetPairs,
        vuexTypes.userOffers
      ]),
      baseAssets () {
        let arr = []
        if (this.assetPairs !== null) {
          for (let el of this.assetPairs) {
            if (!arr.some(item => item === el.base)) {
              arr.push(el.base)
            }
          }
        }
        return arr
      },
      quoteAssets () {
        let arr = []
        if (this.assetPairs !== null) {
          for (let el of this.assetPairs) {
            if (this.filters.base === el.base) {
              arr.push(el.quote)
            }
          }
        }
        return arr
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
          this.loadTrades(pair)
        ])
      },
      async loadPrices ({base, quote}) {
        try {
          this.history = (await chartsService.loadChartsForTokenPair(base, quote)).data()
        } catch (error) {
          if (error instanceof errors.NotFoundError) {
            console.log('error')
          }
        }
      },
      handleAssetChange (payload) {
        this.filters.base = payload.base
        this.filters.quote = payload.quote
        this.loadData(this.filters)
      },
      handleCancelOrder () {
        this.loadUserOffers()
        this.loadData(this.filters)
      },
      handleCreatedOffer () {
        this.loadUserOffers()
        this.loadData(this.filters)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../scss/variables';

  .transfer__success-msg {
    text-align: center;
  }

  .trade__chart {
    width: 534px;
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
