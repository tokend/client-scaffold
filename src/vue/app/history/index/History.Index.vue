<template>
  <div class="tx-history">
    <md-table v-model="list" md-card class="tx-history__table">
      <md-table-toolbar>
        <h1 class="md-title">Transaction history</h1>
      </md-table-toolbar>

      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell class="tx-history__table-cell" md-label="Date">{{ item.date }}</md-table-cell>
        <md-table-cell class="tx-history__table-cell" md-label="Transaction">{{ item.name }}</md-table-cell>
        <md-table-cell class="tx-history__table-cell" md-label="Status">{{ item.state }}</md-table-cell>
        <md-table-cell class="tx-history__table-cell" md-label="Asset">{{ item.asset }}</md-table-cell>
        <md-table-cell class="tx-history__table-cell" md-label="Amount">{{ item.amount }}</md-table-cell>
        <md-table-cell class="tx-history__table-cell tx-history__table-cell--counterparty" md-label="Counterparty">
          {{ item.counterparty }}
        </md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { vuexTypes } from '../../../../vuex/types'
  import { RecordTypes } from '../../../../js/records/types'
  import get from 'lodash/get'

  export default {
    name: 'history-index',
    data: _ => ({
      tokenCode: 'BTC'
    }),
    created () {
      this.loadList(this.tokenCode)
    },
    computed: {
      ...mapGetters([
        vuexTypes.transactions
      ]),
      list () {
        return (get(this.transactions, `${this.tokenCode}.records`) || [])
          .reduce((list, item) => {
            if (item instanceof RecordTypes.MatchRecord) {
              item.transactions.forEach(tx => { list.push(tx) })
              return list
            }
            list.push(item)
            return list
          }, [])
      }
    },
    methods: {
      ...mapActions({
        loadList: vuexTypes.GET_TX_LIST
      })
    },
    watch: {
      tokenCode (code) {
        this.loadList(code)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../scss/variables';

  .tx-history__table {
    .md-table-content {
      background: $col-md-block !important;
    }
  }

  .tx-history__table-cell {
    overflow: hidden;
    &--counterparty {
      max-width: 10rem;
    }
  }
</style>
