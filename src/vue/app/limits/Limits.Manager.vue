<template>
  <div class="limits-manager">
    <h2 class="limits-manager__title">{{ i18n.lim_change_limits_title({assetName: assetName, asset: asset}) }}</h2>
    <md-table class="limits-manager__table">
      <md-table-row class="limits-manager__table-row">
        <md-table-head class="limits-manager__table-head">{{i18n.lbl_to()}}</md-table-head>
        <md-table-head class="limits-manager__table-head
                            limits-manager__table-head--right">{{ i18n.lim_limits() }}</md-table-head>
      </md-table-row>
      <template v-for="([type, value],i) in Object.entries(form.limits)">
        <md-table-row class="limits-manager__table-row" :key="i">
          <md-table-cell class="limits-manager__table-cell">
          <span class="limits-manager__limit-type">
            {{ type.split(/(?=[A-Z])/).join(' ') }}
          </span>
          </md-table-cell>
          <md-table-cell class="limits-manager__table-cell
                              limits-manager__table-cell--right">
            <editable-input-field :value="value"
                                  :step="DEFAULT_INPUT_STEP"
                                  :fieldId="`${i}-${op}`"
                                  type="number"
                                  :nowrap="true"
                                  iconSize="18"
                                  align="right"
                                  min="0"
                                  @changed-value="form.limits[type] = $event.value"
            />
          </md-table-cell>
        </md-table-row>
      </template>
      <md-table-row class="limits-manager__table-row">
        <md-table-cell class="limits-manager__table-cell" colspan="2">
          <h3 class="limits-manager__note-label">{{i18n.lbl_note()}}</h3>
          <textarea-field v-model="form.note"
                      class="limits-manager__note-field"
          />
        </md-table-cell>
      </md-table-row>
    </md-table>
    <div class="limits-manager__btn-outer">
      <md-button class="limits-manager__update-btn md-primary"
                  :disabled="isPending"
                  @click="closeForm"
                  >{{i18n.lbl_cancel()}}</md-button>
      <md-button class="limits-manager__update-btn md-primary"
                  :disabled="isPending"
                  @click="submit"
                  >{{i18n.lbl_send_request()}}</md-button>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import FormMixin from '../../common/mixins/form.mixin'
  import EditableInputField from '../../common/fields/EditableInputField'
  import {
    DEFAULT_INPUT_STEP
  } from '../../../js/const/const'
  import { i18n } from '../../../js/i18n'
  import { accountsService } from '../../../js/services/accounts.service'
  import { ErrorHandler } from '../../../js/errors/error_handler'
  import { EventDispatcher } from '../../../js/events/event_dispatcher'

  import { vuexTypes } from '../../../vuex/types'
  import _get from 'lodash/get'
  const limitsRequestType = Object.freeze({
    initial: 'initial',
    docsUploading: 'docsUploading'
  })
  export default {
    name: 'LimitsManager',
    mixins: [FormMixin],
    props: ['asset', 'limits', 'op'],
    components: { EditableInputField },
    data: _ => ({
      form: {
        limits: {},
        note: ''
      },
      limitsRequestType,
      DEFAULT_INPUT_STEP,
      i18n
    }),

    created () {
      this.form.limits = this.limits.limitOuts
    },

    computed: {
      ...mapGetters([
        vuexTypes.accountBalances,
        vuexTypes.accountType
      ]),
      limitOuts () {
        return this.limits.limitOuts
      },
      assetName () {
        return _get(this.accountBalances[this.asset], 'asset_details.details.name')
      }
    },
    methods: {
      async submit () {
        this.disable()
        try {
          const assetCode = this.asset
          const limits = this.form.limits
          const note = this.form.note
          const requestType = limitsRequestType.initial
          const operationType = this.op
          await accountsService.createLimitRequest({
            details: JSON.stringify({
              operationType,
              assetCode,
              limits,
              requestType,
              note
            })
          })
          this.closeForm()
          EventDispatcher.dispatchShowSuccessEvent(i18n.lim_requested())
        } catch (e) {
          ErrorHandler.processUnexpected(e)
        }
        this.enable()
      },
      closeForm () {
        this.$emit('close-request')
      }
    }
  }
</script>

<style lang="scss">
  @import '../../../scss/variables';

  .limits-manager {
    width: 100%;
    max-width: 40rem;
  }

  .limits-manager__content-title {
    font-weight: bold;
  }

  .limits-manager__limit-type {
    text-transform: capitalize;
    white-space: nowrap;
  }

  .limits-manager__table-row {
    border: none !important;
    &:hover .md-table-cell { background: none !important; }
  }

  .limits-manager__table-head {
    &--right { text-align: right }
  }

  .limits-manager__table-cell:first-child .md-table-cell-container,
  .limits-manager__table-head:first-child .md-table-head-label {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .limits-manager__table-cell {
    border: none !important;
    & .md-table-cell-container {
      padding-bottom: 0 !important;
      padding-top: 0 !important;
      height: auto !important;
    }
  }

  .limits-manager__note-label { margin-bottom: 1rem; }

  .limits-manager__btn-outer  {
    display: flex;
    justify-content: flex-end;
    margin-right: -1.5rem;
  }

  .md-table-head-label:last-child,
  .md-table-cell:last-child .md-table-cell-container {
    padding-right: 0 !important;
  }
</style>
