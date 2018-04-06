<template>
  <div class="trade md-layout md-alignment-center-center">
    <chart class="trade__chart"
      :data="history"
      :needStats="false"
      :precision="common.precision"
      :assets="filters"
      v-on:assets-base-changed="priceHistoryAssetsChanged($event)"
      v-on:assets-quote-changed="priceHistoryAssetsChanged($event)"
    />

    <!-- <info-widget :currentAsset="'BTC'" class="md-layout-item"></info-widget> -->

  </div>
</template>

<script>
  import Chart from '../chart/Chart'
  import InfoWidget from './Trade.InfoWidget'

  import { chartsService } from '../../../../js/services/charts.service'
  import { errors } from '../../../../js/errors/factory'
  import config from '../../../../config'

  import { mapGetters } from 'vuex'
  import { vuexTypes } from '../../../../vuex/types'
  import { RecordTypes } from '../../../../js/records/types'
  import { DEFAULT_SELECTED_ASSET, DEFAULT_BASE_ASSET } from '../../../../js/const/configs.const'
  import { attachEventHandler } from '../../../../js/events/helpers'
  import { commonEvents } from '../../../../js/events/common_events'
  import get from 'lodash/get'

  export default {
    name: 'trade-index',
    components: { Chart, InfoWidget },
    data: _ => ({
      history: {},
      tokenCode: DEFAULT_SELECTED_ASSET,
      filters: {
        base: DEFAULT_SELECTED_ASSET,
        quote: DEFAULT_BASE_ASSET
      },
      common: {
        precision: config.DECIMAL_POINTS
      },
      assetPairs: null
    }),
    created () {
      this.getPriceHistory()
      attachEventHandler(commonEvents.changePairsAsset, this.priceHistoryAssetsChanged)
    },
    computed: {
      ...mapGetters([
        vuexTypes.transactions,
        vuexTypes.userWalletTokens
      ]),
      list () {
        return (get(this.transactions, `${this.tokenCode}.records`) || [])
          .reduce((list, item) => {
            if (item instanceof RecordTypes.MatchRecord) {
              item.transactions.forEach(tx => { list.push(tx) })
              return list
            }
            list.push(item)
            return list
          }, [])
      }
    },
    methods: {
      async getPriceHistory () {
        try {
          this.history = (await chartsService.loadChartsForTokenPair(this.filters.base, this.filters.quote)).data()
        } catch (error) {
          if (error instanceof errors.NotFoundError) {
            console.log('error')
          }
        }
      },
      priceHistoryAssetsChanged (payload) {
        this.filters.base = payload.base
        this.filters.quote = payload.quote
        this.getPriceHistory()
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

  .transfer__success-amount {
    color: $col-md-primary;
    font-size: $fs-heading;
    margin: 1rem 0 .5rem;
  }
</style>
