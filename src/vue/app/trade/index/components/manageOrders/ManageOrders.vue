<template>
  <div class="manage-orders">
    <md-card>
      <md-card-header>
        <h2 class="md-title">Manage orders</h2>
      </md-card-header>
      <md-card-content>
        <md-table md-card class="manage-orders__table md-elevation-0">
          <md-table-row class="manage-orders__row">
            <md-table-head>Data</md-table-head>
            <md-table-head>Marken</md-table-head>
            <md-table-head>Order</md-table-head>
            <md-table-head>Base asset amount</md-table-head>
            <md-table-head>Price in quote asset</md-table-head>
          </md-table-row>

          <template v-for="(order, i) in reversedUserOffers">
            <md-table-row class="manage-orders__row" @click="toggleDetails(i)" v-bind:key="`${i}-row`">
              <md-table-cell class="manage-orders__table-cell">{{ i18n.d(order.createdAt) }}</md-table-cell>
              <md-table-cell class="manage-orders__table-cell">{{ `${order.baseAssetCode}/${order.quoteAssetCode}` }}</md-table-cell>
              <md-table-cell class="manage-orders__table-cell">{{ order.isBuy ? 'Buy' : 'Sell' }}</md-table-cell>
              <md-table-cell class="manage-orders__table-cell">{{ order.baseAmount }}</md-table-cell>
              <md-table-cell class="manage-orders__table-cell">{{ order.price }}</md-table-cell>
              <md-table-cell>
                <md-button class="manage-orders__open-details-btn md-icon-button">
                  <md-icon v-if="isSelected(i)">keyboard_arrow_up</md-icon>
                  <md-icon v-else>keyboard_arrow_down</md-icon>
                </md-button>
              </md-table-cell>

            </md-table-row>

            <md-table-row class="manage-orders__expandable-row" v-if="isSelected(i)" v-bind:key="`${i}-expand`">
              <md-table-cell colspan="7">
                <order-details class="manage-orders__details" :tx="order"/>
              </md-table-cell>
            </md-table-row>

          </template>

        </md-table>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
  import OrderDetails from './OrderDetails'
  import { i18n } from '../../../../../../js/i18n'

  export default {
    name: 'manage-orders',
    components: { OrderDetails },
    props: {
      offers: {
        type: Array,
        require: true
      }
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
</style>
