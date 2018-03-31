<template>
  <div>
    <detail :prop="i18n.counterpartyRole()" :value="tx.counterparty" :copiable="true"/>
    <detail :prop="i18n.lbl_amount()" :value="`${i18n.c(tx.amount)} ${tx.asset}`"/>
    <detail :prop="i18n.lbl_transfer_fee()" :value="`${transferFee} ${tx.asset}`"/>
    <detail :prop="i18n.lbl_date()" :value="tx.date"/>
  </div>
</template>

<script>
  import { add, subtract } from '../../../../../js/utils/math.util'
  import DetailsMixin from './details.mixin'

  export default {
    name: 'transfer-details',
    mixins: [DetailsMixin],
    computed: {
      counterpartyRole () {
        return this.transfer.direction === 'out' ? this.i18n.lbl_receiver() : this.i18n.lbl_sender()
      },
      senderPaid () {
        return this.transfer.fee === 'Sender paid'
      },
      transferFee () {
        if (this.senderPaid) return this.transfer.fee
        return this.localize(this.transfer.fee)
      },
      totalPaid () {
        return add(this.transfer.amount, this.transferFee)
      },
      totalReceived () {
        if (this.senderPaid) return this.transfer.amount
        return subtract(this.transfer.amount, this.transferFee)
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
