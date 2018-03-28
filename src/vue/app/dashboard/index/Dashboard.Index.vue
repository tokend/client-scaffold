<template>
  <div class="dashboard md-layout">
    <portfolio-widget :currentAsset="currentAsset" class="md-layout-item"></portfolio-widget>
    <info-widget :currentAsset="currentAsset" class="md-layout-item"></info-widget>
  </div>
</template>

<script>
  import PortfolioWidget from './Dashboard.PortfolioWidget'
  import InfoWidget from './Dashboard.InfoWidget'

  export default {
    name: 'dashboard',
    components: {
      PortfolioWidget,
      InfoWidget
    },
    data: _ => ({
      currentAsset: 'BTC'
    }),
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
  @import '../../../../scss/variables';

</style>
