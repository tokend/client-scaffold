<template>
  <withdrawal v-if="tx instanceof Withdrawal" :tx="tx"/>
  <issuance   v-else-if="tx instanceof Issuance" :tx="tx"/>
  <transfer   v-else-if="tx instanceof Transfer" :tx="tx"/>
  <match      v-else-if="tx instanceof Match" :tx="tx"/>
</template>

<script>
  import Withdrawal from './components/Details.Withdraw'
  import Issuance from './components/Details.Issuance'
  import Transfer from './components/Details.Transfer'
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
      Match
    },
    data: _ => ({
      Withdrawal: RecordTypes.WithdrawalRecord,
      Issuance: RecordTypes.IssuanceRecord,
      Transfer: RecordTypes.TransferRecord,
      Match: RecordTypes.MatchTransaction
    })
  }
</script>
