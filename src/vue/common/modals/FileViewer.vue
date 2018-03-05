<template>
  <div class="file-viewer" v-if="file">

    <object class="file-viewer__embed"
           :id="`${file.name}-embed`"
           :type="file.type"
           :data="url"
           :class="{ 'file-viewer__embed--pdf': file.type === 'application/pdf' }"
           title>
    </object>
    <div class="cover" @click="close"></div>

  </div>
</template>

<script>
  import { commonEvents } from '../../../js/events/common_events'
  import { attachEventHandler } from '../../../js/events/helpers'
  import config from '../../../config'

  export default {
    name: 'file-viewer',

    data () {
      return {
        file: null
      }
    },

    created () {
      attachEventHandler(commonEvents.openFileViewEvent, this.open)
      attachEventHandler(commonEvents.closeFileViewEvent, this.close)
    },

    computed: {
      url () {
        if (this.file.key) return `${config.FILE_STORAGE}/${this.file.key}`
        return this.file.url
      }
    },

    methods: {
      open (file) {
        this.file = file
      },
      close () {
        this.file = null
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../scss/variables';
  @import '../../../scss/mixins';

  .file-viewer {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    z-index: $z-embed-page;


    .file-viewer__embed {
      @include center;

      position: absolute;
      height: 90%;
      z-index: $z-embed-page;

      &--pdf {
        width: 90%;
      }
    }
  }
</style>
