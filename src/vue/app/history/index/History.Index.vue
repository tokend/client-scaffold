<template>
  <div class="tx-history">
    <md-table md-card class="tx-history__table">
      <md-table-toolbar>
        <h1 class="md-title">Transaction history</h1>
      </md-table-toolbar>

      <md-table-row>
        <md-table-head>{{ i18n.lbl_date() }}</md-table-head>
        <md-table-head>{{ i18n.lbl_tx_type() }}</md-table-head>
        <md-table-head>{{ i18n.lbl_status() }}</md-table-head>
        <md-table-head>{{ i18n.lbl_asset() }}</md-table-head>
        <md-table-head>{{ i18n.lbl_amount() }}</md-table-head>
        <md-table-head><!--Button--></md-table-head>
      </md-table-row>

      <template v-for="item in list">

        <md-table-row>
          <md-table-cell class="tx-history__table-cell">{{ item.date }}</md-table-cell>
          <md-table-cell class="tx-history__table-cell">{{ item.name }}</md-table-cell>
          <md-table-cell class="tx-history__table-cell">{{ item.state }}</md-table-cell>
          <md-table-cell class="tx-history__table-cell">{{ item.asset }}</md-table-cell>
          <md-table-cell class="tx-history__table-cell">{{ item.amount }}</md-table-cell>
          <md-table-cell class="tx-history__table-cell tx-history__table-cell--counterparty" md-label="Counterparty">
            {{ item.counterparty }}
          </md-table-cell>

          <md-table-cell>
            <md-button class="md-icon-button" @click="openDetails">
              <md-icon>keyboard_arrow_down</md-icon>
            </md-button>
          </md-table-cell>

        </md-table-row>

      </template>
    </md-table>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { vuexTypes } from '../../../../vuex/types'
  import { RecordTypes } from '../../../../js/records/types'
  import { i18n } from '../../../../js/i18n'
  import get from 'lodash/get'

  export default {
    name: 'history-index',
    data: _ => ({
      tokenCode: 'BTC',
      selectedItem: '',
      i18n
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
      }),
      openDetails (item) {
        this.selectedItem = this.selectedItem ? null : item.id
      }
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
