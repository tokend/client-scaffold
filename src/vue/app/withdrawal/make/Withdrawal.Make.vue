<template>
  <div class="withdraw md-layout md-alignment-center-center">
    <template v-if="view.mode === VIEW_MODES.submit">
      <div class="md-layout-item
                  md-size-50
                  md-medium-size-65
                  md-small-size-95
                  md-xsmall-size-100
                  app__card
                  withdraw__card">
        <div class="app__card-content">
          <form @submit.prevent="processTransfer">
            <div class="app__form-row">
              <div class="app__form-field">
                <select-field-unchained :values="tokenCodes"
                                    v-model="form.tokenCode"
                                    :label="i18n.lbl_asset()"/>
                <div class="app__form-field-descr">
                  <p v-if="minAmounts[form.tokenCode]">
                    {{ i18n.withdraw_how_much({ asset: form.tokenCode, value: minAmounts[form.tokenCode] }) }}
                  </p>
                  <p>
                    {{ i18n.withdraw_balance({ amount: balance.balance, asset: form.tokenCode }) }}
                  </p>
                </div>
              </div>
            </div>

            <div class="app__form-row">
              <div class="app__form-field">
                <input-field-unchained
                  v-model.trim="form.amount"
                  :label="i18n.lbl_amount()"
                  name="amount"
                  type="number"
                  title="Amount"
                  vvValidateOn="change"
                  v-validate="'required|amount'"
                  :errorMessage="errors.first('amount') ||
                              (isLimitExceeded ? i18n.withdraw_error_insufficient_funds() : '') ||
                              (lessThenMinimumAmount ? i18n.withdraw_error_minimum_amount({
                                                        value: minAmounts[form.tokenCode],
                                                        asset: form.tokenCode })
                                                      : '')"
                />

                <div class="withdraw__fees-container app__form-field-descr" :class="{ loading: isFeesLoadPending }">
                  <p>
                    - {{ i18n.withdraw_network_fee_prefix() }}
                    <hint-wrapper :hint="i18n.withdraw_network_fee_hint()">
                      <span class="fee__fee-type">{{ i18n.withdraw_network_fee() }}</span>
                    </hint-wrapper>
                  </p>

                  <p v-if="fixedFee">
                    - {{ fixedFee }} {{ form.tokenCode }}
                    <span class="fee__fee-type">{{ i18n.withdraw_fixed_fee() }}</span>
                  </p>

                  <p v-if="percentFee">
                    - {{ percentFee }} {{ form.tokenCode }}
                    <span class="fee__fee-type">{{ i18n.withdraw_percent_fee() }}</span>
                  </p>
                </div>
              </div>
            </div>

            <div class="app__form-row">
              <input-field-unchained
                v-model.trim="form.wallet"
                :label="i18n.withdraw_wallet({ asset: form.tokenCode })"
                :monospaced="true"
                name="wallet-address"
                v-validate="'required|wallet_address'"
                :errorMessage="
                  errors.first('wallet-address') ||
                  (isTryingToSendToYourself ? i18n.withdraw_error_is_trying_to_send_to_yourself() : '')
                "
              />
            </div>

            <div class="app__form-actions">
              <button v-ripple
                type="submit"
                class="withdraw__submit"
                :disabled="isPending || !isAllowedToSubmit">
                {{ i18n.withdraw_withdrawal() }}
              </button>
            </div>
          </form>
        </div>
      </div>
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
            <button v-ripple
                    class="app__button-flat"
                    @click="updateView(VIEW_MODES.submit, {} , true)">
              {{ i18n.lbl_go_back() }}
            </button>
            <router-link v-ripple
                        @click="updateView(VIEW_MODES.submit, {} , true)"
                        tag="button"
                        class="app__button-flat"
                        :to="'/history/index/' + form.tokenCode">
              {{ i18n.lbl_view_history() }}
            </router-link>
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

  import SelectFieldUnchained from '@/vue/common/fields/SelectFieldUnchained'
  import HintWrapper from '@/vue/common/hint-wrapper/HintWrapper'
  import InputField from '../../../common/fields/InputField'
  import InputFieldUnchained from '../../../common/fields/InputFieldUnchained'
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
    components: {
      InputField,
      HintWrapper,
      ConfirmWithdraw,
      SelectFieldUnchained,
      InputFieldUnchained
    },
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
        return !this.isFeesLoadPending &&
          !this.isLimitExceeded &&
          !this.isTryingToSendToYourself &&
          !this.lessThenMinimumAmount
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
  @import '~@scss/variables.scss';
  @import '~@scss/mixins.scss';

  .withdraw__explanations {
    font-size: 1rem;
    margin-bottom: 1.5rem;
    color: $col-md-primary;
  }

  .withdraw__fees-container {
    &.loading {
      opacity: .7;
    }

    .fee__fee-type {
      color: $col-md-primary-secondary;
    }
  }

  .withdraw__submit {
      @include button();
      @include button-raised();
      width: 180px;
      position: relative;
      height: 36px;
      margin: 0 auto;
  }

  .withdraw__success-msg {
    text-align: center;
  }

  .withdraw__success-amount {
    color: $col-md-primary;
    font-size: $fs-heading;
    margin: 1rem 0 .5rem;
  }

  .withdraw__card {
    min-width: 0;
    max-width: 550px;
    flex: 1;
    width: 100%;
  }
</style>
