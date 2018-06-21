<template>
  <div class="tx-token-creation">
    <md-table md-card class="tx-token-creation__table">
      <md-table-toolbar class="tx-token-creation__table-toolbar">
        <h1 class="tx-token-creation__table-title md-title">{{ i18n.lbl_token_creation_requests() }}</h1>
        <div class="tx-token-creation__select-outer">
        </div>
      </md-table-toolbar>

      <template v-if="list.length">
        <md-table-row class="tx-token-creation__row">
          <md-table-head>{{ i18n.lbl_token_code() }}</md-table-head>
          <md-table-head>{{ i18n.lbl_request_state() }}</md-table-head>
          <md-table-head>{{ i18n.lbl_created_at() }}</md-table-head>
          <md-table-head>{{ i18n.lbl_updated_at() }}</md-table-head>
          <md-table-head><!--Button--></md-table-head>
        </md-table-row>
        <template v-for="(item, i) in list">

          <md-table-row class="tx-token-creation__row" @click="toggleDetails(i)" :key="i">
            <md-table-cell class="tx-token-creation__table-cell">{{ item.reference }}</md-table-cell>
            <md-table-cell class="tx-token-creation__table-cell">{{ item.request_state }}</md-table-cell>
            <md-table-cell class="tx-token-creation__table-cell">{{ humanizeDate(item.created_at) }}</md-table-cell>
            <md-table-cell class="tx-token-creation__table-cell">{{ humanizeDate(item.updated_at) }}</md-table-cell>

            <md-table-cell class="tx-token-creation__table-cell">
              <md-button class="tx-token-creation__open-details-btn md-icon-button">
                <md-icon v-if="isSelected(i)">keyboard_arrow_up</md-icon>
                <md-icon v-else>keyboard_arrow_down</md-icon>
              </md-button>
            </md-table-cell>

          </md-table-row>

          <md-table-row class="th-token-creation__expandable-row" v-if="isSelected(i)" :key="'selected-'+i">
            <md-table-cell colspan="7">
              <md-card-content class="md-layout md-gutter">
                <div class="icon-column md-layout-item md-size-35 md-layout md-alignment-center-center">
                  <img class="token-icon" v-if="item.details.asset_create.details.logo.key" :src='getUrl(item.details.asset_create.details.logo.key)' :alt="documentTypes.tokenIcon">
                  <div class="token-icon" v-else>{{ item.reference.substr(0, 1).toUpperCase() }}</div>
                </div>
                <div class="details-column md-layout-item">
                  <detail prop="Request type" :value="`${getFancyName(item.details.request_type)}`"/>
                  <detail prop="Max issuance amount" :value="`${item.details.asset_create.max_issuance_amount}`"/>
                  <detail prop="Initial preissued amount" :value="`${item.details.asset_create.initial_preissued_amount}`"/>
                  <detail prop="Token name" :value="`${item.details.asset_create.details.name}`"/>
                  <detail prop="Terms" v-if="item.details.asset_create.details.terms.key !== ''" :value="`<a href='${getUrl(item.details.asset_create.details.terms.key)}' target='_blank'>Open file</a>`"/>
                  <detail prop="Terms" v-else />
                  <detail prop="Policies" :value="`${getPolicies(item.details.asset_create.policies)}`"/>
                  <detail prop="Reject reason" v-if="item.request_state === 'rejected'" :value="`${item.reject_reason}`"/>

                </div>
              </md-card-content>
              <md-card-actions>
                <md-button class="md-dense md-accent"
                          :disabled="item.request_state === 'canceled'
                                  || item.request_state === 'approved'
                                  || isPending"
                          @click="cancelRequest(item.id)">{{ i18n.lbl_cancel() }}</md-button>
                <md-button class="md-dense md-primary"
                          :disabled="item.request_state === 'canceled'
                                  || item.request_state === 'approved'
                                  || isPending"
                          @click="updateRequest(item.id)">{{ i18n.lbl_update() }}</md-button>
              </md-card-actions>
            </md-table-cell>
          </md-table-row>
        </template>
         <md-table-row v-if="!isLoaded">
            <md-table-cell colspan="7">
                <div class="tx-history__btn-outer">
                <md-button @click="more" :disabled="isLoading">{{ i18n.lbl_view_more() }}</md-button>
                </div>
            </md-table-cell>
         </md-table-row>
      </template>
      <template v-else>
        <div class="tx-token-creation__no-requests">
          <md-icon class="md-size-4x">trending_up</md-icon>
          <h2>{{ i18n.lbl_no_token_creation_requests() }}</h2>
          <p>{{ i18n.lbl_no_token_creation_requests_desc() }}</p>
        </div>
      </template>
    </md-table>
  </div>
</template>

<script>
import FormMixin from '../../../common/mixins/form.mixin'
import Detail from '../../common/Detail.Row'
import config from '../../../../config'
import get from 'lodash/get'

import { mapGetters, mapActions } from 'vuex'
import { i18n } from '../../../../js/i18n'
import { documentTypes } from '../../../../js/const/documents.const'
import { vuexTypes } from '../../../../vuex/types'

import { tokensService } from '../../../../js/services/tokens.service'
import { ASSET_POLICIES } from '../../../../js/const/xdr.const'
import { EventDispatcher } from '../../../../js/events/event_dispatcher'
import { ErrorHandler } from '../../../../js/errors/error_handler'

import { humanizeDate } from '../../../../js/utils/dates.util'

export default {
  mixins: [FormMixin],
  components: { Detail },
  data: _ => ({
    i18n,
    documentTypes,
    ASSET_POLICIES,
    isLoading: false,
    index: -1,
    humanizeDate
  }),

  async created () {
    await this.loadList()
  },

  computed: {
    ...mapGetters([
      vuexTypes.tokenCreationRequests
    ]),
    list () {
      return (get(this.tokenCreationRequests, 'records') || [])
        .map(item => item._record)
        .reduce((list, item) => {
          list.push(item)
          return list
        }, [])
    },
    isLoaded () {
      return get(this.tokenCreationRequests, 'isLoaded')
    }
  },

  methods: {
    ...mapActions({
      loadList: vuexTypes.GET_USER_TOKENS_CREATION_REQUESTS,
      loadNext: vuexTypes.NEXT_USER_TOKENS_CREATION_REQUESTS
    }),

    toggleDetails (index) {
      this.index = this.index === index ? -1 : index
    },

    isSelected (i) {
      return this.index === i
    },

    async cancelRequest (requestID) {
      this.disable()
      try {
        await tokensService.cancelTokenCreationRequest({
          requestID: requestID
        })
        this.requests = await tokensService.loadTokenCreationRequestsForState()
        EventDispatcher.dispatchShowSuccessEvent('Cancel request success')
      } catch (error) {
        console.log(error)
        ErrorHandler.processUnexpected(error)
      }
      this.enable()
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
    },

    getUrl (item) {
      return `${config.FILE_STORAGE}/${item}`
    },

    getPolicies (item) {
      return item.map(policy => policy.name.replace('AssetPolicy', '')).join(', ')
    },

    getFancyName (item) {
      return item.replace('_', ' ')
    },

    async updateRequest (id) {
      this.$router.push({name: 'token-creation.index', params: { id: id }})
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

  .tx-token-creation {
    width: 100%;
  }

  .tx-token-creation__table {
    margin: 0 !important;
  }

  .tx-token-creation__table-toolbar {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    @media (max-width: 840px) {
      flex-direction: column;
      padding-top: $padding-vertical;
    }
  }

  .tx-token-creation__row {
    cursor: pointer;
  }

  .tx-token-creation__table-cell {
    overflow: hidden;
    white-space: nowrap;

    &--counterparty {
      max-width: 10rem;
    }
    &:last-child {
      text-align: right;
    }
  }

  .tx-token-creation__open-details-btn {
    margin-right: .65rem;
  }

  .tx-token-creation__select-outer {
    padding: 5px $padding-horizontal;
  }

  .tx-token-creation__details {
    padding: $padding;
    max-width: 25rem;
    width: 100%;
  }

  .tx-token-creation__btn-outer {
    text-align: center;
  }

  .tx-token-creation__no-requests {
    padding: 0 16px 32px;
    text-align: center;

    p {
      margin-top: 10px;
    }
  }

  .tx-token-creation__table-title {
    padding: 24px;
    font-size: 24px;
  }

  .tx-token-creation__no-requests {
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
</style>
