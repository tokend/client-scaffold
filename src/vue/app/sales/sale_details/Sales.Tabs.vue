<template>
  <md-tabs class="tabs">
    <md-tab name="Overview"  md-label="Overview">
      <div class="tabs__tab-inner">
        <description-tab :description="description" />
      </div>
    </md-tab>
    <md-tab name="Details"  md-label="Details">
      <div class="tabs__tab-inner">
        <sale-tab :sale="sale" />
      </div>
    </md-tab>
    <md-tab name="Token"  md-label="Token">
      <div class="tabs__tab-inner">
        <token-tab :token="token" />
      </div>
    </md-tab>
    <!-- <md-tab name="crowdfund"  md-label="Crowdfund">
      <div class="tabs__tab-inner">
        <crowdfund-tab :syndicate="syndicate" />
      </div>
    </md-tab> -->
    <md-tab name="Banner"  md-label="Video" :md-disabled="!sale.youTubeVideoId">
      <div class="tabs__tab-inner">
        <sale-banner :sale="sale" />
      </div>
    </md-tab>
    <md-tab name="Updates"  md-label="Updates">
      <div class="tabs__tab-inner">
        <updates-tab :sale="sale" />
      </div>
    </md-tab>
    <md-tab name="Documents"  md-label="Documents">
      <div class="tabs__tab-inner">
        <documents-tab :sale="sale"/>
      </div>
    </md-tab>
  </md-tabs>

</template>

<script>
  import DescriptionTab from './tabs/Sales.DescriptionTab'
  import CrowdfundTab from './tabs/Sales.CrowdfundTab'
  import SaleBanner from './components/Sales.Banner'
  import TokenTab from './tabs/Sales.TokenTab'
  import DocumentsTab from './tabs/Sales.DocumentsTab'
  import UpdatesTab from './tabs/Sales.UpdatesTab'
  import SaleTab from './tabs/Sales.SaleTab'
  export default {
    name: 'sale-details-tabs',
    props: ['sale', 'description', 'syndicate', 'token'],
    components: {
      DocumentsTab,
      DescriptionTab,
      CrowdfundTab,
      SaleBanner,
      TokenTab,
      SaleTab,
      UpdatesTab
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
