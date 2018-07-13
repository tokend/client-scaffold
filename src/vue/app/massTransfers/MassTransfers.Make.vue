<template>
  <div class="mass-transfer">
     <md-card class="mass-transfer__card">
       <md-card-header>
         <div class="md-title">{{ i18n.tr_create_mass() }}</div>
       </md-card-header>

       <md-card-content>
         <p>{{ i18n.tr_mass_about() }}</p>
         <p><md-button @click="isHowToOpened = true">{{ i18n.tr_tell_me_more() }}</md-button></p>
         <md-dialog :md-active.sync="isHowToOpened">
           <md-dialog-title>{{ i18n.tr_about_csv() }}</md-dialog-title>
           <div class="app__dialog-inner">
             <p>{{ i18n.tr_mass_about_detailed() }}</p>
             <md-table>
               <md-table-row>
                 <md-table-head class="mass-transfer__table-cell">{{ i18n.lbl_recipient_email_or_account() }}</md-table-head>
                 <md-table-head class="mass-transfer__table-cell">{{ i18n.lbl_amount() }}</md-table-head>
                 <md-table-head class="mass-transfer__table-cell">{{ i18n.lbl_asset() }}</md-table-head>
               </md-table-row>
               <md-table-row>
                 <md-table-cell>alice@mail.com</md-table-cell>
                 <md-table-cell>0.012</md-table-cell>
                 <md-table-cell>BTC</md-table-cell>
               </md-table-row>
               <md-table-row>
                 <md-table-cell>bob@mail.com</md-table-cell>
                 <md-table-cell>1.541</md-table-cell>
                 <md-table-cell>ETH</md-table-cell>
               </md-table-row>
               <md-table-row>
                 <md-table-cell>john@mail.com</md-table-cell>
                 <md-table-cell>0.998</md-table-cell>
                 <md-table-cell>ETH</md-table-cell>
               </md-table-row>
             </md-table>

             <p>{{ i18n.tr_should_look_like() }}</p>

             <blockquote class="mass-transfer__csv-example">
               alice@mail.com,0.012,BTC <br>
               bob@mail.com,1.541,ETH <br>
               john@mail.com,0.998,ETH <br>
             </blockquote>

             <p>{{ i18n.tr_use_editor() }}</p>

           </div>
           <md-dialog-actions>
             <md-button class="md-primary" @click="isHowToOpened = false">
               {{ i18n.lbl_got_it() }}
             </md-button>
           </md-dialog-actions>
         </md-dialog>

         <file-field class="mass-transfer__upload-input"
                     v-model="documents.transfers"
                     label="Select File(s)"
                     accept=".csv"
                     id="preissuance-field"
         />
         <template v-if="transfers.length">
           <p class="mass-transfer__total">
             {{ i18n.tr_total_amount() }}:
             <template v-for="(amount, asset, i) in totals.amounts">
               <template v-if="totals.amounts.length > 1">{{ i+1 }}.</template>
               {{ amount }} {{ asset }}
             </template>
           </p>

           <p class="mass-transfer__total">
             {{ i18n.tr_total_source_fee() }}:
             <template v-for="(amount, asset, i) in totals.sourceFees">
               <template v-if="totals.sourceFees.length > 1">{{ i+1 }}.</template>
               {{ amount }} {{ asset }}
             </template>
           </p>

           <p class="mass-transfer__total">
             {{ i18n.tr_total_recipient_fee() }}:
             <template v-for="(amount, asset, i) in totals.destinationFees">
               <template v-if="totals.destinationFees.length > 1">{{ i+1 }}.</template>
               {{ amount }} {{ asset }}
             </template>
           </p>
         </template>
       </md-card-content>
       <md-card-actions md-alignment="left">
         <md-button class="mass-transfer__confirm-btn
                           md-primary"
                    :disabled="!transfers.length"
         >{{ i18n.lbl_confirm() }}</md-button>
       </md-card-actions>
       <template v-if="transfers.length">
         <md-table>
           <md-table-row>
             <md-table-head class="mass-transfer__table-cell">{{ i18n.lbl_amount() }}</md-table-head>
             <md-table-head class="mass-transfer__table-cell">{{ i18n.lbl_email() }}</md-table-head>
             <md-table-head class="mass-transfer__table-cell">
               {{ i18n.lbl_source_fees() }}
               {{ i18n.lbl_fixed_percent() }}
             </md-table-head>
             <md-table-head class="mass-transfer__table-cell">
               {{ i18n.lbl_destination_fees() }}
               {{ i18n.lbl_fixed_percent() }}
             </md-table-head>
           </md-table-row>
           <template v-for="transfer in transfers">
             <md-table-row>
               <md-table-cell class="mass-transfer__table-cell">
                 {{ i18n.c(transfer.amount) }} {{ transfer.asset }}
               </md-table-cell>
               <md-table-cell class="mass-transfer__table-cell">{{ transfer.email }}</md-table-cell>
               <md-table-cell class="mass-transfer__table-cell">
                 {{ transfer.sourceFees.fixed }}/{{ transfer.sourceFees.percent }}
                 {{ transfer.sourceFees.feeAsset }}
               </md-table-cell>
               <md-table-cell class="mass-transfer__table-cell">
                 {{ transfer.destinationFees.fixed }}/{{ transfer.destinationFees.percent }}
                 {{ transfer.destinationFees.feeAsset }}
               </md-table-cell>
             </md-table-row>
           </template>
         </md-table>

       </template>
     </md-card>
   </div>
</template>

<script>
  import { FileHelper } from '../../../js/helpers/file.helper'
  import { ErrorHandler } from '../../../js/errors/error_handler'
  import { Keypair } from 'swarm-js-sdk'

  import { accountsService } from '../../../js/services/accounts.service'
  import { feeService } from '../../../js/services/fees.service'

  import { i18n } from '../../../js/i18n'

  import { PAYMENT_FEE_SUBTYPES } from '../../../js/const/xdr.const'

  import FileField from '../../common/fields/FileField'
  import FormMixin from '../../common/mixins/form.mixin'

  import { add } from '../../../js/utils/math.util'

  export default {
    name: 'MassTransfersIndex',
    components: { FileField },
    mixins: [FormMixin],
    data: _ => ({
      documents: {
        transfers: null
      },
      transfers: [],
      i18n,
      isHowToOpened: false
    }),
    computed: {
      totals () {
        const amountsByAssets = {}
        const sourceFeesByAssets = {}
        const destinationFeesByAssets = {}

        this.transfers.forEach(transfer => {
          amountsByAssets[transfer.asset] = [...(amountsByAssets[transfer.asset] || []), transfer.amount]
          sourceFeesByAssets[transfer.sourceFees.feeAsset] = [
            ...(sourceFeesByAssets[transfer.sourceFees.feeAsset] || []),
            add(transfer.sourceFees.fixed, transfer.sourceFees.percent)
          ]
          destinationFeesByAssets[transfer.destinationFees.feeAsset] = [
            ...(destinationFeesByAssets[transfer.destinationFees.feeAsset] || []),
            add(transfer.destinationFees.fixed, transfer.destinationFees.percent)
          ]
        })

        const totalAmounts = {}
        const totalSourceFees = {}
        const totalDestinationFees = {}

        for (const [asset, amounts] of Object.entries(amountsByAssets)) {
          totalAmounts[asset] = amounts.reduce((total, amount) => add(total, amount), 0)
        }
        for (const [asset, amounts] of Object.entries(sourceFeesByAssets)) {
          totalSourceFees[asset] = amounts.reduce((total, amount) => add(total, amount), 0)
        }
        for (const [asset, amounts] of Object.entries(destinationFeesByAssets)) {
          totalDestinationFees[asset] = amounts.reduce((total, amount) => add(total, amount), 0)
        }

        return {
          amounts: totalAmounts,
          sourceFees: totalSourceFees,
          destinationFees: totalDestinationFees
        }
      }
    },
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
        this.disable()
        try {
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
        } catch (e) { ErrorHandler.processUnexpected(e) }
        this.enable()
      }
    },
    watch: { 'documents.transfers': 'parseFile' }
  }
</script>

<style lang="scss">
  @import '../../../scss/variables';

  .mass-transfer {
    display: flex;
    justify-content: center;
    width: 100%;
  }


  .mass-transfer__card {
    max-width: 755px;
    margin: auto;
    width: 100%;
  }


  .mass-transfer__table-cell {
    white-space: nowrap;

    .md-checkbox {
      margin: 0 !important;
    }
  }

  .mass-transfer__table-cell--account-id {
    .md-table-cell-container {
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .mass-transfer__csv-example {
    border: 1px solid rgba($col-unfocused, .5);
    background: rgba($col-md-primary, .05);
    color: $col-md-accent;
    /*font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;*/
    border-radius: 5px;
    padding: .5rem 1rem;
  }
</style>
