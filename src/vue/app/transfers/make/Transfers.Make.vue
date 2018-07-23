<template>
  <div class="transfer app__page-content-wrp">
    <template v-if="!tokenCodes.length">
      <h2 class="app__page-heading">{{ i18n.transfer_no_assets_heading() }}</h2>
      <p class="app__page-explanations app__page-explanations--secondary">
        {{ i18n.transfer_no_assets() }}
      </p>
      <router-link to="/tokens" tag="button" class="app__button-raised">
        {{ i18n.transfer_discover_assets_btn() }}
      </router-link>
    </template>

    <!-- TODO: remove template -->
    <template v-else-if="view.mode === VIEW_MODES.submit || view.mode === VIEW_MODES.confirm">
      <h2 class="app__page-heading">{{ i18n.transfer_heading() }}</h2>
      <form @submit.prevent="processTransfer"
        id="transfer-form"
        v-if="view.mode === VIEW_MODES.submit || view.mode === VIEW_MODES.confirm">
        <div class="app__form-row">
          <div class="app__form-field">
            <select-field-unchained :values="tokenCodes"
              v-model="form.tokenCode"
              :label="i18n.lbl_asset()"
              :readonly="view.mode === VIEW_MODES.confirm"/>
              <div class="app__form-field-description">
                <p v-if="form.tokenCode">
                  {{ i18n.transfer_balance({ amount: balance.balance, asset: form.tokenCode }) }}
                </p>
              </div>
          </div>
        </div>

        <div class="app__form-row">
          <div class="app__form-field">
            <input-field-unchained name="amount"
              step="0.000001"
              type="number"
              v-model.trim="form.amount"
              v-validate="'required|amount'"
              :label="i18n.lbl_amount()"
              :readonly="view.mode === VIEW_MODES.confirm"
              :errorMessage="errors.first('amount') ||
                (isLimitExceeded ? i18n.transfer_error_insufficient_funds() : '')"
            />
            <!-- TODO: fees -->

            <div class="withdraw__fees-container app__form-field-description" :class="{ loading: isFeesLoadPending }">
              <p>
                - {{ i18n.withdraw_network_fee_prefix() }}
                <hint-wrapper :hint="i18n.withdraw_network_fee_hint()">
                  <span class="fee__fee-type">{{ i18n.withdraw_network_fee() }}</span>
                </hint-wrapper>
              </p>

              <!-- <p v-if="fixedFee">
                - {{ fixedFee }} {{ form.tokenCode }}
                <span class="fee__fee-type">{{ i18n.withdraw_fixed_fee() }}</span>
              </p>

              <p v-if="percentFee">
                - {{ percentFee }} {{ form.tokenCode }}
                <span class="fee__fee-type">{{ i18n.withdraw_percent_fee() }}</span>
              </p> -->
            </div>

          </div>
        </div>

        <div class="app__form-row">
          <input-field-unchained name="recipient"
            v-model.trim="form.recipient"
            v-validate="'required|email_or_account_id'"
            :label="i18n.lbl_recipient_email_or_account()"
            :errorMessage="errorMessage('recipient')"
            :readonly="view.mode === VIEW_MODES.confirm"
          />
        </div>

        <div class="app__form-row">
          <textarea-field id="transfer-description"
            name="description"
            v-model="form.subject"
            v-validate="'max:250'"
            :label="i18n.lbl_add_note()"
            :maxlength="250"
            :errorMessage="errorMessage('recipient')"
            :readonly="view.mode === VIEW_MODES.confirm"
          />
        </div>
      </form>

      <div class="app__form-actions">
        <button v-ripple
          v-if="view.mode === VIEW_MODES.submit"
          type="submit"
          class="app__form-submit-btn"
          :disabled="isPending"
          form="transfer-form">
          {{ i18n.lbl_send() }}
        </button>

        <form-confirmation
          v-if="view.mode === VIEW_MODES.confirm"
          :pending="isPending"
          @cancel="updateView(VIEW_MODES.submit)"
          @ok="submit"
        />
      </div>
    </template>

    <template v-else-if="false">
      <confirm-transfer :opts="view.opts"
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
      <div class="transfer__success-msg
                  md-layout-item
                  md-size-50
                  md-medium-size-45
                  md-small-size-100
                  md-xsmall-size-100
                  app__card">
        <div class="app__card-header">
          <div class="md-title">{{ i18n.tr_successful() }}</div>
        </div>
        <div class="app__card-content">
          <div>
            <div class="transfer__success-amount">
              {{ form.amount }} {{ form.tokenCode }}
            </div>
          </div>
        </div>
        <div class="app__card-actions transfer-dialog__actions">
          <button v-ripple
                  @click="updateView(VIEW_MODES.submit, {}, true)"
                  class="app__button-flat">
            {{ i18n.lbl_go_back() }}
          </button>
        </div>
      </div>
    </template>

  </div>

</template>

<script>
  import get from 'lodash/get'

  import FormMixin from '../../../common/mixins/form.mixin'
  import ConfirmTransfer from './Transfers.Confirm'
  import SelectFieldUnchained from '@/vue/common/fields/SelectFieldUnchained'
  import InputFieldUnchained from '@/vue/common/fields/InputFieldUnchained'
  import FormConfirmation from '@/vue/common/form-confirmation/FormConfirmation'
  import HintWrapper from '@/vue/common/hint-wrapper/HintWrapper'

  import { ErrorHandler } from '../../../../js/errors/error_handler'
  import { mapGetters, mapActions } from 'vuex'
  import { vuexTypes } from '../../../../vuex/types'
  import { Keypair } from 'swarm-js-sdk'
  import { errors } from '../../../../js/errors/factory'
  import { i18n } from '../../../../js/i18n'

  import { accountsService } from '../../../../js/services/accounts.service'
  import { feeService } from '../../../../js/services/fees.service'
  import { transferService } from '../../../../js/services/transfers.service'

  const VIEW_MODES = {
    submit: 'submit',
    confirm: 'confirm',
    success: 'success'
  }

  export default {
    name: 'transfers-make',
    mixins: [FormMixin],
    components: {
      ConfirmTransfer,
      HintWrapper,
      SelectFieldUnchained,
      InputFieldUnchained,
      FormConfirmation
    },
    data: _ => ({
      form: {
        tokenCode: null,
        amount: '',
        recipient: '',
        subject: ''
      },
      view: {
        mode: VIEW_MODES.submit,
        opts: {}
      },
      isFeesLoadPending: false,
      i18n,
      VIEW_MODES
    }),
    created () {
      this.setTokenCode()
      this.loadCurrentBalances()
    },
    computed: {
      ...mapGetters([
        vuexTypes.accountBalances,
        vuexTypes.userTransferableTokens
      ]),
      tokenCodes () {
        return this.userTransferableTokens.map(token => token.code)
      },
      balance () {
        return this.accountBalances[this.form.tokenCode]
      },
      isLimitExceeded () {
        return Number(this.form.amount) > Number(get(this.balance, 'balance') || 0)
      }
    },
    methods: {
      ...mapActions({
        loadCurrentBalances: vuexTypes.GET_ACCOUNT_BALANCES
      }),
      async submit (feeFromSource) {
        this.disable()
        try {
          await transferService.createTransfer({
            ...this.view.opts,
            feeFromSource,
            asset: this.form.tokenCode
          })
          this.view.mode = VIEW_MODES.success
          await this.loadCurrentBalances()
        } catch (error) {
          console.error(error)
          ErrorHandler.processUnexpected(error)
        }
        this.enable()
      },
      async processTransfer () {
        if (!await this.isValid()) return
        this.disable()
        try {
          const counterparty = await this.loadCounterparty()
          const fees = await this.loadFees(counterparty.accountId)

          const opts = {
            amount: this.form.amount,
            destinationAccountId: counterparty.accountId,
            destinationEmail: counterparty.email,
            destinationFixedFee: fees.destination.fixed,
            destinationPercentFee: fees.destination.percent,
            destinationFeeAsset: fees.destination.feeAsset,
            sourceBalanceId: this.balance.balance_id,
            sourceFixedFee: fees.source.fixed,
            sourcePercentFee: fees.source.percent,
            sourceFeeAsset: fees.source.feeAsset,
            subject: this.form.subject,
            tokenCode: this.form.tokenCode
          }
          this.updateView(VIEW_MODES.confirm, opts)
        } catch (error) {
          console.error(error)
          if (error instanceof errors.NotFoundError) {
            error.showBanner(i18n.tr_recipient_not_found())
            this.enable()
            return
          }
          ErrorHandler.processUnexpected(error)
        }
        this.enable()
      },
      async loadCounterparty () {
        const counterparty = {}
        const providedRecipient = this.form.recipient
        if (Keypair.isValidPublicKey(providedRecipient)) {
          counterparty.accountId = providedRecipient
          counterparty.email = await accountsService.loadEmailByAccountId(providedRecipient)
          return counterparty
        }
        counterparty.email = providedRecipient
        counterparty.accountId = await accountsService.loadAccountIdByEmail(providedRecipient)
        return counterparty
      },
      async loadFees (recipientAccountId) {
        const fees = { source: {}, destination: {} }
        const [ senderFees, recipientFees ] = await Promise.all([
          feeService.loadPaymentFeeByAmount(this.form.tokenCode, this.form.amount),
          feeService.loadPaymentFeeByAmount(this.form.tokenCode, this.form.amount, recipientAccountId)
        ])
        fees.source.fixed = senderFees.fixed
        fees.source.percent = senderFees.percent
        fees.source.feeAsset = senderFees.feeAsset
        fees.destination.fixed = recipientFees.fixed
        fees.destination.percent = recipientFees.percent
        fees.destination.feeAsset = recipientFees.feeAsset
        return fees
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
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../scss/variables';

  .transfer__success-msg {
    text-align: center;
  }

  .transfer__success-amount {
    color: $col-md-primary;
    font-size: $fs-heading;
    margin: 1rem 0 .5rem;
  }

  .transfer__header {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  .transfer__title {
    .transfer__header &:first-child {
      margin-top: 0;
    }
  }

  .transfer__user-balance {
    color: $col-text-secondary;
  }
</style>
