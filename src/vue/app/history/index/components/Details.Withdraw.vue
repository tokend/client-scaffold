<template>
  <div>
    <detail :key="i18n.lbl_destination_asset()" :value="tx.destinationAsset"/>
    <detail :key="`${tx.destinationAsset} ${i18n.lbl_wallet}`" :value="tx.counterparty"/>
    <detail :key="i18n.lbl_amount()" :value="`${tx.amount} ${tx.asset}`"/>
    <detail :key="i18n.lbl_fixed_fee()" :value="`${tx.fixedFee} ${tx.feeAsset}`"/>
    <detail :key="i18n.lbl_percent_fee()" :value="`${tx.percentFee} ${tx.feeAsset}`"/>
    <detail :key="i18n.lbl_destination_amount()" :value="`${tx.destinationAmount} ${tx.destinationAsset}`"/>
    <detail :key="i18n.lbl_date()" :value="tx.date"/>
  </div>
</template>

<script>
  import DetailsMixin from './details.mixin'

  export default {
    name: 'withdraw-details',
    mixins: [DetailsMixin],

    computed: {
      totalAmount () {
        return Number(this.withdraw.amount) + Number(Number(this.withdraw.fixedFee) + Number(this.withdraw.percentFee))
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
