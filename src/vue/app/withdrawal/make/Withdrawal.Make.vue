<template>
  <div class="withdraw md-layout md-alignment-center-center">
    <form class="md-layout-item
                 md-size-50
                 md-medium-size-65
                 md-small-size-95
                 md-xsmall-size-100"
      @submit.prevent="submit">

      <md-card
      >
        <md-progress-bar md-mode="indeterminate" v-if="isPending"/>

        <md-card-header class="withdraw__header">
          <div class="md-title withdraw__title">{{ i18n.withdraw_withdrawal() }}</div>
          <div class="withdraw__user-balance">
            {{ i18n.withdraw_balance({ balance: balance.balance, token: form.tokenCode }) }}
          </div>
        </md-card-header>

        <md-card-content>
          <p class="withdraw__explanations" v-if="form.tokenCode !== 'SWM'">
            {{ i18n.withdraw_how_much({ asset: form.tokenCode, value: minAmounts[form.tokenCode] }) }}.
            {{ i18n.withdraw_minimal() }}.
          </p>

          <div class="md-layout withdraw__flex-wrapper">
            <select-field
              class="md-layout-item withdraw__select"
              :label="i18n.lbl_asset()"
              :values="tokenCodes"
              v-model="form.tokenCode"
            />

            <input-field
              class="md-layout-item withdraw__field"
              v-model.trim="form.amount"
              :label="i18n.lbl_amount()"
              name="amount"
              type="number"
              title="Amount"
              align="right"
              v-validate="'required|amount'"
              :errorMessage="errors.first('amount') ||
                            (isLimitExceeded ? 'Insufficient funds' : '') ||
                            (lessThenMinimumAmount ? `The minimum amount is ${minAmounts[form.tokenCode]} ${form.tokenCode}` : '') "
            />
          </div>

          <div class="withdraw__fees-container" :class="{ loading: isFeesLoadPending }">

            <div class="fees-container__fee fees-container__fee--fixed" v-if="fixedFee && !isLimitExceeded">
              - <span class="fee__fee-amount">{{ fixedFee }}</span>
              <span class="fee__fee-asset">{{ form.tokenCode }}</span>
              <span class="fee__fee-type">fixed fee</span>
            </div>

            <div class="fees-container__fee fees-container__fee--percent" v-if="percentFee && !isLimitExceeded">
              - <span class="fee__fee-amount">{{ percentFee }}</span>
              <span class="fee__fee-asset">{{ form.tokenCode }}</span>
              <span class="fee__fee-type">percent fee</span>
            </div>

          </div>

          <input-field
            class="md-layout-item"
            v-model.trim="form.wallet"
            :label="i18n.withdraw_wallet({ asset: form.tokenCode })"
            name="wallet-address"
            v-validate="'required|wallet_address'"
            data-vv-validate-on="change"
            :errorMessage="
             errors.first('wallet-address') ||
             (isTryingToSendToYourself ? 'Sender can\'t be a recipient! Make sure the address is correct' : '') ||
             (!isValidWallet ? 'Invalid wallet address' : '')
           "
          />
          <md-button type="submit" class="md-dense md-raised md-primary withdraw__submit" :disabled="isPending || !isAllowedToSubmit">withdraw</md-button>

        </md-card-content>

      </md-card>
    </form>
  </div>
</template>

<script>
  import formMixin from '../../../common/mixins/form.mixin'
  import debounce from 'lodash/debounce'

  import SelectField from '../../../common/fields/SelectField'
  import InputField from '../../../common/fields/InputField'

  import { mapGetters } from 'vuex'
  import { vuexTypes } from '../../../../vuex/types'

  import { i18n } from '../../../../js/i18n'
  import { feeService } from '../../../../js/services/fees.service'
  import { validateAddress } from '../../../../validator/address_validation'
  import { withdrawService } from '../../../../js/services/withdraw.service'
  import { EventDispatcher } from '../../../../js/events/event_dispatcher'

  import { DEFAULT_SELECTED_ASSET } from '../../../../js/const/configs.const'

  export default {
    name: 'Withdraw',
    mixins: [formMixin],
    components: { SelectField, InputField },
    data: _ => ({
      form: {
        tokenCode: DEFAULT_SELECTED_ASSET,
        amount: '',
        wallet: ''
      },
      minAmounts: {
        BTC: '0.00001',
        ETH: '0.01'
      },
      fixedFee: '',
      percentFee: '',
      isFeesLoadPending: false,
      isFeesLoadFailed: false,
      isValidWallet: true,
      isTryingToSendToYourself: false,
      feesDebouncedRequest: null,
      lessThenMinimumAmount: false,
      amountWasUpdated: false,
      walletWasUpdated: false,
      i18n
    }),
    mounted () {

    },
    computed: {
      ...mapGetters([
        vuexTypes.userWalletTokens,
        vuexTypes.accountDepositAddresses,
        vuexTypes.accountBalances,
        vuexTypes.accountRawBalances
      ]),
      tokenCodes () {
        return this.userWalletTokens.map(token => token.code)
      },
      balance () {
        return this.accountBalances[this.form.tokenCode]
      },
      isLimitExceeded () {
        return Number(this.form.amount) > Number(this.balance.balance)
      },
      isAllowedToSubmit () {
        return this.fixedFee &&
               this.percentFee &&
               this.form.amount &&
               this.form.wallet &&
               this.errors.count() === 0 &&
               !this.isFeesLoadPending &&
               !this.isFeesLoadFailed &&
               !this.isAmountLoadPending &&
               !this.isAmountLoadFailed &&
               !this.isLimitExceeded &&
               !this.isTryingToSendToYourself
      }
    },
    methods: {
      async submit () {
        if (!await this.isValid()) return
        this.disableLong()
        try {
          const options = this.composeOptions()
          await withdrawService.createWithdrawalRequest(options)
          EventDispatcher.dispatchShowSuccessEvent(i18n.withdraw_success())
          this.clear()
        } catch (error) {
          console.error(error)
          error.showBanner(i18n.unexpected_error)
        }
        this.enable()
      },
      composeOptions () {
        return {
          balance: this.balance.balance_id,
          amount: this.form.amount,
          externalDetails: { address: this.form.wallet },
          destAsset: this.form.tokenCode,
          expectedDestAssetAmount: this.form.amount,
          fee: {
            fixed: this.fixedFee,
            percent: this.percentFee
          }
        }
      },
      async getFees () {
        try {
          const fees = await feeService.loadWithdrawalFeeByAmount(this.form.tokenCode, this.form.amount)
          this.fixedFee = fees.fixed
          this.percentFee = fees.percent
          this.isFeesLoadFailed = false
        } catch (err) {
          this.isFeesLoadFailed = true
        }
        this.isFeesLoadPending = false
      },
      tryGetFees () {
        this.isFeesLoadPending = true
        if (!this.feesDebouncedRequest) {
          this.feesDebouncedRequest = debounce(() => this.getFees(), 300)
        }
        return this.feesDebouncedRequest()
      }
    },
    watch: {
      'form.amount' (value) {
        this.amountWasUpdated = true
        if (this.isLimitExceeded) return
        if (value === '' || value < this.minAmounts[this.form.tokenCode]) {
          this.fixedFee = '0.0000'
          this.percentFee = '0.0000'
          this.lessThenMinimumAmount = true
          return
        }
        this.lessThenMinimumAmount = false
        this.tryGetFees()
      },
      'form.wallet' (value) {
        let address = this.accountDepositAddresses[this.form.tokenCode]

        this.walletWasUpdated = true
        value === address ? this.isTryingToSendToYourself = true : this.isTryingToSendToYourself = false
        if (validateAddress(value, this.form.tokenCode) && !this.isTryingToSendToYourself) {
          this.isValidWallet = true
          return
        }
        this.isValidWallet = false
      },
      'form.tokenCode' (value) {
        if (this.walletWasUpdated) {
          this.$validator.validate('wallet-address', this.form.wallet).then(result => {})
        }
        if (this.amountWasUpdated) {
          this.$validator.validate('amount', this.form.amount).then(result => {
            if (this.form.amount < this.minAmounts[this.form.tokenCode]) {
              this.lessThenMinimumAmount = true
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../scss/variables';
  @import '../../../../scss/mixins';

  .withdraw__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .withdraw__title {
    .withdraw__header &:first-child {
      margin-top: 0;
    }
  }

  .withdraw__user-balance {
    color: $col-text-secondary;
  }

  .withdraw__explanations {
    margin-bottom: 1.5rem;
  }

  .withdraw__flex-wrapper {
    display: flex;
    justify-content: space-between;
  }

  .withdraw__select,
  .withdraw__field {
    width: 47%;
    flex: none;
  }

  .withdraw__fees-container {
    font-size: $fs-tip;
    transform: translateY(-13px);

    &.loading {
      opacity: .7;
    }

    .fee__fee-type {
      color: $col-active;
    }
  }

  .withdraw__fee-error {
    position: absolute;
    @include center-vertically;
    right: -60%;
  }

  .md-field.md-theme-default.md-invalid.md-focused label {
    border-color: #ff1744
  }

  .withdraw__submit {
    display: block;
    margin-left: auto;
  }
</style>
