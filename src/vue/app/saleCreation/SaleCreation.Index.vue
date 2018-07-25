<template>
  <div class="create-sale md-layout md-alignment-center-center">
    <div class="md-layout-item
                    md-size-50
                    md-medium-size-65
                    md-small-size-95
                    md-xsmall-size-100">
    <template v-if=" accountTypeI !== ACCOUNT_TYPES.syndicate">
      <not-available-card icon='work'
                          :title="i18n.lbl_not_available()"
                          :descr="i18n.sale_not_available_exp()"/>
    </template>
    <template v-else-if="!accountOwnedTokens.length">
      <not-available-card icon='work'
                          :title="i18n.lbl_not_available()"
                          :descr="i18n.lbl_token_not_available_yet()"/>
    </template>
    <template v-else-if="view.mode === VIEW_MODES.edit">  
          <md-card class="create-sale__heading">
            <md-card-header>
              <div class="md-title">{{ i18n.lbl_create_sale() }}</div>
            </md-card-header>
          </md-card>

          <md-card>
            <md-card-content>
              <md-steppers md-vertical md-linear :md-active-step.sync="activeStep">
                <md-step v-for="(step, i) in steps"
                        :key="i"
                        :id="step.name"
                        :md-label="step.label"
                        :md-done.sync="step.done"
                >
                  <component :is="step.component"
                            :schema="step.schema"
                            :sale="sale"
                            @sale-update="handleSaleUpdate($event, { step, i })"
                            @sale-edit-end="handleSaleEditEnd"
                  />
                </md-step>
              </md-steppers>
            </md-card-content>
          </md-card>
      </template>

      <template v-else-if="view.mode === VIEW_MODES.list">
        <md-card class="create-sale__request-list">
          <md-card-header>
            <div class="md-title">{{ i18n.sale_open_requests() }}</div>
          </md-card-header>
          <md-card-content>
            <md-button @click="startNewSale">{{ i18n.sale_start_new_sale() }}</md-button>
            <request-list :list="listManager.list" @sale-select="handleSaleSelect"/>
          </md-card-content>
        </md-card>
      </template>
    </div>
  </div>
</template>

<script>
  import FormMixin from '../../common/mixins/form.mixin'
  import RequestList from './SaleCreation.RequestList'
  import NotAvailableCard from '../common/NotAvailableCard'
  import steps from './specs/steps.schema'
  import config from '../../../config'
  import { i18n } from '../../../js/i18n'
  import { SaleRequestRecord } from '../../../js/records/sale_request.record'
  import { SaleListManager } from './specs/sale-list-manager'
  import { mapGetters, mapActions } from 'vuex'
  import { vuexTypes } from '../../../vuex/types'
  import { salesService } from '../../../js/services/sales.service'
  import { DateHelper } from '../../../js/helpers/date.helper'
  import { ErrorHandler } from '../../../js/errors/error_handler'
  import { ACCOUNT_TYPES } from '../../../js/const/const'
  import { confirmAction } from '../../../js/modals/confirmation_message'
  import { EventDispatcher } from '../../../js/events/event_dispatcher'
  import { reviewableRequestsService } from '../../../js/services/reviewable_requests.service'
  import _get from 'lodash/get'
  const VIEW_MODES = {
    list: 'list',
    edit: 'edit',
    confirm: 'confirm'
  }

  export default {
    name: 'CreateSale-index',
    components: { RequestList, NotAvailableCard },
    mixins: [FormMixin],
    props: ['id'],
    data: _ => ({
      activeStep: steps[0].name,
      sale: null,
      saleRequest: null,
      listManager: new SaleListManager(),
      i18n,
      steps,
      view: {
        mode: null
      },
      VIEW_MODES,
      ACCOUNT_TYPES
    }),
    async created () {
      await Promise.all([
        this.loadTokens(),
        this.loadBalances(),
        this.listManager.fetch()
      ])
      if (this.id) {
        this.saleRequest = await reviewableRequestsService.loadReviewableRequestById(this.id)
      }
      if (!this.id && this.listManager.list.length) {
        this.view.mode = VIEW_MODES.list
        return
      }
      this.startNewSale()
    },

    computed: {
      ...mapGetters([
        vuexTypes.accountId,
        vuexTypes.accountTypeI,
        vuexTypes.accountOwnedTokens
      ])
    },

    methods: {
      ...mapActions({
        loadTokens: vuexTypes.GET_ALL_TOKENS,
        loadBalances: vuexTypes.GET_ACCOUNT_BALANCES
      }),
      startNewSale () {
        const sale = new SaleRequestRecord(this.saleRequest || undefined)
        this.sale = sale
        this.listManager.add(sale)
        this.view.mode = VIEW_MODES.edit
      },
      handleSaleSelect (sale) {
        this.sale = sale
        this.view.mode = VIEW_MODES.edit
      },
      handleSaleUpdate ({ form, documents }, { step, i }) {
        form = form || {}
        documents = documents || {}
        Object.entries(form).forEach(([key, value]) => {
          this.sale[key] = value
        })
        Object.entries(documents).forEach(([key, value]) => {
          this.sale.logo = value
        })
        this.listManager.pushToStorage()
        if (this.activeStep === steps[steps.length - 1].name) {
          return
        }
        step.done = true
        this.activeStep = (steps[i + 1] || steps[0]).name
      },
      async handleSaleEditEnd () {
        if (!await confirmAction()) return
        await this.listManager.fetch()
        const opts = _get(this.sale.getDetailsForSave(), 'details.sale')
        this.disable()
        try {
          await salesService.createSaleCreationRequest({
            requestID: opts.request_id,
            baseAsset: opts.base_asset,
            defaultQuoteAsset: config.DEFAULT_QUOTE_ASSET,
            startTime: DateHelper.toTimestamp(opts.start_time),
            endTime: DateHelper.toTimestamp(opts.end_time),
            softCap: opts.soft_cap,
            hardCap: opts.hard_cap,
            details: {
              name: opts.details.name,
              short_description: opts.details.short_description,
              description: opts.details.description,
              logo: opts.details.logo,
              youtube_video_id: opts.details.youtube_video_id
            },
            baseAssetForHardCap: opts.base_asset_for_hard_cap,
            quoteAssets: opts.quote_assets,
            isCrowdfunding: true
          })
          this.listManager.drop(this.sale)
          await this.listManager.fetch()
          this.view.mode = VIEW_MODES.list
          this.$router.push({ path: '/requests/sale-creation' })
          EventDispatcher.dispatchShowSuccessEvent(i18n.sale_create_request_success())
        } catch (error) {
          console.error(error)
          ErrorHandler.processUnexpected(error)
        }
        this.enable()
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>