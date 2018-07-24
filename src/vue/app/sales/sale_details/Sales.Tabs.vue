<template>
  <md-tabs class="sales-tabs" v-if="isReadyToShowTabs">
    <md-tab name="Chart"  md-label="Market price">
      <div class="sales-tabs__tab-inner">
        <sale-chart :sale="sale"/>
      </div>
    </md-tab>
    <md-tab name="Overview"  md-label="Overview">
      <div class="sales-tabs__tab-inner">
        <description-tab :description="description" />
      </div>
    </md-tab>
    <md-tab name="Details"  md-label="Details">
      <div class="sales-tabs__tab-inner">
        <sale-tab :sale="sale" />
      </div>
    </md-tab>
    <md-tab name="Token"  md-label="Token">
      <div class="sales-tabs__tab-inner">
        <token-tab :token="token" />
      </div>
    </md-tab>
    <!-- <md-tab name="crowdfund"  md-label="Crowdfund">
      <div class="sales-tabs__tab-inner">
        <crowdfund-tab :syndicate="syndicate" />
      </div>
    </md-tab> -->
    <md-tab name="Banner"  md-label="Video" :md-disabled="!sale.youTubeVideoId">
      <div class="sales-tabs__tab-inner">
        <sale-banner :sale="sale" />
      </div>
    </md-tab>
  </md-tabs>
</template>

<script>
  import DescriptionTab from './tabs/Sales.DescriptionTab'
  import CrowdfundTab from './tabs/Sales.CrowdfundTab'
  import SaleBanner from './components/Sales.Banner'
  import TokenTab from './tabs/Sales.TokenTab'
  import SaleTab from './tabs/Sales.SaleTab'
  import SaleChart from './components/Sales.Chart'
  export default {
    name: 'sale-details-tabs',
    props: ['sale', 'description', 'syndicate', 'token'],
    components: {
      DescriptionTab,
      CrowdfundTab,
      SaleBanner,
      TokenTab,
      SaleTab,
      SaleChart
    },
    computed: {
      isReadyToShowTabs () { return !!this.sale.id }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../scss/variables';
  @import '../../../../scss/mixins';

  .sales-tabs {
    @include box-shadow;
  }
</style>
