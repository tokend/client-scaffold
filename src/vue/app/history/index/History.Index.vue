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

      <template v-for="(tx, i) in list">

        <md-table-row class="tx-history__row">
          <md-table-cell class="tx-history__table-cell">{{ tx.date }}</md-table-cell>
          <md-table-cell class="tx-history__table-cell">{{ tx.name }}</md-table-cell>
          <md-table-cell class="tx-history__table-cell">{{ tx.state }}</md-table-cell>
          <md-table-cell class="tx-history__table-cell">{{ tx.asset }}</md-table-cell>
          <md-table-cell class="tx-history__table-cell">{{ tx.amount }}</md-table-cell>
          <md-table-cell class="tx-history__table-cell tx-history__table-cell--counterparty" md-label="Counterparty">
            {{ tx.counterparty }}
          </md-table-cell>

          <md-table-cell>
            <md-button class="md-icon-button" @click="toggleDetails(i)">
              <md-icon>keyboard_arrow_down</md-icon>
            </md-button>
          </md-table-cell>

        </md-table-row>

        <tx-details class="tx-history__details" v-if="index === i" :tx="tx"/>

      </template>
    </md-table>
  </div>
</template>

<script>
  import TxDetails from './History.TxDetails'

  import { mapGetters, mapActions } from 'vuex'
  import { vuexTypes } from '../../../../vuex/types'
  import { RecordTypes } from '../../../../js/records/types'
  import { i18n } from '../../../../js/i18n'
  import get from 'lodash/get'

  export default {
    name: 'history-index',
    components: { TxDetails },
    data: _ => ({
      tokenCode: 'BTC',
      index: -1,
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
      toggleDetails (index) {
        this.index = this.index === index ? -1 : index
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

  .tx-history__table-cell {
    overflow: hidden;

    &--counterparty {
      max-width: 10rem;
    }
  }

  .tx-history__details {
    padding: 10px 25px;
  }
</style>
