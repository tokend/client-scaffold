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
    margin: 1rem .75rem 0;
    box-shadow: 0px 2px 4px 0 rgba(0, 0, 0, 0.08);
  }
  
  .md-tab {
    padding: 0;
  }

</style>
