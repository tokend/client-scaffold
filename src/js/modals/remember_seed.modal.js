import Vue from 'vue'

const template = `

      <div>
          <div class="cover"></div>
          <div class="remember-seed-message form material">
            <h2>Save this seed to your offline device</h2>
            <p>
              For security reasons, please put this seed in some secret place.
              You will need it to recover access in case if your account will be lost.
            </p>
            <div class="field input-field">
              <input type="text"
                     id="seed"
                     v-model="seed"
                     readonly
              />
              <label for="seed">Seed</label>
            </div>

            <p>Please validate this seed in the field below to ensure that you copied it properly</p>
            
            <div class="field input-field">
              <input type="text"
                     id="seed-provide"
                     v-model="provideSeed"
              />
              <label for="seed-provide">Validate seed</label>

              <div class="success-tip" v-if="isSeedValid">Your seed is valid. Please don't forget to save it</div>
              <div class="error-tip" v-else>Provided seed does not match with generated one</div>
            </div>
            
            <div class="btn-outer">
            <button class="btn" @click="submit" :disabled="!isSeedValid">
              Continue
            </button>
            </div>
            
          </div>
        </div>          
    
`

export function showRememberSeedMessage (seed) {
  const message = document.createElement('div')
  const app = document.querySelector('#app')
  app.appendChild(message)

  return new Promise((resolve) => {
    const messageEl = new Vue({
      template,
      data () {
        return {
          seed,
          provideSeed: ''
        }
      },

      computed: {
        isSeedValid () {
          return this.seed === this.provideSeed
        }
      },

      methods: {
        close () {
          this.$el.parentNode.removeChild(this.$el)
        },
        async submit () {
          this.close()
          return resolve(true)
        }
      }
    })
    messageEl.$mount(message)
  })
}
