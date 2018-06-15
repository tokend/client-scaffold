<template>
  <div class="invest">
    <div class="invest__row">
      <select-field v-model="form.quoteAsset"
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
                      v-validate="'required|amount|min_value:0'"
                      :label="i18n.sale_invest_asset({ asset: form.quoteAsset })"
        />
        <div class="invest__available"
            :class="{ 'invest__available--error': limitExceeded }"
            >
          Available:
          <span class="invest__available-amount">{{ i18n.c(available) }}</span>
          <span class="invest__available-asset">{{ form.quoteAsset }}</span>
        </div>
      </div>
      <i class="invest__convert-icon material-icons">compare_arrows</i>
      <div class="get__input-quote-wrp">
        <span class="investment_converted-label">{{i18n.sale_get_asset({ asset: sale.defaultQuoteAsset })}}</span>
        <span class="investment_converted">{{ form.convertedAmount }}</span>
      </div>
    </div>
    <!-- <div class="invest__tip">
      {{ i18n.sale_tip({ endTime: i18n.d(sale.endTime) })}}
    </div> -->
    <div class="invest__actions">
      <md-button class="md-primary invest__btn"
                 @click="invest"
                 :disabled="isPending || ownerOfThisSale || hardCapExceeded">{{i18n.sale_invest()}}</md-button>
    </div>
  </div>
</template>

<script>
  import FormMixin from '../../../../common/mixins/form.mixin'
  import { i18n } from '../../../../../js/i18n'
  import { mapGetters } from 'vuex'
  import { vuexTypes } from '../../../../../vuex/types'
  import _get from 'lodash/get'
  import { offersService } from '../../../../../js/services/offer.service'
  import { pairsService } from '../../../../../js/services/pairs.service'
  import { feeService } from '../../../../../js/services/fees.service'
  import { ErrorHandler } from '../../../../../js/errors/error_handler'
  import { EventDispatcher } from '../../../../../js/events/event_dispatcher'
  import { add, subtract, multiply } from '../../../../../js/utils/math.util'
  import { RecordFactory } from '../../../../../js/records/factory'
  import { commonEvents } from '../../../../../js/events/common_events'
  export default {
    name: 'sale-invest',
    mixins: [FormMixin],
    props: ['sale'],
    components: {},
    data: _ => ({
      form: {
        quoteAsset: '',
        amount: 0,
        convertedAmount: 0
      },
      offers: [],
      i18n
    }),
    created () {
      this.setTokenCode()
      this.loadOffers()
    },
    computed: {
      ...mapGetters([
        vuexTypes.saleOffers,
        vuexTypes.accountBalances,
        vuexTypes.accountId
      ]),
      offer () {
        return this.offers.find(
          offer => offer.quoteAssetCode === this.form.quoteAsset &&
                   offer.baseAssetCode === this.sale.baseAsset) || null
      },
      price () {
        return this.sale.quoteAssetPrices[this.form.quoteAsset] || '1'
      },

      ownerOfThisSale () {
        return this.sale.owner === this.accountId
      },

      saleOffer () {
        return this.saleOffers.find(
          offer => offer.quoteAssetCode === this.form.quote &&
                   offer.baseAssetCode === this.sale.baseAsset) || {}
      },
      available () {
        const balance = add(
          _get(this.accountBalances, `${this.form.quoteAsset}.balance`) || 0,
          this.saleOffer.baseAmount || 0)
        const left = balance ? subtract(balance, this.form.amount) : 0
        return left < 0 ? 0 : left
      },
      limitExceeded () {
        if (!this.form.amount) return false
        return this.available <= 0
      },
      hardCapExceeded () {
        return parseFloat(this.form.convertedAmount) > parseFloat(this.sale.hardCap)
      }
    },
    methods: {
      setTokenCode () {
        this.form.quoteAsset = this.sale.quoteAssetCodes[0] || null
      },

      async loadOffers () {
        const response = await offersService.loadUserSaleOffers(this.sale.id)
        const records = response.records
        this.offers = records.map(record => RecordFactory.createOfferRecord(record))
      },
      async invest () {
        if (!await this.isValid()) return
        this.disableLong()
        try {
          const offerFees = await feeService.loadOfferFeeByAmount(this.form.quoteAsset, multiply(this.form.amount, this.price))

          const cancelOpts = this.offer ? {
            baseBalance: _get(this.accountBalances, `${this.sale.baseAsset}.balance_id`),
            quoteBalance: _get(this.accountBalances, `${this.form.quoteAsset}.balance_id`),
            offerId: this.offer.id,
            price: this.price,
            orderBookId: this.sale.id
          } : null
          const createOpts = this.form.amount > 0 ? {
            amount: this.form.amount,
            price: this.price,
            orderBookId: this.sale.id,
            isBuy: true,
            baseBalance: _get(this.accountBalances, `${this.sale.baseAsset}.balance_id`),
            quoteBalance: _get(this.accountBalances, `${this.form.quoteAsset}.balance_id`),
            fee: offerFees.percent
          } : null
          await offersService.createSaleOffer(createOpts, cancelOpts)
          this.$emit(commonEvents.investInSale)
          this.loadOffers()
          EventDispatcher.dispatchShowSuccessEvent(i18n.sale_offer_created({ asset: this.sale.baseAsset }))
        } catch (error) { ErrorHandler.processUnexpected(error) }
        this.enable()
      }
    },
    watch: {
      'form.amount': async function (value) {
        if (value !== '') {
          this.form.convertedAmount = await pairsService.loadConvertedAmount(this.form.amount, this.form.quoteAsset, this.sale.defaultQuoteAsset)
        }
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

  .get__input-quote-wrp {
    display: flex;
    flex-direction: column;
    & .investment_converted-label {
      font-size: 0.75rem;
    }
    
    & .investment_converted {
      font-size: 1rem;
      line-height: 2rem;
      border-bottom: 1px solid $col-primary;
    }
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

  .invest__convert-icon {
    align-self: center;
  }
</style>
