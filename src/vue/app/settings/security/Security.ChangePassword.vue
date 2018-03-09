<template>

  <form novalidate
        class="change-password
               md-layout"
        @submit.prevent="submit">


    <md-card class="change-password__card">

      <div class="change-password__inner">
        <p class="change-password__explain">{{ i18n.set_help_pwd() }}</p>

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
      </div>

    </md-card>

  </form>

</template>

<script>
  import { i18n } from '../../../../js/i18n'
  import { authService } from '../../../../js/services/auth.service'
  import { mapGetters } from 'vuex'
  import { vuexTypes } from '../../../../vuex/types'

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
    computed: {
      ...mapGetters([
        vuexTypes.userEmail
      ])
    },
    methods: {
      async submit () {
        if (!await this.isValid()) return
        await authService.changePassword({
          email: this.userEmail,
          newPassword: this.form.password
        })
      }
    }
  }
</script>

<style scoped>
  .change-password__inner {
    padding: 1.2rem 1.5rem 0;
  }
  .change-password__card {
    width: 100%;
  }
  .change-password__explain {
    text-align: center;
  }
</style>
