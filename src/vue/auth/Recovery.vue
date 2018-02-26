<template>
  <div class="auth-page">

    <form class="app__specified-form auth-form material" @submit.prevent="submit">

      <load-indicator class="load-indicator"/>

      <h2 class="form-heading">Account recovery</h2>

      <input-field class="input-field"
                   v-model.trim="email"
                   name="email"
                   title="Email"
                   placeholder="example@mail.com"
                   :error="errors.first('email')"
                   v-validate="'required|email'"
      >
      </input-field>

      <input-field class="input-field"
                   v-model.trim="recoverySeed"
                   name="recovery-seed"
                   title="Recovery seed"
                   :error="errors.first('recovery-seed')"
                   v-validate="'secret_key'"
      >
      </input-field>

      <input-field class="input-field"
                   v-model.trim="password"
                   type="password"
                   name="password"
                   title="New password"
                   :error="errors.first('password')"
                   v-validate="'required|min:6'"
      >
      </input-field>

      <input-field class="input-field"
                   v-model.trim="confirmPassword"
                   type="password"
                   name="confirm_password"
                   title="Confirm password"
                   :error="passwordDoNotMatchError || errors.first('confirm_password')"
                   v-validate="'required'"
      >
      </input-field>

      <div class="btn-outer">
        <button class="btn form-btn" :disabled="!isAllowedToSubmit">Submit recovery</button>
      </div>

      <div class="tips">
        <div class="register-tip">
          Know your credentials?
          <router-link :to="routes.login">Sign in now</router-link>
        </div>
      </div>

    </form>
  </div>
</template>

<script>
  import form from '../common/mixins/form.mixin'

  import { errors } from '../../js/errors/error_factory'
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
        email: '',
        recoverySeed: '',
        password: '',
        confirmPassword: '',
        routes: vueRoutes
      }
    },

    computed: {
      passwordDoNotMatchError () {
        return this.password &&
          this.confirmPassword &&
          this.password !== this.confirmPassword &&
          i18n.password_do_not_match
      },
      isAllowedToSubmit () {
        return this.password &&
               this.confirmPassword &&
               this.email &&
               this.recoverySeed &&
              !this.isPending &&
              !this.passwordDoNotMatchError &&
               this.errors.count() === 0
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
  @import '../../assets/style/form';
  @import 'auth';
</style>
