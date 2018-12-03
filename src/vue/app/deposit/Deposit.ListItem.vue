<template>
  <div class="deposit-list-item">
    <div class="app__card deposit-list-item__inner">
      <span
        class="deposit-list-item__td
               deposit-list-item__td--time"
      >
        <md-icon class="deposit-list__icon-watch">query_builder</md-icon>
        <timeout-ticker :timeout="item.timeLeft" />
      </span>

      <span
        class="deposit-list-item__td
               deposit-list-item__td--amount">
        {{ item.amount }} {{ item.asset }}
      </span>

      <button
        class="deposit-list-item__td
               deposit-list-item__td--qr
               app__button-icon"
        @click="isAddressShown = true"
      >
        <i class="deposit-list__icon-qr mdi mdi-qrcode">
          <!---->
        </i>
      </button>
    </div>

    <modal
      v-if="isAddressShown"
      @close-request="isAddressShown = false"
      max-width="30rem"
    >
      <div class="deposit-list-item__address-wrp">
        <address-viewer
          :address="item.address"
          :amount="item.amount"
          :asset="item.asset"
          :timeout="item.timeLeft"
        />
      </div>
    </modal>
  </div>
</template>

<script>
import TimeoutTicker from './TimeoutTicker'
import AddressViewer from './Deposit.AddressViewer'
import Modal from '../common/Modal'

export default {
  components: {
    TimeoutTicker,
    AddressViewer,
    Modal
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data: _ => ({
    isAddressShown: false
  })
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";

.deposit-list-item__inner {
  margin-bottom: 1.5 * $point;
  padding: 1 * $point 2 * $point;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.deposit-list-item__td {
  display: flex;
  align-items: center;
}

.deposit-list__icon-watch {
  margin-right: 1 * $point;
  color: $col-pending!important;
}

.deposit-list__icon-qr {
  font-size: 2.4 * $point;
  color: $col-unfocused;
}

.deposit-list-item__address-wrp {
  padding-bottom: 2 * $point;
}
</style>
