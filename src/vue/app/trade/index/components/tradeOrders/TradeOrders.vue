<template>
  <div>
    <md-card>
      <md-card-content class="md-layout">
        <buy-order :assets="assets" class="md-layout-item"/>
        <sell-order :assets="assets" class="md-layout-item"/>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
  import BuyOrder from './BuyOrder'
  import SellOrder from './SellOrder'

  export default {
    name: 'trade-orders',
    components: { BuyOrder, SellOrder },
    props: {
      assets: {
        type: Object,
        require: true
      }
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

</style>
