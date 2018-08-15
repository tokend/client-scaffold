<template>
  <div>
    <detail :prop="'Base amount'" :value="`${tx.baseAmount} ${tx.baseAssetCode}`"/>
    <detail :prop="'Quote amount'" :value="`${tx.quoteAmount} ${tx.quoteAssetCode}`"/>
    <detail :prop="'Order'" :value="tx.isBuy ? i18n.trd_order_buy() : i18n.trd_order_sell()"/>
    <detail :prop="'Price'" :value="`${tx.price} ${tx.quoteAssetCode}`"/>
    <detail :prop="'Fee'" :value="`${tx.fee} ${tx.baseAssetCode}`"/>
    <detail :prop="'Date'" :value="i18n.d(tx.createdAt)"/>
    <button v-ripple @click="cancelOffer" class="cancel-button" :disabled="isPending">
      {{ i18n.trd_cancel_order() }}
    </button>
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
        }
        this.enable()
      }
    },
    watch: {

    }
  }
</script>

<style lang="scss" scoped>
  @import "~@scss/mixins";

  .cancel-button {
    @include button-accent();
    margin-left: -16px;
    margin-top: 24px;
    display: block;

    @include respond-to-custom(760px) {
      margin-left: 0;
      margin-right: auto;
    }
  }
</style>
