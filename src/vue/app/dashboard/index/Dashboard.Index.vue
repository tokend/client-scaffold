<template>
  <div class="dashboard md-layout">
    <portfolio-widget :currentAsset="currentAsset" class="md-layout-item"></portfolio-widget>
    <info-widget :currentAsset="currentAsset" class="md-layout-item"></info-widget>
  </div>
</template>

<script>
  import PortfolioWidget from './Dashboard.PortfolioWidget'
  import InfoWidget from './Dashboard.InfoWidget'
  import { mapGetters } from 'vuex'
  import { vuexTypes } from '../../../../vuex/types'

  export default {
    name: 'dashboard',
    components: {
      PortfolioWidget,
      InfoWidget
    },
    data: _ => ({
      currentAsset: null
    }),
    created () {
      this.currentAsset = Object.keys(this.accountBalances)[0] || null
    },
    computed: {
      ...mapGetters([
        vuexTypes.accountBalances
      ])
    },
    watch: {
      accountBalances (val) {
        this.currentAsset = Object.keys(val)[0] || null
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../scss/variables';

</style>
