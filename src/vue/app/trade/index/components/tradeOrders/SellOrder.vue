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
        <md-button type="submit" class="md-primary">Sell</md-button>
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
  import { feeService } from '../../../../../../js/services/fees.service'
  import { EventDispatcher } from '../../../../../../js/events/event_dispatcher'
  import { mapGetters } from 'vuex'
  import { vuexTypes } from '../../../../../../vuex/types'
  import { SECONDARY_MARKET_ORDER_BOOK_ID } from '../../../../../../js/const/const'
  import { confirmAction } from '../../../../../../js/modals/confirmation_message'

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
        allowToValidAmount: false
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
        if (Number(this.accountBalances[this.filters.base].balance) < Number(this.form.quoteAmount)) {
          EventDispatcher.dispatchShowErrorEvent('Недостаточно средств!')
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
        try {
          dispatchAppEvent(commonEvents.createdOrder)
          EventDispatcher.dispatchShowSuccessEvent('оффер успешно создан')
        } catch (error) {
          offersService.createOffer(opts)
          console.error(error)
          EventDispatcher.dispatchShowErrorEvent('что-то пошло не так')
        }
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
