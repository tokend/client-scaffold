import Vue from 'vue'
import store from '../../vuex'
import { factorsService } from '../services/factors.service'
import { ErrorFactory } from '../errors/factory'

import i18n from '../i18n/auth'

import FormMixin from '../../vue/common/mixins/form.mixin'
import { EventDispatcher } from '../events/event_dispatcher'
import { WalletHelper } from '../helpers/wallet.helper'

const template = `
  <div>
    <div class="cover"></div>
    <div class="password-dialog form material">
      <button class="close-btn" @click="close"><i class="mdi mdi-close"></i></button>
      <h2>{{ passwordHeading }}</h2>
      <p>{{ passwordMessage }}</p>
      <div class="field input-field">
        <input type="password" name="password" id="password"
               v-model="password"
        >
        <label for="password">Password</label>
      </div>
      <button class="btn" @click="submit" :disabled="isPending">
        {{ isPending ? 'Pending...' : 'Submit' }}
      </button>
    </div>
  </div>
 `

export function createPasswordDialog (onSubmit, { salt, kdf, token, keychainData, factorId }) {
  const passwordScreen = document.createElement('div')
  const app = document.querySelector('#app')
  app.appendChild(passwordScreen)

  return new Promise((resolve, reject) => {
    const TFADialog = new Vue({
      template,
      store,
      mixins: [FormMixin],
      data () {
        return {
          passwordHeading: 'Password verification',
          passwordMessage: 'Enter password',
          isPending: false,
          password: ''
        }
      },
      methods: {
        removeEl () {
          this.$el.parentNode.removeChild(this.$el)
          return Promise.resolve(true)
        },
        async submit () {
          this.disable()
          let walletParams
          try {
            walletParams = WalletHelper.calculateWalletParams(
              this.password,
              this.$store.getters.email,
              salt,
              kdf
            )
          } catch (error) {
            console.error(error)
            this.enable()
            EventDispatcher.dispatchShowErrorEvent(i18n.password_not_verified)
            return
          }
          const walletKey = walletParams.walletKey
          let signedToken
          try {
            signedToken = WalletHelper.signToken(token, keychainData, walletKey)
          } catch (e) {
            this.enable()
            EventDispatcher.dispatchShowErrorEvent(i18n.password_not_verified)
            return
          }
          try {
            await factorsService.verifyFactor(factorId, token, signedToken)
          } catch (e) {
            this.enable()
            EventDispatcher.dispatchShowErrorEvent(i18n.default)
            return
          }
          this.enable()
          this.removeEl()
          const result = await onSubmit()
            .catch(err => reject(err))
          return resolve(result)
        },
        close () {
          this.removeEl()
          reject(ErrorFactory.getOTPCancelledError())
        }
      }
    })
    TFADialog.$mount(passwordScreen)
  })
}
