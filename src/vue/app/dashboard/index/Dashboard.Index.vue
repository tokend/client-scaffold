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
  import { mapGetters, mapActions } from 'vuex'
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
    async created () {
      await this.loadBalances()
      this.setCurrentAsset()
    },
    computed: {
      ...mapGetters([
        vuexTypes.accountBalances
      ])
    },
    methods: {
      ...mapActions({
        loadBalances: vuexTypes.GET_ACCOUNT_BALANCES
      }),
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

  .dashboard {
    justify-content: center;
  }
</style>
