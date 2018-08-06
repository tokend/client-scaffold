<template>
  <tabs class="app__tabs">
    <tab :name="i18n.lbl_token_creation()" id="token-creation">
      <token-creation />
    </tab>
    <tab :name="i18n.lbl_sale_creation()" id="sale-creation">
      <sale-creation />
    </tab>
    <tab :name="i18n.preis_upload()" id="pre-issuance-upload">
      <pre-issuance-upload />
    </tab>
  </tabs>
</template>

<script>
import TokenCreation from './Requests.TokenCreation'
import PreIssuanceUpload from './Requests.PreissuanceUpload'
import SaleCreation from './Requests.SaleCreation'
import { i18n } from '@/js/i18n'
import Tabs from '@/vue/app/common/tabs/Tabs'
import Tab from '@/vue/app/common/tabs/Tab'

export default {
  components: {
    TokenCreation,
    SaleCreation,
    PreIssuanceUpload,
    Tabs,
    Tab
  },
  data: _ => ({
    i18n
  })
}
</script>

<style lang="scss">
@import "~@scss/variables";

.requests__tabs {
  .md-title,
  .md-table-cell-container {
    color: $col-md-primary !important;
  }

  .md-table-head-label {
    color: $col-md-primary-inactive !important;
  }

  .md-tab {
    padding: 0;
  }

  .md-card {
    box-shadow: none;
  }

  .md-tabs-content {
    height: auto !important;
    min-height: 100% !important;
    background-color: transparent;
  }
}
</style>
