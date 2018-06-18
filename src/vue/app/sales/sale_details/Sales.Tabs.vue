<template>
  <md-tabs class="tabs">
    <md-tab name="Chart"  md-label="chart">
      <div class="tabs__tab-inner">
        <chart-tab :sale="sale" />
      </div>
    </md-tab>
    <md-tab name="Overview"  md-label="Overview">
      <div class="tabs__tab-inner">
        <description-tab :description="description" />
      </div>
    </md-tab>
    <!-- <md-tab name="crowdfund"  md-label="Crowdfund">
      <div class="tabs__tab-inner">
        <crowdfund-tab :syndicate="syndicate" />
      </div>
    </md-tab> -->
    <md-tab name="Banner"  md-label="Video">
      <div class="tabs__tab-inner">
        <sale-banner :sale="sale" />
      </div>
    </md-tab>
  </md-tabs>

</template>

<script>
  import DescriptionTab from './tabs/Sales.DescriptionTab'
  import CrowdfundTab from './tabs/Sales.CrowdfundTab'
  import SaleBanner from './components/Sales.Banner'
  import ChartTab from './tabs/Sales.ChartTab'
  export default {
    name: 'sale-details-tabs',
    props: ['sale', 'description', 'syndicate'],
    components: {
      DescriptionTab,
      CrowdfundTab,
      SaleBanner,
      ChartTab
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../scss/variables';
  @import '../../../../scss/mixins';

  .tabs__tab-inner {
    padding-top: 2rem;
  }
</style>
