<template>
  <div class="dashboard md-layout">
    <portfolio-widget :currentAsset="currentAsset" class="md-layout-item"></portfolio-widget>
    <info-widget :currentAsset="currentAsset" class="md-layout-item"></info-widget>
  </div>
</template>

<script>
  import PortfolioWidget from './Dashboard.PortfolioWidget'
  import InfoWidget from './Dashboard.InfoWidget'
  import { DEFAULT_SELECTED_ASSET } from '../../../../js/const/configs.const'

  export default {
    name: 'dashboard',
    components: {
      PortfolioWidget,
      InfoWidget
    },
    data: _ => ({
      currentAsset: DEFAULT_SELECTED_ASSET
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
