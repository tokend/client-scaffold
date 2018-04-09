<template>
  <form class="md-layout" @submit.prevent="submit">
    <md-card class="md-layout-item md-size-100 md-small-size-100 md-elevation-0">
      <md-card-header>
        <div class="md-title">{{ i18n.trd_create_sell_order() }}</div>
      </md-card-header>

      <md-card-content>
        <div class="md-layout md-gutter">
          <div class="md-layout-item md-small-size-100">
            <input-field
              class="md-layout-item"
              v-model.trim="form.price"
              :label="i18n.trd_price_per({ asset: assets.quote })"
              name="order-buy-price"
              v-validate="'required'"
              type="number"
              :errorMessage="(allowToValidPrice && (Number(form.price) === 0 ||
                            Number(form.price) < 0) ? i18n.trd_validate_minimal_price() : '')"
            />
          </div>
        </div>

        <div class="md-layout md-gutter">
          <div class="md-layout-item md-small-size-100">
            <input-field
              class="md-layout-item"
              v-model.trim="form.amount"
              :label="i18n.trd_amount_for({ asset: assets.base })"
              name="order-buy-amount"
              v-validate="'required'"
              type="number"
              :errorMessage="(allowToValidAmount && lessThanMinimumAmount) ? i18n.trd_validate_minimal_amount() : ''"
            />
          </div>
        </div>

        <div class="md-layout md-gutter">
          <div class="md-layout-item md-small-size-100">
            <input-field
              class="md-layout-item"
              v-model.trim="form.quoteAmount"
              :label="i18n.trd_total_value({ value: assets.quote })"
              name="order-buy-total"
              :disabled="true"
            />
          </div>
        </div>
      </md-card-content>

      <md-card-actions>
        <md-button type="submit" class="md-primary" :disabled="isPending">Sell</md-button>
      </md-card-actions>
    </md-card>
  </form>
</template>

<script>
  import { dispatchAppEvent } from '../../../../../../js/events/helpers'
  import { commonEvents } from '../../../../../../js/events/common_events'
  import formMixin from '../../../../../common/mixins/form.mixin'
  import InputField from '../../../../../common/fields/InputField'
  import { offersService } from '../../../../../../js/services/offer.service'
  import { accountsService } from '../../../../../../js/services/accounts.service'
  import { feeService } from '../../../../../../js/services/fees.service'
  import { EventDispatcher } from '../../../../../../js/events/event_dispatcher'
  import { mapGetters, mapActions } from 'vuex'
  import { vuexTypes } from '../../../../../../vuex/types'
  import { SECONDARY_MARKET_ORDER_BOOK_ID } from '../../../../../../js/const/const'
  import { confirmAction } from '../../../../../../js/modals/confirmation_message'
  import { i18n } from '../../../../../../js/i18n'
  import { ErrorHandler } from '../../../../../../js/errors/error_handler'
  import { multiply } from '../../../../../../js/utils/math.util'

  export default {
    name: 'trade-orders-sell',
    mixins: [formMixin],
    components: { InputField },
    props: {
      assets: { type: Object, require: true }
    },
    data () {
      return {
        form: {
          price: '',
          amount: '',
          quoteAmount: ''
        },
        allowToValidPrice: false,
        allowToValidAmount: false,
        i18n
      }
    },
    created () {
    },
    computed: {
      ...mapGetters([
        vuexTypes.accountBalances
      ]),
      lessThanMinimumAmount () {
        return Number(this.form.amount) < 0.000001
      }
    },
    methods: {
      ...mapActions({
        loadBalances: vuexTypes.GET_ACCOUNT_BALANCES
      }),
      getQuoteAmount () {
        this.form.quoteAmount = i18n.c(multiply(this.form.price, this.form.amount))
      },
      async submit () {
        this.allowToValidPrice = true
        this.allowToValidAmount = true
        if (!await this.isValid()) return
        if (!await confirmAction()) return
        this.errors.clear()

        if (!this.accountBalances[this.assets.base]) {
          await accountsService.createBalance(this.assets.base)
          await this.loadBalances()
        }

        if (!this.accountBalances[this.assets.quote]) {
          await accountsService.createBalance(this.assets.quote)
          await this.loadBalances()
        }

        if (Number(this.accountBalances[this.assets.base].balance) < Number(this.form.quoteAmount)) {
          EventDispatcher.dispatchShowErrorEvent(i18n.trd_order_not_enough_funds())
          return
        }
        const fee = await this.loadFee()
        const opts = {
          amount: this.form.amount,
          price: this.form.price,
          orderBookId: SECONDARY_MARKET_ORDER_BOOK_ID,
          isBuy: false,
          baseBalance: this.accountBalances[this.assets.base].balance_id,
          quoteBalance: this.accountBalances[this.assets.quote].balance_id,
          fee: fee.percent
        }
        this.disable()
        try {
          await offersService.createOffer(opts)
          dispatchAppEvent(commonEvents.createdOrder)
          EventDispatcher.dispatchShowSuccessEvent(i18n.trd_offer_created())
        } catch (error) {
          ErrorHandler.processUnexpected(error)
          EventDispatcher.dispatchShowErrorEvent(i18n.trd_some_went_wrong())
        }
        this.enable()
        this.resetForm()
      },
      loadFee () {
        return feeService.loadOfferFeeByAmount(this.assets.quote, this.form.quoteAmount)
      },
      resetForm () {
        this.form.price = ''
        this.form.amount = ''
        setTimeout(() => this.changeAllow(), 0)
      },
      changeAllow () {
        this.allowToValidPrice = false
        this.allowToValidAmount = false
      }
    },
    watch: {
      'form.price' (value) {
        this.getQuoteAmount()
        this.allowToValidPrice = true
      },
      'form.amount' (value) {
        this.getQuoteAmount()
        this.allowToValidAmount = true
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
