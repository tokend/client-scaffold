import Vue from 'vue'
import InputField from '../../vue/common/fields/InputField'

// :successMessage="isSeedValid ? 'Your seed is valid. Please don't forget to save it' : ''"

const template = `
<div>
  <md-dialog :md-active="opened" class="app__dialog">
     <md-dialog-title>Save this seed to your offline device</md-dialog-title>
     
     <p>
       For security reasons, please put this seed in some secret place.
       You will need it to recover access in case if your account will be lost.
     </p>
     
     <input-field
       :value="seed"
       id="signup-recovery-seed"
       type="password"
       :togglePassword="true"
       label="Seed"
       name="recovery-seed"
       :readonly="true"
     />
     
     <p>Please validate this seed in the field below to ensure that you copied it properly</p>
     
     <input-field
       v-model.trim="provideSeed"
       id="signup-provide-seed"
       type="password"
       :togglePassword="true"
       label="Validate seed"
       name="recovery-seed"
       :errorMessage="isSeedValid ? '' : 'Provided seed does not match with generated one'"
     />
     
     <md-dialog-actions>
       <md-button class="md-primary" @click="submit">OK</md-button>
     </md-dialog-actions>
   </md-dialog>
 </div>
`

export function showRememberSeedMessage (seed) {
  const message = document.createElement('div')
  const app = document.querySelector('#app main')
  app.appendChild(message)

  return new Promise((resolve) => {
    const messageEl = new Vue({
      template,
      components: { InputField },
      data () {
        return {
          seed,
          provideSeed: '',
          opened: true
        }
      },

      computed: {
        isSeedValid () {
          return this.seed === this.provideSeed
        }
      },

      methods: {
        close () {
          if (!this.isSeedValid) return
          this.opened = false
          this.$el.parentNode.removeChild(this.$el)
        },
        async submit () {
          if (!this.isSeedValid) return
          this.close()
          return resolve(true)
        }
      }
    })
    messageEl.$mount(message)
  })
}
