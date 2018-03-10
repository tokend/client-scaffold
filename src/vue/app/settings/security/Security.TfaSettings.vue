<template>
  <md-list-item class="tfa-settings">
    <span class="md-list-item-text"> {{ i18n.set_tfa_enable() }}</span>
    <md-switch class="md-primary" v-model="isTfaEnabled"></md-switch>
  </md-list-item>
</template>

<script>
  import { i18n } from '../../../../js/i18n'

  export default {
    name: 'tfa-settings',
    data: _ => ({
      i18n,
      isTfaEnabled: false
    })
  }
</script>

<style lang="scss" scoped>
  @import './settings.scss';
</style>
