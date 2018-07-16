<template>
  <div class="invest">
    <div class="invest__available"
            :class="{ 'invest__available--error': limitExceeded }"
            >
      Available:
      <span class="invest__available-amount">{{ i18n.c(available) }}</span>
      <span class="invest__available-asset">{{ form.quoteAsset }}</span>
    </div>
    <div class="invest__row">
      <div class="asset-wrp">
        <select-field-custom
          class="invest__select-quote-assets"
          :label="i18n.lbl_asset()"
          v-model="form.quoteAsset"
          :values="sale.quoteAssetCodes"/>
      </div>
      <div class="invest-wrp">
        <div class="invest__input-quote-wrp">
          <div class="invest__amount-tooltip" v-if="offer">
          <i class="material-icons invest__tooltip-icon">help_outline</i>
          <md-tooltip md-direction="top">{{ i18n.sale_offer_overlap() }}</md-tooltip>
          </div>
          <input-field  class="invest__input-field"
                        title="Your investment"
                        v-model="form.amount"
                        id="investment"
                        name="investment"
                        type="number"
                        :disabled="isOwner"
                        :errorMessage="errorMessage('investment')"
                        v-validate="'amount'"
                        data-vv-validate-on="input"
                        :label="i18n.sale_invest_asset({ asset: form.quoteAsset })"
          />
      </div>
      <i class="invest__convert-icon material-icons">compare_arrows</i>
      <span class="get__input-quote-wrp">{{ i18n.cc(form.convertedAmount) }}</span>
      <button class="invest__max-value-btn"
                @click="form.amount = maxValue"
                :disabled="available === 0">
        <i class="material-icons">trending_up</i>
        <md-tooltip md-direction="top">{{ i18n.sale_max_invest() }}</md-tooltip>
      </button>
      </div>
    </div>
    <!-- <div class="invest__tip">
      {{ i18n.sale_tip({ endTime: i18n.d(sale.endTime) })}}
    </div> -->
    <div class="invest__actions">
      <div class="invest__cancel-btn-ctn">
        <md-tooltip md-direction="top">
          {{ i18n.sale_offer_cancel_tip({amount: i18n.c(investedAmount), asset: form.quoteAsset}) }}
        </md-tooltip>
        <button v-ripple
                @click="cancelOffer"
                v-if="sale.isOpened && offer"
                class="app__button-flat invest__cancel-btn"
                :disabled="isPending">
          {{ i18n.sale_offer_cancel() }}
        </button>
      </div>
      <div class="invest__submit-btn-ctn">
        <button v-ripple
                @click="invest"
                class="app__button-flat invest__submit-btn"
                :disabled="isPending || isOwner || hardCapExceeded || !sale.isOpened || sale.isUpcoming || !form.amount">
          {{ i18n.sale_invest() }}
        </button>
        <md-tooltip v-if="sale.isUpcoming"
                    md-direction="top">{{ i18n.sale_disable_invest_upcoming_sale() }}</md-tooltip>
        <md-tooltip v-else-if="isOwner"
                    md-direction="top">{{ i18n.sale_disable_invest_owners() }}</md-tooltip>
        <md-tooltip v-else-if="hardCapExceeded"
                    md-direction="top">{{ i18n.sale_disable_invest_hardcap_exceed({amount: i18n.cc(sale.hardCap)}) }}</md-tooltip>
        <md-tooltip v-else-if="sale.isClosed"
                    md-direction="top">{{ i18n.sale_disable_invest_closed_sale() }}</md-tooltip>
        <md-tooltip v-else-if="sale.isCanceled"
                    md-direction="top">{{ i18n.sale_disable_invest_canceled_sale() }}</md-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
  import FormMixin from '../../../../common/mixins/form.mixin'
  import { i18n } from '../../../../../js/i18n'
  import { mapGetters, mapActions } from 'vuex'
  import { vuexTypes } from '../../../../../vuex/types'
  import _get from 'lodash/get'
  import { offersService } from '../../../../../js/services/offer.service'
  import { accountsService } from '../../../../../js/services/accounts.service'
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
      investedAmount: 0,
      offers: [],
      i18n
    }),
    created () {
      this.setTokenCode()
      this.loadOffers()
    },
    computed: {
      ...mapGetters([
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

      isOwner () {
        return this.sale.owner === this.accountId
      },

      available () {
        const balance = add(
          _get(this.accountBalances, `${this.form.quoteAsset}.balance`, 0),
          _get(this.offer, 'baseAmount', 0))
        const left = balance ? subtract(balance, this.form.amount) : 0
        return left <= 0 ? balance : left
      },
      limitExceeded () {
        if (!this.form.amount) return false
        return this.available <= 0
      },
      hardCapExceeded () {
        return parseFloat(this.form.convertedAmount) > parseFloat(this.sale.hardCap)
      },
      maxValue () {
        const hardCap = this.sale.hardCaps[this.form.quoteAsset]
        const currentCap = this.sale.totalCurrentCaps[this.form.quoteAsset]
        const lastOfferAmount = this.offer ? this.offer.quoteAmount : 0
        const balance = this.accountBalances[this.form.quoteAsset].balance
        const totalBalance = add(balance, (lastOfferAmount || 0))
        if (parseFloat(totalBalance) > parseFloat(hardCap)) {
          return add(subtract(hardCap, currentCap), lastOfferAmount)
        } else {
          return totalBalance
        }
      }
    },
    methods: {
      ...mapActions({
        loadBalances: vuexTypes.GET_ACCOUNT_BALANCES
      }),
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
        this.disable()
        try {
          if (!this.accountBalances[this.form.quoteAsset]) {
            await accountsService.createBalance(this.form.quoteAsset)
            await this.loadBalances()
          }

          if (!this.accountBalances[this.sale.baseAsset]) {
            await accountsService.createBalance(this.sale.baseAsset)
            await this.loadBalances()
          }
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
          this.loadBalances()
          this.loadOffers()
          EventDispatcher.dispatchShowSuccessEvent(i18n.sale_offer_created({ asset: this.sale.baseAsset }))
        } catch (error) { ErrorHandler.processUnexpected(error) }
        this.enable()
      },
      async cancelOffer () {
        this.disable()
        try {
          const cancelOpts = this.offer ? {
            baseBalance: _get(this.accountBalances, `${this.sale.baseAsset}.balance_id`),
            quoteBalance: _get(this.accountBalances, `${this.form.quoteAsset}.balance_id`),
            offerId: this.offer.id,
            price: this.price,
            orderBookId: this.sale.id
          } : null
          await offersService.cancelOffer(cancelOpts)
          this.$emit(commonEvents.investInSale)
          this.loadBalances()
          this.loadOffers()
          EventDispatcher.dispatchShowSuccessEvent(i18n.sale_offer_cancelled({ asset: this.sale.baseAsset }))
        } catch (err) {
          ErrorHandler.processUnexpected(err)
        }
        this.enable()
      }
    },
    watch: {
      'form.amount': async function (value) {
        if (value !== '' && value > 0) {
          this.form.convertedAmount = await pairsService.loadConvertedAmount(this.form.amount, this.form.quoteAsset, this.sale.defaultQuoteAsset)
        }
        if (value === '') {
          this.form.convertedAmount = 0
        }
      },
      offer: function (value) {
        if (value) {
          this.form.amount = value.quoteAmount
          this.investedAmount = value.quoteAmount
        } else {
          this.form.amount = ''
          this.form.convertedAmount = 0
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
    margin-top: .25rem;
    padding-top: 1rem;
    white-space: nowrap;
  }

  .invest__progress-bar-wrp {
    margin-bottom: 1rem;
  }

  .invest__select-quote-wrp {
    max-width: 5rem;
    margin-bottom: .75rem;
  }

  .asset-wrp,
  .invest__input-quote-wrp,
  .get__input-quote-wrp {
    width: 40%;
  }

  .invest__input-quote-wrp {
    display: flex;
    align-items: center;
  }

  .invest__amount-tooltip {
    margin-right: .5rem;
    margin-top: -.35rem;
  }

  .invest-wrp {
    display: flex;
    width: 60%;
    justify-content: space-between;
    align-items: center;
    @include respond-to-custom('1180px') {
      width: 100%;
    }
  }

  .invest__input-field {
    @include respond-to-custom('1180px') {
      width: 69%;
    }
    @include respond-to(medium) {
      width: 100%;
    }

  }

  .invest__select-quote-assets {
    width: 85%;
    @include respond-to(medium) {
      width: 100%;
    }
  }

  .get__input-quote-wrp {
    font-size: 1rem;
    line-height: 2rem;
  }

  .invest__available {
    font-size: $fs-tip;
    margin-bottom: 1rem;
    &--error {
      color: $col-danger;
      .io-invest__available-amount,
      .invest__available-amount { color: $col-danger }
    }
  }

  .invest__row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    @include respond-to(large) {
      margin-bottom: 0;
    }
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
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .invest__cancel-btn,
    .invest__submit-btn {
      margin: 0;
    }
  }

  .invest__convert-icon {
    align-self: center;
  }

  .invest__tooltip-icon {
    vertical-align: middle;
    font-size: 1rem;
  }
  .invest__max-value-btn {
    width: 2rem;
    border: none;
    cursor: pointer;
  }
</style>
