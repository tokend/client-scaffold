<template>

  <form novalidate
        class="change-password
                 md-layout"
        @submit.prevent="submit">


    <md-card class="change-password__card">
      <md-card-header>
        <div class="md-title">Provide a new password</div>
      </md-card-header>

      <md-card-content>

        <input-field
          v-model.trim="form.password"
          id="login-password"
          class="input-field"
          name="password"
          type="password"
          :togglePassword="true"
          :label="i18n.lbl_pwd()"
          :errorMessage="errorMessage('password')"
          v-validate="'required|min:6'"
        />

        <input-field
          v-model.trim="form.confirmPassword"
          id="login-confirm-password"
          name="confirm-password"
          class="input-field"
          type="password"
          :togglePassword="true"
          :label="i18n.lbl_confirm()"
          :errorMessage="errorMessage('confirm-password')"
          v-validate="'required|confirmed:password'"
          data-vv-as="password"
          data-vv-validate-on="input"
        />

        <div class="md-layout md-alignment-center-right">
          <md-button type="submit" class="md-raised md-primary">Submit</md-button>
        </div>

      </md-card-content>

    </md-card>

  </form>

</template>

<script>
  import {i18n} from '../../../../js/i18n'
  import Form from '../../../common/mixins/form.mixin'

  export default {
    name: 'change-password',
    mixins: [Form],
    data: _ => ({
      i18n,
      form: {
        password: '',
        confirmPassword: ''
      }
    }),
    methods: {
      submit () {
        // wip
      }
    }
  }
</script>

<style scoped>
  .change-password__card {
    width: 100%;
  }
</style>
