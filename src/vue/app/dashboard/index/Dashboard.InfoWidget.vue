<template>
  <md-card class="info-widget">
    <md-card-header class="info-widget__header">
      <div class="md-title">Your {{ currentAsset }} activity</div>
    </md-card-header>

    <md-card-content class="info-widget__asset">
      <md-list class="md-double-line info-widget__asset-list md-layout">
        <md-list-item class="info-widget__asset-item"
                      v-for="(tx, i) in list"
                      v-bind:key="i"
                      v-if="i < transactionsToShow"
                      @click="makeDialogIsShow(list[i])">
          <div class="info-widget__asset-item-left  md-layout-item">
            <div class="info-widget__asset-name"> {{ tx.name }} </div>
            <div class="info-widget__asset-counterparty">
              {{ tx.direction === 'in' ? 'from' : 'to' }} {{ tx.counterparty }}
            </div>
            <div class="info-widget__asset-date"> {{ tx.date }} </div>
          </div>
          <div class="info-widget__asset-item-right  md-layout-item">
            <div :class="'info-widget__asset-amount info-widget__asset-amount--' + tx.direction">
              {{ tx.direction === 'in' ? '+' : '-' }}{{ tx.amount }} {{ tx.asset }}
            </div>
            <div :class="'info-widget__asset-state info-widget__asset-state--' + tx.state">
              {{ tx.state === 'confirm' ? 'success' : tx.state }}
            </div>
          </div>
        </md-list-item>
      </md-list>
    </md-card-content>

    <md-card-actions>
      <md-button to="/history" class="md-primary">View more</md-button>
    </md-card-actions>
    <info-dialog v-on:close-dialog="closeDialog"
                 v-if="showDialog"
                 :dialogValues="dialogValues"
                 :showDialog="showDialog"/>
  </md-card>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { vuexTypes } from '../../../../vuex/types'
  import { RecordTypes } from '../../../../js/records/types'

  import get from 'lodash/get'

  import InfoDialog from './Dashboard.InfoDialog'

  export default {
    name: 'info-widget',
    components: { InfoDialog },
    data: _ => ({
      transactionsToShow: 3,
      showDialog: false,
      dialogValues: {}
    }),
    props: ['currentAsset'],
    created () {
      this.loadList(this.currentAsset)
    },
    computed: {
      ...mapGetters([
        vuexTypes.transactions,
        vuexTypes.userWalletTokens
      ]),
      list () {
        return (get(this.transactions, `${this.currentAsset}.records`) || [])
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
    mounted () {
      console.log(this.transactions)
      console.log(this.userWalletTokens)
      console.log(this.list)
    },
    methods: {
      ...mapActions({
        loadList: vuexTypes.GET_TX_LIST
      }),
      makeDialogIsShow (list) {
        this.showDialog = true
        this.dialogValues = list
      },
      closeDialog: function (status) {
        this.showDialog = status
      }
    }
  }
</script>

<style lang="scss" scoped>

  @import '../../../../scss/variables.scss';
  @import '../../../../scss/mixins.scss';

  .info-widget {
    max-height: 408px;
    max-width: 560px;
    width: 100%;
  }

  .info-widget__header {
    padding: 24px 24px 42px;
  }

  .info-widget__asset {
    padding: 0;
  }

  .info-widget__asset-list {
    padding: 0;
  }

  .info-widget__asset-item {
    border-bottom: 1px solid #e8e8e8;

    &:first-child {
      border-top: 1px solid #e8e8e8;
    }
  }

  .info-widget__asset-name {
    font-size: 14px;
    letter-spacing: 0.1px;
    margin-bottom: 4px;
  }

  .info-widget__asset-counterparty {
    overflow: hidden;
    max-width: 145px;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
    letter-spacing: 0.1px;
    color: rgba(0, 0, 0, 0.55);
    margin-bottom: 12px;
  }

  .info-widget__asset-item-right {
    text-align: right;
  }

  .info-widget__asset-date {
    font-size: 12px;
    letter-spacing: 0.1px;
  }

  .info-widget__asset-amount {
    font-size: 14px;
  }

  .info-widget__asset-amount--in { color: $blue; }
  .info-widget__asset-amount--out { color: $red; }

  .info-widget__asset-state {
    text-align: right;
    margin-top: 14px;
    font-size: 12px;
  }

  .info-widget__asset-state--success { color: $green; }
  .info-widget__asset-state--pending { color: $orange; }
  .info-widget__asset-state--rejected,
  .info-widget__asset-state--failed { color: $md-invalid; }

</style>
