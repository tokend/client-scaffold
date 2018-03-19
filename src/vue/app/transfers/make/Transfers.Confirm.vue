<template>
  <md-card class="transfer-confirm">
    <md-card-header>
      <div class="md-title">{{ i18n.tr_confirm() }}</div>
    </md-card-header>

    <md-card-content>

      <div class="transfer-confirm__inner">
        <detail-row :prop="i18n.lbl_asset()"
                    :value="`${assetMap[opts.tokenCode]} (${opts.tokenCode})`"
        />
        <detail-row :prop="i18n.lbl_amount()" :value="`${opts.amount} ${opts.tokenCode}`"/>

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

            <detail-row :prop="i18n.lbl_fixed()" :value="`${opts.sourceFixedFee} ${opts.tokenCode}`" />
            <detail-row :prop="i18n.lbl_percent()" :value="`${opts.sourcePercentFee} ${opts.tokenCode}`" />
          </div>
          <div class="md-layout-item  md-size-40 md-small-size-100 text-align-right">
            <h4>{{ i18n.lbl_recipient_fees() }}</h4>

            <detail-row :prop="i18n.lbl_fixed()" :value="`${opts.destinationFixedFee} ${opts.tokenCode}`" />
            <detail-row :prop="i18n.lbl_percent()" :value="`${opts.destinationPercentFee} ${opts.tokenCode}`" />
          </div>
        </div>

        <h4>{{ i18n.lbl_subject() }}</h4>
        <textarea-field class="transfer-confirm__subject-field" :value="opts.subject" disabled/>
      </div>

      <div class="transfer-confirm__btn-outer md-layout md-alignment-center-right">
        <md-button class="md-primary" @click="$emit(commonEvents.cancelClickEvent)">{{ i18n.lbl_cancel() }}</md-button>
        <md-button class="md-primary" @click="$emit(commonEvents.confirmClickEvent)">{{ i18n.lbl_confirm() }}</md-button>
      </div>

    </md-card-content>

  </md-card>
</template>

<script>
  import DetailRow from '../../common/Detail.Row'
  import { i18n } from '../../../../js/i18n'
  import { formatDate } from '../../../../js/utils/dates.util'
  import { assetMap } from '../../../../js/const/asset_map'
  import TextareaField from '../../../common/fields/TextareaField'
  import { commonEvents } from '../../../../js/events/common_events'

  export default {
    name: 'transfers-confirm',
    components: { DetailRow, TextareaField },
    props: { opts: { type: Object, required: true } },
    data: _ => ({
      i18n,
      assetMap,
      commonEvents
    }),
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

  .transfer-confirm__btn-outer {
    padding: 2rem 0 0;
  }
</style>
