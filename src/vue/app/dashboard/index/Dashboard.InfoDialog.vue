<template>
  <md-dialog :md-active.sync="show" @md-closed="closeDialog" class="info-dialog">
    <md-dialog-title>Transaction details</md-dialog-title>
    <md-list>
      <md-list-item class="info-dialog__item">
        <div class="info-dialog__label">Date</div>
        <div class="info-dialog__value">{{ dialogValues.date }}</div>
      </md-list-item>

      <md-list-item class="info-dialog__item">
        <div class="info-dialog__label">Transaction type</div>
        <div class="info-dialog__value">{{ dialogValues.name }}</div>
      </md-list-item>

      <md-list-item class="info-dialog__item">
        <div class="info-dialog__label">Transaction ID</div>
        <div class="info-dialog__value" id="transaction-clipboard-target">{{ dialogValues.id }}</div>
        <md-button
          class="md-icon-button info-dialog__clipboard"
          id="transaction-clipboard-btn"
          @click="showCopySuccess"
          data-clipboard-target="#transaction-clipboard-target"
        >
          <md-icon>content_copy</md-icon>
          <md-tooltip>Copy</md-tooltip>
        </md-button>
      </md-list-item>

      <md-list-item class="info-dialog__item">
        <div class="info-dialog__label">{{ dialogValues.direction === 'in' ? 'From' : 'To' }}</div>
        <div class="info-dialog__value" id="counterparty-clipboard-target">{{ dialogValues.counterparty }}</div>
        <md-button
          class="md-icon-button info-dialog__clipboard"
          id="counterparty-clipboard-btn"
          @click="showCopySuccess"
          data-clipboard-target="#counterparty-clipboard-target"
        >
          <md-icon>content_copy</md-icon>
          <md-tooltip>Copy</md-tooltip>
        </md-button>
      </md-list-item>

      <md-list-item class="info-dialog__item">
        <div class="info-dialog__label">Asset</div>
        <div class="info-dialog__value">{{ dialogValues.asset }}</div>
      </md-list-item>

      <md-list-item class="info-dialog__item">
        <div class="info-dialog__label">Amount</div>
        <div class="info-dialog__value">{{ dialogValues.amount }} {{ dialogValues.asset }}</div>
      </md-list-item>

      <md-list-item class="info-dialog__item">
        <div class="info-dialog__label">State</div>
        <div class="info-dialog__value">{{ dialogValues.state }}</div>
      </md-list-item>

    </md-list>

    <md-dialog-actions>
      <md-button class="md-primary" @click="closeDialog">Close</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
  import Clipboard from 'clipboard'
  import { EventDispatcher } from '../../../../js/events/event_dispatcher'
  import { i18n } from '../../../../js/i18n'

  export default {
    name: 'info-dialog',
    components: {},
    props: {
      showDialog: { type: Boolean, default: false },
      dialogValues: { type: Object, default: {} }
    },
    data () {
      return {
        show: this.showDialog,
        transactionClipboard: null,
        counterpartyClipboard: null
      }
    },
    created () {},
    computed: {},
    mounted () {
      this.transactionClipboard = new Clipboard(document.querySelector('#transaction-clipboard-btn'))
      this.counterpartyClipboard = new Clipboard(document.querySelector('#counterparty-clipboard-btn'))
    },
    methods: {
      closeDialog (value) {
        this.$emit('close-dialog', false)
      },
      showCopySuccess () {
        EventDispatcher.dispatchShowSuccessEvent(i18n.dep_copied())
      }
    }
  }
</script>

<style lang="scss" scoped>

  @import '../../../../scss/variables.scss';

  .info-dialog {
    padding: 8px 16px;
  }

  .info-dialog__label {
    width: 220px;
    padding-right: 16px;
  }

  .info-dialog__value {
    width: 240px;
    padding-right: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .info-dialog__clipboard {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }

</style>
