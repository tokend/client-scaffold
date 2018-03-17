<template>
  <div class="auth-page md-layout md-alignment-center-center">
    <form novalidate
          class="auth-page__form
                 md-layout
                 md-alignment-center-center"
          @submit.prevent="submit">

      <md-card>
        <md-card-header>
          <div class="md-title">Account recovery</div>
        </md-card-header>

        <md-card-content>

          <input-field class="input-field"
                       id="recovery-email"
                       name="email"
                     v-model.trim="form.email"
                     v-validate="'required|email'"
                      :label="i18n.lbl_email()"
                      :errorMessage="errorMessage('email')"
          />
          <input-field class="input-field"
                       type="password"
                       id="recovery-seed"
                       name="seed"
                     v-model.trim="form.seed"
                     v-validate="'required|secret_key'"
                      :label="i18n.lbl_recovery_seed()"
                      :errorMessage="errorMessage('seed')"
          />
          <input-field class="input-field"
                       id="recovery-password"
                       type="password"
                       name="password"
                     v-model.trim="form.password"
                     v-validate="'required|min:6'"
                      :togglePassword="true"
                      :label="i18n.lbl_pwd()"
                      :errorMessage="errorMessage('password')"
          />
          <input-field class="input-field"
                       id="recovery-confirm-password"
                       type="password"
                       name="confirm-password"
                     v-model.trim="form.confirmPassword"
                     v-validate="'required|confirmed:password'"
                      :togglePassword="true"
                      :label="i18n.lbl_confirm()"
                      :errorMessage="errorMessage('confirm-password')"
                      :data-vv-as="i18n.lbl_pwd().toLowerCase()"
          />

          <div class="auth-page__bottom">
            <div class="auth-page__tips">
              <div class="tips__tip">
                Know your credentials?
                <router-link :to="routes.login">Sign in now</router-link>
              </div>
            </div>
            <md-button class="md-raised md-primary" :disabled="isPending">Submit recovery</md-button>
          </div>

        </md-card-content>
      </md-card>

    </form>
  </div>
</template>

<script>
  import FormMixin from '../common/mixins/form.mixin'

  import { errors } from '../../js/errors/factory'
  import { vueRoutes } from '../../vue-router/const'
  import { i18n } from '../../js/i18n'
  import { EventDispatcher } from '../../js/events/event_dispatcher'
  import LoadIndicator from '../common/LoadIndicator'

  export default {
    name: 'recovery',

    components: {
      LoadIndicator
    },

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
        this.disable()
        try {
          await this.makeRecovery()
          EventDispatcher.dispatchShowSuccessEvent(i18n.recovered())
          this.goLogin()
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
              if (error.showBanner) {
                error.showBanner(i18n.unexpected_error())
              } else {
                EventDispatcher.dispatchShowErrorEvent(i18n.unexpected_error())
              }
          }
        }
        this.enable()
      },
      makeRecovery () {
        return this.$services.password.makeRecovery(this.recoverySeed, this.email, this.password)
      },
      goLogin () {
        this.$router.push(vueRoutes.login)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'auth';
</style>
