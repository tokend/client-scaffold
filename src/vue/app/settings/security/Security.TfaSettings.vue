<template>
  <md-card class="tfa-settings">
    <div class="tfa-settings__inner">
      <div class="md-layout md-alignment-center-space-between">
        <label class="md-layout-item">
          {{i18n.set_tfa_enable() }}
        </label>
        <md-switch class="md-layout-item md-primary md-layout md-alignment-center-right" v-model="isTfaEnabled"></md-switch>
      </div>
    </div>
  </md-card>
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

<style scoped>
  .tfa-settings__inner {
    width: 100%;
    padding: 1.2rem 1.5rem;
  }
</style>
