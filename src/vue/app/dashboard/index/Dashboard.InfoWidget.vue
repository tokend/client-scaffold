<template>
  <div class="info-widget">
    <template v-if="list.length">
      <div class="info-widget__title"> {{ i18n.dash_activity() }} </div>
      <div class="info-widget__list-wrapper">
        <div class="info-widget__list" v-table-scroll-shadow>
          <div class="info-widget__list-header">
            <div class="info-widget__list-header-item info-widget__list-header-item--date">{{ i18n.lbl_date() }}</div>
            <div class="info-widget__list-header-item info-widget__list-header-item--type">{{ i18n.lbl_tx_type() }} Type</div>
            <div class="info-widget__list-header-item info-widget__list-header-item--asset">{{ i18n.lbl_asset() }}</div>
            <div class="info-widget__list-header-item info-widget__list-header-item--amount">{{ i18n.lbl_amount() }}</div>
            <div class="info-widget__list-header-item info-widget__list-header-item--counterparty">{{ i18n.lbl_counterparty() }}</div>
            <div class="info-widget__list-header-item info-widget__list-header-item--status">{{ i18n.lbl_status() }}</div>
            <div class="info-widget__list-header-item info-widget__list-header-item--btn"></div>
          </div>
          <div class="info-widget__list-body">
            <div class="info-widget__list-body-elem"
                v-for="(tx, i) in list"
                v-if="i < transactionsToShow"
                :key="`activity-item-${i}`"
                :class="`info-widget__list-body-elem--${tx.state}`">
              <div class="info-widget__list-body-row"
                   @click="makeDialogIsShow(tx)">
                <div :title="tx.date" class="info-widget__list-body-item info-widget__list-body-item--date">
                  {{ tx.date }}
                </div>
                <div :title="tx.name" class="info-widget__list-body-item info-widget__list-body-item--type">
                  {{ tx.name }}
                </div>
                <div :title="tx.asset" class="info-widget__list-body-item info-widget__list-body-item--asset">
                  {{ tx.asset }}
                </div>
                <div :title="tx.direction" class="info-widget__list-body-item info-widget__list-body-item--amount">
                  {{ tx.direction === 'in' ? '+' : '-' }}{{ tx.amount }}
                </div>
                <div :title="tx.counterparty" class="info-widget__list-body-item info-widget__list-body-item--counterparty">
                  {{ tx.counterparty }}
                </div>
                <div :title="tx.state" class="info-widget__list-body-item info-widget__list-body-item--status">
                  {{ tx.state }}
                </div>
                <div class="info-widget__list-body-item info-widget__list-body-item--btn">
                  <button class="info-widget__list-body-item-btn" @click="makeDialogIsShow(tx)">
                    <md-icon>keyboard_arrow_down</md-icon>
                  </button>
                </div>
              </div>
            </div>
            <info-dialog @close-dialog="closeDialog"
                         v-if="showDialog"
                         :dialogValues="dialogValues"
                         :showDialog="showDialog"/>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <no-data-message icon-name="trending_up"
                       :msg-title="i18n.th_no_transaction_history()"
                       :msg-message="i18n.th_here_will_be_the_list()"/>
    </template>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { vuexTypes } from '../../../../vuex/types'
  import { RecordTypes } from '../../../../js/records/types'
  import { PricesHelper } from '../../../../vuex/helpers/prices.helper'
  import { DEFAULT_CONVERSION_ASSET } from '../../../../js/const/configs.const'
  import { i18n } from '../../../../js/i18n'
  import { TX_STATES } from '../../../../js/const/const'
  import NoDataMessage from '@/vue/common/messages/NoDataMessage'

  import get from 'lodash/get'

  import InfoDialog from './Dashboard.InfoDialog'

  export default {
    name: 'info-widget',
    components: {
      InfoDialog,
      NoDataMessage
    },
    data: _ => ({
      transactionsToShow: 10,
      showDialog: false,
      dialogValues: {},
      i18n,
      DEFAULT_CONVERSION_ASSET,
      TX_STATES
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
    methods: {
      ...mapActions({
        loadList: vuexTypes.GET_TX_LIST
      }),
      convertAmount (amount) {
        return PricesHelper.baseToQuote(amount, this.currentAsset, DEFAULT_CONVERSION_ASSET)
      },
      makeDialogIsShow (list) {
        this.showDialog = true
        this.dialogValues = list
      },
      closeDialog (status) {
        this.showDialog = status
      }
    },
    watch: {
      currentAsset (value) {
        this.loadList(value)
      }
    }
  }
</script>

<style lang="scss" scoped>

  @import '~@scss/variables';
  @import '~@scss/mixins';

  .info-widget__list {
    padding: 0 4px 6px 4px;

    @include respond-to-custom(1300px) {
      overflow-x: scroll;
    }
  }

  .info-widget__title {
    color: $col-md-primary;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 16px;
    margin-top: 72px;

    @include respond-to(medium) { margin-top: 24px }
  }

  .info-widget__list-header,
  .info-widget__list-body-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
  }

  .info-widget__list-wrapper {
    position: relative;
  }

  .info-widget__list-body-elem--failed,
  .info-widget__list-body-elem--pending,
  .info-widget__list-body-elem--success {
    &:before {
      position: absolute;
      left: -29px;
      margin-top: 22px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      color: #fff;
      font-size: 10px;
      line-height: 18px;

      @include respond-to(medium) {
        left: -25px;
      }

      @include respond-to-custom(800px) {
        left: -21px;
      }

      @include respond-to(xsmall) {
        left: -17px;
      }
    }
  }

  .info-widget__list-body-elem--failed:before {
    content: '\2715';
    background-color: $col-md-accent;
    padding: 0 4px;
  }

  .info-widget__list-body-elem--pending:before {
    background-color: #ffb454;
    content: '';
  }

  .info-widget__list-body-elem--success:before {
    content: '\2713';
    background-color: #51ca90;
    padding: 0 3px;
  }

  .info-widget__list-body-elem {
    @include box-shadow();

    background-color: #fff;
    min-width: 970px;

    &:not(:last-child) {
      margin-bottom: 6px;
    }
  }

  .info-widget__list-body-item,
  .info-widget__list-header-item {
    padding: 8px 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: $col-md-primary;
  }

  .info-widget__list-body-row-details {
    padding-top: 17px;
    padding-bottom: 17px;
    margin: 0 20px;
    position: relative;

    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 60px;
      height: 1px;
      background-color: rgba($col-md-primary, .2);
    }
  }

  .info-widget__history {
    max-width: 280px;

    @include respond-to(medium) {
      margin-left: auto;
      margin-right: 30px;
    }
  }

  .info-widget__list-body-item--btn,
  .info-widget__list-header-item--btn {
    width: 70px;
    flex: none;
    padding: 0;
  }

  .info-widget__list-body-item-btn {
    @include button();
    @include button-flat();

    background: rgba($col-md-primary, .1);
    font-size: 10px;
    border-radius: 4px;
    padding: 8px;
  }

  .info-widget__list-body-item-icon {
    color: $col-md-primary !important;
    font-size: 20px !important;
    font-weight: 400;
    transition: .3s ease-out;
    will-change: transform;
  }

  .info-widget__list-body-item-icon--active { transform: rotate(-180deg) }

  .info-widget__list-header-item--date,
  .info-widget__list-body-item--date {
    width: 15%;
    min-width: 160px;
  }

  .info-widget__list-body-item--type,
  .info-widget__list-header-item--type {
    width: 15%;
    min-width: 150px;
  }

  .info-widget__list-body-item--asset,
  .info-widget__list-header-item--asset {
    width: 12%;
    min-width: 100px;
  }

  .info-widget__list-body-item--amount,
  .info-widget__list-header-item--amount {
    width: 18%;
    min-width: 120px;
  }

  .info-widget__list-body-item--counterparty,
  .info-widget__list-header-item--counterparty {
    width: 24%;
    min-width: 250px;
  }

  .info-widget__list-body-item--status,
  .info-widget__list-header-item--status {
    width: 12%;
    min-width: 120px;
  }

  .info-widget__list-body-row-detail {
    display: flex;
    font-size: 12px;

    label {
      width: 65px;
      margin-right: 16px;
      color: #837fa1;
    }

    p { color: #3a4180; }
  }

</style>
