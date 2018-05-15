<template>
  <div class="tx-token-creation">
    <md-table md-card class="tx-token-creation__table">
      <md-table-toolbar class="tx-token-creation__table-toolbar">
        <h1 class="tx-token-creation__table-title md-title">Token creation requests</h1>
        <div class="tx-token-creation__select-outer">
        </div>
      </md-table-toolbar>

      <template v-if="requests && (requests.records).length">
        <md-table-row class="tx-token-creation__row">
          <md-table-head>Token code</md-table-head>
          <md-table-head>request state</md-table-head>
          <md-table-head>created at</md-table-head>
          <md-table-head>updated at</md-table-head>
          <md-table-head><!--Button--></md-table-head>
        </md-table-row>
        <template v-for="(item, i) in requests.records">

          <md-table-row class="tx-token-creation__row" @click="toggleDetails(i)" :key="i">
            <md-table-cell class="tx-token-creation__table-cell">{{ item.reference }}</md-table-cell>
            <md-table-cell class="tx-token-creation__table-cell">{{ item.request_state }}</md-table-cell>
            <md-table-cell class="tx-token-creation__table-cell">{{ humanizeDate(item.created_at) }}</md-table-cell>
            <md-table-cell class="tx-token-creation__table-cell">{{ humanizeDate(item.updated_at) }}</md-table-cell>

            <md-table-cell>
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
                  <img class="token-icon" :src='getTokenIconUrl(item)' :alt="documentTypes.tokenIcon">
                </div>
                <div class="details-column md-layout-item">
                  <detail prop="Request type:" :value="`${item.details.request_type}`"/>
                  <detail prop="Max issuance amount:" :value="`${item.details.asset_create.max_issuance_amount}`"/>
                  <detail prop="Initial preissued amount:" :value="`${item.details.asset_create.initial_preissued_amount}`"/>
                  <detail prop="Token name:" :value="`${item.details.asset_create.details.name}`"/>
                </div>
              </md-card-content>
              <md-card-actions>
                <md-button class="md-dense md-accent" v-if="item.request_state !== 'canceled'" @click="cancelRequest(item.id)">Cancel</md-button>
              </md-card-actions>
            </md-table-cell>
          </md-table-row>
        </template>
      </template>
    </md-table>
  </div>
</template>

<script>
import FormMixin from '../../../common/mixins/form.mixin'
import Detail from '../../common/Detail.Row'
import config from '../../../../config'

import { i18n } from '../../../../js/i18n'
import { documentTypes } from '../../../../js/const/documents.const'

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
    requests: null,
    isLoading: false,
    index: -1,
    humanizeDate
  }),

  async created () {
    this.requests = await tokensService.loadTokenCreationRequestsForState()
  },

  methods: {
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

    getTokenIconUrl (item) {
      const logoKey = item.details.asset_create.details.logo.key
      if (logoKey) {
        return `${config.FILE_STORAGE}/${logoKey}`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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

  .token-icon {
    width: 142px;
    height: 142px;
  }
</style>
