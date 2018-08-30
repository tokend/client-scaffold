<template>
  <div>
    <detail
      :prop="counterpartyRole"
      :value="tx.counterparty"
      :copiable="true" />
    <detail
      :prop="i18n.lbl_amount()"
      :value="`${i18n.c(tx.amount)} ${tx.asset}`" />

    <detail
      :prop="i18n.lbl_sender_fee()"
      :value="tx.fees.source" />
    <detail
      :prop="i18n.lbl_recipient_fee()"
      :value="tx.fees.destination" />
    <detail
      :prop="i18n.lbl_fee_from_source()"
      :value="tx.sourcePaysForDest" />
    <detail
      :prop="i18n.lbl_sender_fee_asset()"
      :value="tx.sourceFeeAsset" />
    <detail
      :prop="i18n.lbl_recipient_fee_asset()"
      :value="tx.destinationFeeAsset" />

    <detail
      :prop="i18n.lbl_date()"
      :value="tx.date" />
    <detail
      :prop="i18n.lbl_subject()"
      :value="`${tx.subject}`"
      class="subject-detail" />
  </div>
</template>

<script>
import DetailsMixin from './details.mixin'

export default {
  name: 'transfer-details',
  mixins: [DetailsMixin],
  computed: {
    counterpartyRole () {
      return this.tx.direction === 'out' ? this.i18n.lbl_receiver() : this.i18n.lbl_sender()
    }
  }
}
</script>

<style lang="scss" scoped>
  .subject-detail {
    text-align: right;
    margin-top: 8px
  }
</style>
