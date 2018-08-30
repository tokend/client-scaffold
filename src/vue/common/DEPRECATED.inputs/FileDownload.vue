<template>
  <div class="file-download">

    <a
      :href="url"
      class="file-download__link"
      download>
      <i class="mdi mdi-download" />
      <span
        class="file-download__file-name"
        :title="file.name">{{ file.name }}</span>
    </a>

    <a
      :href="url"
      class="view-btn"
      target="_blank"
      rel="noopener">
      <span>View  <i class="mdi mdi-open-in-new" /></span>
    </a>
    <!--<button class="view-btn" @click="view">-->
    <!--View online-->
    <!--</button>-->

  </div>
</template>

<script>
import { commonEvents } from '../../../js/events/common_events'
import { dispatchAppEvent } from '../../../js/events/helpers'
import config from '../../../config'

export default {
  name: 'file-download',

  props: {
    file: {
      type: Object,
      required: true
    }
  },

  computed: {
    url () {
      if (this.file.key) return `${config.FILE_STORAGE}/${this.file.key}`
      if (this.file.url) return this.file.url
    }
  },

  methods: {
    view () {
      dispatchAppEvent(commonEvents.openFileViewEvent, this.file)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../../scss/variables';
  @import '../../../scss/mixins';

  .file-download {
    display: flex;
  }

  .file-download__link {
    color: $col-text;
    text-decoration: none;
    display: flex;
    align-items: center;
    i {
      font-size: $material-icon-big;
      margin-right: 10px;
    }
  }

  .view-btn {
    color: $col-active;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: $fs-tip;
    margin-left: 15px;
    text-decoration: underline;

    i {
      font-size: $fs-tip;
      color: $col-active;
      margin-left: 5px;
    }
  }

  .file-download__file-name {
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

</style>
