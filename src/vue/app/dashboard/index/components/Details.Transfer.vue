<template>
  <table class="app__table-details">
    <tr>
      <td>{{ counterpartyRole }}</td>
      <td>{{ tx.counterparty }}</td>
    </tr>
    <tr>
      <td>{{ i18n.lbl_amount() }}</td>
      <td>{{ `${i18n.c(tx.amount)} ${tx.asset}` }}</td>
    </tr>
    <tr>
      <td>{{ i18n.lbl_transfer_fee() }}</td>
      <td>{{ `${transferFee} ${tx.asset}` }}</td>
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
      transferFee () {
        if (this.senderPaid) return this.tx.fee
        return this.i18n.c(this.tx.fee)
      }
    }
  }
</script>
