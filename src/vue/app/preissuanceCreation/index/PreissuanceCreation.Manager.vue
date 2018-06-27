<template>
   <div class="upload-preissuance md-layout md-alignment-center-center">
      <div class="preissuance-form__upload-wrp
                    md-layout-item
                    md-size-50
                    md-medium-size-65
                    md-small-size-95
                    md-xsmall-size-100">
      <md-card>
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
                  <label class="preissuance-form__upload-btn app__btn app__btn--info"
                          for="file-select">
                          Select File(s)
                  </label>
                  <input class="preissuance-form__upload-input"
                    id="file-select"
                    type="file"
                    accept=".iss"
                    @change="onFileChange"
                    multiple
                  />
                </template>
                <template v-else>
                  <p>
                    Loading...
                  </p>
                  <md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate"></md-progress-spinner>
                </template>
                <ul class="preissuance-form__list" v-if="this.issuances.length">
                  <p>To upload:</p>

                  <li v-for="(item, index) in this.issuances" :key="item.reference">
                    {{index + 1}}. {{i18n.c(item.amount)}} {{item.asset}}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </md-card-content>
        <!-- <md-card-actions>
          <md-button type="submit" class="md-primary"
            :disabled="isPending"
          >{{ i18n.lbl_submit() }}</md-button>
        </md-card-actions> -->
      </md-card>
    </div>
  </div>
</template>

<script>
import { i18n } from '../../../../js/i18n'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '../../../../vuex/types'
import { EventDispatcher } from '../../../../js/events/event_dispatcher'
// import { ErrorHandler } from '../../../../js/errors/error_handler'
// import { issuanceService } from '../../../../js/services/issuances.service'
import { FileHelper } from '../../../../js/helpers/file.helper'
import { PreIssuanceRequest, xdr } from 'swarm-js-sdk'

export default {
  components: {},
  data: _ => ({
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
    }
  },

  methods: {
    ...mapActions({
      loadTokens: vuexTypes.GET_ALL_TOKENS
    }),

    async onFileChange (event) {
      const files = event.target.files || event.dataTransfer.files
      if (!files.length) return
      for (let i = 0; i < files.length; i++) {
        const extracted = await FileHelper.readFileAsText(files[i])
        this.parsePreIssuances(JSON.parse(extracted).issuances)
      }
    },

    parsePreIssuances (issuances) {
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
        console.log(!this.isAssetDefined(assetCode))
        if (!this.isAssetDefined(assetCode)) {
          EventDispatcher.dispatchShowErrorEvent(`Asset with code ${assetCode} does not exist in the system`)
          return
        }
      }
      this.issuances = this.issuances.concat(items)
    },
    isAssetDefined (assetCode) {
      return !!this.userOwnedTokens.filter(item => item.code === assetCode).length
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
