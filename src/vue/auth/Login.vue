<template>
  <div class="auth-page">

    <p class="redirect-explain" v-if="isRedirectToDiscourse">
      * By providing valid credentials, you will be automatically redirected to your Discource account. If you want just to
      login to Swarm, click <button class="just-login-btn" @click="isRedirectToDiscourse = false">close <i class="mdi mdi-close"></i></button>
    </p>

    <form class="app__specified-form auth-form material" @submit.prevent="login">

      <load-indicator class="auth-page__load-indicator"/>

      <h2>Sign in</h2>

      <input-field class="input-field"
                   id="login-field"
                   v-model.trim="email"
                   title="Email"
                   name="email"
                   placeholder="example@mail.com"
                   :error="errors.first('email')"
                   v-validate="'required'"
      />

      <input-field class="input-field"
                   v-model.trim="password"
                   type="password"
                   name="password"
                   title="Password"
                   :error="errors.first('password')"
                   v-validate="'required'"
      />

      <div class="btn-outer">
        <button class="btn" :disabled="isPending">Sign in</button>
      </div>

      <div class="tips">

        <div class="tips__register-tip">
          Don't have an account?
          <router-link :to="{ name: 'signup' }">Register now</router-link>
        </div>

        <div class="tips__register-tip">
          Forgot your password?
          <router-link :to="{ name: 'recovery' }">Recover it</router-link>
        </div>

      </div>

    </form>

  </div>
</template>

<script>
  import auth from '../common/mixins/form.mixin'

  import i18n from '../../js/i18n/auth'
  import { errors } from '../../js/errors/error_factory'
  import { EventDispatcher } from '../../js/events/event_dispatcher'
  import { dispatchEvent } from '../../js/events/helpers'
  import { commonEvents } from '../../js/events/common_events'
  import { mapActions } from 'vuex'
  import { vuexTypes } from '../../vuex/types'
  import { vueRoutes } from '../../vue-router/const'
  import LoadIndicator from '../common/LoadIndicator'
  import common from '../../js/services/auth/helpers/common'

  import { confirmAction } from '../../js/modals/confirmation_message'

  import { walletService } from '../../js/services/wallet.service'
  import { emailService } from '../../js/services/email.service'
  import { usersService } from '../../js/services/users.service'

  export default {
    mixins: [auth],

    components: { LoadIndicator },

    data () {
      return {
        email: '',
        password: '',
        isRedirectToDiscourse: false
      }
    },

    created () {
      if (this.redirectParams) this.setRedirectMessage()
      if (this.emailParams) return this.verifyEmail()
    },

    computed: {
      emailParams () {
        const token = this.$route.params.token
        const walletId = this.$route.params.walletId
        if (token && walletId) return { token, walletId }
        else return null
      },

      redirectParams () {
        return this.$route.params.redirect
      }
    },

    methods: {
      ...mapActions({
        setUserLoggedIn: vuexTypes.LOG_IN,
        loadAccount: vuexTypes.GET_ACCOUNT_DETAILS,
        loadUser: vuexTypes.GET_USER_DETAILS,
        loadKyc: vuexTypes.GET_INDIVIDUAL_DATA,
        loadBalances: vuexTypes.GET_BALANCES
      }),

      async login () {
        if (!await this.$validator.validateAll()) {
          EventDispatcher.dispatchShowErrorEvent('Please fill all the fields correctly before continuing')
          return
        }

        this.disable()
          .then(this.sendLoginRequest)
          .then(this.checkIfUserExists)
          .then(this.sendCreateUserRequest)
          .then(this.storeUserDetails)
          .then(this.enterApplication)
          .catch(this.handleReject)
      },

      checkIfUserExists (accountId) {
        return this.$services.users.checkIfUserExists(accountId)
      },

      enterApplication () {
        this.setUserLoggedIn()
        dispatchEvent(commonEvents.enterAppEvent)
        const redirectParams = this.isRedirectToDiscourse && this.redirectParams
        const redirectPath = { ...vueRoutes.app, params: { redirect: redirectParams } }
        this.$router.push(redirectPath)
      },

      async storeUserDetails () {
        await Promise.all([
          this.loadUser(),
          this.loadAccount(),
          this.loadBalances()
        ])
        await this.loadKyc()
        return Promise.resolve(true)
      },

      sendLoginRequest () {
        return walletService.login({ email: this.email, password: this.password })
      },

      sendCreateUserRequest ({ exists, accountId }) {
        if (exists) return Promise.resolve(true)
        return usersService.createUser(accountId)
      },

      setRedirectMessage () {
        this.isRedirectToDiscourse = true
      },

      async handleNotVerifiedError () {
        if (!await confirmAction({
          title: 'Email not verified',
          message: `It seems your email is not verified yet. Please check your spam folder or request new email by pressing "Confirm"` }
        )) return
        this.disable()
        try {
          const kdf = await common.getWalletKDF(this.email)
          const { walletId } = common.calculateWalletParams(
            this.password,
            this.email,
            kdf.attributes().salt,
            kdf.attributes()
          )
          await this.resendEmail(walletId)
          EventDispatcher.dispatchShowSuccessEvent(i18n.email_sent)
        } catch (error) {
          if (error.showBanner) {
            error.showBanner(i18n.unexpected_error)
          } else {
            EventDispatcher.dispatchShowErrorEvent(i18n.unexpected_error)
          }
        }
        this.enable()
      },

      resendEmail (walletId) {
        return emailService.sendResendEmailRequest(walletId)
      },

      async verifyEmail () {
        try {
          await emailService.sendVerifyEmailRequest(this.emailParams.token, this.emailParams.walletId)
          EventDispatcher.dispatchShowSuccessEvent(i18n.email_verified)
        } catch (error) {
          this.handleReject(error)
        }
      },

      handleReject (error) {
        console.error(error)
        this.enable()
        switch (error.constructor) {
          case errors.NotFoundError:
            error.showBanner(i18n.not_found)
            break
          case errors.EmailNotVerifiedError:
            this.handleNotVerifiedError()
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

  .redirect-explain {
    border-left: 2px solid $col-info;
    font-size: $fs-tip;
    max-width: 440px;
    margin: 0 auto 20px;
    padding-left: 10px;
    width: 100%;

    .just-login-btn {
      cursor: pointer;
      &, i {
        font-size: $fs-tip;
        color: $col-active;
        text-decoration: underline;
      }

    }
  }
</style>
