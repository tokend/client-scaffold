<template>
  <div class="dashboard">
    <template v-if="isLoading">
      <loader :message="i18n.dash_loading()"/>
    </template>
    <template v-else>
      <portfolio-widget class="dashboard__portfolio"
                        :currentAsset="currentAsset"
                        @asset-change="setCurrentAsset"
                        :scale="scale"
      />
      <div class="dashboard__chart" v-if="currentAsset">
        <chart :base-asset="currentAsset" :quote-asset="'USD'"/>
      </div>
      <info-widget v-if="currentAsset" class="dashboard__activity" :currentAsset="currentAsset"/>
    </template>
  </div>
</template>

<script>
  import PortfolioWidget from './Dashboard.PortfolioWidget'
  import InfoWidget from './Dashboard.InfoWidget'
  import Chart from '@/vue/app/common/chart/Chart'
  import { mapGetters, mapActions } from 'vuex'
  import { vuexTypes } from '@/vuex/types'
  import { i18n } from '@/js/i18n'
  import Loader from '@/vue/app/common/Loader'

  export default {
    name: 'dashboard',
    components: {
      PortfolioWidget,
      InfoWidget,
      Chart,
      Loader
    },
    data: _ => ({
      currentAsset: null,
      isLoading: false,
      scale: 'month',
      i18n
    }),
    async created () {
      this.isLoading = true
      await this.loadBalances()
      this.setCurrentAsset()
      this.isLoading = false
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
        const regExp = /\(([^)]+)\)/
        if (value) {
          this.currentAsset = regExp.exec(value)[1]
        } else {
          const keys = Object.keys(this.accountBalances)
          this.currentAsset =
            keys.filter(a => a === 'ETH')[0] || keys[0] || null
        }
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
  @import '~@scss/variables';
  @import '~@scss/mixins';

  $custom-breakpoint: 800px;

  .dashboard {
    padding: 0 0;
  }

  .dashboard__portfolio {
    margin-bottom: -40px;
  }

  .dashboard__activity {
    width: 100%;
  }
</style>
