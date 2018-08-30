<template>
  <div class="app__card trade-history">
    <template v-if="validatedTrades.length">
      <md-table class="trade-history__table">
        <md-table-toolbar>
          <h2 class="md-title">{{ i18n.trd_history() }}</h2>
        </md-table-toolbar>

        <md-table-row>
          <md-table-head>{{ i18n.trd_history_amount({ asset: assets.base }) }}</md-table-head>
          <md-table-head>{{ i18n.trd_history_price({ asset: assets.quote }) }}</md-table-head>
          <md-table-head>{{ i18n.trd_history_total({ asset: assets.quote }) }}</md-table-head>
          <md-table-head>{{ i18n.trd_history_time() }}</md-table-head>
        </md-table-row>

        <md-table-row
          v-for="(item, i) in validatedTrades"
          :key="`${i}-trade-history-item`"
          :class="`trade-history__item-status--${item.priceStatus}`">
          <template v-if="i < maxLengthOfTradeHistory">
            <md-table-cell>{{ i18n.c(item.baseAmount) }}</md-table-cell>
            <md-table-cell class="trade-history__item-price">
              {{ i18n.c(item.price) }}
              <template v-if="item.priceStatus === 0">
                <md-icon>call_received</md-icon>
              </template>
              <template v-if="item.priceStatus === 1">
                <md-icon>call_made</md-icon>
              </template>
            </md-table-cell>
            <md-table-cell class="trade-history__item-total">{{ i18n.c(multiply(item.baseAmount, item.price)) }}</md-table-cell>
            <md-table-cell class="trade-history__item-date">{{ toValidDate(item.createdAt) }}</md-table-cell>
          </template>
        </md-table-row>
      </md-table>
    </template>
    <template v-else>
      <div class="trade-history--empty">
        <div class="trade-history__no-transactions">
          <md-icon class="md-size-4x">trending_up</md-icon>
          <h2>{{ i18n.trd_no_trade_history() }}</h2>
          <p>{{ i18n.trd_here_will_be_the_list() }}</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { vuexTypes } from '../../../../../../vuex/types'
import { i18n } from '../../../../../../js/i18n'
import { multiply } from '../../../../../../js/utils/math.util'

export default {
  name: 'trade-history',
  props: {
    assets: { type: Object, require: true }
  },
  data () {
    return {
      maxLengthOfTradeHistory: 10,
      i18n,
      multiply
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.trades
    ]),
    validatedTrades () {
      // priceStatus:
      // 0 === price decreased
      // 1 === price increased
      // 2 === price hasn't changed
      let trades = this.trades.reverse()
      for (let item of trades) {
        let index = trades.indexOf(item)
        if (trades.length) {
          trades['0'].priceStatus = 2
        }
        if (trades[index] !== trades['0']) {
          let prevIndex = index - 1
          if (Number(trades[index].price) > Number(trades[prevIndex].price)) {
            trades[index].priceStatus = 1
          } else if (Number(trades[index].price) === Number(trades[prevIndex].price)) {
            trades[index].priceStatus = 2
          } else {
            trades[index].priceStatus = 0
          }
        }
      }
      return trades.reverse()
    }
  },
  watch: {

  },
  methods: {
    toValidDate (date) {
      return new Date(date).toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../../../../scss/variables";
  @import "../../../../../../scss/mixins";

  .md-table-cell {
    font-size: 12px;
    height: 28px;
    border-top: 0;
    padding-left: 15px;

    @include respond-to-custom(1340px) {
      padding-left: 0;
    }
  }
  .trade-history__table {
    padding-bottom: 16px;
  }
  .md-table-cell-container {
    padding: 0 12px;
  }

  .trade-history {
    @include respond-to-custom(944px) {
      margin-top: 24px;
    }
  }

  .trade-history__item-price,
  .trade-history__item-total,
  .trade-history__item-price .md-icon,
  .trade-history__item-total .md-icon {
    .trade-history__item-status--1 & {
      color: $green;
    }
    .trade-history__item-status--0 & {
      color: $red;
    }
  }
  .trade-history__item-date {
    min-width: 100px;
  }

  .trade-history__item-price .md-icon {
    font-size: 14px !important;

    @include respond-to-custom(620px) {
      position: absolute;
      right: -8px;
      top: 1px;
    }
  }
  .trade-history__no-transactions {
    text-align: center;
    padding: 1rem;
    .md-icon {
      margin-bottom: 1rem;
    }

    p {
      margin-top: 10px;
    }
  }
  .trade-history--empty {
    display: flex;
    align-items: center;
    justify-content: center;
  }

</style>
