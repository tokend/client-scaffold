<template>
  <div class="deposit">
    <form @submit.prevent="submit">
      <div class="app__form-row">
        <div class="app__form-field deposit__amount-field">
          <input-field-unchained
            id="deposit-amount"
            v-model="form.amount"
            v-validate="'required|amount'"
            :label="i18n.lbl_amount()"
            name="deposit amount"
            :disabled="isPending"
            :error-message="errorMessage('deposit amount')"
          />
        </div>
      </div>

      <template v-if="resultDetails.address">
        <div class="deposit__address-viewer-wrp">
          <address-viewer
            :asset="token.code"
            :amount="resultDetails.amount"
            :address="resultDetails.address"
            :timeout="resultDetails.timeout"
          />
        </div>
      </template>

      <template v-else-if="!isFailed">
        <div class="app__form-actions">
          <button
            class="app__button-raised"
            type="submit"
            :disabled="isPending"
          >
            {{ i18n.dep_request_cp() }}
          </button>
        </div>
      </template>

      <template v-else>
        <p class="app__page-explanations app__page-explanations--secondary">
          {{ i18n.dep_no_address() }}
        </p>
      </template>
    </form>

    <div class="deposit__list-wrp">
      <deposit-list />
    </div>
  </div>
</template>

<script>
import DepositList from './Deposit.List'
import FormMixin from '@/vue/common/mixins/form.mixin'
import InputFieldUnchained from '@/vue/common/fields/InputFieldUnchained'
import AddressViewer from './Deposit.AddressViewer'

import { i18n } from '@/js/i18n'
import { depositService } from '@/js/services/deposit.service'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex/types'

export default {
  components: {
    InputFieldUnchained,
    DepositList,
    AddressViewer
  },
  mixins: [FormMixin],
  props: {
    token: {
      type: Object,
      required: true
    }
  },
  data: _ => ({
    i18n,
    form: {
      amount: ''
    },
    resultDetails: {
      address: '',
      amount: '',
      confirmsNeeded: '',
      timeout: '',
      txId: ''
    },
    isPending: false,
    isFailed: false
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountBalances
    ])
  },
  watch: {
    selectedToken: {
      handler: 'resetForm',
      immediate: true
    }
  },
  methods: {
    async submit () {
      if (!await this.isValid()) {
        return
      }
      this.disable()
      try {
        const response = await depositService.requestDeposit({
          amount: this.form.amount,
          balance: this.accountBalances[this.token.code].balance_id
        })
        const resultDetails = response.data().extras

        this.resultDetails.address = resultDetails.address
        this.resultDetails.amount = resultDetails.amount
        this.resultDetails.confirmsNeeded = resultDetails.confirms_needed
        this.resultDetails.timeout = resultDetails.timeout
        this.resultDetails.txId = resultDetails.txn_id
      } catch (e) {
        console.error(e)
        this.isFailed = true
      }
      this.enable()
    },
    resetForm () {
      this.form.amount = ''
      this.resultDetails.address = ''
      this.resultDetails.amount = ''
      this.resultDetails.confirmsNeeded = ''
      this.resultDetails.timeout = ''
      this.resultDetails.txId = ''
      this.isFailed = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./deposit";
.deposit__amount-field {
  margin-top: 4 * $point;
}
</style>
