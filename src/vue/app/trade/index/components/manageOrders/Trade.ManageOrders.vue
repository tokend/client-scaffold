<template>
  <div class="manage-orders">
    <md-card>
      <md-card-header>
        <h2 class="md-title">{{ i18n.trd_manage({ pair: `${assets.base}/${assets.quote}` }) }}</h2>
      </md-card-header>
      <md-card-content>
        <template v-if="reversedUserOffers.length">
          <md-table md-card class="manage-orders__table md-elevation-0">
            <md-table-row class="manage-orders__row">
              <md-table-head>{{ i18n.trd_manage_date() }}</md-table-head>
              <md-table-head>{{ i18n.trd_manahe_marken() }}</md-table-head>
              <md-table-head>{{ i18n.trd_manahe_order() }}</md-table-head>
              <md-table-head>{{ i18n.trd_manage_base_asset_amount() }}</md-table-head>
              <md-table-head>{{ i18n.trd_manage_quote_asset_price() }}</md-table-head>
            </md-table-row>

            <template v-for="(order, i) in reversedUserOffers">
              <md-table-row class="manage-orders__row" @click="toggleDetails(i)" :key="`${i}-row`">
                <md-table-cell class="manage-orders__table-cell">{{ i18n.d(order.createdAt) }}</md-table-cell>
                <md-table-cell class="manage-orders__table-cell">{{ `${order.baseAssetCode}/${order.quoteAssetCode}` }}</md-table-cell>
                <md-table-cell class="manage-orders__table-cell">
                  {{ order.isBuy ? i18n.trd_order_buy() : i18n.trd_order_sell() }}
                </md-table-cell>
                <md-table-cell class="manage-orders__table-cell">{{ order.baseAmount }}</md-table-cell>
                <md-table-cell class="manage-orders__table-cell">{{ order.price }}</md-table-cell>
                <md-table-cell>
                  <md-button class="manage-orders__open-details-btn md-icon-button">
                    <md-icon v-if="isSelected(i)">keyboard_arrow_up</md-icon>
                    <md-icon v-else>keyboard_arrow_down</md-icon>
                  </md-button>
                </md-table-cell>

              </md-table-row>

              <md-table-row class="manage-orders__expandable-row" v-if="isSelected(i)" :key="`${i}-expand`">
                <md-table-cell colspan="7">
                  <order-details class="manage-orders__details" :tx="order"/>
                </md-table-cell>
              </md-table-row>

            </template>

          </md-table>
        </template>
        <template v-else>
          <div class="manage-orders__no-transactions">
            <md-icon class="md-size-4x">trending_up</md-icon>
            <h2>{{ i18n.trd_no_orders_history() }}</h2>
            <p>{{ i18n.trd_here_will_be_the_order_list() }}</p>
          </div>
        </template>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
  import OrderDetails from './ManageOrders.OrderDetails'
  import { i18n } from '../../../../../../js/i18n'

  export default {
    name: 'manage-orders',
    components: { OrderDetails },
    props: {
      offers: { type: Array, require: true },
      assets: { type: Object, retuqire: true }
    },
    data () {
      return {
        index: -1,
        i18n
      }
    },
    created () {
    },
    computed: {
      reversedUserOffers () {
        return this.offers.reverse()
      }
    },
    methods: {
      toggleDetails (index) {
        this.index = this.index === index ? -1 : index
      },
      isSelected (i) {
        return this.index === i
      }
    },
    watch: {

    }
  }
</script>

<style lang="scss" scoped>
  .manage-orders__details {
    max-width: 400px;
  }
  .manage-orders__row {
    cursor: pointer;
  }
  .manage-orders__no-transactions {
    padding: 24px;
    text-align: center;
  }
</style>
