<template>
  <div class="auth-page md-layout md-alignment-center-center">
    <md-card>

      <md-card-header>
        <div class="md-title">Almost done</div>
      </md-card-header>

      <md-card-content>

        <p>A confirmation email was sent to <span class="info">{{ email }}</span>. Please check your inbox to verify your account</p>
        <p>If you didn't receive a confirmation email, check your spam folder.</p>

        <div class="md-layout md-alignment-center-right">
          <md-button @click="requestNew"
                    :disabled="isButtonDisabled">
            Request new email
          </md-button>
        </div>

      </md-card-content>
    </md-card>
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
