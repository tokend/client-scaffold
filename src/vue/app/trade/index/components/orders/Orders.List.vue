<template>
  <div>
    <md-table class="order-list">
      <md-table-toolbar class="order-list__title">
        <h2>{{ type === ORDER_TYPES.buy ? i18n.trd_ask () : i18n.trd_bid() }}</h2>
      </md-table-toolbar>
      <template v-if="list.length">
        <md-table-row>
          <md-table-head class="order-list__cell">{{ type === ORDER_TYPES.buy ? i18n.trd_want() : i18n.trd_order() }}</md-table-head>
          <md-table-head class="order-list__cell">{{ type === ORDER_TYPES.buy ? i18n.trd_order() : i18n.trd_want() }}</md-table-head>
          <md-table-head class="order-list__cell">{{ i18n.trd_price() }}</md-table-head>
        </md-table-row>

        <template v-for="(order, i) in list">
          <md-table-row class="order-list__row" :key="`${i}-order-row`" @click="matchOrder(order)">
            <md-table-cell class="order-list__cell">{{ order.baseAmount }} {{ order.baseAssetCode }}</md-table-cell>
            <md-table-cell class="order-list__cell">{{ order.quoteAmount }} {{ order.quoteAssetCode }}</md-table-cell>
            <md-table-cell class="order-list__cell">{{ order.price }} {{ order.quoteAssetCode }}</md-table-cell>
          </md-table-row>
        </template>

      </template>
      <template v-else>
        <div class="order-list__no-transactions">
          <md-icon class="md-size-4x">trending_up</md-icon>
          <h2>{{ i18n.trd_no_orders_history() }}</h2>
          <p>{{
            type === ORDER_TYPES.buy ?
            i18n.trd_here_will_be_the_order_ask_list() :
            i18n.trd_here_will_be_the_order_bid_list()
          }}</p>
        </div>
      </template>
    </md-table>
  </div>
</template>

<script>
  import { i18n } from '../../../../../../js/i18n'
  import { ORDER_TYPES } from '../../../../../../js/const/order-types'
  import OrderMakerMixin from '../order-maker.mixin'
  import SubmitterMixin from '../../../../../common/mixins/submitter.mixin'

  import { confirmAction } from '../../../../../../js/modals/confirmation_message'

  export default {
    name: 'order-list',
    mixins: [OrderMakerMixin, SubmitterMixin],
    data: _ => ({
      ORDER_TYPES,
      i18n
    }),
    props: {
      type: { type: String, required: true },
      list: { type: Array, required: true }
    },
    methods: {
      async matchOrder (order) {
        if (!await confirmAction({ message: i18n.trd_confirm_match() })) return
        this.disable()
        await this.createOrder({
          pair: {
            base: order.baseAssetCode,
            quote: order.quoteAssetCode
          },
          baseAmount: order.baseAmount,
          quoteAmount: order.quoteAmount,
          price: order.price,
          isBuy: !order.isBuy
        })
        this.enable()
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../../../../scss/mixins";

  .order-list {
    max-height: 400px;
  }

  .order-list__row {
    cursor: pointer;
  }
  .order-list__no-transactions {
    text-align: center;
  }
  .orders__list {
    width: 100%;
  }

  .order-list__title {
    @include respond-to-custom(985px) {
      min-height: 24px;
    }
  }
</style>
