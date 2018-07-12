<template>
  <div class="mass-transfer">
    <file-field class="mass-transfer__upload-input"
                v-model="documents.payment"
                label="Select File(s)"
                accept=".csv"
                id="preissuance-field"
    />
    <ul class="mass-transfer__list" v-if="payments.length">
      <p>{{ i18n.lbl_to_upload() }}</p>

      <li v-for="(item, index) in payments" :key="index">
        {{index + 1}}. {{item.account}} {{i18n.c(item.amount)}} {{item.asset}} {{item.email}} {{item.id}}
      </li>
    </ul>
  </div>
</template>

<script>
  import { FileHelper } from '../../../js/helpers/file.helper'
  import { Keypair } from 'swarm-js-sdk'
  import { accountsService } from '../../../js/services/accounts.service'

  import { i18n } from '../../../js/i18n'

  import FileField from '../../common/fields/FileField'
  import FormMixin from '../../common/mixins/form.mixin'

  export default {
    name: 'MassTransfersIndex',
    components: { FileField },
    mixins: [FormMixin],
    data: _ => ({
      documents: {
        payment: null
      },
      payments: [],
      i18n
    }),
    methods: {
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

</style>
