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
                            v-model="form.tokenName"
                            v-validate="'required'"
                            :label="i18n.lbl_token_name()"
                            :errorMessage="errorMessage('token name')"
                />
              </div>
              <div class="md-layout-item md-small-size-100">
                <input-field id="token-code"
                            name="token code"
                            v-model="form.tokenCode"
                            v-validate="'required'"
                            :label="i18n.lbl_token_code()"
                            :errorMessage="errorMessage('token code')"
                            :disabled="hasValueToUpdate"
                />
              </div>
            </div>
            <div class="md-layout md-gutter">
              <div class="md-layout-item md-small-size-100">
                <input-field id="token-max-issuance-amount"
                            name="max issuance amount"
                            v-model="form.maxIssuanceAmount"
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
                <md-checkbox v-model="form.policies"
                              :value="ASSET_POLICIES.transferable"
                              name="policy-transferable"
                              id="policy-transferable"
                              class="md-primary">
                            Transferable
                </md-checkbox>
              </div>
              <div class="md-layout-item md-size-50">
                <md-checkbox v-model="form.policies"
                              :value="ASSET_POLICIES.withdrawable"
                              name="policy-withdrawable"
                              id="policy-withdrawable"
                              class="md-primary">
                            Withdrawable
                </md-checkbox>
              </div>
              <div class="md-layout-item md-size-50">
                <md-checkbox v-model="form.policies"
                              :value="ASSET_POLICIES.requiresKyc"
                              name="policy-requiresKyc"
                              id="policy-requiresKyc"
                              class="md-primary">
                            Requires Kyc
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
                      :value="true">I want to make additional issuance later (<a @click.stop.prevent="showDialog = true">tell me more</a>)</md-radio>
          </div>
          <div class="md-card-content-item" v-if="makeAdditional">
            <div class="md-layout md-gutter">
              <div class="md-layout-item md-small-size-100">
                <input-field id="token-preissued-asset-signer"
                            name="preissued asset signer"
                            v-model="form.preissuedAssetSigner"
                            v-validate="'required|account_id'"
                            :label="i18n.lbl_token_preissued_asset_signer()"
                            :errorMessage="errorMessage('preissued asset signer')"
                />
              </div>
              <div class="md-layout-item md-small-size-100">
                <input-field id="token-initial-preissued-amount"
                            name="initial preissued amount"
                            v-model="form.initialPreissuedAmount"
                            v-validate="{required:true, amount: true, max_value: form.maxIssuanceAmount}"
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
import get from 'lodash/get'

import { i18n } from '../../../../js/i18n'
import { documentTypes } from '../../../../js/const/documents.const'

import { tokensService } from '../../../../js/services/tokens.service'
import { ASSET_POLICIES } from '../../../../js/const/xdr.const'
import { EventDispatcher } from '../../../../js/events/event_dispatcher'
import { ErrorHandler } from '../../../../js/errors/error_handler'

import { fileService } from '../../../../js/services/file.service'
import { DocumentContainer } from '../../../../js/helpers/DocumentContainer'

export default {
  mixins: [FormMixin],
  components: { FileField },
  props: ['requestValues'],
  data: _ => ({
    form: {
      requestID: '0',
      tokenName: '',
      tokenCode: '',
      preissuedAssetSigner: '',
      initialPreissuedAmount: '',
      maxIssuanceAmount: '',
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

  created () {
    if (this.requestValues) {
      const tokenIcon = get(this.requestValues, 'details.asset_create.details.logo')
      const tokenTerms = get(this.requestValues, 'details.asset_create.details.terms')
      this.form.requestID = get(this.requestValues, 'id')
      this.form.tokenName = get(this.requestValues, 'details.asset_create.details.name')
      this.form.tokenCode = get(this.requestValues, 'reference')
      this.form.preissuedAssetSigner = get(this.requestValues, 'details.asset_create.pre_issued_asset_signer')
      this.form.initialPreissuedAmount = get(this.requestValues, 'details.asset_create.initial_preissued_amount')
      this.form.maxIssuanceAmount = get(this.requestValues, 'details.asset_create.max_issuance_amount')
      this.form.policies = get(this.requestValues, 'details.asset_create.policies').map(policy => policy.value)
      this.documents[documentTypes.tokenTerms] = tokenTerms.key ? new DocumentContainer(tokenTerms) : null
      this.documents[documentTypes.tokenIcon] = tokenIcon.key ? new DocumentContainer(tokenIcon) : null
      if (this.form.initialPreissuedAmount !== this.form.maxIssuanceAmount) {
        this.makeAdditional = true
      }
    }
  },

  computed: {
    hasValueToUpdate () {
      return typeof this.requestValues !== 'undefined'
    }
  },

  methods: {
    async submit () {
      if (!await this.isValid()) return
      this.disable()
      try {
        await this.createRequest()
        EventDispatcher.dispatchShowSuccessEvent(i18n.kyc_upload_success())
      } catch (error) {
        console.log(error)
        ErrorHandler.processUnexpected(error)
      }
      this.enable()
    },

    async createRequest () {
      let preissuedAssetSigner = 'GAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHV4'
      let initialPreissuedAmount = this.form.maxIssuanceAmount

      if (this.makeAdditional || this.requestValues) {
        preissuedAssetSigner = this.form.preissuedAssetSigner
        initialPreissuedAmount = this.form.initialPreissuedAmount
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
        requestID: this.form.requestID,
        code: this.form.tokenCode,
        preissuedAssetSigner: preissuedAssetSigner,
        maxIssuanceAmount: this.form.maxIssuanceAmount,
        policies: (this.form.policies).reduce((a, b) => (a | b), 0),
        initialPreissuedAmount: initialPreissuedAmount,
        details: {
          name: this.form.tokenName,
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
