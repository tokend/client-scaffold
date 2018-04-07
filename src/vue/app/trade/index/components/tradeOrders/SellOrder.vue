<template>
  <form class="md-layout" @submit.prevent="submit">
    <md-card class="md-layout-item md-size-100 md-small-size-100 md-elevation-0">
      <md-card-header>
        <div class="md-title">Limit sell order</div>
      </md-card-header>

      <md-card-content>
        <div class="md-layout md-gutter">
          <div class="md-layout-item md-small-size-100">
            <input-field
              class="md-layout-item"
              v-model.trim="form.price"
              :label="`Price per ${filters.quote}`"
              name="order-buy-price"
              v-validate="'required'"
              type="number"
              placeholder="0"
              vvValidateOn="change"
              :errorMessage="(allowToValidPrice && (Number(form.price) === 0 || Number(form.price) < 0)  ? 'Price must be more than 0' : '')"
            />
          </div>
        </div>

        <div class="md-layout md-gutter">
          <div class="md-layout-item md-small-size-100">
            <input-field
              class="md-layout-item"
              v-model.trim="form.amount"
              :label="`Amount ${filters.base}`"
              name="order-buy-amount"
              v-validate="'required'"
              type="number"
              placeholder="0"
              vvValidateOn="change"
              :errorMessage="(allowToValidAmount && lessThanMinimumAmount) ? 'Minimal amount is 0.000001' : ''"
            />
          </div>
        </div>

        <div class="md-layout md-gutter">
          <div class="md-layout-item md-small-size-100">
            <input-field
              class="md-layout-item"
              v-model.trim="form.quoteAmount"
              :label="`Total ${filters.quote}`"
              name="order-buy-total"
              placeholder="0"
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
  import { attachEventHandler, dispatchAppEvent } from '../../../../../../js/events/helpers'
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

  export default {
    name: 'trade-orders-sell',
    mixins: [formMixin],
    components: { InputField },
    props: {
      assets: {
        type: Object,
        require: true
      }
    },
    data () {
      return {
        form: {
          price: '',
          amount: '',
          quoteAmount: ''
        },
        filters: {
          base: this.assets.base,
          quote: this.assets.quote
        },
        allowToValidPrice: false,
        allowToValidAmount: false,
        i18n
      }
    },
    created () {
      attachEventHandler(commonEvents.changePairsAsset, this.priceHistoryAssetsChanged)
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
        this.form.quoteAmount = this.form.price * this.form.amount
      },
      priceHistoryAssetsChanged (payload) {
        this.filters.base = payload.base
        this.filters.quote = payload.quote
      },
      async submit () {
        this.allowToValidPrice = true
        this.allowToValidAmount = true
        if (!await this.isValid()) return
        if (!await confirmAction()) return
        this.errors.clear()

        if (!this.accountBalances[this.filters.base]) {
          await accountsService.createBalance(this.filters.base)
          await this.loadBalances()
        }

        if (!this.accountBalances[this.filters.quote]) {
          await accountsService.createBalance(this.filters.quote)
          await this.loadBalances()
        }

        if (Number(this.accountBalances[this.filters.base].balance) < Number(this.form.quoteAmount)) {
          EventDispatcher.dispatchShowErrorEvent(i18n.trd_order_not_enough_funds())
          return
        }
        const fee = await this.loadFee()
        const opts = {
          amount: this.form.amount,
          price: this.form.price,
          orderBookId: SECONDARY_MARKET_ORDER_BOOK_ID,
          isBuy: false,
          baseBalance: this.accountBalances[this.filters.base].balance_id,
          quoteBalance: this.accountBalances[this.filters.quote].balance_id,
          fee: fee.percent
        }
        this.disable()
        try {
          await offersService.createOffer(opts)
          dispatchAppEvent(commonEvents.createdOrder)
          EventDispatcher.dispatchShowSuccessEvent(i18n.trd_offer_created())
        } catch (error) {
          console.error(error)
          EventDispatcher.dispatchShowErrorEvent(i18n.trd_some_went_wrong())
        }
        this.enable()
        this.resetForm()
      },
      loadFee () {
        return feeService.loadOfferFeeByAmount(this.filters.quote, this.form.quoteAmount)
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
