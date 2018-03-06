import Vue from 'vue'
import store from '../../vuex'

import { ErrorFactory, errors } from '../errors/factory'
import { EventDispatcher } from '../events/event_dispatcher'

import i18n from '../i18n/auth'

import FormMixin from '../../vue/common/mixins/form.mixin'

import { factorsService } from '../services/factors.service'

const template = `
  <div>
    <div class="cover"></div>
    <div class="tfa-dialog form material">
      <button class="close-btn" @click="close"><i class="mdi mdi-close"></i></button>
      <h2>{{ tfaHeading }}</h2>
      <p>{{ tfaMessage }}</p>
      <div class="field input-field">
        <input type="text" name="tfa-code" id="tfa"
               placeholder="12345"
               v-model="otp"
        >
        <label for="tfa">Code</label>
      </div>
      <button class="btn" @click="submit" :disabled="isPending || !otp">
        {{ isPending ? 'Pending...' : 'Submit' }}
      </button>
    </div>
  </div>
 `

export function createTfaDialog (onSubmit, { factorId, token }, walletId) {
  const tfaScreen = document.createElement('div')
  const app = document.querySelector('#app')
  app.appendChild(tfaScreen)

  return new Promise((resolve, reject) => {
    const TFADialog = new Vue({
      template,
      store,
      mixins: [FormMixin],
      data () {
        return {
          tfaHeading: '2-factor authentication',
          tfaMessage: 'Enter 2FA code',
          otp: ''
        }
      },
      methods: {
        removeEl () {
          this.$el.parentNode.removeChild(this.$el)
          return Promise.resolve(true)
        },
        async submit () {
          this.disable()
          await factorsService.verifyFactor(factorId, token, this.otp, walletId)
            .catch(err => {
              this.enable()
              if (err instanceof errors.TFAWrongCodeError) {
                EventDispatcher.dispatchShowErrorEvent(i18n.tfa_wrong_code)
              }
              return Promise.reject(err)
            })
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
    TFADialog.$mount(tfaScreen)
  })
}
