<template>
  <div>
    <detail :prop="i18n.lbl_destination_asset()" :value="tx.destinationAsset"/>
    <detail :prop="`${tx.destinationAsset} ${i18n.lbl_wallet()}`" :value="tx.counterparty" :copiable="true"/>
    <detail :prop="i18n.lbl_amount()" :value="`${i18n.c(tx.amount)} ${tx.asset}`"/>
    <detail :prop="i18n.lbl_fixed_fee()" :value="`${i18n.c(tx.fixedFee)} ${tx.asset}`"/>
    <detail :prop="i18n.lbl_percent_fee()" :value="`${i18n.c(tx.percentFee)} ${tx.asset}`"/>
    <detail :prop="i18n.lbl_destination_amount()" :value="`${i18n.c(tx.destinationAmount)} ${tx.destinationAsset}`"/>
    <detail :prop="i18n.lbl_date()" :value="tx.date"/>
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
