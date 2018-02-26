import Vue from 'vue'

export function showStatusMessage ({ text, type }) {
  const statusMessage = document.createElement('div')
  const app = document.querySelector('#app')
  app.appendChild(statusMessage)

  const messageEl = new Vue({
    template: `
      <div @click="close()"
           class="status-message"
          :class="\`status-message--${type}\`"
      >
  
        <div class="status-heading flex-row flex-row--justify-between flex-row--align-center">
          <div class="flex-row flex-row--align-center" v-if="type === 'success'">
            <i class="mdi mdi-check-circle"></i>
            Success!
          </div>
          <div class="flex-row flex-row--align-center" v-if="type === 'error'">
            <i class="mdi mdi-close-circle"></i>
            Error
          </div>
  
          <div class="flex-row flex-row--align-center" v-if="type === 'info'">
            <i class="mdi mdi-info"></i>
            Information!
          </div>
  
        </div>
  
        <div class="status-text">
          {{ message }}
        </div>
  
      </div>
    `,
    data () {
      return {
        message: text,
        type
      }
    },
    mounted () {
      window.setTimeout(this.close, 1500)
    },
    methods: {
      close () {
        this.$el.parentNode.removeChild(this.$el)
      }
    }
  })
  messageEl.$mount(statusMessage)
}
