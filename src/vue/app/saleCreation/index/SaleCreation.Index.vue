<template>
   <div class="kyc-form md-layout md-alignment-center-center">
     <form novalidate @submit.prevent="submit">
      <md-steppers md-vertical md-linear :md-active-step.sync="steps.active">
        <md-step id="first" md-label="Provide fund information" :md-done.sync="steps.first">
          <md-progress-bar md-mode="indeterminate" v-if="isPending"/>
          <md-card-header>
            <div class="md-title">{{ i18n.lbl_create_sale() }}</div>
          </md-card-header>
          <md-card-content>
            <div class="md-card-content-item">
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-small-size-100">
                  <input-field :label="i18n.lbl_sale_name()"
                               name="sale name"
                               v-model="form.details.name"
                               v-validate="'required'"
                               :errorMessage="errorMessage('sale name')"/>
                </div>
                <div class="md-layout-item md-small-size-100">
                  <select-field :label="i18n.lbl_base_asset()"
                                name="base asset"
                                v-model="form.tokenCode"
                                :values="accountOwnedTokens"/>
                </div>
              </div>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-small-size-100">
                  <date-field label="Start time"
                              name="start time"
                              v-model="form.startTime"
                              :disableBefore="new Date().toString()"
                              v-validate="'required'"
                              :errorMessage="errorMessage('start time')" />
                </div>
                <div class="md-layout-item md-small-size-100">
                  <date-field label="Close time"
                              name="close time"
                              v-model="form.endTime"
                              :disableBefore="form.startTime"
                              v-validate="'required'"
                              :errorMessage="errorMessage('close time')" />
                </div>
              </div>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-small-size-100">
                  <input-field label="Soft cap"
                               name="soft cap"
                               v-model="form.softCap"
                               v-validate="'required|amount'"
                               :errorMessage="errorMessage('soft cap')"/>
                </div>
                <div class="md-layout-item md-small-size-100">
                  <input-field label="Hard cap" 
                               name="hard cap"
                               v-model="form.hardCap"
                               v-validate="{required:true, amount: true, min_value: form.softCap}"
                               :errorMessage="errorMessage('hard cap')"/>
                </div>
              </div>
            </div>
          </md-card-content>
          <md-card-actions>
            <md-button class="md-raised md-primary" @click="setDone('first', 'second')">Continue</md-button>
          </md-card-actions>
        </md-step>
        <md-step id="second" md-label="Add a short blurb" :md-done.sync="steps.second">
          <md-card-header>
            <div class="md-title">Short blurb</div>
          </md-card-header>
          <file-field fileType="image"
                      label="Upload the image users will see first in their searcher"/>
        </md-step>
      </md-steppers>
    </form>
  </div>
</template>

<script>
import FormMixin from '../../../common/mixins/form.mixin'
import SelectField from '../../../common/fields/SelectField'
import FileField from '../../../common/fields/FileField'
import DateField from '../../../common/fields/DateField'
import InputField from '../../../common/fields/InputField'
// import SaleCreationBlurb from '../components/SaleCreation.Blurb'
// import get from 'lodash/get'

import { i18n } from '../../../../js/i18n'
import { documentTypes } from '../../../../js/const/documents.const'
import { vuexTypes } from '../../../../vuex/types'
import { mapGetters } from 'vuex'
// import { salesService } from '../../../../js/services/sales.service'
// import { tokensService } from '../../../../js/services/tokens.service'
import { ASSET_POLICIES } from '../../../../js/const/xdr.const'
// import { EventDispatcher } from '../../../../js/events/event_dispatcher'
// import { ErrorHandler } from '../../../../js/errors/error_handler'
// import { fileService } from '../../../../js/services/file.service'
// import { DocumentContainer } from '../../../../js/helpers/DocumentContainer'

export default {
  mixins: [FormMixin],
  components: { FileField, SelectField, DateField, InputField },
  data: _ => ({
    form: {
      baseAsset: '',
      startTime: null,
      endTime: null,
      softCap: '',
      hardCap: '',
      details: {
        name: '',
        short_description: '',
        description: '',
        logo: ''
      },
      quoteAssets: {
        price: '',
        asset: ''
      }
    },
    steps: {
      active: 'first',
      first: false,
      second: false,
      third: false
    },
    i18n,
    documentTypes,
    ASSET_POLICIES
  }),

  created () {
    this.setTokenCode()
  },

  computed: {
    ...mapGetters([
      vuexTypes.walletTokens,
      vuexTypes.accountOwnedTokens
    ])
  },

  methods: {
    setTokenCode () {
      this.form.tokenCode = this.accountOwnedTokens[0] || null
    },
    setDone (id, index) {
      this.steps[id] = true

      if (index) {
        this.steps.active = index
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .md-card-content-item:not(:last-child) {
    margin-bottom: 24px;
  }
</style>
