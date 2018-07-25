<template>
  <table class="app__table-details">
    <tr>
      <td>{{ i18n.lbl_sender() }}</td>
      <td :id="`el-${id}`" class="app__table-details-counterparty">{{ tx.counterparty }}</td>
    </tr>
    <tr>
      <td>{{ i18n.lbl_amount() }}</td>
      <td>{{ `${i18n.c(tx.amount)} ${tx.asset}` }}</td>
    </tr>
    <tr>
      <td>{{ i18n.lbl_fixed_fee() }}</td>
      <td>{{ `${i18n.c(tx.fixedFee)} ${tx.asset}` }}</td>
    </tr>
    <tr>
      <td>{{ i18n.lbl_percent_fee() }}</td>
      <td>{{ `${i18n.c(tx.percentFee)} ${tx.asset}` }}</td>
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
