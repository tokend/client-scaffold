<template>
  <div class="tx-preissuance-upload">
    <div
      class="requests__list-wrapper"
      v-if="list.length">
      <div
        class="requests__list"
        v-table-scroll-shadow>
        <div class="requests__list-header">
          <div class="requests__list-header-item
                      requests__list-header-item--token-code">
            {{ i18n.lbl_token_code() }}
          </div>
          <div class="requests__list-header-item
                      requests__list-header-item--amount">
            {{ i18n.preis_amount() }}
          </div>
          <div class="requests__list-header-item
                      requests__list-header-item--state">
            {{ i18n.lbl_request_state() }}
          </div>
          <div class="requests__list-header-item
                      requests__list-header-item--created">
            {{ i18n.lbl_created_at() }}
          </div>
          <div class="requests__list-header-item
                      requests__list-header-item--btn" />
        </div>
        <div class="requests__list-body">
          <div
            class="requests__list-body-elem"
            v-for="(tx, i) in list"
            :key="`activity-item-${i}`"
            :class="`requests__list-body-elem--${tx.state}`">
            <div class="requests__list-body-row">
              <div
                :title="tx.asset"
                class="requests__list-body-item
                       requests__list-body-item--token-code">
                {{ tx.asset }}
              </div>
              <div
                :title="tx.amount"
                class="requests__list-body-item
                       requests__list-body-item--amount">
                {{ i18n.c(tx.amount) }}
              </div>
              <div
                :title="tx.state"
                class="requests__list-body-item
                       requests__list-body-item--state">
                {{ tx.state }}
              </div>
              <div
                :title="tx.createdAt"
                class="requests__list-body-item
                       requests__list-body-item--created">
                {{ i18n.dmy(tx.createdAt) }}
              </div>
              <div class="requests__list-body-item
                          requests__list-body-item--btn">
                <button
                  class="requests__list-body-item-btn"
                  @click="toggleDetails(i)">
                  <md-icon
                    class="requests__list-body-item-icon"
                    :class="{
                      'requests__list-body-item-icon--active':
                        isSelected(i)
                    }"
                  >
                    keyboard_arrow_down
                  </md-icon>
                </button>
              </div>
            </div>
            <div
              class="requests__list-body-row requests__list-body-row--details"
              v-if="isSelected(i)">
              <md-card-content class="md-layout md-gutter">
                <div class="details-column md-layout-item">
                  <detail
                    prop="Reject reason"
                    :value="`${tx.rejectReason}`" />
                </div>
              </md-card-content>
            </div>
          </div>
        </div>
        <div
          class="requests__btn-outer"
          v-if="!isLoaded">
          <button
            v-ripple
            @click="more"
            class="app__button-flat"
            :disabled="isLoading">
            {{ i18n.lbl_view_more() }}
          </button>
        </div>
      </div>
    </div>
    <template v-else>
      <div class="tx-token-creation__no-requests">
        <no-data-message
          icon-name="trending_up"
          :msg-title="i18n.preis_no_token_creation_requests()"
          :msg-message="i18n.preis_no_token_creation_requests_desc()" />
      </div>
    </template>
  </div>
</template>

<script>
import FormMixin from '../../../common/mixins/form.mixin'
import Detail from '../../common/Detail.Row'
import _get from 'lodash/get'
import NoDataMessage from '@/vue/common/messages/NoDataMessage'

import { mapGetters, mapActions } from 'vuex'
import { i18n } from '../../../../js/i18n'
import { vuexTypes } from '../../../../vuex/types'

import { EventDispatcher } from '../../../../js/events/event_dispatcher'

export default {
  components: { Detail, NoDataMessage },
  mixins: [FormMixin],
  data: _ => ({
    i18n,
    isLoading: false,
    index: -1
  }),
  computed: {
    ...mapGetters([
      vuexTypes.preIssuanceUploadRequests
    ]),
    list () {
      return _get(this.preIssuanceUploadRequests, 'records', [])
    },
    isLoaded () {
      return _get(this.preIssuanceUploadRequests, 'isLoaded')
    }
  },
  async created () {
    await this.loadList()
  },
  methods: {
    ...mapActions({
      loadList: vuexTypes.GET_USER_PREISSUANCE_UPLOAD_REQUESTS,
      loadNext: vuexTypes.NEXT_USER_PREISSUANCE_UPLOAD_REQUESTS
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
        await this.loadNext()
      } catch (e) {
        console.error(e)
        EventDispatcher.dispatchShowErrorEvent(i18n.th_failed_to_load_tx())
      }
      this.isLoading = false
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

  .tx-preissuance-upload {
    width: 100%;
  }

  .tx-preissuance-upload__table {
    margin: 0 !important;
  }

  .tx-preissuance-upload__table-toolbar {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    @media (max-width: 840px) {
      flex-direction: column;
      padding-top: $padding-vertical;
    }
  }

  .tx-preissuance-upload__row {
    cursor: pointer;
  }

  .tx-preissuance-upload__table-cell {
    overflow: hidden;
    white-space: nowrap;

    &--counterparty {
      max-width: 10rem;
    }
  }

  .tx-preissuance-upload__open-details-btn {
    margin-right: .65rem;
  }

  .tx-preissuance-upload__select-outer {
    padding: 5px $padding-horizontal;
  }

  .tx-preissuance-upload__details {
    padding: $padding;
    max-width: 25rem;
    width: 100%;
  }

  .tx-preissuance-upload__btn-outer {
    text-align: center;
  }

  .tx-preissuance-upload__no-requests {
    padding: 0 16px 32px;
    text-align: center;

    p {
      margin-top: 10px;
    }
  }

  .tx-preissuance-upload__table-title {
    padding: 24px;
    font-size: 24px;
  }

  .tx-preissuance-upload__no-requests {
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
  }

  .requests__list-header-item--token-code,
  .requests__list-body-item--token-code {
    width: 20%;
  }

  .requests__list-header-item--amount,
  .requests__list-body-item--amount {
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
      left: 0px;
      margin-top: 22px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      color: #fff;
      font-size: 10px;
      line-height: 18px;
    }
  }

  .requests__list-wrapper {
    position: relative;
  }

  .requests__list-body-elem--canceled:before,
  .requests__list-body-elem--rejected:before,
  .requests__list-body-elem--permanentlyRejected:before {
    content: '\2715';
    background-color: $col-md-accent;
    padding: 0 4px;
  }

  .requests__list-body-elem--pending:before {
    background-color: #ffb454;
    content: '';
  }

  .requests__list-body-elem--approved:before {
    content: '\2713';
    background-color: #51ca90;
    padding: 0 3px;
  }

  .requests__btn-outer {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
  }

  .requests__list-header,
  .requests__list-body {
    padding: 0 2rem;
  }
</style>
