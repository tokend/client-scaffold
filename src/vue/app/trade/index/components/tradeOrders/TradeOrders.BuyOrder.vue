<template>
  <form class="md-layout" @submit.prevent="submit">
    <md-card class="md-layout-item md-size-100 md-small-size-100 md-elevation-0">
      <md-card-header>
        <div class="md-title">{{ i18n.trd_create_buy_order() }}</div>
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
                            Number(form.price) < 0)  ? i18n.trd_validate_minimal_price() : '')"
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
              :value="i18n.c(form.quoteAmount)"
              :label="i18n.trd_total_value({ value: assets.quote })"
              name="order-buy-total"
              :disabled="true"
            />
          </div>
        </div>
      </md-card-content>

      <md-card-actions>
        <md-button type="submit" class="md-primary" :disabled="isPending">Buy</md-button>
      </md-card-actions>
    </md-card>
  </form>
</template>

<script>
  import InputField from '../../../../../common/fields/InputField'
  import FormMixin from '../../../../../common/mixins/form.mixin'
  import OrderMakerMixin from '../order-maker.mixin'

  import { confirmAction } from '../../../../../../js/modals/confirmation_message'
  import { multiply } from '../../../../../../js/utils/math.util'
  import { i18n } from '../../../../../../js/i18n'

  export default {
    name: 'trade-orders-buy',
    mixins: [FormMixin, OrderMakerMixin],
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
      lessThanMinimumAmount () {
        return Number(this.form.amount) < 0.000001
      }
    },
    methods: {
      getQuoteAmount () {
        this.form.quoteAmount = multiply(this.form.price, this.form.amount)
      },
      async submit () {
        this.allowToValidPrice = true
        this.allowToValidAmount = true
        if (!await this.isValid()) return
        if (!await confirmAction()) return
        this.errors.clear()

        this.disable()
        await this.createOrder({
          pair: {
            base: this.assets.base,
            quote: this.assets.quote
          },
          baseAmount: this.form.amount,
          quoteAmount: this.form.quoteAmount,
          price: this.form.price,
          isBuy: true
        })
        this.enable()
        this.resetForm()
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
