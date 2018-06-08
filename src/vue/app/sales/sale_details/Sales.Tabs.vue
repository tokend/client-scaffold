<template>
  <md-tabs class="tabs">
    <md-tab name="Overview"  md-label="Overview">
      <div class="tabs__tab-inner">
        <description-tab :sale="sale" />
      </div>
    </md-tab>
    <md-tab name="token"  md-label="Token" md-disabled>
      <div class="tabs__tab-inner">
        sad
      </div>
    </md-tab>
    <md-tab name="updates"  md-label="Updates" md-disabled>
      <div class="tabs__tab-inner">
        sad
      </div>
    </md-tab>
    <md-tab name="crowdfund"  md-label="Crowdfund" md-disabled>
      <div class="tabs__tab-inner">
        sad
      </div>
    </md-tab>
    <md-tab name="documents"  md-label="Documents " md-disabled>
      <div class="tabs__tab-inner">
        sad
      </div>
    </md-tab>
    <md-tab name="nav"  md-label="Nav" md-disabled>
      <div class="tabs__tab-inner">
        sad
      </div>
    </md-tab>
    <md-tab name="governance"  md-label="Governance" md-disabled>
      <div class="tabs__tab-inner">
        sad
      </div>
    </md-tab>
  </md-tabs>

</template>

<script>
  import DescriptionTab from './tabs/Sales.DescriptionTab'
  export default {
    name: 'sale-details-tabs',
    props: ['sale'],
    components: {
      DescriptionTab
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
