<template>
  <md-card class="orders">
    <md-card-header>
      <div class="md-title">{{ i18n.trd_orders() }}</div>
    </md-card-header>

    <md-card-content>
      <div class="orders__list-wrp">
        <order-list class="orders__list" :type="ORDER_TYPES.buy" :list="formattedBuyOffers"/>
        <order-list class="orders__list" :type="ORDER_TYPES.sell" :list="formattedSellOffers"/>
      </div>
    </md-card-content>
  </md-card>
</template>

<script>
  import OrderList from './Orders.List'

  import { mapGetters } from 'vuex'
  import { vuexTypes } from '../../../../../../vuex/types'
  import { ORDER_TYPES } from '../../../../../../js/const/order-types'
  import { i18n } from '../../../../../../js/i18n'

  export default {
    name: 'orders',
    components: { OrderList },
    data: _ => ({
      ORDER_TYPES,
      i18n
    }),
    computed: {
      ...mapGetters([
        vuexTypes.buyOffers,
        vuexTypes.sellOffers
      ]),
      formattedBuyOffers () {
        return this.buyOffers.sort((a, b) => { return b.price - a.price })
      },
      formattedSellOffers () {
        return this.sellOffers.sort((a, b) => { return a.price - b.price })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .orders__list-wrp {
    display: flex;
    justify-content: space-between;
  }

  .orders__list {
    width: 100%;

    &:first-child {
      margin-right: 1rem;
    }
  }
</style>
