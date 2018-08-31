import { EventDispatcher } from '@/js/events/event_dispatcher'
import { ErrorHandler } from '@/js/errors/error_handler'
import { dispatchAppEvent } from '@/js/events/helpers'
import { commonEvents } from '@/js/events/common_events'

import { SECONDARY_MARKET_ORDER_BOOK_ID } from '@/js/const/offers.const'
import { i18n } from '@/js/i18n'

import { offersService } from '@/js/services/offer.service'
import { accountsService } from '@/js/services/accounts.service'
import { feeService } from '@/js/services/fees.service'

import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex/types'

export default {
  computed: {
    ...mapGetters([
      vuexTypes.accountBalances
    ])
  },
  methods: {
    ...mapActions({
      loadBalances: vuexTypes.GET_ACCOUNT_BALANCES
    }),
    /**
     * @param opts
     * @param {object} opts.pair - pair to create order for
     * @param {object} opts.pair.base
     * @param {object} opts.pair.quote
     * @param {object} opts.baseAmount
     * @param {object} opts.quoteAmount
     * @param {object} opts.price
     * @param {object} opts.isBuy
     * @returns {Promise<void>}
     */
    async createOrder (opts) {
      try {
        if (!this.accountBalances[opts.pair.base]) {
          await accountsService.createBalance(opts.pair.base)
          await this.loadBalances()
        }

        if (!this.accountBalances[opts.pair.quote]) {
          await accountsService.createBalance(opts.pair.quote)
          await this.loadBalances()
        }

        // const asset = opts.isBuy ? opts.pair.quote : opts.pair.base
        // const amount = opts.isBuy ? opts.quoteAmount : opts.baseAmount

        // if (Number(this.accountBalances[asset].balance) < Number(amount)) {
        //   EventDispatcher.dispatchShowErrorEvent(
        //     i18n.trd_order_not_enough_funds()
        //   )
        //   this.enable()
        //   return
        // }

        const fee =
          await feeService.loadOfferFeeByAmount(
            opts.pair.quote, opts.quoteAmount
          )

        await offersService.createOffer({
          amount: opts.baseAmount,
          price: opts.price,
          orderBookId: SECONDARY_MARKET_ORDER_BOOK_ID,
          isBuy: opts.isBuy,
          baseBalance: this.accountBalances[opts.pair.base].balance_id,
          quoteBalance: this.accountBalances[opts.pair.quote].balance_id,
          fee: fee.percent
        })
        dispatchAppEvent(commonEvents.createdOrder)
        EventDispatcher.dispatchShowSuccessEvent(i18n.trd_offer_created())
      } catch (error) {
        ErrorHandler.processUnexpected(error)
      }
    }
  }
}
