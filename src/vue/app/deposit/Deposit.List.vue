<template>
  <div class="deposit-list">
    <deposit-list-item
      v-for="item in list"
      :item="item"
      :key="item.id"
    />

    <div class="deposit-list__btn-more-wrp" v-if="!isLoaded">
      <button
        class="app__button"
        @click="loadNext"
        :disabled="isLoaded"
      >
        More
      </button>
    </div>
  </div>
</template>

<script>
import DepositListItem from './Deposit.ListItem'

import { issuanceService } from '@/js/services/issuances.service'
import { IssuanceRecord } from '@/js/records/issuance.record'

import config from '../../../config'

export default {
  components: { DepositListItem },
  data: _ => ({
    list: [],
    next: () => {},
    isLoaded: false,
    isLoading: false
  }),
  created () {
    this.loadList()
  },
  methods: {
    async loadList () {
      this.isLoading = true
      const response = await issuanceService.loadPendingIssuances()
      this.isLoading = false
      this.updateList(response)
    },
    async loadNext () {
      this.isLoading = true
      const response = await this.next()
      this.isLoading = false
      this.updateList(response)
    },
    updateList ({ records, next }) {
      this.list = this.list.concat(records.map(r => new IssuanceRecord(r)))
      this.next = next

      if (records.length < config.TRANSACTIONS_PER_PAGE) {
        this.isLoaded = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";

.deposit-list__btn-more-wrp {
  text-align: center;
  margin-top: 1 * $point;
}
</style>
