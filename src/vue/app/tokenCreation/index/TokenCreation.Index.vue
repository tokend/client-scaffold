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
                          :slabel="i18n.lbl_token_icon()"
                          :minWidth='120'
                          :minHeight='120'
                          :accept="'image/*'"/>
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
                />
              </div>
            </div>
            <div class="md-layout md-gutter">
              <div class="md-layout-item md-small-size-100">
                <input-field id="token-max-issuance-amount"
                            name="max issuance amount"
                            v-model="form.maxIssuanceAmount"
                            v-validate="'required|numeric'"
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
                            v-validate="'required|secret_key'"
                            :label="i18n.lbl_token_preissued_asset_signer()"
                            :errorMessage="errorMessage('preissued asset signer')"
                />
              </div>
              <div class="md-layout-item md-small-size-100">
                <input-field id="token-initial-preissued-amount"
                            name="initial preissued amount"
                            v-model="form.initialPreissuedAmount"
                            v-validate="{required:true, numeric: true, max_value: form.maxIssuanceAmount}"
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
import { Keypair } from 'swarm-js-sdk'
import { ASSET_POLICIES } from '../../../../js/const/xdr.const'
import { EventDispatcher } from '../../../../js/events/event_dispatcher'
import { ErrorHandler } from '../../../../js/errors/error_handler'

export default {
  mixins: [FormMixin],
  components: { FileField },
  data: _ => ({
    form: {
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

  methods: {
    async submit () {
      if (!await this.isValid()) return
      this.disable()
      try {
        const opts = await this.getDataFromForm()
        await this.submitRequest(opts)
        await tokensService.loadTokenCreationRequestsForState()
        EventDispatcher.dispatchShowSuccessEvent(i18n.kyc_upload_success())
      } catch (error) {
        console.log(error)
        ErrorHandler.processUnexpected(error)
      }
      this.enable()
    },

    async getDataFromForm () {
      const code = this.form.tokenCode
      let preissuedAssetSigner = 'GAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHV4'
      const maxIssuanceAmount = this.form.maxIssuanceAmount
      const policies = (this.form.policies).reduce((a, b) => (a | b), 0)
      let initialPreissuedAmount = this.form.maxIssuanceAmount
      const name = this.form.tokenName
      let logo = {}
      let terms = {}

      if (this.makeAdditional) {
        preissuedAssetSigner = Keypair.fromSecret(this.form.preissuedAssetSigner).accountId()
        initialPreissuedAmount = this.form.initialPreissuedAmount
      }

      if (this.documents[documentTypes.tokenIcon]) {
        logo = this.documents[documentTypes.tokenIcon].getDetailsForSave()
      }

      if (this.documents[documentTypes.tokenTerms]) {
        terms = this.documents[documentTypes.tokenTerms].getDetailsForSave()
      }

      return {
        code: code,
        preissuedAssetSigner: preissuedAssetSigner,
        maxIssuanceAmount: maxIssuanceAmount,
        policies: policies,
        initialPreissuedAmount: initialPreissuedAmount,
        details: {
          name: name,
          logo: logo,
          terms: terms
        }
      }
    },

    async submitRequest (opts) {
      await tokensService.createTokenCreationRequest({
        requestID: '0',
        code: opts.code,
        preissuedAssetSigner: opts.preissuedAssetSigner,
        maxIssuanceAmount: opts.maxIssuanceAmount,
        policies: opts.policies,
        initialPreissuedAmount: opts.initialPreissuedAmount,
        details: {
          name: opts.details.name,
          logo: opts.details.logo,
          terms: opts.details.terms
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .md-card-content-item:not(:last-child) {
    margin-bottom: 48px;
  }
</style>
