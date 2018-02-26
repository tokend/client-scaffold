import Vue from 'vue'

import store from '../../vuex'

const template = `
    <div class="confirmation-message-outer">
      <div class="cover" @click="cancel"></div>
  
      <div class="confirmation-message material">
  
        <div class="close-btn" @click="cancel">
          <i class="mdi mdi-close"></i>
        </div>
  
        <h2 class="confirmation-message__title">
          {{ title }}
        </h2>
  
        <div class="confirmation-message__text">
          {{ message }}
        </div>
  
        <div class="confirmation-message__buttons">
  
          <button class="cancel-btn btn-secondary btn-secondary--danger" @click="cancel">
            Cancel
          </button>
  
          <button class="confirm-btn btn" @click="confirm">
            Confirm
          </button>
  
        </div>
  
      </div>
  
    </div>
`

export function confirmAction ({ title, message } = {}) {
  const container = document.createElement('div')
  const app = document.querySelector('#app')
  app.appendChild(container)

  return new Promise((resolve, reject) => {
    const confirmMessage = new Vue({
      template,
      store,
      data () {
        return {
          title: title || 'Are you sure?',
          message: message || 'Please confirm this action before continuing'
        }
      },
      methods: {
        removeEl () {
          this.$el.parentNode.removeChild(this.$el)
        },
        confirm () {
          this.removeEl()
          return resolve(true)
        },
        cancel () {
          this.removeEl()
          return resolve(false)
        }
      }
    })
    confirmMessage.$mount(container)
  })
}
