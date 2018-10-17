<template>
  <table class="app__table-details">
    <tr>
      <td>{{ i18n.lbl_fund_name() }}</td>
      <td class="app__table-details-counterparty">{{ tx.counterparty }}</td>
    </tr>
    <tr>
      <td>{{ i18n.lbl_base_asset() }}</td>
      <td>{{ tx.baseAsset }}</td>
    </tr>
    <tr>
      <td>{{ i18n.lbl_amount() }}</td>
      <td>{{ `${i18n.c(tx.amount)} ${tx.asset}` }}</td>
    </tr>
    <tr>
      <td>{{ i18n.lbl_fee_paid() }}</td>
      <td>{{ `${i18n.c(tx.feePaid)} ${tx.asset}` }}</td>
    </tr>
    <tr>
      <td>{{ i18n.lbl_price() }}</td>
      <td>{{ `${i18n.c(tx.price)} ${tx.quoteAsset}` }}</td>
    </tr>
    <tr>
      <td>{{ i18n.lbl_date() }}</td>
      <td>{{ tx.date }}</td>
    </tr>
  </table>
</template>

<script>
import DetailsMixin from './details.mixin'

export default {
  name: 'issuance-details',
  mixins: [DetailsMixin],
  computed: {
    id () {
      return this._uid
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
