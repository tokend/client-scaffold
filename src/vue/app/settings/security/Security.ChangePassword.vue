<template>
  <md-list-item class="change-password" @click="isFormOpened = !isFormOpened">

    <span class="md-list-item-text">{{i18n.set_change_password() }}</span>
    <md-icon class="md-icon--half-sized">play_arrow</md-icon>

    <md-dialog class="change-password__dialog" :md-active.sync="isFormOpened" :md-click-outside-to-close="!isPending">
      <md-progress-bar md-mode="indeterminate" v-if="isPending"/>
      <md-dialog-title>{{ i18n.set_change_password() }}</md-dialog-title>
      <form novalidate
              class="change-password"
              @submit.prevent="submit">


          <div class="app__dialog-inner">
            <input-field
              v-model="form.password"
              id="settings-password"
              name="password"
              type="password"
              :togglePassword="true"
              :label="i18n.lbl_new_pwd()"
              :errorMessage="errorMessage('password')"
              v-validate="'required|min:6'"
            />
            <input-field
              v-model="form.confirmPassword"
              id="settings-confirm-password"
              name="confirm-password"
              type="password"
              :label="i18n.lbl_pwd_confirm()"
              v-validate="'required'"
              :errorMessage="pwdUnconfirmedMessage"
            />
          </div>

          <md-dialog-actions class="md-layout md-alignment-center-right">
            <button v-ripple
                    type="button"
                    @click="isFormOpened = !isFormOpened"
                    class="app__button-flat"
                    :disabled="isPending">
              {{ i18n.lbl_cancel() }}
            </button>
            <button v-ripple
                    type="submit"
                    class="app__button-flat"
                    :disabled="isPending">
              {{ i18n.lbl_submit() }}
            </button>
          </md-dialog-actions>
        </form>
    </md-dialog>
  </md-list-item>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { EventDispatcher } from '../../../../js/events/event_dispatcher'
  import { authService } from '../../../../js/services/auth.service'
  import { vuexTypes } from '../../../../vuex/types'
  import { i18n } from '../../../../js/i18n'

  import Form from '../../../common/mixins/form.mixin'

  export default {
    name: 'change-password',
    mixins: [Form],
    data: _ => ({
      isFormOpened: false,
      i18n,
      form: {
        password: '',
        confirmPassword: ''
      }
    }),
    computed: {
      ...mapGetters([
        vuexTypes.userEmail,
        vuexTypes.accountId
      ]),
      pwdUnconfirmedMessage () {
        return (this.form.password && this.form.confirmPassword &&
                this.form.confirmPassword !== this.form.password)
               ? i18n.set_pwd_do_not_match() : ''
      }
    },
    methods: {
      ...mapActions({
        storeNewData: vuexTypes.STORE_USER_DATA_FROM_WALLET
      }),
      async submit () {
        if (!await this.isValid()) return
        if (this.pwdUnconfirmedMessage) return
        this.disable()
        try {
          const newKeys = await authService.changePassword({
            email: this.userEmail,
            newPassword: this.form.password
          })
          EventDispatcher.dispatchShowSuccessEvent(i18n.set_pwd_changed())
          this.isFormOpened = false
          this.storeNewData({
            publicKey: newKeys.newPublicKey,
            walletId: newKeys.newWalletId,
            seed: newKeys.newSeed,
            accountId: this.accountId,
            email: this.userEmail
          })
        } catch (error) {
          console.error(error)
          if (error.showBanner) {
            error.showBanner(i18n.unexpected_error())
            this.enable()
            return
          }
          EventDispatcher.dispatchShowErrorEvent(i18n.unexpected_error())
        }
        this.enable()
      }
    },
    watch: {
      isFormOpened () {
        this.form.password = ''
        this.form.confirmPassword = ''
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import './settings.scss';
  .md-dialog {
    width: 36rem;
  }
</style>
