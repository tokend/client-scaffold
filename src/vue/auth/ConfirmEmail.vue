<template>
  <div>
    <h2 class="auth-page__form-title">{{ i18n.lbl_almost_done() }}</h2>

    <p class="auth-page__form-descr">
      {{ i18n.auth_confirmation_email_path_1() }}
      <span class="auth-page__form-descr-info">{{ email }}</span>
      {{ i18n.auth_confirmation_email_path_2() }}
    </p>
    <p class="auth-page__form-descr">{{ i18n.auth_check_span_folder() }}</p>

    <div class="auth-page__submit">
      <button @click="requestNew"
              class="auth-page__submit-btn"
              :disabled="isButtonDisabled"
              v-ripple>
        {{ i18n.lbl_request_new_email() }}
      </button>
    </div>
  </div>
</template>

<script>
  import form from '../common/mixins/form.mixin'
  import { EventDispatcher } from '@/js/events/event_dispatcher'
  import { emailService } from '@/js/services/email.service'
  import { i18n } from '@/js/i18n'

  export default {
    name: 'email-resend',

    mixins: [form],

    data () {
      return {
        i18n,
        walletId: '',
        email: ''
      }
    },

    beforeCreate () {
      if (!this.$route.params.walletId || !this.$route.params.email) {
        this.$router.push('/login')
      }
    },

    created () {
      this.walletId = this.$route.params.walletId
      this.email = this.$route.params.email
    },

    methods: {
      async requestNew () {
        this.disable()
        try {
          await emailService.sendResendEmailRequest(this.walletId)
          EventDispatcher.dispatchShowSuccessEvent(i18n.auth_request_sent())
        } catch (error) {
          console.error(error)
          EventDispatcher.dispatchShowErrorEvent(i18n.auth_email_confirmed())
        }
        this.enable()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'auth';
</style>
