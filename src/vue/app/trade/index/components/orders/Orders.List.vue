<template>
    <md-table class="order-list">
      <md-table-toolbar>
        <h2>{{ type === ORDER_TYPES.buy ? i18n.trd_ask () : i18n.trd_bid() }}</h2>
      </md-table-toolbar>
      <template v-if="list.length">
        <md-table-row>
          <md-table-head class="order-list__cell">{{ type === ORDER_TYPES.buy ? i18n.trd_want() : i18n.trd_order() }}</md-table-head>
          <md-table-head class="order-list__cell">{{ type === ORDER_TYPES.buy ? i18n.trd_order() : i18n.trd_want() }}</md-table-head>
          <md-table-head class="order-list__cell">{{ i18n.trd_price() }}</md-table-head>
        </md-table-row>

        <template v-for="order in list">
          <md-table-row class="order-list__row">
            <md-table-cell class="order-list__cell">{{ order.baseAmount }} {{ order.baseAssetCode }}</md-table-cell>
            <md-table-cell class="order-list__cell">{{ order.quoteAmount }} {{ order.quoteAssetCode }}</md-table-cell>
            <md-table-cell class="order-list__cell">{{ order.price }} {{ order.quoteAssetCode }}</md-table-cell>
          </md-table-row>
        </template>

      </template>
    </md-table>
</template>

<script>
  import { i18n } from '../../../../../../js/i18n'
  import { ORDER_TYPES } from '../../../../../../js/const/order-types'

  export default {
    name: 'order-list',
    data: _ => ({
      ORDER_TYPES,
      i18n
    }),
    props: {
      type: { type: String, required: true },
      list: { type: Array, required: true }
    }
  }
</script>

<style scoped>
  .order-list__row {
    cursor: pointer;
  }
</style>
