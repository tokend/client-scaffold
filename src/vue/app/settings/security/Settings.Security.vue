<template>
  <md-tabs md-card class="security-settings app__page-content-wrp">
    <md-tab :md-label="`${ i18n.set_change_password()}`">
      <change-password class="security-settings__change-password"/>
    </md-tab>
    <md-tab :md-label="`${ i18n.set_tfa_enable()}`" v-if="config.FEATURE_FLAGS.tfa">
      <tfa-settings class="security-settings__tfa-settings"/>
    </md-tab>
    <md-tab :md-label="`${ i18n.set_account_id()}`">
      <account-id class="security-settings__account-id"/>
    </md-tab>
    <md-tab :md-label="`${ i18n.set_secret_seed()}`">
      <seed class="security-settings__seed"/>
    </md-tab>
  </md-tabs>
</template>

<script>
  import ChangePassword from './Security.ChangePassword'
  import TfaSettings from './Security.TfaSettings'
  import AccountId from './Security.AccountId'
  import Seed from './Security.Seed'
  import { i18n } from '../../../../js/i18n'

  import config from '../../../../config'

  export default {
    name: 'settings-security',
    components: {
      ChangePassword,
      TfaSettings,
      AccountId,
      Seed
    },
    data: _ => ({
      i18n,
      config
    })
  }
</script>

<style lang="scss" scoped>
  @import './settings.scss';

  .security-settings {
    max-width: 48rem;
  }
</style>
