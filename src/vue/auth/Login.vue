<template>
  <div class="auth-page md-layout md-alignment-center-center">
    <form novalidate
          class="auth-page__form
                 md-layout
                 md-alignment-center-center"
          @submit.prevent="login">

      <md-card
        class="auth-page__card
               md-layout-item
               md-size-30
               md-small-size-65
               md-xsmall-size-100">
        <md-card-header>
          <div class="md-title">Sign in</div>
        </md-card-header>

        <md-card-content>
          <input-field class="input-field"
            id="login-email"
            v-model.trim="form.email"
            label="Email"
            name="email"
            :errorMessage="errorMessage('email')"
                       v-validate="'required'"
          />
          <input-field
            class="input-field"
            id="login-password"
            v-model.trim="form.password"
            type="password"
            :togglePassword="true"
            label="Password"
            name="password"
            :errorMessage="errorMessage('password')"
            v-validate="'required'"
          />

          <div class="auth-page__bottom">
            <div class="auth-page__tips">
              <div class="tips__tip">
                Don't have an account?
                <router-link :to="{ name: 'signup' }">Register now</router-link>
              </div>
              <div class="tips__tip">
                Forgot your password?
                <router-link :to="{ name: 'recovery' }">Recover it</router-link>
              </div>
            </div>
            <md-button class="md-raised md-primary" :disabled="isPending">Sign in</md-button>
          </div>

        </md-card-content>
      </md-card>
    </form>
  </div>
</template>

<script>
  import formMixin from '../common/mixins/form.mixin'

  import i18n from '../../js/i18n/auth'
  import { errors } from '../../js/errors/error_factory'
  import { EventDispatcher } from '../../js/events/event_dispatcher'
  import { dispatchAppEvent } from '../../js/events/helpers'
  import { commonEvents } from '../../js/events/common_events'
  import { mapActions } from 'vuex'
  import { vuexTypes } from '../../vuex/types'
  import { vueRoutes } from '../../vue-router/const'

  import { confirmAction } from '../../js/modals/confirmation_message'
  import { WalletHelper } from '../../js/helpers/wallet.helper'
  import { walletService } from '../../js/services/wallet.service'
  import { emailService } from '../../js/services/email.service'
  import { usersService } from '../../js/services/users.service'
  import { authService } from '../../js/services/auth.service'

  export default {
    mixins: [formMixin],

    data: () => ({
      form: {
        password: '',
        email: ''
      }
    }),

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
        if (!await this.isValid) return
        this.disable()

        try {
          await this.sendLoginRequest()
          await this.checkIfUserExists()
          await this.sendCreateUserRequest()
          await this.storeUserDetails()
          await this.enterApplication()
        } catch (e) {
          this.handleReject(e)
        }
      },

      checkIfUserExists (accountId) {
        return this.$services.users.checkIfUserExists(accountId)
      },

      enterApplication () {
        this.setUserLoggedIn()
        dispatchAppEvent(commonEvents.enterAppEvent)
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
        return authService.login({ email: this.email, password: this.password })
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
          const kdf = await walletService.loadKdfParamsForEmail(this.email)
          const { walletId } = WalletHelper.calculateWalletParams(
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
  @import './auth';
</style>
