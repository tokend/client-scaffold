<template>
  <div class="withdraw md-layout md-alignment-center-center">
    <template v-if="view.mode === VIEW_MODES.submit">
      <form class="md-layout-item
                 md-size-50
                 md-medium-size-65
                 md-small-size-95
                 md-xsmall-size-100"
            @submit.prevent="processTransfer">

        <md-card>
          <md-progress-bar md-mode="indeterminate" v-if="isPending"/>

          <md-card-header class="withdraw__header">
            <div class="md-title withdraw__title">{{ i18n.withdraw_withdrawal() }}</div>
            <div class="withdraw__user-balance">
              {{ i18n.withdraw_balance({ balance: balance.balance, token: form.tokenCode }) }}
            </div>
          </md-card-header>

          <md-card-content>
            <p class="withdraw__explanations" >
              <template v-if="minAmounts[form.tokenCode]">
                {{ i18n.withdraw_how_much({ asset: form.tokenCode, value: minAmounts[form.tokenCode] }) }}.
                {{ i18n.withdraw_minimal() }}.
              </template>
              <template v-else>
                {{  i18n.withdraw_network_fee()  }}
              </template>
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
                vvValidateOn="change"
                v-validate="'required|amount'"
                :errorMessage="errors.first('amount') ||
                            (isLimitExceeded ? i18n.withdraw_error_insufficient_funds() : '') ||
                            (lessThenMinimumAmount ? i18n.withdraw_error_minimum_amount({
                                                      value: minAmounts[form.tokenCode],
                                                      asset: form.tokenCode })
                                                   : '')"
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
              :errorMessage="
             errors.first('wallet-address') ||
             (isTryingToSendToYourself ? i18n.withdraw_error_is_trying_to_send_to_yourself() : '')
           "
            />
          </md-card-content>
          <md-dialog-actions class="withdrawal-dialog__actions">
              <md-button type="submit" class="md-primary withdraw__submit">withdraw</md-button>
          </md-dialog-actions>
        </md-card>
      </form>
    </template>
    <template v-else-if="view.mode === VIEW_MODES.confirm">
      <confirm-withdraw :opts="view.opts"
                         class="md-layout-item
                              md-size-50
                              md-medium-size-45
                              md-small-size-100
                              md-xsmall-size-100"
                         :isPending="isPending"
                         @cancel-click="updateView(VIEW_MODES.submit)"
                         @confirm-click="submit"
      />
    </template>
    <template v-if="view.mode === VIEW_MODES.success">
      <md-card class="withdraw__success-msg
                      md-layout-item
                      md-size-50
                      md-medium-size-45
                      md-small-size-100
                      md-xsmall-size-100">
        <md-card-header>
          <div class="md-title">{{ i18n.withdraw_success() }}</div>
        </md-card-header>
        <md-card-content>
          <div>
            <div class="withdraw__success-amount">
              {{ form.amount }} {{ form.tokenCode }}
            </div>
            <md-button class="md-primary" @click="updateView(VIEW_MODES.submit, {} , true)">{{ i18n.lbl_go_back() }}</md-button>
            <md-button :to="'/history/index/' + form.tokenCode" class="md-primary">{{ i18n.lbl_view_history() }}</md-button>
          </div>
        </md-card-content>
      </md-card>
    </template>
    <template v-if="!tokenCodes.length">
      <md-card class="md-layout-item
                      md-size-50
                      md-medium-size-65
                      md-small-size-95
                      md-xsmall-size-100">
        <md-card-content>
          <div class="app__no-data-msg">
            <md-icon class="md-size-4x">file_upload</md-icon>
            <h2>{{ i18n.withdraw_no_assets() }}</h2>
            <p>{{ i18n.withdraw_no_assets_exp() }}</p>
          </div>
        </md-card-content>
      </md-card>
    </template>
  </div>
</template>

<script>
  import formMixin from '../../../common/mixins/form.mixin'
  import debounce from 'lodash/debounce'
  import get from 'lodash/get'

  import SelectField from '../../../common/fields/SelectField'
  import InputField from '../../../common/fields/InputField'
  import ConfirmWithdraw from './Withdrawal.Confirm'

  import { mapGetters, mapActions } from 'vuex'
  import { vuexTypes } from '../../../../vuex/types'

  import { i18n } from '../../../../js/i18n'
  import { feeService } from '../../../../js/services/fees.service'
  import { withdrawService } from '../../../../js/services/withdraw.service'
  import { EventDispatcher } from '../../../../js/events/event_dispatcher'
  import { ErrorHandler } from '../../../../js/errors/error_handler'
  import { errors } from '../../../../js/errors/factory'

  const VIEW_MODES = {
    submit: 'submit',
    confirm: 'confirm',
    success: 'success'
  }

  export default {
    name: 'Withdraw',
    mixins: [formMixin],
    components: { SelectField, InputField, ConfirmWithdraw },
    data: _ => ({
      form: {
        tokenCode: null,
        amount: '',
        wallet: ''
      },
      view: {
        mode: VIEW_MODES.submit,
        opts: {}
      },
      minAmounts: {
        BTC: '0.00001',
        ETH: '0.01'
      },
      fixedFee: '',
      percentFee: '',
      isFeesLoadPending: false,
      isFeesLoadFailed: false,
      feesDebouncedRequest: null,
      i18n,
      VIEW_MODES
    }),
    created () {
      this.form.tokenCode = this.tokenCodes[0] || null
      this.loadBalances()
    },
    computed: {
      ...mapGetters([
        vuexTypes.userWithdrawableTokens,
        vuexTypes.accountDepositAddresses,
        vuexTypes.accountBalances
      ]),
      tokenCodes () {
        return this.userWithdrawableTokens.map(token => token.code)
      },
      balance () {
        return this.accountBalances[this.form.tokenCode]
      },
      isLimitExceeded () {
        return Number(this.form.amount) > Number(get(this.balance, 'balance') || 0)
      },
      isTryingToSendToYourself () {
        return this.form.wallet === this.accountDepositAddresses[this.form.tokenCode]
      },
      lessThenMinimumAmount () {
        return this.form.amount !== '' ? Number(this.form.amount) < this.minAmounts[this.form.tokenCode] : false
      },
      isAllowedToSubmit () {
        return !this.isFeesLoadPending && !this.isLimitExceeded && !this.isTryingToSendToYourself && !this.lessThenMinimumAmount
      }
    },
    methods: {
      ...mapActions({
        loadBalances: vuexTypes.GET_ACCOUNT_BALANCES
      }),
      async submit () {
        if (!this.isAllowedToSubmit) return
        this.disableLong()
        try {
          const options = this.composeOptions()
          if (this.isFeesLoadFailed) {
            EventDispatcher.dispatchShowErrorEvent('Failed to load fees')
            return false
          }
          await withdrawService.createWithdrawalRequest(options)
          this.view.mode = VIEW_MODES.success
          await this.loadBalances()
          // EventDispatcher.dispatchShowSuccessEvent(i18n.withdraw_success())
          // this.clear(['tokenCode'])
        } catch (error) {
          console.error(error)
          error.showBanner(i18n.unexpected_error)
        }
        this.enable()
        this.errors.clear()
      },
      async processTransfer () {
        if (!this.isAllowedToSubmit) return
        if (!await this.isValid()) return
        this.disable()
        try {
          const opts = await this.composeOptions()
          this.updateView(VIEW_MODES.confirm, opts)
        } catch (error) {
          console.log(error)
          if (error instanceof errors.NotFoundError) {
            error.showBanner(i18n.withdraw_error_invalid_address())
            this.enable()
            return
          }
          ErrorHandler.processUnexpected(error)
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
          EventDispatcher.dispatchShowErrorEvent('Failed to load fees')
        }
        this.isFeesLoadPending = false
      },
      tryGetFees () {
        this.isFeesLoadPending = true
        if (!this.feesDebouncedRequest) {
          this.feesDebouncedRequest = debounce(() => this.getFees(), 300)
        }
        return this.feesDebouncedRequest()
      },

      updateView (mode, opts = {}, clear = false) {
        this.view.mode = mode
        this.view.opts = opts
        if (clear) {
          this.clear()
          this.setTokenCode()
        }
      },
      setTokenCode () {
        this.form.tokenCode = this.$route.params.tokenCode || this.tokenCodes[0] || null
      }
    },
    watch: {
      'form.amount' (value) {
        if (this.isLimitExceeded) return
        if (value === '' || value < this.minAmounts[this.form.tokenCode]) {
          this.fixedFee = '0.0000'
          this.percentFee = '0.0000'
          return
        }
        this.tryGetFees()
      },
      'form.tokenCode' (value) {
        this.tryGetFees()
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

  .withdraw__success-msg {
    text-align: center;
  }

  .withdraw__success-amount {
    color: $col-md-primary;
    font-size: $fs-heading;
    margin: 1rem 0 .5rem;
  }
</style>
