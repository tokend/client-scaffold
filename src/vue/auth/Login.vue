<template>
  <div class="auth-page md-layout md-alignment-center-center">

    <form novalidate
          class="auth-page__form
                 md-layout
                 md-layout-item
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
          <div class="md-title">{{ i18n.log_signin() }}</div>
        </md-card-header>

        <md-card-content>
          <input-field class="input-field"
            id="login-email"
            v-model.trim="form.email"
            :label="i18n.lbl_email()"
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
            :label="i18n.lbl_pwd()"
            name="password"
            :errorMessage="errorMessage('password')"
            v-validate="'required'"
          />

          <div class="auth-page__bottom">
            <div class="auth-page__tips">
              <div class="tips__tip">
                {{ i18n.log_dont_have_an_account() }}
                <router-link :to="{ name: 'signup' }">{{ i18n.log_register_now() }}</router-link>
              </div>
              <div class="tips__tip">
                {{ i18n.log_forgot_password() }}
                <router-link :to="{ name: 'recovery' }">{{ i18n.log_recover_it() }}</router-link>
              </div>
            </div>
            <md-button type="submit" class="md-raised md-primary" :disabled="isPending">{{ i18n.log_signin() }}</md-button>
          </div>

        </md-card-content>
      </md-card>
    </form>
  </div>
</template>

<script>
  import formMixin from '../common/mixins/form.mixin'

  import { errors } from '../../js/errors/factory'
  import { EventDispatcher } from '../../js/events/event_dispatcher'
  import { ErrorHandler } from '../../js/errors/error_handler'
  import { dispatchAppEvent } from '../../js/events/helpers'
  import { commonEvents } from '../../js/events/common_events'
  import { mapActions, mapGetters } from 'vuex'
  import { vuexTypes } from '../../vuex/types'
  import { vueRoutes } from '../../vue-router/const'

  import { confirmAction } from '../../js/modals/confirmation_message'
  import { showAlert } from '../../js/modals/alert_message'
  import { WalletHelper } from '../../js/helpers/wallet.helper'
  import { walletService } from '../../js/services/wallet.service'
  import { emailService } from '../../js/services/email.service'
  import { usersService } from '../../js/services/users.service'

  import { i18n } from '../../js/i18n'

  export default {
    mixins: [formMixin],

    data: () => ({
      form: {
        password: '',
        email: ''
      },
      i18n
    }),

    created () {
      if (this.verifyEmailParams) return this.verifyEmail()
    },

    computed: {
      ...mapGetters([
        vuexTypes.accountId,
        vuexTypes.accountType,
        vuexTypes.accountBlocked
      ]),
      verifyEmailParams () {
        const token = this.$route.params.token
        const walletId = this.$route.params.walletId
        if (token && walletId) return { token, walletId }
        return null
      }
    },

    methods: {
      ...mapActions({
        setUserLoggedIn: vuexTypes.LOG_IN, // TODO

        processUserWallet: vuexTypes.PROCESS_USER_WALLET,
        loadAccount: vuexTypes.GET_ACCOUNT_DETAILS,
        loadUser: vuexTypes.GET_USER_DETAILS,
        loadBalances: vuexTypes.GET_ACCOUNT_BALANCES
      }),

      async submit () {
        if (!await this.isValid()) return
        this.form.email = this.form.email.toLowerCase()
        this.disable()
        try {
          await this.processUserWallet(this.form)
          if (!await usersService.checkIfUserExists()) {
            await usersService.createUser(this.accountId)
          }
          await this.fetchUserDetails()
          await this.enterApplication()
        } catch (error) {
          switch (error.constructor) {
            case errors.NotFoundError:
              error.showBanner(i18n.not_found())
              break
            case errors.EmailNotVerifiedError:
              this.handleNotVerifiedError()
              break
            default:
              ErrorHandler.processUnexpected(error)
          }
        }
        this.enable()
      },

      async fetchUserDetails () {
        await Promise.all([
          this.loadUser(),
          this.loadAccount(),
          this.loadBalances()
        ])
      },

      enterApplication () {
        this.setUserLoggedIn()
        dispatchAppEvent(commonEvents.enterAppEvent)
        this.$router.push(vueRoutes.app)
        if (this.accountBlocked) {
          showAlert({
            title: i18n.mod_accountBlocked_title(),
            message: i18n.mod_accountBlocked_message()
          })
        }
      },

      // TODO: wtf, need drop this away
      async handleNotVerifiedError () {
        if (!await confirmAction({
          title: i18n.mod_email_not_verified_title(),
          message: i18n.mod_email_not_verified_message()
        })) return
        this.disable()
        try {
          const kdf = await walletService.loadKdfParamsForEmail(this.form.email)
          const { walletId } = WalletHelper.calculateWalletParams(
            this.form.password,
            this.form.email,
            kdf.attributes().salt,
            kdf.attributes()
          )
          await emailService.sendResendEmailRequest(walletId)
          EventDispatcher.dispatchShowSuccessEvent(i18n.email_sent())
        } catch (error) {
          ErrorHandler.processUnexpected(error)
        }
        this.enable()
      },

      async verifyEmail () {
        try {
          await emailService.sendVerifyEmailRequest(this.verifyEmailParams.token, this.verifyEmailParams.walletId)
          EventDispatcher.dispatchShowSuccessEvent(i18n.email_verified())
        } catch (error) {
          console.error(error)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import './auth';
</style>
