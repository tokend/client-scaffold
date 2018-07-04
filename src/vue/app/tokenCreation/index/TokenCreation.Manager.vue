<template>
   <div class="kyc-form md-layout md-alignment-center-center">
    <form novalidate @submit.prevent="submit"
          class="md-layout-item
                  md-size-50
                  md-medium-size-65
                  md-small-size-95
                  md-xsmall-size-100"
    >
      <md-card>
        <md-progress-bar md-mode="indeterminate" v-if="isPending"/>
        <md-card-header>
          <div class="md-title">{{ i18n.lbl_create_token() }}</div>
        </md-card-header>
        <md-card-content>
          <div class="md-card-content-item">
            <div class="md-layout-item">
              <file-field fileType="image"
                          v-model="documents[documentTypes.tokenIcon]"
                          :label="i18n.lbl_token_icon()"
                          :minWidth='120'
                          :minHeight='120'
                          :accept="'image/*'"
                          :type="documentTypes.tokenIcon"/>
            </div>
          </div>
          <div class="md-card-content-item">
            <div class="md-layout md-gutter">
              <div class="md-layout-item md-small-size-100">
                <input-field id="token-name"
                            name="token name"
                            v-model="request.tokenName"
                            v-validate="'required'"
                            :label="i18n.lbl_token_name()"
                            :errorMessage="errorMessage('token name')"
                />
              </div>
              <div class="md-layout-item md-small-size-100">
                <input-field id="token-code"
                            name="token code"
                            v-model="request.tokenCode"
                            v-validate="'required'"
                            :label="i18n.lbl_token_code()"
                            :errorMessage="errorMessage('token code')"
                />
              </div>
            </div>
            <div class="md-layout md-gutter"> 
              <div class="md-layout-item md-small-size-100"> 
                <input-field id="token-max-issuance-amount" 
                            name="max issuance amount" 
                            type="number"
                            v-model="request.maxIssuanceAmount" 
                            v-validate="'required|amount'" 
                            :label="i18n.lbl_token_max_issuance_amount()" 
                            :errorMessage="errorMessage('max issuance amount')" 
                /> 
              </div> 
            </div> 
          </div>
          <div class="md-card-content-item">
            <div class="md-layout md-gutter">
              <div class="md-layout-item md-size-50">
                <md-checkbox v-model="request.policies"
                              :value="ASSET_POLICIES.transferable"
                              name="policy-transferable"
                              id="policy-transferable"
                              class="md-primary">
                            Transferable
                </md-checkbox>
              </div>
              <div class="md-layout-item md-size-50">
                <md-checkbox v-model="request.policies"
                              :value="ASSET_POLICIES.requiresKyc"
                              name="policy-requiresKyc"
                              id="policy-requiresKyc"
                              class="md-primary">
                            Requires KYC
                </md-checkbox>
              </div>
            </div>
          </div>
          <div class="md-card-content-item">
            <div class="md-layout-item">
              <file-field class="token_terms__file-field"
                          name="token terms document"
                          v-model="documents[documentTypes.tokenTerms]"
                          :label="i18n.lbl_token_terms()"
                          id="document.id"
                          :type="documentTypes.tokenTerms"
              />
            </div>
          </div>
          <div class="md-card-content-item">
            <md-radio class="md-primary"
                      v-model="makeAdditional"
                      :value="false">I don't want to make additional issuance later</md-radio>
            <md-radio class="md-primary"
                      v-model="makeAdditional"
                      :value="true">I want to make additional issuance later
              <!--(<a @click.stop.prevent="showDialog = true">tell me more</a>)-->
            </md-radio>
          </div>
          <div class="md-card-content-item" v-if="makeAdditional">
            <div class="md-layout md-gutter">
              <div class="md-layout-item md-small-size-100">
                <input-field id="token-preissued-asset-signer"
                            name="preissued asset signer"
                            v-model="request.preissuedAssetSigner"
                            v-validate="'required|account_id'"
                            :label="i18n.lbl_token_preissued_asset_signer()"
                            :errorMessage="errorMessage('preissued asset signer')"
                />
              </div>
              <div class="md-layout-item md-small-size-100">
                <input-field id="token-initial-preissued-amount"
                            name="initial preissued amount"
                            v-model="request.initialPreissuedAmount"
                            type="number"
                            v-validate="{required:true, min_value: 0, max_value: request.maxIssuanceAmount}"
                            :label="i18n.lbl_token_initial_preissued_amount()"
                            :errorMessage="errorMessage('initial preissued amount')"
                />
              </div>
            </div>
          </div>
        </md-card-content>
        <md-card-actions>
          <md-button type="submit" class="md-primary"
            :disabled="isPending"
          >{{ i18n.lbl_submit() }}</md-button>
        </md-card-actions>
      </md-card>
    </form>

    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>Tell you something more</md-dialog-title>
      <md-card-content>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ullam mollitia dolorum dolores quae commodi impedit possimus qui, atque at voluptates cupiditate. Neque quae culpa suscipit praesentium inventore ducimus ipsa aut.</p>
      </md-card-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showDialog = false">Close</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import FormMixin from '../../../common/mixins/form.mixin'
import FileField from '../../../common/fields/FileField'

import { i18n } from '../../../../js/i18n'
import { documentTypes } from '../../../../js/const/documents.const'

import { tokensService } from '../../../../js/services/tokens.service'
import { ASSET_POLICIES } from '../../../../js/const/xdr.const'
import { EventDispatcher } from '../../../../js/events/event_dispatcher'
import { ErrorHandler } from '../../../../js/errors/error_handler'

import { DocumentContainer } from '../../../../js/helpers/DocumentContainer'
import { reviewableRequestsService } from '../../../../js/services/reviewable_requests.service'
import { fileService } from '../../../../js/services/file.service'
import { TokenCreationRecord } from '../../../../js/records/token_creation.record'
import config from '../../../../config'

export default {
  mixins: [FormMixin],
  components: { FileField },
  props: ['id'],
  data: _ => ({
    request: {
      policies: []
    },
    documents: {
      [documentTypes.tokenTerms]: null,
      [documentTypes.tokenIcon]: null
    },
    makeAdditional: false,
    showDialog: false,
    i18n,
    documentTypes,
    ASSET_POLICIES
  }),

  async created () {
    if (this.id) {
      this.makeAdditional = true
      this.request = new TokenCreationRecord(await reviewableRequestsService.loadReviewableRequestById(this.id))
      this.documents[documentTypes.tokenTerms] = this.request.terms.key ? new DocumentContainer(this.request.terms) : null
      this.documents[documentTypes.tokenIcon] = this.request.logo.key ? new DocumentContainer(this.request.logo) : null
    }
  },

  computed: {
  },

  methods: {
    async submit () {
      if (!await this.isValid()) return
      this.disable()
      try {
        await this.createRequest()
        EventDispatcher.dispatchShowSuccessEvent(i18n.kyc_upload_success())
        this.$router.push({ path: '/requests/token-creation' })
      } catch (error) {
        console.log(error)
        ErrorHandler.processUnexpected(error)
      }
      this.enable()
    },

    async createRequest () {
      let preissuedAssetSigner = config.NULL_ASSET_SIGNER
      let initialPreissuedAmount = this.request.maxIssuanceAmount

      if (this.makeAdditional || this.id) {
        preissuedAssetSigner = this.request.preissuedAssetSigner
        initialPreissuedAmount = this.request.initialPreissuedAmount
      }

      const logoContainer = this.documents[documentTypes.tokenIcon]
      const termsContainer = this.documents[documentTypes.tokenTerms]

      if (logoContainer && !logoContainer.isUploaded) {
        const logoKey = await fileService.uploadFile(logoContainer.getDetailsForUpload())
        logoContainer.setKey(logoKey)
      }

      if (termsContainer && !termsContainer.isUploaded) {
        const termsKey = await fileService.uploadFile(termsContainer.getDetailsForUpload())
        termsContainer.setKey(termsKey)
      }
      await tokensService.createTokenCreationRequest({
        requestID: this.request.requestID ? this.request.requestID : '0',
        code: this.request.tokenCode,
        preissuedAssetSigner: preissuedAssetSigner,
        maxIssuanceAmount: this.request.maxIssuanceAmount,
        policies: (this.request.policies).reduce((a, b) => (a | b), 0),
        initialPreissuedAmount: initialPreissuedAmount,
        details: {
          name: this.request.tokenName,
          logo: logoContainer ? logoContainer.getDetailsForSave() : {},
          terms: termsContainer ? termsContainer.getDetailsForSave() : {}
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .md-card-content-item:not(:last-child) {
    margin-bottom: 24px;
  }
</style>
