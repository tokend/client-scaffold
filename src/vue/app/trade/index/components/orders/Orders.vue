<template>
  <md-card class="orders">
    <md-card-header>
      <div class="md-title">Orders</div>
    </md-card-header>

    <md-card-content>
      <div class="orders__list-wrp">
        <order-list class="orders__list" :type="ORDER_TYPES.buy" :list="buyOffers"/>
        <order-list class="orders__list" :type="ORDER_TYPES.sell" :list="sellOffers"/>
      </div>
    </md-card-content>
  </md-card>
</template>

<script>
  import OrderList from './Orders.List'

  import { mapGetters } from 'vuex'
  import { vuexTypes } from '../../../../../../vuex/types'
  import { ORDER_TYPES } from '../../../../../../js/const/order-types'

  export default {
    name: 'orders',
    components: { OrderList },
    data: _ => ({
      ORDER_TYPES
    }),
    computed: {
      ...mapGetters([
        vuexTypes.buyOffers,
        vuexTypes.sellOffers
      ])
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
