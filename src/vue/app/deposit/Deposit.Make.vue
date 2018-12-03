<template>
  <div class="app__page-content-wrp">
    <deposit-bind />
    <deposit-coinpayments />
  </div>
</template>

<script>
import DepositCoinpayments from '@/vue/app/deposit/Deposit.Coinpayments'
import DepositBind from './Deposit.Bind'

export default {
  components: {
    DepositCoinpayments,
    DepositBind
  }
}
</script>
