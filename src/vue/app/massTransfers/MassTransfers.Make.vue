<template>
  <div class="md-layout md-alignment md-alignment-center-center">
    <md-card class="mass-transfer
                    md-layout-item
                    md-size-75
                    md-small-size-95
                    md-xsmall-size-100">
      <md-card-header>
        <div class="md-title">{{ i18n.tr_create_mass() }}</div>
      </md-card-header>
      <md-card-content>
        <file-field class="mass-transfer__upload-input"
                    v-model="documents.transfers"
                    label="Select File(s)"
                    accept=".csv"
                    id="preissuance-field"
        />
        <template v-if="transfers.length">
          <p>{{ i18n.lbl_to_upload() }}</p>
          <md-table>
            <md-table-row>
              <md-table-head>{{ i18n.lbl_amount() }}</md-table-head>
              <md-table-head>{{ i18n.lbl_email() }}</md-table-head>
              <md-table-head class="mass-transfer__table-row--account-id">{{ i18n.lbl_recipient_account_id() }}</md-table-head>
              <md-table-head>{{ i18n.lbl_source_fees() }}</md-table-head>
              <md-table-head>{{ i18n.lbl_destination_fees() }}</md-table-head>
              <md-table-head>{{ i18n.lbl_fee_from_source() }}</md-table-head>
            </md-table-row>
            <template v-for="transfer in transfers">
              <md-table-row>
                <md-table-cell>
                  {{ i18n.c(transfer.amount) }} {{ transfer.asset }}
                </md-table-cell>
                <md-table-cell>{{ transfer.email }}</md-table-cell>
                <md-table-cell class="mass-transfer__table-row--account-id">
                  {{ transfer.accountId }}
                </md-table-cell>
                <md-table-cell>
                  {{ transfer.sourceFees.fixed }}/{{ transfer.sourceFees.percent }}
                  {{ transfer.sourceFees.feeAsset }}
                </md-table-cell>
                <md-table-cell>
                  {{ transfer.destinationFees.fixed }}/{{ transfer.destinationFees.percent }}
                  {{ transfer.destinationFees.feeAsset }}
                </md-table-cell>
                <md-table-cell>
                  <md-checkbox v-model="transfer.sourcePaysForDest"/>
                </md-table-cell>
              </md-table-row>
            </template>
          </md-table>
        </template>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
  import { FileHelper } from '../../../js/helpers/file.helper'
  import { Keypair } from 'swarm-js-sdk'

  import { accountsService } from '../../../js/services/accounts.service'
  import { feeService } from '../../../js/services/fees.service'

  import { i18n } from '../../../js/i18n'

  import { PAYMENT_FEE_SUBTYPES } from '../../../js/const/xdr.const'

  import FileField from '../../common/fields/FileField'
  import FormMixin from '../../common/mixins/form.mixin'

  export default {
    name: 'MassTransfersIndex',
    components: { FileField },
    mixins: [FormMixin],
    data: _ => ({
      documents: {
        transfers: null
      },
      transfers: [],
      i18n
    }),
    methods: {
      async parseFile () {
        if (!this.documents.transfers) return
        const objKeys = ['recipient', 'amount', 'asset']
        const extracted = await FileHelper.readFileAsText(this.documents.transfers.file)

        const parsed = extracted
          .replace(/\r\n/g, '\n')
          .split('\n')
          .map(row => row
            .split(',')
            .reduce((transfer, item, i) => ({
              ...transfer, [objKeys[i]]: item
            }), {})
          )
        await this.loadTransferDetails(parsed)
      },
      async loadTransferDetails (transfers) {
        for (const transfer of transfers) {
          if (Keypair.isValidPublicKey(transfer.recipient)) {
            transfer.email = await accountsService.loadEmailByAccountId(transfer.recipient)
            transfer.accountId = transfer.recipient
          } else {
            transfer.accountId = await accountsService.loadAccountIdByEmail(transfer.recipient)
            transfer.email = transfer.recipient
          }
          transfer.sourceFees = await feeService.loadPaymentFeeByAmount(
            transfer.asset,
            transfer.amount
          )
          transfer.destinationFees = await feeService.loadPaymentFeeByAmount(
            transfer.asset,
            transfer.amount,
            transfer.accountId,
            PAYMENT_FEE_SUBTYPES.incoming
          )
          transfer.sourcePaysForDest = false
        }
        this.transfers = transfers
      }
    },
    watch: { 'documents.transfers': 'parseFile' }
  }
</script>

<style lang="scss">
  .mass-transfer__table-row--account-id {
    .md-table-cell-container {
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>
