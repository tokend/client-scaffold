<template>
  <md-tabs>
    <md-tab md-label="Token creation">
      <token-creation />
    </md-tab>
  </md-tabs>
</template>

<script>
import TokenCreation from './Requests.TokenCreation'
export default {
  components: { TokenCreation }
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
