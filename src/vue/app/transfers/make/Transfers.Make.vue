<template>
  <div class="transfer__wrapper">
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

          <md-card-header class="transfer__header">
            <div class="md-title transfer__title">{{ i18n.tr_send() }}</div>
            <div class="transfer__user-balance">
              {{ i18n.tr_balance({ balance: balance.balance, token: form.tokenCode }) }}
            </div>
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
          </md-card-content>
          <md-dialog-actions class="transfer-dialog__actions">
              <md-button type="submit" class="md-primary" :isPending="isPending">
                {{ i18n.lbl_send() }}
              </md-button>
          </md-dialog-actions>
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
                         :isPending="isPending"
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
          </div>
        </md-card-content>
        <md-dialog-actions class="transfer-dialog__actions">
            <md-button class="md-primary" @click="updateView(VIEW_MODES.submit, {}, true)">{{ i18n.lbl_go_back() }}</md-button>
        </md-dialog-actions>
      </md-card>
    </template>

  </div>
    <div class="preissuance-form__upload-wrp">
      <file-field class="preissuance-form__upload-input"
            v-model="documents.payment"
            label="Select File(s)"
            accept=".csv"
            id="preissuance-field"
      />
      <ul class="payment-form__list" v-if="payments.length">
        <p>{{ i18n.lbl_to_upload() }}</p>

        <li v-for="(item, index) in payments" :key="index">
          {{index + 1}}. {{item.account}} {{i18n.c(item.amount)}} {{item.asset}} {{item.email}} {{item.id}}
        </li>
      </ul>
    </div>
  </div>

</template>

<script>
  import { FileHelper } from '../../../../js/helpers/file.helper'
  import FileField from '../../../common/fields/FileField'
  import FormMixin from '../../../common/mixins/form.mixin'
  import ConfirmTransfer from './Transfers.Confirm'

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
    components: { ConfirmTransfer, FileField },
    data: _ => ({
      form: {
        tokenCode: null,
        amount: '',
        recipient: '',
        subject: ''
      },
      documents: {
        payment: null
      },
      payments: [],
      view: {
        mode: VIEW_MODES.submit,
        opts: {}
      },
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
      },
      parsePayments (payments) {
        payments.forEach(async (value) => {
          if (Keypair.isValidPublicKey(value.account)) {
            value.email = await accountsService.loadEmailByAccountId(value.account)
            value.id = value.account
          } else {
            value.id = await accountsService.loadAccountIdByEmail(value.account)
            value.email = value.account
          }
        })
        console.log(payments)
        this.payments = payments
      }
    },
    watch: {
      'documents.payment': async function (value) {
        if (value) {
          const extracted = await FileHelper.readFileAsText(value.file)
          const extractedArr = extracted.replace(/\r\n/g, '\n').split('\n')
          const parsedPayment = extractedArr.map((payment) => {
            const split = payment.split(',')
            const objKeys = ['account', 'amount', 'asset']
            const converted = split.reduce((obj, item, i) => {
              obj[objKeys[i]] = item
              return obj
            }, {})
            return converted
          })
          this.parsePayments(parsedPayment)
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

  .transfer__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
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

  .payment-form__list {
    list-style-type: none;
  }
</style>
