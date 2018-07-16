<template>
  <div class="dashboard">
    <portfolio-widget class="md-layout-item dashboard__portfolio"
                      :currentAsset="currentAsset"
                      @asset-change="setCurrentAsset"
                      @change-dashboard-scale="changeDashboardScale"
                      :scale="scale"
                      :show-tabls="showTabs"
    />
    <div class="dashboard__chart">
      <chart :currency="currentAsset" :scale="scale" @check-dashboard-chart-has-value="checkDashboardHasValue"/>
    </div>
    <info-widget v-if="currentAsset" class="dashboard__activity" :currentAsset="currentAsset"/>
  </div>
</template>

<script>
  import PortfolioWidget from './Dashboard.PortfolioWidget'
  import InfoWidget from './Dashboard.InfoWidget'
  import Chart from './Dashboard.Chart'
  import { mapGetters, mapActions } from 'vuex'
  import { vuexTypes } from '../../../../vuex/types'

  export default {
    name: 'dashboard',
    components: {
      PortfolioWidget,
      InfoWidget,
      Chart
    },
    data: _ => ({
      currentAsset: null,
      showTabs: false,
      scale: 'day'
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
        if (value) {
          this.currentAsset = value.split(' ')[0]
        } else {
          this.currentAsset = Object.keys(this.accountBalances)[0] || null
        }
      },
      changeDashboardScale (value) {
        this.scale = value
      },
      checkDashboardHasValue (value) {
        this.showTabs = value
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
    padding: 0 40px;

    @include respond-to(medium) {
      padding: 0 24px;
    }

    @include respond-to-custom($custom-breakpoint) {
      padding: 0 16px;
    }

    @include respond-to(xsmall) {
      padding: 0 8px;
    }
  }

  .dashboard__portfolio {
    margin-bottom: 24px;
  }

  .dashboard__activity {
    width: 100%;
  }
</style>
