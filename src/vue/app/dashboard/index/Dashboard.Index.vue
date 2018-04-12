<template>
  <div class="dashboard md-layout">
    <portfolio-widget class="md-layout-item"
                      :currentAsset="currentAsset"
                      @asset-change="setCurrentAsset"
    />
    <info-widget :currentAsset="currentAsset" class="md-layout-item"/>
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
      this.setCurrentAsset()
    },
    computed: {
      ...mapGetters([
        vuexTypes.accountBalances
      ])
    },
    methods: {
      setCurrentAsset (value) {
        this.currentAsset = value || Object.keys(this.accountBalances)[0] || null
      }
    },
    watch: {
      accountBalances () {
        this.setCurrentAsset()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../scss/variables';

</style>
