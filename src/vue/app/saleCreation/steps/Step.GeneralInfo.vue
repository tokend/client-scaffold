<template>
  <form class="step" @submit.prevent="submit">
    <div class="step-row md-layout">
        <input-field v-model="form.name"
                    v-validate="'required'"
                    class="step__input-field
                          md-layout-item
                          md-size-45
                          md-small-size-95
                          md-xsmall-size-100"
                    name="sale-name"
                    id="sale-name"
                    :label="i18n.lbl_sale_name()"
                    :errorMessage="errorMessage('sale-name')"
        />
        <select-field-custom
            name="sale-base-asset"
            id="sale-base-asset"
            class="step__input-field
                  md-layout-item
                  md-size-45
                  md-small-size-95
                  md-xsmall-size-100"
            v-model="form.baseAsset"
            :values="values.tokens"
            :label="i18n.lbl_base_asset()"/>
    </div>
    <div class="step-row md-layout">
        <date-field v-model="form.startTime"
                    v-validate="'required'"
                    name="sale-open-time"
                    id="sale-open-time"
                    class="step__input-field
                           md-layout-item
                           md-size-45
                           md-small-size-95
                           md-xsmall-size-100"
                    :label="i18n.sale_start_time()"
                    :disableBefore="new Date().toString()"
                    :disableAfter="form.endTime"
                    :errorMessage="errorMessage('sale-open-time')"
        />
        <date-field v-model="form.endTime"
                    v-validate="'required'"
                    name="sale-close-time"
                    id="sale-close-time"
                    class="step__input-field
                          md-layout-item
                          md-size-45
                          md-small-size-95
                          md-xsmall-size-100"
                    :label="i18n.sale_close_time()"
                    :disableBefore="form.startTime"
                    :errorMessage="errorMessage('sale-close-time')"
        />
    </div>
    <div class="step-row md-layout">
        <input-field v-model="form.softCap"
            v-validate="{
                required:true,
                amount: true
            }"
            class="step__input-field
                  md-layout-item
                  md-size-45
                  md-small-size-95
                  md-xsmall-size-100"
            name="sale-soft-cap"
            id="sale-soft-cap"
            :label="i18n.sale_soft_cap()"
            :errorMessage="errorMessage('sale-soft-cap')"
        />
        <input-field v-model="form.hardCap"
            v-validate="{
                required:true,
                amount: true,
                soft_cap: [form.softCap]
            }"
            class="step__input-field
                  md-layout-item
                  md-size-45
                  md-small-size-95
                  md-xsmall-size-100"
            name="sale-hard-cap"
            id="sale-hard-cap"
            :label="i18n.sale_hard_cap()"
            :errorMessage="errorMessage('sale-hard-cap')"
        />
    </div>
    <div class="step-row md-layout step-row__base-asset-input">
      <input-field v-model="form.baseAssetForHardCap"
                  v-validate="{
                      required: true,
                      amount: true,
                      max_issuance: [avalaibleForIssuance, form.baseAsset]
                  }"
                  class="step__input-field
                        md-layout-item
                        md-size-31
                        md-small-size-95
                        md-xsmall-size-100"
                  name="sale-base-asset-for-hard-cap"
                  id="sale-base-asset-for-hard-cap"
                  :label="i18n.sale_base_asset_hard_cap_to_sell({asset: form.baseAsset})"
                  :errorMessage="errorMessage('sale-base-asset-for-hard-cap')"
      />
    </div>
    <div class="step__switchers">
      <h3>{{ i18n.sale_quote_assets() }}</h3>
      <md-switch class="md-primary"
                   v-for="(token,i) in walletTokens"
                   v-model="form.quoteAssets"
                   :value="token.code"
                   :key="i"
        >
          {{ token.code }}</md-switch>
    </div>
    <div class="step__action">
      <button v-ripple
              type="submit"
              class="step__submit-btn app__button-flat"
              :disabled="isPending">
        {{ i18n.sale_next_step() }}
      </button>
    </div>
  </form>
</template>

<script>
  import StepMixin from './step.mixin'
  import { ErrorHandler } from '../../../../js/errors/error_handler'
  import { EventDispatcher } from '../../../../js/events/event_dispatcher'
  import { commonEvents } from '../../../../js/events/common_events'
  import { ASSET_POLICIES, documentTypes } from '../../../../js/const/const'
  import { i18n } from '../../../../js/i18n'
  import { vuexTypes } from '../../../../vuex/types'
  import { mapGetters } from 'vuex'
  import _pick from 'lodash/pick'
  export default {
    name: 'StepGeneralInfo',
    mixins: [StepMixin],
    data: _ => ({
      values: {
        tokens: []
      },
      form: {
        name: '',
        baseAsset: '',
        startTime: '',
        endTime: '',
        softCap: '',
        hardCap: '',
        baseAssetForHardCap: '',
        quoteAssets: []
      },
      i18n,
      documentTypes,
      ASSET_POLICIES,
      uploadVideo: false
    }),

    created () {
      this.values.tokens = this.accountOwnedTokens
      this.form = _pick(this.sale, Object.keys(this.form))
      if (!this.form.baseAsset) {
        this.setTokenCode()
      }
    },

    computed: {
      ...mapGetters([
        vuexTypes.accountOwnedTokens,
        vuexTypes.walletTokens,
        vuexTypes.userAcquiredTokens
      ]),
      avalaibleForIssuance () {
        const token = this.userAcquiredTokens
          .find(token => token.code === this.form.baseAsset)
        return token.available
      }
    },

    methods: {
      setTokenCode () {
        this.form.baseAsset = this.values.tokens[0] || null
      },
      async submit () {
        if (!await this.isValid()) return
        if (!this.form.quoteAssets.length) {
          EventDispatcher.dispatchShowErrorEvent(i18n.sale_accept_investments())
          return
        }
        this.disable()
        try {
          this.$emit(commonEvents.saleUpdateEvent, {
            form: this.form
          })
        } catch (error) {
          ErrorHandler.processUnexpected(error)
        }
        this.enable()
      }
    }
  }
</script>

<style scoped>
  @import './step.scss';

  .step-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .step-row__base-asset-input {
    margin-bottom: 1rem;
  }
</style>
