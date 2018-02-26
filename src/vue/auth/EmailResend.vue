<template>
  <div class="auth-page">

    <div class="form-block resend-email-block material">
      <i class="mdi mdi-email"></i>

      <h2>Almost done</h2>
      <p class="check-email"> A confirmation email was sent to <span class="info">{{ email }}</span>. Please check your inbox to verify your account</p>
      <p class="bad-happens">If you didn't receive a confirmation email, check your spam folder or</p>

      <button class="btn" @click="requestNew" :disabled="isButtonDisabled">Request new email</button>
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

    created () {
      this.walletId = this.$route.query.walletId
      this.email = this.$route.query.email
    },

    methods: {
      requestNew () {
        this.disable()
          .then(this.sendResendEmailRequest)
          .then(this.enable)
          .then(_ => EventDispatcher.dispatchShowSuccessEvent('Request successfully sent. Please check your inbox'))
          .catch(_ => EventDispatcher.dispatchShowErrorEvent('Email already confirmed'))
      },
      sendResendEmailRequest () {
        return emailService.sendResendEmailRequest(this.walletId)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/style/form';
  @import 'auth';
  @import '../../assets/style/variables';

  .resend-email-block {
    max-width: 770px;
    text-align: center;
    i {
      font-size: $material-icon-xx-super-big;
    }

    .check-email {
      margin-bottom: 50px;
    }

    .bad-happens {
      font-size: $fs-tip;
      color: $col-unfocused;
      margin-bottom: 10px;
    }
  }
</style>
