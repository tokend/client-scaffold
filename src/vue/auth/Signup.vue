<template>
  <div class="auth-page">


    <form class="app__specified-form auth-form material" @submit.prevent="signup">

      <load-indicator class="load-indicator"/>

      <h2 class="form-heading">Sign up</h2>

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
                   v-model.trim="password"
                   type="password"
                   name="password"
                   title="Password"
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
        <button class="btn form-btn" :disabled="isPending || passwordDoNotMatchError">Sign up</button>
      </div>

      <div class="tips">
        <div class="register-tip">
          Already have an account?
          <router-link :to="routes.login">Sign in now</router-link>
        </div>
      </div>

    </form>
  </div>
</template>

<script>
  import form from '../common/mixins/form.mixin'

  import { ErrorFactory, errorTypes, errors } from '../../js/errors/error_factory'
  import { vueRoutes } from '../../vue-router/const'
  import i18n from '../../js/i18n/auth'

  import LoadIndicator from '../common/LoadIndicator'
  import { showRememberSeedMessage } from '../../js/modals/remember_seed.modal'

  import { Keypair } from 'swarm-js-sdk'

  import { conversionCustomEvents } from '../../js/const/conversion_events.const'
  import {
    sendPixelsEvents,
    sendFacebookPixelStandardEvent,
    sendMixPanelEvent,
    sendGoogleAnalyticsEvent
  } from '../../js/services/integrations.service'

  import config from '../../config'

  import { walletService } from '../../js/services/wallet.service'
  import { emailService } from '../../js/services/email.service'

  export default {
    mixins: [form],

    components: { LoadIndicator },

    data () {
      return {
        email: '',
        password: '',
        confirmPassword: '',
        recoveryKeypair: '',
        routes: vueRoutes
      }
    },

    computed: {
      passwordDoNotMatchError () {
        return this.password &&
               this.confirmPassword &&
               this.password !== this.confirmPassword &&
               i18n.password_do_not_match
      }
    },

    methods: {
      signup () {
        return this.validateParams()
          .then(this.checkEmail)
          .then(this.generateRecoveryKeypair)
          .then(this.sendCreateUserRequest)
          .then(this.showSeedMessage)
          .then(this.goShowEmail)
          .catch(this.handleReject)
      },

      async checkEmail () {
        this.disable()
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
        this.sendConversionEvents()
        const route = { ...vueRoutes.email, query: { walletId, email: this.email } }
        this.$router.push(route)
      },

      sendCreateUserRequest () {
        this.disable()
        return walletService.signup({ email: this.email, password: this.password }, this.recoveryKeypair)
      },

      async showSeedMessage (arg) {
        const recoveryKeypair = this.recoveryKeypair
        await showRememberSeedMessage(recoveryKeypair.secret())
        return Promise.resolve(arg)
      },

      async generateRecoveryKeypair () {
        this.recoveryKeypair = Keypair.random()
        return Promise.resolve(true)
      },

      sendConversionEvents () {
        sendFacebookPixelStandardEvent(conversionCustomEvents.CompleteRegistration, { em: this.email })
        sendPixelsEvents(conversionCustomEvents.signUp, { em: this.email })
        sendMixPanelEvent(conversionCustomEvents.signUp, { email: this.email })
        sendGoogleAnalyticsEvent(conversionCustomEvents.signUp, { email: this.email })
      },

      handleReject (error) {
        console.error(error)
        this.enable()
        switch (error.constructor) {
          case errors.ConflictError:
            error.showBanner(i18n.user_exists)
            break
          default:
            error.showBanner(i18n.unexpected_error)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/style/form';
  @import 'auth';
</style>
