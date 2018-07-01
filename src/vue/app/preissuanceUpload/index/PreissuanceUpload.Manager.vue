<template>
   <div class="upload-preissuance">
      <md-card>
        <md-progress-bar v-if="isPending" md-mode="indeterminate"></md-progress-bar>
        <md-card-header>
          <div class="md-title">{{ i18n.lbl_upload_preissuance() }}</div>
        </md-card-header>
        <md-card-content>
          <div class="md-card-content-item">
            <div class="md-layout md-gutter">
              <div class="md-layout-item md-small-size-100">
                <p class="preissuance-form__hint">
                  Select file(s) with preissued asset and click <strong>Upload</strong>.<br/>
                  <em>Note:</em> you cannot upload the same preissuance twice
                </p>
                <template v-if="tokens.length">
                  <div class="preissuance-form__upload-wrp">
                    <file-field class="preissuance-form__upload-input"
                          v-model="documents.preissuance"
                          label="Select File(s)"
                          accept=".iss"
                          id="preissuance-select"
                    />
                  </div>
                </template>
                <template v-else>
                  <p>
                    Loading...
                  </p>
                </template>
                <ul class="preissuance-form__list" v-if="issuances.length">
                  <p>To upload:</p>

                  <li v-for="(item, index) in issuances" :key="item.reference">
                    {{index + 1}}. {{i18n.c(item.amount)}} {{item.asset}}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </md-card-content>
        <md-card-actions v-if="issuances.length">
          <md-button class="md-primary"
                    @click="upload"
                    :disabled="isPending">
            {{ i18n.lbl_upload() }}
          </md-button>
          <md-button class="md-primary"
                    @click="clear"
                    :disabled="isPending">
            {{ i18n.lbl_clear() }}
          </md-button>
        </md-card-actions>
      </md-card>
    </div>
</template>

<script>
import { i18n } from '../../../../js/i18n'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '../../../../vuex/types'
import { EventDispatcher } from '../../../../js/events/event_dispatcher'
import { ErrorHandler } from '../../../../js/errors/error_handler'
import { issuanceService } from '../../../../js/services/issuances.service'
import { FileHelper } from '../../../../js/helpers/file.helper'
import { PreIssuanceRequest, xdr } from 'swarm-js-sdk'
import FormMixin from '../../../common/mixins/form.mixin'
import FileField from '../../../common/fields/FileField'
import config from '../../../../config'

export default {
  components: { FileField },
  mixins: [FormMixin],
  data: _ => ({
    documents: {
      preissuance: null
    },
    issuances: [],
    i18n
  }),

  created () {
    this.loadTokens()
  },

  computed: {
    ...mapGetters([
      vuexTypes.accountId,
      vuexTypes.tokens
    ]),
    userOwnedTokens () {
      return this.tokens.filter(token => token.owner === this.accountId)
    },
    nullAssignerTokens () {
      return this.userOwnedTokens.filter(item => item.signer === config.NULL_ASSET_SIGNER)
    }
  },

  methods: {
    ...mapActions({
      loadTokens: vuexTypes.GET_ALL_TOKENS
    }),

    parsePreIssuances (issuances) {
      this.issuances = []
      const items = issuances
        .map(function (item) {
          const _xdr = xdr.PreIssuanceRequest.fromXDR(item.preEmission, 'hex')
          const result = PreIssuanceRequest.dataFromXdr(_xdr)

          result.xdr = _xdr
          result.isUsed = item.used

          return result
        }).filter(item => {
          return !this.issuances.find(el => el.reference === item.reference)
        })

      for (let i = 0; i < items.length; i++) {
        const assetCode = items[i].asset
        if (!this.isAssetDefined(assetCode)) {
          EventDispatcher.dispatchShowErrorEvent(`Asset with code ${assetCode} does not exist in the system`)
          return
        }
      }
      this.issuances = this.issuances.concat(items)
    },
    isAssetDefined (assetCode) {
      return !!this.userOwnedTokens.filter(item => item.code === assetCode).length
    },

    async isNullAssetSigner (asset) {
      return !!this.nullAssignerTokens.filter(item => item.code === asset).length
    },

    clear () {
      this.issuances = []
      this.documents.preissuance = null
    },

    async upload () {
      this.disable()
      try {
        for (let item of this.issuances) {
          if (await this.isNullAssetSigner(item.asset)) {
            EventDispatcher.dispatchShowErrorEvent(`Preissuance for asset ${item.asset} is not available`)
            this.enable()
            return
          }
          await issuanceService.createPreIssuanceRequest(this.issuances.map(item => item.xdr))
          EventDispatcher.dispatchShowSuccessEvent(i18n.preis_uploaded())
        }
        this.issuances = []
      } catch (err) {
        ErrorHandler.processUnexpected(err)
      }
      this.enable()
    }
  },
  watch: {
    'documents.preissuance': async function (value) {
      if (value) {
        const extracted = await FileHelper.readFileAsText(value.file)
        this.parsePreIssuances(JSON.parse(extracted).issuances)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../../scss/mixins";
  @import "../../../../scss/variables";

  .preissuance-form__upload-wrp {
    margin-top: 1rem;
  }

  .preissuance-form__list {
    margin-top: 2rem;
    list-style-type: none;
  }
</style>
