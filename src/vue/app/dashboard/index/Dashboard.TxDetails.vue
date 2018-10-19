<template>
  <transfer
    v-if="tx instanceof Transfer"
    :tx="tx" />
  <match
    v-else-if="tx instanceof Match"
    :tx="tx" />
  <record-details-viewer
    v-else
    :tx="tx" />
</template>

<script>
import Transfer from './components/Details.Transfer'
import Match from './components/Details.Match'
import RecordDetailsViewer from '../../common/RecordDetailsViewer'

import { RecordTypes } from '@/js/records/types'

export default {
  name: 'tx-details',
  components: {
    Transfer,
    Match,
    RecordDetailsViewer
  },
  props: {
    tx: { type: Object, required: true }
  },
  data: _ => ({
    Transfer: RecordTypes.TransferRecord,
    Match: RecordTypes.MatchTransaction
  })
}
</script>
