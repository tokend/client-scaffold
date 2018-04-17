<template>
  <div>
    <detail :prop="counterpartyRole" :value="tx.counterparty" :copiable="true"/>
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
        return this.tx.direction === 'out' ? this.i18n.lbl_receiver() : this.i18n.lbl_sender()
      },
      senderPaid () {
        return this.tx.fee === 'Sender paid'
      },
      transferFee () {
        if (this.senderPaid) return this.tx.fee
        return this.i18n.c(this.tx.fee)
      },
      totalPaid () {
        return add(this.tx.amount, this.transferFee)
      },
      totalReceived () {
        if (this.senderPaid) return this.tx.amount
        return subtract(this.tx.amount, this.transferFee)
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
