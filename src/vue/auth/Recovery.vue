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
                       v-model.trim="form.email"
                       label="Email"
                       name="email"
                       :errorMessage="errorMessage('email')"
                       v-validate="'required|email'"
          />
          <input-field class="input-field"
                       id="recovery-seed"
                       v-model.trim="form.seed"
                       label="Recovery seed"
                       name="seed"
                       :errorMessage="errorMessage('seed')"
                       v-validate="'required|secret_key'"
          />
          <input-field
            v-model.trim="form.password"
            class="input-field"
            id="recovery-password"
            type="password"
            :togglePassword="true"
            label="Password"
            name="password"
            :errorMessage="errorMessage('password')"
            v-validate="'required|min:6'"
          />
          <input-field
            v-model.trim="form.confirmPassword"
            id="recovery-confirm-password"
            name="confirm-password"
            :togglePassword="true"
            class="input-field"
            type="password"
            label="Confirm password"
            :errorMessage="errorMessage('confirm-password')"
            v-validate="'required|confirmed:password'"
            data-vv-as="password"
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
  import form from '../common/mixins/form.mixin'

  import { errors } from '../../js/errors/factory'
  import { vueRoutes } from '../../vue-router/const'
  import i18n from '../../js/i18n/auth'
  import { EventDispatcher } from '../../js/events/event_dispatcher'
  import LoadIndicator from '../common/LoadIndicator'

  export default {
    name: 'recovery',

    components: {
      LoadIndicator
    },

    mixins: [form],

    data () {
      return {
        form: {
          email: '',
          password: '',
          recoverySeed: '',
          confirmPassword: ''
        },
        routes: vueRoutes
      }
    },

    methods: {
      async submit () {
        this.disable()
        try {
          await this.makeRecovery()
          EventDispatcher.dispatchShowSuccessEvent(i18n.recovered)
          this.goLogin()
        } catch (error) {
          console.error(error)
          switch (error.constructor) {
            case errors.NotFoundError:
              error.showBanner(i18n.recovery_wallet_not_found)
              break
            case errors.EmailNotVerifiedError:
              error.showBanner(i18n.email_not_verified_on_recovery)
              break
            default:
              if (error.showBanner) {
                error.showBanner(i18n.unexpected_error)
              } else {
                EventDispatcher.dispatchShowErrorEvent(i18n.unexpected_error)
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
