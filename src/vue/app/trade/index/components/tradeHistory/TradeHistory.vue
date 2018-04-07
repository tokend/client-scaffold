<template>
  <div class="trade-history">
    <md-table md-card>
      <md-table-toolbar>
        <h2 class="md-title">Trade History</h2>
      </md-table-toolbar>

      <md-table-row>
        <md-table-head>Amount ({{ assets.base }})</md-table-head>
        <md-table-head>Price ({{ assets.quote }})</md-table-head>
        <md-table-head>Total ({{ assets.quote }})</md-table-head>
        <md-table-head>Time</md-table-head>
      </md-table-row>

      <md-table-row v-for="(item, i) in validatedTrades" v-bind:key="i" :class="`trade-history__item-status--${item.priceStatus}`">
        <template v-if="i < maxLengthOfTradeHistory">
          <md-table-cell>{{ item.baseAmount }}</md-table-cell>
          <md-table-cell class="trade-history__item-price">
            {{ item.price }}
            <template v-if="item.priceStatus === 0">
              <md-icon>call_received</md-icon>
            </template>
            <template v-if="item.priceStatus === 1">
              <md-icon>call_made</md-icon>
            </template>
          </md-table-cell>
          <md-table-cell class="trade-history__item-total">{{ item.baseAmount * item.price }}</md-table-cell>
          <md-table-cell class="trade-history__item-date">{{ toValidDate(item.createdAt) }}</md-table-cell>
        </template>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { vuexTypes } from '../../../../../../vuex/types'

  export default {
    name: 'trade-history',
    props: {
      assets: {
        type: Object,
        require: true
      }
    },
    data () {
      return {
        maxLengthOfTradeHistory: 10
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
        let trades = this.trades
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
    methods: {
      toValidDate (date) {
        return new Date(date).toLocaleString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: true
        })
      }
    },
    watch: {

    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../../../../scss/variables";

  .md-table-cell {
    font-size: 12px;
    height: 28px;
  }
  .md-table-cell-container {
    padding: 0 12px;
  }
  .md-card {
    height: 100%;
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
  }
</style>
