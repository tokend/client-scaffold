<template>
  <div class="app__card-wrapper">
    <buy-order :assets="assets" class="md-layout-item"/>
    <sell-order :assets="assets" class="md-layout-item"/>
  </div>
</template>

<script>
  import BuyOrder from './TradeOrders.BuyOrder'
  import SellOrder from './TradeOrders.SellOrder'

  export default {
    name: 'trade-orders',
    components: { BuyOrder, SellOrder },
    props: {
      assets: { type: Object, require: true }
    }
  }
</script>

<style lang="scss" scoped>

  @import "../../../../../../scss/mixins";

  .trade-orders__list {
    padding: 0 !important;

    @include respond-to (small) {
      flex-direction: column;
    }
  }

</style>
