<template>
  <div>
    <detail :prop="'Base amount'" :value="`${tx.baseAmount} ${tx.baseAssetCode}`"/>
    <detail :prop="'Quote amount'" :value="`${tx.quoteAmount} ${tx.quoteAssetCode}`"/>
    <detail :prop="'Order'" :value="tx.isBuy ? i18n.trd_order_buy() : i18n.trd_order_sell()"/>
    <detail :prop="'Price'" :value="`${tx.price} ${tx.quoteAssetCode}`"/>
    <detail :prop="'Fee'" :value="`${tx.fee} ${tx.baseAssetCode}`"/>
    <detail :prop="'Date'" :value="i18n.d(tx.createdAt)"/>
    <md-button class="md-accent cancel-button" @click="cancelOffer" :disabled="isPending">Cancel order</md-button>
  </div>
</template>

<script>
  import DetailsMixin from './details.mixin'
  import SubmitterMixin from '../../../../../common/mixins/submitter.mixin'

  import { i18n } from '../../../../../../js/i18n'
  import { mapGetters } from 'vuex'
  import { vuexTypes } from '../../../../../../vuex/types'
  import { ErrorHandler } from '../../../../../../js/errors/error_handler'
  import { offersService } from '../../../../../../js/services/offer.service'
  import { EventDispatcher } from '../../../../../../js/events/event_dispatcher'
  import { dispatchAppEvent } from '../../../../../../js/events/helpers'
  import { commonEvents } from '../../../../../../js/events/common_events'
  import { confirmAction } from '../../../../../../js/modals/confirmation_message'

  export default {
    name: 'manage-orders',
    mixins: [DetailsMixin, SubmitterMixin],
    props: {
      tx: { type: Object, require: true }
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
        if (!await confirmAction()) return
        this.disable()
        try {
          await offersService.cancelOffer({
            baseBalance: this.accountBalances[this.tx.baseAssetCode].balance_id,
            quoteBalance: this.accountBalances[this.tx.quoteAssetCode].balance_id,
            offerId: this.tx.id.toString(),
            price: this.tx.price,
            orderBookId: this.tx.orderBookId.toString()
          })
          dispatchAppEvent(commonEvents.cancelOrder)
          EventDispatcher.dispatchShowSuccessEvent(i18n.trd_offer_canceled())
        } catch (error) {
          ErrorHandler.processUnexpected(error)
          EventDispatcher.dispatchShowErrorEvent(i18n.trd_offer_failed_to_cancel())
        }
        this.enable()
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
