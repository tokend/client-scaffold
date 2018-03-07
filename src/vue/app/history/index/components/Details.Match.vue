<template>
  <div>
    <detail :prop="i18n.lbl_fund_name()" :value="`${tx.counterparty}`"/>
    <detail :prop="i18n.lbl_base_asset()" :value="tx.baseAsset"/>
    <detail :prop="i18n.lbl_amount()" :value="`${tx.amount} ${tx.asset}`"/>
    <detail :prop="i18n.lbl_fee_paid()" :value="`${tx.feePaid} ${tx.feeAsset}`"/>
    <detail :prop="i18n.lbl_price()" :value="`${tx.price} ${tx.quoteAsset}`"/>
    <detail :prop="i18n.lbl_date()" :value="tx.date"/>
  </div>
</template>

<script>
  import DetailsMixin from './details.mixin'

  export default {
    name: 'issuance-details',
    mixins: [DetailsMixin]
  }
</script>

<style lang="scss" scoped>

</style>
