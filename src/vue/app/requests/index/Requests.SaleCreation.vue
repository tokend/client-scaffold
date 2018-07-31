<template>
  <div class="tx-sale-creation">
    <div class="tx-sale-creation__select-outer" v-if="accountOwnedTokens.length">
      <select-field-custom
      :label="i18n.lbl_asset()"
      v-model="tokenCode"
      :values="accountOwnedTokens"/>
    </div>
    <div class="requests__list-wrapper" v-if="list.length">
      <div class="requests__list" v-table-scroll-shadow>
        <div class="requests__list-header">
          <div class="requests__list-header-item requests__list-header-item--sale-name">{{ i18n.lbl_sale_name() }}</div>
          <div class="requests__list-header-item requests__list-header-item--token-code">{{ i18n.lbl_token_code() }}</div>
          <div class="requests__list-header-item requests__list-header-item--state">{{ i18n.lbl_request_state() }}</div>
          <div class="requests__list-header-item requests__list-header-item--created">{{ i18n.lbl_created_at() }}</div>
          <div class="requests__list-header-item requests__list-header-item--updated">{{ i18n.lbl_updated_at() }}</div>
          <div class="requests__list-header-item requests__list-header-item--btn"></div>
        </div>
        <div class="requests__list-body">
          <div class="requests__list-body-elem"
              v-for="(tx, i) in list"
              :key="`activity-item-${i}`"
              :class="`requests__list-body-elem--${tx.state}`">
            <div class="requests__list-body-row">
              <div :title="tx.saleName" class="requests__list-body-item requests__list-body-item--sale-name">
                {{ tx.saleName }}
              </div>
              <div :title="tx.tokenCode" class="requests__list-body-item requests__list-body-item--token-code">
                {{ tx.tokenCode }}
              </div>
              <div :title="tx.state" class="requests__list-body-item requests__list-body-item--state">
                {{ tx.state }}
              </div>
              <div :title="tx.createdAt" class="requests__list-body-item requests__list-body-item--created">
                {{ i18n.dmy(tx.createdAt) }}
              </div>
              <div :title="tx.direction" class="requests__list-body-item requests__list-body-item--updated">
                {{ i18n.dmy(tx.updatedAt) }}
              </div>
              <div class="requests__list-body-item requests__list-body-item--btn">
                <button class="requests__list-body-item-btn" @click="toggleDetails(i)">
                  <md-icon class="requests__list-body-item-icon"
                          :class="{ 'requests__list-body-item-icon--active': isSelected(i) }">
                    keyboard_arrow_down
                  </md-icon>
                </button>
              </div>
            </div>
            <div class="requests__list-body-row requests__list-body-row--details" v-if="isSelected(i)">
              <md-card-content class="md-layout md-gutter">
                <div class="icon-column md-layout-item md-size-35 md-layout md-alignment-center-center">
                  <img class="token-icon" v-if="tx.saleLogoUrl" :src='tx.saleLogoUrl' :alt="documentTypes.fundLogo">
                  <div class="token-icon" v-else>{{ tx.saleName.substr(0, 1).toUpperCase() }}</div>
                </div>
                <div class="details-column md-layout-item">
                  <detail prop="Request type" :value="`${ tx.requestType }`"/>
                  <detail prop="Token name" :value="`${tx.tokenCode}`"/>
                  <detail :prop="`${i18n.sale_start_time()}`" :value="`${i18n.d(tx.startTime)}`"/>
                  <detail :prop="`${i18n.sale_close_time()}`" :value="`${i18n.d(tx.endTime)}`"/>
                  <detail :prop="`${i18n.sale_soft_cap()}`" :value="`${i18n.c(tx.softCap)} ${tx.defaultQuoteAsset}`"/>
                  <detail :prop="`${i18n.sale_hard_cap()}`" :value="`${i18n.c(tx.hardCap)} ${tx.defaultQuoteAsset}`"/>
                  <detail :prop="`${i18n.sale_base_asset_hard_cap_to_sell({asset: tx.tokenCode})}`" :value="`${i18n.c(tx.baseAssetForHardCap)} ${tx.tokenCode}`"/>
                  <detail :prop="`${i18n.sale_quote_assets()}`" :value="`${tx.quoteAssets}`"/>
                  <detail :prop="`${i18n.sale_fund_video()}`" :value="`<a href='${tx.youtubeVideoUrl}' target='_blank'>Open video</a>`"/>
                  <detail :prop="`${i18n.sale_short_description()}`" :value="`${tx.shortDescription}`"/>
                  <detail :prop="`${i18n.lbl_reject_message()}`"
                          v-if="tx.requestState === REQUEST_STATES_STR.rejected ||
                                tx.requestState === REQUEST_STATES_STR.permanentlyRejected"
                                :value="`${tx.rejectReason}`"/>
                </div>
              </md-card-content>
              <md-card-actions>
                <!-- <md-button class="md-dense md-accent"
                          :disabled="item.requestState !== REQUEST_STATES_STR.pending
                                  || isPending"
                          @click="cancelRequest(item.requestID)">{{ i18n.lbl_cancel() }}</md-button> -->
              <template v-if="tx.isApproved">
                <button v-ripple
                           class="app__button-flat" 
                           @click="goFundDetails(tx.tokenCode)">
                  {{ i18n.lbl_view_sale() }}
                </button>
              </template>
              <router-link :to="{name: 'sale-creation.index', params: { id: tx.id }}"
                            tag="button"
                            v-ripple
                            class="app__button-flat"
                            :disabled="(!tx.isPending && !tx.isRejected) || isPending">{{ i18n.lbl_update() }}</router-link>
              </md-card-actions>
            </div>
          </div>
        </div>
        <div class="requests__btn-outer" v-if="!isLoaded">
          <button v-ripple 
                          @click="more" 
                          class="app__button-flat" 
                          :disabled="isLoading"> 
                    {{ i18n.lbl_view_more() }} 
          </button> 
        </div>
      </div>
    </div>
    <template v-else>
        <div class="tx-sale-creation__no-requests">
          <no-data-message icon-name="trending_up"
            :msg-title="i18n.sale_no_creation_requests()"
            :msg-message="i18n.sale_no_creation_requests_desc()"/>
        </div>
    </template>
  </div>
</template>

<script>
import FormMixin from '../../../common/mixins/form.mixin'
import Detail from '../../common/Detail.Row'
import _get from 'lodash/get'

import { mapGetters, mapActions } from 'vuex'
import { i18n } from '../../../../js/i18n'
import { REQUEST_STATES_STR, documentTypes } from '../../../../js/const/const'
import { vuexTypes } from '../../../../vuex/types'
import { vueRoutes } from '../../../../vue-router/const'
import { EventDispatcher } from '../../../../js/events/event_dispatcher'
import NoDataMessage from '@/vue/common/messages/NoDataMessage'

import { salesService } from '../../../../js/services/sales.service'

export default {
  mixins: [FormMixin],
  components: { Detail, NoDataMessage },
  data: _ => ({
    i18n,
    tokenCode: null,
    isLoading: false,
    index: -1,
    documentTypes,
    REQUEST_STATES_STR
  }),

  async created () {
    this.tokenCode = this.accountOwnedTokens[0] || null
    if (this.tokenCode) {
      await this.loadList(this.tokenCode)
    }
  },

  computed: {
    ...mapGetters([
      vuexTypes.saleCreationRequests,
      vuexTypes.accountOwnedTokens
    ]),
    list () {
      return _get(this.saleCreationRequests, `${this.tokenCode}.records`, [])
    },
    isLoaded () {
      return _get(this.saleCreationRequests, `${this.tokenCode}.isLoaded`)
    }
  },

  methods: {
    ...mapActions({
      loadList: vuexTypes.GET_USER_SALE_CREATION_REQUESTS,
      loadNext: vuexTypes.NEXT_USER_SALE_CREATION_REQUESTS
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
    },

    async goFundDetails (code) {
      const sale = await salesService.loadSaleByTokenCode(code)
      console.log('sale.id')
      console.log(sale.id)
      this.$router.push({
        ...vueRoutes.saleDetails,
        params: { id: sale.id }
      })
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
  @import "../../../../scss/mixins";
  @import "../../../../scss/variables";

  $padding-vertical: 20px;
  $padding-horizontal: 25px;
  $padding: $padding-vertical $padding-horizontal;

  .tx-sale-creation {
    width: 100%;
  }

  .tx-sale-creation__table {
    margin: 0 !important;
  }

  .tx-sale-creation__table-toolbar {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    @media (max-width: 840px) {
      flex-direction: column;
      padding-top: $padding-vertical;
    }
  }

  .tx-sale-creation__row {
    cursor: pointer;
  }

  .tx-sale-creation__table-cell {
    overflow: hidden;
    white-space: nowrap;

    &--counterparty {
      max-width: 10rem;
    }
    &:last-child {
      text-align: right;
    }
  }

  .tx-sale-creation__open-details-btn {
    margin-right: .65rem
  }

  .tx-sale-creation__select-outer {
    padding: 5px $padding-horizontal;
  }

  .tx-sale-creation__details {
    padding: $padding;
    max-width: 25rem;
    width: 100%;
  }

  .tx-sale-creation__btn-outer {
    text-align: center;
  }

  .tx-sale-creation__no-requests {
    padding: 0 16px 32px;
    text-align: center;

    p {
      margin-top: 10px;
    }
  }

  .tx-sale-creation__table-title {
    padding: 24px;
    font-size: 24px;
  }

  .tx-sale-creation__no-requests {
    padding: 0 16px 32px;
    text-align: center;

    p {
      margin-top: 10px;
    }
  }

  .token-icon {
    width: 142px;
    height: 142px;
    border-radius: 50%;
    font-size: 48px;
    color: #fff;
    background-color: #ccc;
    margin-right: 27px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;

    @include respond-to(small) {
      margin-right: 0;
      margin-bottom: 12px;
    }
  }

  .details-column {
    margin-right: .2rem;
  }

  .tx-sale-creation__hide-md {
    @include respond-to(medium) {
      display: none;
    }
  }

  .requests__list-wrapper {
    position: relative;
  }

  .requests__list {
    padding: 0 4px 6px 4px;

    @include respond-to-custom(1300px) {
      overflow-x: auto;
    }
  }

  .requests__list-header,
  .requests__list-body-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
  }

  .requests__list-header-item--sale-name,
  .requests__list-body-item--sale-name {
    width: 20%;
  }

  .requests__list-header-item--token-code,
  .requests__list-body-item--token-code {
    width: 15%;
  }

  .requests__list-body-item--state,
  .requests__list-header-item--state {
    width: 20%;
  }

  .requests__list-body-item--created,
  .requests__list-header-item--created {
    width: 20%;
  }

  .requests__list-body-item--updated,
  .requests__list-header-item--updated {
    width: 20%;
  }

  .requests__list-body-item--btn,
  .requests__list-header-item--btn {
    width: 70px;
    flex: none;
    padding: 0;

    @include respond-to(medium) {
      width: 47px;
    }
  }

  .requests__list-body-item-btn {
    @include button();
    @include button-flat();

    background: rgba($col-md-primary, .1);
    font-size: 10px;
    border-radius: 4px;
    padding: 8px;
  }

  .requests__list-body-elem {
    @include box-shadow();

    background-color: #fff;

    @include respond-to(medium) {
      min-width: 670px;
    }

    &:not(:last-child) {
      margin-bottom: 6px;
    }
  }

  .requests__list-body-item,
  .requests__list-header-item {
    padding: 8px 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: $col-md-primary;
    display: flex;
    align-items: center;
  }

  .requests__list-body-row--details {
    padding-top: 17px;
    padding-bottom: 17px;
    margin: 0 20px;
    min-width: 25rem;
    display: flex;
    flex-direction: column;
  }

  .requests__list-body-item-icon--active { transform: rotate(-180deg) }

  .requests__list-body-elem--canceled,
  .requests__list-body-elem--pending,
  .requests__list-body-elem--approved,
  .requests__list-body-elem--rejected,
  .requests__list-body-elem--permanentlyRejected {
    &:before {
      position: absolute;
      left: -25px;
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

  .requests__list-wrapper {
    position: relative;
  }

  // .requests__list-body-elem--canceled:before,
  // .requests__list-body-elem--rejected:before,
  // .requests__list-body-elem--permanentlyRejected:before {
  //   content: '\2715';
  //   background-color: $col-md-accent;
  //   padding: 0 4px;
  // }

  // .requests__list-body-elem--pending:before {
  //   background-color: #ffb454;
  //   content: '';
  // }

  // .requests__list-body-elem--approved:before {
  //   content: '\2713';
  //   background-color: #51ca90;
  //   padding: 0 3px;
  // }

  .requests__btn-outer {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
  }
</style>
