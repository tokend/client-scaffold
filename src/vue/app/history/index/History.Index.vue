<template>
  <div class="tx-history">

    <md-table md-card class="tx-history__table">
      <md-table-toolbar class="tx-history__table-toolbar">
        <h1 class="tx-history__table-title md-title">{{ i18n.th_transaction_history() }}</h1>
        <div class="tx-history__select-outer">
          <select-field
            :label="i18n.lbl_asset()"
            v-model="tokenCode"
            :values="tokens"
          />
        </div>
      </md-table-toolbar>


      <template v-if="tokenCode && list.length">
        <md-table-row class="tx-history__row">
          <md-table-head>{{ i18n.lbl_date() }}</md-table-head>
          <md-table-head>{{ i18n.lbl_tx_type() }}</md-table-head>
          <md-table-head>{{ i18n.lbl_status() }}</md-table-head>
          <md-table-head>{{ i18n.lbl_asset() }}</md-table-head>
          <md-table-head>{{ i18n.lbl_amount() }}</md-table-head>
          <md-table-head>{{ i18n.lbl_counterparty() }}</md-table-head>
          <md-table-head><!--Button--></md-table-head>
        </md-table-row>

        <template v-for="(tx, i) in list">

          <md-table-row class="tx-history__row" @click="toggleDetails(i)">
            <md-table-cell class="tx-history__table-cell">{{ tx.date }}</md-table-cell>
            <md-table-cell class="tx-history__table-cell">{{ tx.name }}</md-table-cell>
            <md-table-cell class="tx-history__table-cell">{{ tx.state }}</md-table-cell>
            <md-table-cell class="tx-history__table-cell">{{ tx.asset }}</md-table-cell>
            <md-table-cell class="tx-history__table-cell">{{ tx.amount }}</md-table-cell>
            <md-table-cell class="tx-history__table-cell tx-history__table-cell--counterparty">
              {{ tx.counterparty }}
            </md-table-cell>

            <md-table-cell>
              <md-button class="tx-history__open-details-btn md-icon-button">
                <md-icon v-if="isSelected(i)">keyboard_arrow_up</md-icon>
                <md-icon v-else>keyboard_arrow_down</md-icon>
              </md-button>
            </md-table-cell>

          </md-table-row>

          <md-table-row class="th-history__expandable-row" v-if="isSelected(i)">
            <md-table-cell colspan="7">
              <tx-details class="tx-history__details" :tx="tx"/>
            </md-table-cell>
          </md-table-row>

        </template>

        <md-table-row v-if="!isLoaded">
          <md-table-cell colspan="7">
            <div class="tx-history__btn-outer">
              <md-button @click="more" :disabled="isLoading">More</md-button>
            </div>
          </md-table-cell>
        </md-table-row>
      </template>

      <template v-else>
        <div class="tx-history__no-transactions">
          <md-icon class="md-size-4x">trending_up</md-icon>
          <h2>{{ i18n.th_no_transaction_history() }}</h2>
          <p>{{ i18n.th_here_will_be_the_list() }}</p>
        </div>
      </template>


    </md-table>
  </div>
</template>

<script>
  import TxDetails from './History.TxDetails'
  import SelectField from '../../../common/fields/SelectField'

  import { mapGetters, mapActions } from 'vuex'
  import { EventDispatcher } from '../../../../js/events/event_dispatcher'
  import { vuexTypes } from '../../../../vuex/types'
  import { RecordTypes } from '../../../../js/records/types'
  import { i18n } from '../../../../js/i18n'
  import get from 'lodash/get'

  export default {
    name: 'history-index',
    components: { TxDetails, SelectField },
    data: _ => ({
      isLoading: false,
      tokenCode: null,
      index: -1,
      i18n
    }),
    async created () {
      this.tokenCode = this.$route.params.tokenCode || this.tokens[0] || null
      if (this.tokenCode) {
        this.loadList(this.tokenCode)
      }
    },
    computed: {
      ...mapGetters([
        vuexTypes.transactions,
        vuexTypes.userAcquiredTokens
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
      },
      isLoaded () {
        return get(this.transactions, `${this.tokenCode}.isLoaded`)
      },
      tokens () {
        return this.userAcquiredTokens.map(token => token.code)
      }
    },
    methods: {
      ...mapActions({
        loadList: vuexTypes.GET_TX_LIST,
        loadNext: vuexTypes.NEXT_TX_LIST
      }),
      toggleDetails (index) {
        this.index = this.index === index ? -1 : index
      },
      isSelected (i) {
        return this.index === i
      },
      async more () {
        this.isLoading = true
        try {
          await this.loadNext(this.tokenCode)
        } catch (e) {
          console.error(e)
          EventDispatcher.dispatchShowErrorEvent(i18n.th_failed_to_load_tx())
        }
        this.isLoading = false
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

  $padding-vertical: 20px;
  $padding-horizontal: 25px;
  $padding: $padding-vertical $padding-horizontal;

  .tx-history {
    width: 100%;
    padding: 0 12px;
  }

  .tx-history__table {
    margin: 0 !important;
  }

  .tx-history__table-toolbar {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    @media (max-width: 840px) {
      flex-direction: column;
      padding-top: $padding-vertical;
    }
  }

  .tx-history__row {
    cursor: pointer;
  }

  .tx-history__table-cell {
    overflow: hidden;
    white-space: nowrap;

    &--counterparty {
      max-width: 10rem;
    }
  }

  .tx-history__select-outer {
    padding: 5px $padding-horizontal;
  }

  .tx-history__details {
    padding: $padding;
    max-width: 25rem;
    width: 100%;
  }

  .tx-history__btn-outer {
    text-align: center;
  }

  .tx-history__no-transactions {
    padding: 0 16px 32px;
    text-align: center;

    p {
      margin-top: 10px;
    }
  }

  .tx-history__table-title {
    padding: 24px;
  }

</style>
