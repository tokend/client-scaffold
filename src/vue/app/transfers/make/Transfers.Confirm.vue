<template>
  <md-card class="transfer-confirm">
    <md-progress-bar md-mode="indeterminate" v-if="isPending"/>

    <md-card-header>
      <div class="md-title">{{ i18n.tr_confirm() }}</div>
    </md-card-header>

    <md-card-content>

      <div class="transfer-confirm__inner">
        <detail-row :prop="i18n.lbl_asset()"
                    :value="`${opts.tokenCode}`"
        />
        <detail-row :prop="i18n.lbl_amount()" :value="`${i18n.c(opts.amount)} ${opts.tokenCode}`"/>

        <h4>{{ i18n.lbl_recipient() }}</h4>

        <md-list class="md-double-line">
          <md-list-item>
            <md-avatar class="md-avatar-icon md-accent">{{ opts.destinationEmail.charAt(0).toUpperCase() }}</md-avatar>

            <div class="md-list-item-text">
              <span>{{ opts.destinationEmail }}</span>
              <span>{{ opts.destinationAccountId }}</span>
            </div>
          </md-list-item>
        </md-list>

        <div class="md-layout md-gutter md-alignment-center-space-between">
          <div class="md-layout-item md-size-40 md-small-size-100">
            <h4>{{ i18n.lbl_sender_fees() }}</h4>

            <detail-row :prop="i18n.lbl_fixed()" :value="`${i18n.c(senderFee.fixed)} ${opts.sourceFeeAsset}`" />
            <detail-row :prop="i18n.lbl_percent()" :value="`${i18n.c(senderFee.percent)} ${opts.sourceFeeAsset}`" />
          </div>
          <div class="md-layout-item  md-size-40 md-small-size-100 text-align-right">
            <h4>{{ i18n.lbl_recipient_fees() }}</h4>

            <detail-row :prop="i18n.lbl_fixed()" :value="`${i18n.c(recipientFee.fixed)} ${opts.destinationFeeAsset}`" />
            <detail-row :prop="i18n.lbl_percent()" :value="`${i18n.c(recipientFee.percent)} ${opts.destinationFeeAsset}`" />
          </div>
        </div>

        <md-checkbox v-model="form.sourcePaysForDest">{{ i18n.tr_pay_fee_for_rec() }}</md-checkbox>

        <h4>{{ i18n.lbl_subject() }}</h4>
        <textarea-field class="transfer-confirm__subject-field" :value="opts.subject" disabled/>
      </div>

      <div class="md-layout md-alignment-center-right">

      </div>

    </md-card-content>
    <md-dialog-actions class="transfer-dialog__actions">
      <md-button class="md-primary" @click="$emit(commonEvents.cancelClickEvent)" :disabled="isPending">
        {{ i18n.lbl_cancel() }}
      </md-button>
      <md-button class="md-primary" @click="$emit(commonEvents.confirmClickEvent, form.sourcePaysForDest)" :disabled="isPending">
        {{ i18n.lbl_confirm() }}
      </md-button>
    </md-dialog-actions>
  </md-card>
</template>

<script>
  import DetailRow from '../../common/Detail.Row'
  import TextareaField from '../../../common/fields/TextareaField'

  import { commonEvents } from '../../../../js/events/common_events'
  import { formatDate } from '../../../../js/utils/dates.util'
  import { assetMap } from '../../../../js/const/asset_map'
  import { i18n } from '../../../../js/i18n'
  import { add } from '../../../../js/utils/math.util'

  export default {
    name: 'transfers-confirm',
    components: { DetailRow, TextareaField },
    props: { opts: { type: Object, required: true }, isPending: { type: Boolean, default: false } },
    data: _ => ({
      i18n,
      assetMap,
      commonEvents,
      form: {
        sourcePaysForDest: false
      }
    }),
    computed: {
      senderFee () {
        if (this.form.sourcePaysForDest) {
          return {
            fixed: add(this.opts.sourceFixedFee, this.opts.destinationFixedFee),
            percent: add(this.opts.sourcePercentFee, this.opts.destinationPercentFee)
          }
        }
        return {
          fixed: this.opts.sourceFixedFee,
          percent: this.opts.sourcePercentFee
        }
      },
      recipientFee () {
        if (this.form.sourcePaysForDest) {
          return { fixed: 0, percent: 0 }
        }
        return {
          fixed: this.opts.destinationFixedFee,
          percent: this.opts.destinationPercentFee
        }
      }
    },
    methods: {
      formatDate
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../scss/variables';

  .transfer-confirm__subject-field {
    padding-top: 0;
  }

  .transfer-confirm__inner {
    padding: .75rem 1.2rem 0;
  }
</style>
