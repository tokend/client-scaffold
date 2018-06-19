<template>
  <div class="create-sale md-layout md-alignment-center-center">
    <div class="md-layout-item
                    md-size-50
                    md-medium-size-65
                    md-small-size-95
                    md-xsmall-size-100">
      <template v-if="view.mode === VIEW_MODES.edit">
        
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
          <md-dialog-confirm
            :md-active.sync="isConfirmDialogOpened"
            :md-title="i18n.sale_confirm()"
            :md-confirm-text="i18n.lbl_confirm()"
            :md-cancel-text="i18n.lbl_cancel()"
            :disabled="isPending"
            @md-cancel="isConfirmDialogOpened=false"
            @md-confirm="confirmSaleCreation" />
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
  import steps from './specs/steps.schema'
  import config from '../../../config'
  import { i18n } from '../../../js/i18n'
  import { SaleRequestRecord } from '../../../js/records/sale-request.record'
  import { SaleListManager } from './specs/sale-list-manager'
  import { mapGetters, mapActions } from 'vuex'
  import { vuexTypes } from '../../../vuex/types'
  import { salesService } from '../../../js/services/sales.service'
  import { DateHelper } from '../../../js/helpers/date.helper'
  import { ErrorHandler } from '../../../js/errors/error_handler'
  import get from 'lodash/get'
  const VIEW_MODES = {
    list: 'list',
    edit: 'edit',
    confirm: 'confirm'
  }

  export default {
    name: 'CreateSale-index',
    components: { RequestList },
    mixins: [FormMixin],
    data: _ => ({
      activeStep: steps[0].name,
      sale: null,
      listManager: new SaleListManager(),
      i18n,
      steps,
      view: {
        mode: null
      },
      isConfirmDialogOpened: false,
      VIEW_MODES
    }),
    async created () {
      await Promise.all([
        this.loadTokens(),
        this.listManager.fetch()
      ])
      if (this.listManager.list.length) {
        this.view.mode = VIEW_MODES.list
        return
      }
      this.startNewSale()
    },

    computed: {
      ...mapGetters([
        vuexTypes.accountId
      ])
    },

    methods: {
      ...mapActions({
        loadTokens: vuexTypes.GET_ALL_TOKENS
      }),
      startNewSale () {
        const sale = new SaleRequestRecord()
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
        step.done = true
        this.activeStep = (steps[i + 1] || steps[0]).name
      },
      async handleSaleEditEnd () {
        this.isConfirmDialogOpened = true
        await this.listManager.fetch()
      },
      async confirmSaleCreation () {
        const opts = get(this.sale.getDetailsForSave(), 'details.sale')
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
