<template>
  <withdrawal    v-if="tx instanceof Withdrawal" :tx="tx"/>
  <issuance      v-else-if="tx instanceof Issuance" :tx="tx"/>
  <transfer      v-else-if="tx instanceof Transfer" :tx="tx"/>
  <transfer-v2   v-else-if="tx instanceof TransferV2" :tx="tx"/>
  <match         v-else-if="tx instanceof Match" :tx="tx"/>
</template>

<script>
  import Withdrawal from './components/Details.Withdraw'
  import Issuance from './components/Details.Issuance'
  import Transfer from './components/Details.Transfer'
  import TransferV2 from './components/Details.TransferV2'
  import Match from './components/Details.Match'

  import { RecordTypes } from '../../../../js/records/types'

  export default {
    name: 'tx-details',
    props: {
      tx: { type: Object, required: true }
    },
    components: {
      Withdrawal,
      Issuance,
      Transfer,
      TransferV2,
      Match
    },
    data: _ => ({
      Withdrawal: RecordTypes.WithdrawalRecord,
      Issuance: RecordTypes.IssuanceRecord,
      Transfer: RecordTypes.TransferRecord,
      TransferV2: RecordTypes.TransferV2Record,
      Match: RecordTypes.MatchTransaction
    })
  }
</script>
