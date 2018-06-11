<template>
  <md-tabs>
    <md-tab :md-label="`${ i18n.lbl_token_creation()}`">
      <token-creation />
    </md-tab>
    <md-tab :md-label="`${ i18n.lbl_sale_creation()}`">
      <sale-creation />
    </md-tab>
  </md-tabs>
</template>

<script>
import TokenCreation from './Requests.TokenCreation'
import SaleCreation from './Requests.SaleCreation'
import { i18n } from '../../../../js/i18n'
export default {
  components: {
    TokenCreation,
    SaleCreation },
  data: _ => ({
    i18n
  })
}
</script>

<style lang="scss" scoped>
  .md-tabs {
    padding: 0 12px;
  }
  
  .md-tab {
    padding: 0;
  }

</style>
