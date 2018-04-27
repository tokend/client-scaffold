<template>
  <div>
    <md-card>
      <md-card-content class="md-layout trade-orders__list">
        <buy-order :assets="assets" class="md-layout-item"/>
        <sell-order :assets="assets" class="md-layout-item"/>
      </md-card-content>
    </md-card>
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
    },
    data () {
      return {

      }
    },
    created () {

    },
    computed: {

    },
    methods: {

    },
    watch: {

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
