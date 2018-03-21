<template>
  <div class="auth-page md-layout md-alignment-center-center">

    <form novalidate
          class="auth-page__form
                 md-layout
                 md-alignment-center-center"
          @submit.prevent="submit">

      <md-card
        class="auth-page__card
               md-layout-item
               md-size-30
               md-medium-size-45
               md-small-size-65
               md-xsmall-size-100">
        <md-progress-bar md-mode="indeterminate" v-if="isPending"/>

        <md-card-header>
          <div class="md-title">{{ i18n.su_sign_up() }}</div>
        </md-card-header>


        <md-card-content>
          <input-field class="input-field"
                       id="login-email"
                       name="email"
                      :label="i18n.su_email()"
                      :errorMessage="errorMessage('email')"
                     v-model.trim="form.email"
                     v-validate="'required|email'"
          />

          <input-field class="input-field"
                       id="login-password"
                       type="password"
                       name="password"
                      :togglePassword="true"
                      :label="i18n.su_pwd()"
                      :errorMessage="errorMessage('password')"
                     v-model.trim="form.password"
                     v-validate="'required|min:6'"
          />

          <input-field class="input-field"
                       id="login-confirm-password"
                       type="password"
                       name="confirm-password"
                      :label="i18n.su_confirm()"
                      :togglePassword="true"
                      :errorMessage="errorMessage('confirm-password')"
                     v-model.trim="form.confirmPassword"
                     v-validate="'required|confirmed:password'"
               data-vv-as="password"
          />

          <div class="auth-page__bottom">
            <div class="auth-page__tips">
              <div class="tips__tip">
                {{ i18n.su_already_have_an_account() }}
                <router-link :to="routes.login">{{ i18n.su_sign_in() }}</router-link>
              </div>
            </div>
            <md-button type="submit" class="md-raised md-primary" :disabled="isPending">
              {{ i18n.su_sign_up() }}
            </md-button>
          </div>
        </md-card-content>
      </md-card>
    </form>
  </div>
</template>

<script>
  import formMixin from '../common/mixins/form.mixin'

  import { ErrorFactory, errorTypes, errors } from '../../js/errors/factory'
  import { ErrorHandler } from '../../js/errors/error_handler'
  import { vueRoutes } from '../../vue-router/const'
  import { Keypair } from 'swarm-js-sdk'
  import { showRememberSeedMessage } from '../../js/modals/remember_seed.modal'
  import config from '../../config'

  import { emailService } from '../../js/services/email.service'
  import { authService } from '../../js/services/auth.service'
  import { i18n } from '../../js/i18n'

  export default {
    mixins: [formMixin],

    data () {
      return {
        form: {
          email: '',
          password: '',
          confirmPassword: ''
        },
        routes: vueRoutes,
        i18n
      }
    },

    methods: {
      async submit () {
        if (!await this.isValid()) return
        this.disable()
        try {
          await this.checkEmailValidity()
          const recoveryKeypair = Keypair.random()
          const walletId = await authService.signup(this.form, recoveryKeypair)
          this.enable()
          await showRememberSeedMessage(recoveryKeypair.secret())
          this.goShowEmail(walletId)
        } catch (error) {
          switch (error.constructor) {
            case errors.ConflictError:
              error.showBanner(i18n.user_exists())
              break
            default:
              ErrorHandler.processUnexpected(error)
          }
        }
        this.enable()
      },

      async checkEmailValidity () {
        if (!config.VALIDATE_EMAILS) return Promise.resolve(true)

        const emailDetails = await emailService.validateOnMailgun(this.email)

        if (emailDetails.is_valid === false) {
          ErrorFactory.throwError(errorTypes.InvalidEmailError)
        }
        if (emailDetails.is_role_address) {
          ErrorFactory.throwError(errorTypes.RoleEmailError)
        }
        if (emailDetails.is_disposable_address) {
          ErrorFactory.throwError(errorTypes.DisposableEmailError)
        }
        return Promise.resolve(true)
      },

      goShowEmail (walletId) {
        const route = { ...vueRoutes.email, query: { walletId, email: this.form.email } }
        this.$router.push(route)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'auth';
</style>
