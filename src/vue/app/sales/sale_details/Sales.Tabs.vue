<template>
  <md-tabs
    class="sales-tabs"
    v-if="isReadyToShowTabs">
    <md-tab
      name="Chart"
      md-label="Market price">
      <div class="sales-tabs__tab-inner">
        <sale-chart :sale="sale" />
      </div>
    </md-tab>
    <md-tab
      name="Overview"
      md-label="Overview">
      <div class="sales-tabs__tab-inner">
        <description-tab :description="description" />
      </div>
    </md-tab>
    <md-tab
      name="Details"
      md-label="Details">
      <div class="sales-tabs__tab-inner">
        <sale-tab :sale="sale" />
      </div>
    </md-tab>
    <md-tab
      name="Token"
      md-label="Token">
      <div class="sales-tabs__tab-inner">
        <token-tab :token="token" />
      </div>
    </md-tab>
    <!-- <md-tab name="crowdfund"  md-label="Crowdfund">
      <div class="sales-tabs__tab-inner">
        <crowdfund-tab :syndicate="syndicate" />
      </div>
    </md-tab> -->
    <md-tab
      name="Banner"
      md-label="Video"
      :md-disabled="!sale.youTubeVideoId">
      <div class="sales-tabs__tab-inner">
        <sale-banner :sale="sale" />
      </div>
    </md-tab>
    <md-tab
      name="Updates"
      md-label="Updates">
      <div class="tabs__tab-inner">
        <updates-tab :sale="sale" />
      </div>
    </md-tab>
    <md-tab
      name="Documents"
      md-label="Documents">
      <div class="tabs__tab-inner">
        <documents-tab :sale="sale" />
      </div>
    </md-tab>
  </md-tabs>
</template>

<script>
import DescriptionTab from './tabs/Sales.DescriptionTab'
import SaleBanner from './components/Sales.Banner'
import TokenTab from './tabs/Sales.TokenTab'
import DocumentsTab from './tabs/Sales.DocumentsTab'
import UpdatesTab from './tabs/Sales.UpdatesTab'
import SaleTab from './tabs/Sales.SaleTab'
import SaleChart from './components/Sales.Chart'
export default {
  name: 'sale-details-tabs',
  components: {
    DocumentsTab,
    DescriptionTab,
    SaleBanner,
    TokenTab,
    SaleTab,
    UpdatesTab,
    SaleChart
  },
  props: {
    sale: { type: Object, required: true },
    description: { type: String, default: '' },
    token: { type: Object, default: () => {} }
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
