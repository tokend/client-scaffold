<template>
  <div class="deposit-list">
    <deposit-list-item
      v-for="item in list"
      :item="item"
      :key="item.id"
    />
  </div>
</template>

<script>
import DepositListItem from './Deposit.ListItem'

import { issuanceService } from '@/js/services/issuances.service'
import { IssuanceRecord } from '@/js/records/issuance.record'

export default {
  components: { DepositListItem },
  data: _ => ({
    list: []
  }),
  created () {
    this.loadList()
  },
  methods: {
    async loadList () {
      const { records } = await issuanceService.loadPendingIssuances()
      this.list = records.map(r => new IssuanceRecord(r))
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
