<template>
  <div class="load-indicator" v-if="isShown">
    <div class="load-indicator__runner"></div>
  </div>
</template>

<script>
  import { commonEvents } from '@/js/events/common_events'
  import { attachEventHandler } from '@/js/events/helpers'

  export default {
    name: 'load-indicator',

    data () {
      return {
        isShown: false
      }
    },

    created () {
      attachEventHandler(commonEvents.showLoadIndicator, this.show)
      attachEventHandler(commonEvents.hideLoadIndicator, this.hide)
    },

    methods: {
      show () {
        this.isShown = true
      },
      hide () {
        this.isShown = false
      }
    }
  }
</script>

<style lang="scss">
  @import '~@scss/variables';

  .load-indicator {
    height: 5px;
    left: 0;
    overflow: hidden;
    position: absolute;
    top: 0;
    width: 100%;
  }

  $width: 65%;

  @keyframes run {
    from { left: -$width; width: $width; }
    to { left: 100%; width: $width;}
  }

  .load-indicator__runner {
    background: $col-active;
    animation: run 3s linear infinite;
    border-radius: 3%;
    height: 3px;
    position: absolute;
    width: 80%;
  }
</style>
