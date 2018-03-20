<template>
  <div class="clipboard__outer">
    <div class="clipboard md-layout md-alignment-center-space-between">
      <div class="clipboard__value-outer">
        <label class="clipboard__label">{{ label }}</label>
        <span class="clipboard__value" id="clipboard-target">{{ value }}</span>
      </div>
      <md-button
        class="md-icon-button"
        id="clipboard-btn"
        @click="showSuccess"
        data-clipboard-target="#clipboard-target"
      >
        <md-icon class="clipboard__icon md-icon-half-sized">content_copy</md-icon>
        <md-tooltip>Copy</md-tooltip>
      </md-button>
    </div>
  </div>
</template>

<script>
  import { EventDispatcher } from '../../../js/events/event_dispatcher'
  import { i18n } from '../../../js/i18n'

  import Clipboard from 'clipboard'

  export default {
    name: 'clipboard-field',
    props: {
      value: { type: String, default: '' },
      label: { type: String, default: '' }
    },
    mounted () {
      const btn = document.querySelector('#clipboard-btn')
      if (!btn) return
      this.clipboard = new Clipboard(btn)
    },
    methods: {
      showSuccess () {
        EventDispatcher.dispatchShowSuccessEvent(i18n.dep_copied())
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../scss/variables';

  .clipboard {
    border-bottom: 1px solid $col-unfocused;
  }

  .clipboard__value-outer {
    display: flex;
    flex-direction: column;
  }

  .clipboard__label {
    font-size: $fs-tip;
    color: $col-unfocused;
  }
</style>
