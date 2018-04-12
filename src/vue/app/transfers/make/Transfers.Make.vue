<template>
  <div class="transfer md-layout md-alignment-center-center" >
    <template v-if="!tokenCodes.length">
      <div class="app__no-data-msg">
        <md-card class="md-layout-item
                      md-size-100">
          <md-card-content>
            <md-icon class="md-size-4x">send</md-icon>
            <h2>{{ i18n.tr_no_assets() }}</h2>
            <p>{{ i18n.tr_no_assets_exp() }}</p>
          </md-card-content>
        </md-card>
      </div>
    </template>

    <template v-else-if="view.mode === VIEW_MODES.submit">
      <form novalidate @submit.prevent="processTransfer"
            class="md-layout-item
                   md-size-50
                   md-medium-size-65
                   md-small-size-95
                   md-xsmall-size-100"
      >
        <md-card>
          <md-progress-bar md-mode="indeterminate" v-if="isPending"/>

          <md-card-header>
            <div class="md-title">{{ i18n.tr_send() }}</div>
          </md-card-header>

          <md-card-content>
            <div class="md-layout md-gutter">
              <div class="md-layout-item md-small-size-100">
                <select-field id="transfer-token"
                              name="token"
                              :label="i18n.lbl_asset()"
                              :values="tokenCodes"
                              v-model="form.tokenCode"

                />
              </div>

              <div class="md-layout-item md-small-size-100">
                <input-field id="transfer-amount"
                             name="amount"
                             type="number"
                             v-model="form.amount"
                             v-validate="'required|amount'"
                             :label="i18n.lbl_amount()"
                             :errorMessage="errorMessage('amount')"
                />
              </div>
            </div>

            <input-field id="transfer-recipient"
                         name="recipient"
                         v-model="form.recipient"
                         v-validate="'required|email_or_account_id'"
                         :label="i18n.lbl_recipient_email_or_account()"
                         :errorMessage="errorMessage('recipient')"
            />

            <textarea-field id="transfer-description"
                            name="description"
                            v-model="form.subject"
                            v-validate="'max:250'"
                            :label="i18n.lbl_add_note()"
                            :maxlength="250"
                            :errorMessage="errorMessage('recipient')"
            />

            <div class="md-layout md-alignment-center-right">
              <md-button type="submit" class="md-dense md-raised md-primary" :isPending="isPending">
                {{ i18n.lbl_send() }}
              </md-button>
            </div>

          </md-card-content>
        </md-card>
      </form>
    </template>

    <template v-else-if="view.mode === VIEW_MODES.confirm">
      <confirm-transfer :opts="view.opts"
                         class="md-layout-item
                              md-size-50
                              md-medium-size-45
                              md-small-size-100
                              md-xsmall-size-100"
                         :disabled="isPending"
                         @cancel-click="updateView(VIEW_MODES.submit)"
                         @confirm-click="submit"
      />
    </template>

    <template v-if="view.mode === VIEW_MODES.success">
      <md-card class="transfer__success-msg
                      md-layout-item
                      md-size-50
                      md-medium-size-45
                      md-small-size-100
                      md-xsmall-size-100">
        <md-card-header>
          <div class="md-title">{{ i18n.tr_successful() }}</div>
        </md-card-header>
        <md-card-content>
          <div>
            <div class="transfer__success-amount">
              {{ form.amount }} {{ form.tokenCode }}
            </div>
            <md-button class="md-primary" @click="updateView(VIEW_MODES.submit, {}, true)">{{ i18n.lbl_go_back() }}</md-button>
          </div>
        </md-card-content>
      </md-card>
    </template>

  </div>

</template>

<script>
  import FormMixin from '../../../common/mixins/form.mixin'
  import ConfirmTransfer from './Transfers.Confirm'

  import { ErrorHandler } from '../../../../js/errors/error_handler'
  import { mapGetters } from 'vuex'
  import { vuexTypes } from '../../../../vuex/types'
  import { Keypair } from 'swarm-js-sdk'
  import { errors } from '../../../../js/errors/factory'
  import { i18n } from '../../../../js/i18n'

  import { accountsService } from '../../../../js/services/accounts.service'
  import { feeService } from '../../../../js/services/fees.service'
  import { transferService } from '../../../../js/services/transfers.service'

  import { DEFAULT_SELECTED_ASSET } from '../../../../js/const/configs.const'

  const VIEW_MODES = {
    submit: 'submit',
    confirm: 'confirm',
    success: 'success'
  }

  export default {
    name: 'transfers-make',
    mixins: [FormMixin],
    components: { ConfirmTransfer },
    data: _ => ({
      form: {
        tokenCode: DEFAULT_SELECTED_ASSET,
        amount: '',
        recipient: '',
        subject: ''
      },
      view: {
        mode: VIEW_MODES.submit,
        opts: {}
      },
      i18n,
      VIEW_MODES
    }),
    computed: {
      ...mapGetters([
        vuexTypes.accountBalances,
        vuexTypes.userTransferableTokens
      ]),
      tokenCodes () {
        return this.userTransferableTokens.map(token => token.code)
      }
    },
    methods: {
      async submit (feeFromSource) {
        this.disable()
        try {
          await transferService.createTransfer({
            ...this.view.opts,
            feeFromSource,
            asset: this.form.tokenCode
          })
          this.view.mode = VIEW_MODES.success
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
          const balances = await this.loadBalances(counterparty.accountId)
          const fees = await this.loadFees(counterparty.accountId)

          const opts = {
            amount: this.form.amount,
            destinationAccountId: counterparty.accountId,
            destinationBalanceId: balances.recipientBalanceId,
            destinationEmail: counterparty.email,
            destinationFixedFee: fees.destination.fixed,
            destinationPercentFee: fees.destination.percent,
            sourceBalanceId: balances.senderBalanceId,
            sourceFixedFee: fees.source.fixed,
            sourcePercentFee: fees.source.percent,
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
      async loadBalances (recipientAccountId) {
        const balances = {}
        balances.senderBalanceId = this.accountBalances[this.form.tokenCode].balance_id
        balances.recipientBalanceId = await accountsService.loadBalanceIdByAccountid(recipientAccountId, this.form.tokenCode)
        return balances
      },
      async loadFees (recipientAccountId) {
        const fees = { source: {}, destination: {} }
        const [ senderFees, recipientFees ] = await Promise.all([
          feeService.loadPaymentFeeByAmount(this.form.tokenCode, this.form.amount),
          feeService.loadPaymentFeeByAmount(this.form.tokenCode, this.form.amount, recipientAccountId)
        ])
        fees.source.fixed = senderFees.fixed
        fees.source.percent = senderFees.percent
        fees.destination.fixed = recipientFees.fixed
        fees.destination.percent = recipientFees.percent
        return fees
      },
      updateView (mode, opts = {}, clear = false) {
        this.view.mode = mode
        this.view.opts = opts
        if (clear) {
          this.clear()
        }
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
</style>
