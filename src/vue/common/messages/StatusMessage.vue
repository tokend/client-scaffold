<template>

  <transition :name="type === 'error' ? 'statusPopup' : 'fade'">

    <div v-if="isShown"
         @click="close"
         class="status-message"
         :class="`status-message--${type}`"
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

      </div>

      <div class="status-text">
        {{ message }}
      </div>

    </div>

  </transition>

</template>

<script>
  import { EventDispatcher } from '../../../js/events/event_dispatcher'

  export default {
    name: 'status-message',

    props: [],

    data () {
      return {
        isShown: false,
        type: '',
        message: ''
      }
    },

    created () {
      this.attachEventListeners()
    },

    methods: {
      attachEventListeners () {
        EventDispatcher.attachToShowSuccessEvent(message => this.showSuccess(message))
        EventDispatcher.attachToShowErrorEvent(message => this.showError(message))
      },
      close () {
        this.isShown = false
        this.type = ''
        this.message = ''
      },
      open () {
        this.isShown = true
        window.setTimeout(this.close, 7200)
      },
      showError (message) {
        this.type = 'error'
        this.message = message
        this.open()
      },
      showSuccess (message) {
        this.type = 'success'
        this.message = message
        this.open()
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
