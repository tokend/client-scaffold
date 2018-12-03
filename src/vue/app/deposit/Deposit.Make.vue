<template>
  <div class="app__page-content-wrp deposit__page-content-wrp">
    <div class="deposit__wrp">
      <deposit-bind />
      <deposit-coinpayments />
    </div>
  </div>
</template>

<script>
import DepositCoinpayments from '@/vue/app/deposit/Deposit.Coinpayments'
import DepositBind from './Deposit.Bind'

import { mapActions } from 'vuex'
import { vuexTypes } from '@/vuex/types'

export default {
  components: {
    DepositCoinpayments,
    DepositBind
  },
  created () {
    this.loadAccount()
  },
  methods: {
    ...mapActions({
      loadAccount: vuexTypes.GET_ACCOUNT_DETAILS
    })
  }
}
</script>

<style lang="scss">
@import '~@scss/variables';
@import '~@scss/mixins';

.deposit__page-content-wrp {
  max-width: 46 * 2.15 * $point !important;
}

.deposit__wrp {
  display: flex;
  justify-content: space-between;

  @include respond-to(medium) {
    flex-direction: column;
    align-items: center;
  }
}
</style>
