<template>
  <table class="app__table-details">
    <tr>
      <td>{{ counterpartyRole }}</td>
      <td :id="`el-${id}`" class="app__table-details-counterparty">{{ tx.counterparty }}</td>
    </tr>
    <tr>
      <td>{{ i18n.lbl_amount() }}</td>
      <td>{{ `${i18n.c(tx.amount)} ${tx.asset}` }}</td>
    </tr>
    <tr>
      <td>{{ i18n.lbl_sender_fee() }}</td>
      <td>{{ tx.fees.source }}</td>
    </tr>
    <tr>
      <td>{{ i18n.lbl_recipient_fee() }}</td>
      <td>{{ tx.fees.destination }}</td>
    </tr>
    <tr>
      <td>{{ i18n.lbl_fee_from_source() }}</td>
      <td>{{ tx.sourcePaysForDest }}</td>
    </tr>
    <tr>
      <td>{{ i18n.lbl_sender_fee_asset() }}</td>
      <td>{{ tx.sourceFeeAsset }}</td>
    </tr>
    <tr>
      <td>{{ i18n.lbl_recipient_fee_asset() }}</td>
      <td>{{ tx.destinationFeeAsset }}</td>
    </tr>
    <tr>
      <td>{{ i18n.lbl_date() }}</td>
      <td>{{ tx.date }}</td>
    </tr>
    <tr>
      <td>{{ i18n.lbl_subject() }}</td>
      <td>{{ tx.subject }}</td>
    </tr>
  </table>
</template>

<script>
  import DetailsMixin from './details.mixin'

  export default {
    name: 'transfer-details',
    mixins: [DetailsMixin],
    computed: {
      counterpartyRole () {
        return this.tx.direction === 'out' ? this.i18n.lbl_receiver() : this.i18n.lbl_sender()
      },
      id () {
        return this._uid
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
