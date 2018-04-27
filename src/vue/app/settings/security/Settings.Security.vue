<template>
  <div class="security-settings md-layout">

    <div class="security-settings__inner md-size-80 md-layout-item" >
      <md-subheader class="security-settings__header" v-if="config.FEATURE_FLAGS.verification">{{ i18n.set_account() }}</md-subheader>
      <md-card class="security-settings__section" v-if="config.FEATURE_FLAGS.verification">
        <md-list class="security-settings__list md-dense">
          <md-list-item to="/verification">
            <span class="md-list-item-text">{{ i18n.set_verify_account() }}</span>
            <md-icon class="md-icon--half-sized">play_arrow</md-icon>
          </md-list-item>
        </md-list>
      </md-card>

      <md-subheader class="security-settings__header">{{ i18n.set_security() }}</md-subheader>
      <md-card class="security-settings__section">
        <md-list class="security-settings__list md-dense">
          <change-password class="security-settings__change-password"/>
          <md-divider class="md-dense"/>
          <tfa-settings class="security-settings__tfa-settings" v-if="config.FEATURE_FLAGS.tfa"/>
        </md-list>
      </md-card>

      <md-subheader class="security-settings__header">{{ i18n.set_keys() }}</md-subheader>
      <md-card class="security-settings__section">
        <md-list class="security-settings__list md-dense">
          <account-id class="security-settings__account-id"/>
          <md-divider class="md-dense"/>
          <seed class="security-settings__seed"/>
        </md-list>
      </md-card>
    </div>

  </div>
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
</style>
