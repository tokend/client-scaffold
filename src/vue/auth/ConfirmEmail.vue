<template>
  <div>
    <h2 class="auth-page__form-title">Almost done</h2>

    <p class="auth-page__form-descr">A confirmation email was sent to <span class="auth-page__form-descr-info">{{ email }}</span>. Please check your inbox to verify your account.</p>
    <p class="auth-page__form-descr">If you didn't receive a confirmation email, check your spam folder.</p>

    <div class="auth-page__submit">
      <button @click="requestNew"
              class="auth-page__submit-btn"
              :disabled="isButtonDisabled"
              v-ripple>
        Request new email
      </button>
    </div>
  </div>
</template>

<script>
  import form from '../common/mixins/form.mixin'
  import { EventDispatcher } from '../../js/events/event_dispatcher'
  import { emailService } from '../../js/services/email.service'

  export default {
    name: 'email-resend',

    mixins: [form],

    data () {
      return {
        walletId: '',
        email: ''
      }
    },

    beforeCreate () {
      if (!this.$route.query.walletId || !this.$route.query.email) {
        this.$router.push('/login')
      }
    },

    created () {
      this.walletId = this.$route.query.walletId
      this.email = this.$route.query.email
    },

    methods: {
      async requestNew () {
        this.disable()
        try {
          await emailService.sendResendEmailRequest(this.walletId)
          EventDispatcher.dispatchShowSuccessEvent('Request successfully sent. Please check your inbox')
        } catch (error) {
          console.error(error)
          EventDispatcher.dispatchShowErrorEvent('Email already confirmed')
        }
        this.enable()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'auth';
</style>
