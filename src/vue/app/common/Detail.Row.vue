<template>
  <p class="detail-row">
    <span class="detail-row__key">{{ prop }}</span>
    <span class="detail-row__value">
      <span class="detail-row__value-text" :id="copiable ? 'clipboard-target' : ''">{{ value }}</span>
      <md-button
        v-if="copiable"
        class="detail-row__clipboard-btn md-icon-button"
        id="clipboard-btn"
        @click="showCopySuccess"
        data-clipboard-target="#clipboard-target"
      >
        <md-icon class="detail-row__clipboard-icon md-icon-size-065x">content_copy</md-icon>
        <md-tooltip>Copy</md-tooltip>
      </md-button>
    </span>
  </p>
</template>

<script>
  import Clipboard from 'clipboard'
  import { EventDispatcher } from '../../../js/events/event_dispatcher'
  import { i18n } from '../../../js/i18n'

  export default {
    name: 'detail-row',
    props: {
      prop: { type: String, default: '' },
      value: { type: String, default: '' },
      copiable: { type: Boolean, default: false }
    },
    data: _ => ({
      clipboard: null
    }),
    mounted () {
      if (!this.copiable) return
      this.clipboard = new Clipboard(document.querySelector('#clipboard-btn'))
    },
    methods: {
      showCopySuccess () {
        EventDispatcher.dispatchShowSuccessEvent(i18n.dep_copied())
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../scss/variables';
  @import '../../../scss/mixins';

  .detail-row {
    display: flex;
    justify-content: space-between;
    line-height: 1.6rem;
    width: 100%;
  }

  .detail-row__key {
    color: $col-md-unfocused;
  }

  .detail-row__value {
    position: relative;

    .detail-row__clipboard-btn {
      @include center-vertically;

      position: absolute;
      right: -48px;
    }
  }

  .detail-row__value-text {
    display: block;
    max-width: 12rem;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .detail-row__clipboard-icon {
    position: relative;
    bottom: .1rem;
  }
</style>
