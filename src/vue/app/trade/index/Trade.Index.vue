<template>
  <div class="trade">
    <asset-selector v-if="formattedPairs.length" :pairs="formattedPairs"/>
    <div class="trade-row app__card-wrapper app__card-wrapper--xmedium-breakpoint">
      <chart class="trade__chart"
        :data="history"
        :precision="common.precision"
        :assets="customAssetPair"
      />
      <trade-history :assets="filters" class="trade__history"/>
    </div>

    <div class="md-layout">
      <orders class="md-layout-item md-size-100"/>
    </div>

    <div class="md-layout">
      <trade-orders :assets="filters" class="md-layout-item md-size-100"/>
    </div>

    <div class="md-layouts">
      <manage-orders :assets="filters" :offers="userOffers" class="md-layout-item md-size-100"/>
    </div>

  </div>
</template>

<script>
  import AssetSelector from './components/asset-selector/Trade.AssetSelector'
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
      ManageOrders,
      AssetSelector
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
        if (!pair) return
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
  $large-breakpoint: 1374px;
  $medium-breakpoint: 1374px;

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

  .trade-row {
    display: flex;
    margin-bottom: 1.5rem;
  }

  .trade__chart {
    @include respond-to-custom($large-breakpoint) {
      margin-bottom: 1.5rem;
    }
    @include respond-to-custom($medium-breakpoint) {
      margin-bottom: 0;
    }
  }
</style>
