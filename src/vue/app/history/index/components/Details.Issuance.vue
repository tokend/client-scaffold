<template>
  <div>
    <detail :prop="i18n.lbl_sender()" :value="tx.counterparty"/>
    <detail :prop="i18n.lbl_amount()" :value="`${tx.amount} ${tx.asset}`"/>
    <detail :prop="i18n.lbl_fixed_fee()" :value="`${tx.fixedFee} ${tx.feeAsset}`"/>
    <detail :prop="i18n.lbl_percent_fee()" :value="`${tx.percentFee} ${tx.feeAsset}`"/>
    <detail :prop="i18n.lbl_date()" :value="tx.date"/>
  </div>
</template>

<script>
  import { subtract } from '../../../../../js/utils/math.util'
  import DetailsMixin from './details.mixin'

  export default {
    name: 'issuance-details',
    mixins: [DetailsMixin],

    computed: {
      totalReceived () {
        return subtract(
          subtract(this.issuance.amount, this.issuance.fixedFee),
          this.issuance.percentFee)
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
