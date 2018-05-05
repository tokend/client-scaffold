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
          <div class="md-title">Account recovery</div>
        </md-card-header>

        <md-card-content>

          <input-field class="input-field"
                       id="recovery-email"
                       name="email"
                      :errorMessage="errorMessage('email')"
                      :label="i18n.lbl_email()"
                     v-model.trim="form.email"
                     v-validate="'required|email'"
          />
          <input-field class="input-field"
                       type="password"
                       id="recovery-seed"
                       name="seed"
                      :label="i18n.lbl_recovery_seed()"
                      :errorMessage="errorMessage('seed')"
                     v-model.trim="form.recoverySeed"
                     v-validate="'required|secret_key'"
          />
          <input-field class="input-field"
                       id="recovery-password"
                       type="password"
                       name="password"
                      :togglePassword="true"
                      :label="i18n.lbl_pwd()"
                      :errorMessage="errorMessage('password')"
                     v-model.trim="form.password"
                     v-validate="'required|min:6'"
          />
          <input-field class="input-field"
                       id="recovery-confirm-password"
                       type="password"
                       name="confirm-password"
                      :togglePassword="true"
                      :label="i18n.lbl_pwd_confirm()"
                      :errorMessage="errorMessage('confirm-password')"
                      :data-vv-as="i18n.lbl_pwd().toLowerCase()"
                     v-validate="'required|confirmed:password'"
                     v-model.trim="form.confirmPassword"
          />

          <div class="auth-page__bottom">
            <div class="auth-page__tips">
              <div class="tips__tip">
                Know your credentials?
                <router-link :to="routes.login">Sign in now</router-link>
              </div>
            </div>
          </div>

        </md-card-content>
        <md-dialog-actions class="auth-page__actions">
          <md-button class="md-primary" type="submit" :disabled="isPending">{{ i18n.lbl_make_recovery() }}</md-button>
        </md-dialog-actions>
      </md-card>

    </form>
  </div>
</template>

<script>
  import FormMixin from '../common/mixins/form.mixin'

  import { EventDispatcher } from '../../js/events/event_dispatcher'
  import { ErrorHandler } from '../../js/errors/error_handler'
  import { vueRoutes } from '../../vue-router/const'
  import { errors } from '../../js/errors/factory'
  import { i18n } from '../../js/i18n'

  import { authService } from '../../js/services/auth.service'

  export default {
    name: 'recovery',
    mixins: [FormMixin],

    data () {
      return {
        form: {
          email: '',
          password: '',
          recoverySeed: '',
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
          await authService.makeRecovery({
            recoverySeed: this.form.recoverySeed,
            newPassword: this.form.password,
            email: this.form.email
          })
          EventDispatcher.dispatchShowSuccessEvent(i18n.recovered())
          this.$router.push(vueRoutes.login)
        } catch (error) {
          console.error(error)
          switch (error.constructor) {
            case errors.NotFoundError:
              error.showBanner(i18n.recovery_wallet_not_found())
              break
            case errors.EmailNotVerifiedError:
              error.showBanner(i18n.email_not_verified_on_recovery())
              break
            default:
              ErrorHandler.processUnexpected(error)
          }
        }
        this.enable()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'auth';
</style>
