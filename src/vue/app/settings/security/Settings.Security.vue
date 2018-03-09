<template>
  <div class="security-settings">

    <div class="security-settings__change-password-outer">
      <md-subheader class="security-settings__change-password-header">{{ i18n.set_change_password() }}</md-subheader>
      <change-password class="security-settings__change-password"/>
    </div>

    <!--<div class="security-settings__tfa-settings-outer">-->
      <!--<md-subheader class="security-settings__tfa-settings-header">{{ i18n.set_tfa() }}</md-subheader>-->
      <!--<tfa-settings class="security-settings__tfa-settings"/>-->
    <!--</div>-->

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

<style scoped>
  .security-settings__change-password-outer,
  .security-settings__tfa-settings-outer {
    max-width: 36rem;
    margin: auto;
  }
</style>
