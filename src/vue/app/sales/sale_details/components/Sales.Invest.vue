<template>
  <div class="invest">
    <div class="invest__row">
      <h2 class="invest__header">Investing</h2>
      <select-field v-model="form.quote"
                    :values="sale.quoteAssetCodes"
                    class="invest__select-quoteAssets"
      />
    </div>
    <div class="invest__row">
      <div class="invest__input-quote-wrp">
        <input-field title="Your investment"
                      v-model="form.amount"
                      id="investment"
                      name="investment"
                      type="number"
                      v-validate="'required|amount'"
                      :label="i18n.sale_invest_asset({ asset: form.quote })"
        />
        <div class="invest__available"
            :class="{ 'invest__available--error': limitExceeded }"
            >
          Available:
          <span class="invest__available-amount">{{ available }}</span>
          <span class="invest__available-asset">{{ form.quote }}</span>
        </div>
      </div>
      <i class="material-icons invest__icon">arrow_right_alt</i>
      <div class="get__input-quote-wrp">
        <input-field title="Get quote"
                      v-model="form.convertedAmount" 
                      name="investment_converted"
                      id="investment_converted"
                      type="number"
                      v-validate="'required|amount'"
                      :label="i18n.sale_get_asset({ asset: sale.baseAsset })"
        />
      </div>
    </div>
        <!-- <div class="invest__tip">
      Tokens will only be issued if the funding target is reached by
      {{ humanizeDate(sale.endTime) }}
    </div> -->
    <div class="invest__actions">
      <md-button class="md-primary invest__btn">Invest</md-button>
    </div>
  </div>
</template>

<script>
  import FormMixin from '../../../../common/mixins/form.mixin'
  import { i18n } from '../../../../../js/i18n'
  import { localizeBase } from '../../../../../js/utils/format-num.util'
  import { PricesHelper } from '../../../../../vuex/helpers/prices.helper'
  import { mapGetters } from 'vuex'
  import { vuexTypes } from '../../../../../vuex/types'
  import _get from 'lodash/get'

  // import { commonEvents } from '../../../../factories/events/common_events'
  // import { ErrorHandler } from '../../../../factories/errors/error_handler'
  import { add, subtract } from '../../../../../js/utils/math.util'
  export default {
    name: 'sale-invest',
    mixins: [FormMixin],
    props: ['sale'],
    components: {},
    data: _ => ({
      form: {
        quote: '',
        amount: 0,
        convertedAmount: 0
      },
      i18n
    }),
    created () {
      this.setTokenCode()
    },
    computed: {
      ...mapGetters([
        vuexTypes.saleOffers,
        vuexTypes.accountBalances
      ]),
      offer () {
        return this.saleOffers.find(
          offer => offer.quoteAssetCode === this.form.quote &&
                   offer.baseAssetCode === this.sale.baseAsset) || {}
      },
      available () {
        const balance = add(
          _get(this.accountBalances, `${this.form.quote}.balance`) || 0,
          this.offer.baseAmount || 0)
        const left = balance ? subtract(balance, this.form.amount) : 0
        return left < 0 ? 0 : left
      },
      limitExceeded () {
        if (!this.form.amount) return false
        return this.available <= 0
      }
    },
    methods: {
      setTokenCode () {
        this.form.quote = this.sale.quoteAssetCodes[0] || null
      },
      // humanizeDate,
      localizeBase
    },
    watch: {
      'form.amount': function () {
        this.form.convertedAmount = PricesHelper.baseToQuote(this.form.amount, this.form.quote, this.sale.baseAsset)
      },
      'form.convertedAmount': function () {
        this.form.amount = PricesHelper.baseToQuote(this.form.convertedAmount, this.sale.baseAsset, this.form.quote)
      }
    }
  }
</script>

<style lang="scss">
  @import '../../../../../scss/variables';
  @import '../../../../../scss/mixins';

  .invest__header {
    font-weight: bold;
    margin-bottom: 1.5rem;
    margin-top: 4px;
    padding-top: 16px;
    white-space: nowrap;
  }

  .invest__progress-bar-wrp {
    margin-bottom: 1rem;
  }

  .invest__select-quote-wrp {
    max-width: 5rem;
    margin-bottom: .75rem;
  }

  .invest__input-quote-wrp,
  .get__input-quote-wrp {
    width: 40%;
  }

  .invest__available {
    margin-top: -.9rem;
    font-size: $fs-tip;

    &--error {
      color: $col-danger;
      .io-invest__available-amount { color: $col-danger }
    }
  }

  .invest__row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 40px;
    @include respond-to(large) {
      margin-bottom: 0;
    }
  }

  .invest__icon {
    align-self: center;
  }

  .invest__select-quoteAssets {
    width: 40%;
  }

  .invest__available-amount {
    color: $col-active;
    text-decoration: underline;
  }

  .invest__action {
    margin-bottom: 1rem;
    .btn {
      display: block;
      text-decoration: none;
      width: 100%;
    }
  }

  .invest__tip {
    font-size: $fs-tip;
  }

  .invest__actions {
    display: flex;
    justify-content: flex-end;
    .invest__btn {
      margin: 0;
    }
  }

</style>
