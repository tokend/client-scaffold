<template>
  <div>
    <detail :prop="'Base amount'" :value="`${tx.baseAmount} ${tx.baseAssetCode}`"/>
    <detail :prop="'Quote amount'" :value="`${tx.quoteAmount} ${tx.quoteAssetCode}`"/>
    <detail :prop="'Order'" :value="tx.isBuy ? 'Buy' : 'Sell'"/>
    <detail :prop="'Price'" :value="`${tx.price} ${tx.quoteAssetCode}`"/>
    <detail :prop="'Fee'" :value="`${tx.fee} ${tx.baseAssetCode}`"/>
    <detail :prop="'Date'" :value="i18n.d(tx.createdAt)"/>
    <md-button class="md-accent cancel-button" @click="cancelOffer">Cancel order</md-button>
  </div>
</template>

<script>
  import DetailsMixin from './details.mixin'
  import { i18n } from '../../../../../../js/i18n'
  import { mapGetters } from 'vuex'
  import { vuexTypes } from '../../../../../../vuex/types'
  import { offersService } from '../../../../../../js/services/offer.service'
  import { EventDispatcher } from '../../../../../../js/events/event_dispatcher'
  import { dispatchAppEvent } from '../../../../../../js/events/helpers'
  import { commonEvents } from '../../../../../../js/events/common_events'
  import { confirmAction } from '../../../../../../js/modals/confirmation_message'

  export default {
    name: 'manage-orders',
    mixins: [DetailsMixin],
    props: {
      tx: {
        type: Object,
        require: true
      }
    },
    data () {
      return {
        i18n
      }
    },
    created () {

    },
    computed: {
      ...mapGetters([
        vuexTypes.accountBalances
      ])
    },
    methods: {
      async cancelOffer () {
        const opts = {
          baseBalance: this.accountBalances[this.tx.baseAssetCode].balance_id,
          quoteBalance: this.accountBalances[this.tx.quoteAssetCode].balance_id,
          offerId: this.tx.id.toString(),
          price: this.tx.price,
          orderBookId: this.tx.orderBookId.toString()
        }
        try {
          if (!await confirmAction()) return
          await offersService.cancelOffer(opts)
          dispatchAppEvent(commonEvents.cancelOrder)
          EventDispatcher.dispatchShowSuccessEvent(i18n.trd_offer_canceled())
        } catch (error) {
          console.error(error)
          EventDispatcher.dispatchShowErrorEvent(i18n.trd_offer_failed_to_cancel())
        }
      }
    },
    watch: {

    }
  }
</script>

<style lang="scss" scoped>
  .cancel-button {
    margin-left: auto;
    margin-right: 0;
    margin-top: 24px;
    display: block;
  }
</style>
