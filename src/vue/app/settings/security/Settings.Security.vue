<template>
  <div class="security-settings">

    <div class="security-settings__account">
      <md-subheader class="security-settings__account-header">{{ i18n.set_account() }}</md-subheader>
      <md-card>
        <md-list class="security-settings__list md-dense">
          <change-password class="security-settings__change-password"/>
          <md-divider class="md-dense"/>
          <tfa-settings class="security-settings__tfa-settings"/>
        </md-list>
      </md-card>
    </div>

  </div>
</template>

<script>
  import ChangePassword from './Security.ChangePassword'
  import TfaSettings from './Security.TfaSettings'

  import { i18n } from '../../../../js/i18n'

  export default {
    name: 'settings-security',
    components: { ChangePassword, TfaSettings },
    data: _ => ({
      i18n
    })
  }
</script>

<style lang="scss" scoped>
  @import './settings.scss';
</style>
