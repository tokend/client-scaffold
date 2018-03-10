import Vue from 'vue'
import store from '../../vuex'
import FormMixin from '../../vue/common/mixins/form.mixin'

import { ErrorFactory, errors } from '../errors/factory'
import { EventDispatcher } from '../events/event_dispatcher'
import { factorsService } from '../services/factors.service'
import { i18n } from '../i18n'

const template = `
  <form novalidate>
   <md-dialog :md-active.sync="isOpened" class="app__dialog">
    <md-dialog-title>{{ i18n.mod_tfa_required() }}</md-dialog-title>
    
    <input-field
     v-model="form.code"
     v-validate="'required'"
       id="modal-tfa-code"
       name="code"
      :errorMessage="errorMessage('code')"
      :label="i18n.lbl_tfa_code()"
    />
      
    <md-dialog-actions>
     <md-button class="md-primary md-raised" :disabled="isPending" @click="submit">{{ i18n.lbl_submit() }}</md-button>
    </md-dialog-actions>
    
   </md-dialog>
  </form>   
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
      data: _ => ({
        form: {
          code: ''
        },
        isOpened: true,
        i18n
      }),
      methods: {
        async submit () {
          if (!await this.isValid()) return
          this.disable()

          try {
            await factorsService.verifyFactor(factorId, token, this.form.code, walletId)
          } catch (error) {
            if (error instanceof errors.TFAWrongCodeError) {
              EventDispatcher.dispatchShowErrorEvent(i18n.tfa_wrong_code())
              this.enable()
              return
            }
            return reject(error)
          }

          this.enable()
          this.removeEl()

          try {
            return resolve(await onSubmit())
          } catch (error) {
            return reject(error)
          }
        },
        close () {
          this.isOpened = false
          this.removeElement()
          reject(ErrorFactory.getOTPCancelledError())
        },
        removeElement () {
          this.isOpened = false
          this.$el.parentNode.removeChild(this.$el)
        }
      }
    })
    TFADialog.$mount(tfaScreen)
  })
}
