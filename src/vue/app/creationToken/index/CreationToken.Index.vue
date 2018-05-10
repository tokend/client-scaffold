<template>
   <div class="kyc-form md-layout md-alignment-center-center">
     <p>ASSET_PAIR_POLICIES {{ASSET_PAIR_POLICIES}}</p>
     <p>ASSET_POLICIES {{ASSET_POLICIES}}</p>
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
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <input-field id="token-name"
                          name="token-name"
                          v-model="form.tokenName"
                          v-validate="'required'"
                          :label="i18n.lbl_token_name()"
                          :errorMessage="errorMessage('token-name')"
              />
            </div>
            <div class="md-layout-item md-small-size-100">
              <input-field id="token-code"
                          name="token-code"
                          v-model="form.tokenCode"
                          v-validate="'required'"
                          :label="i18n.lbl_token_code()"
                          :errorMessage="errorMessage('token-code')"
              />
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <input-field id="token-preissued-asset-signer"
                          name="token preissued asset signer"
                          v-model="form.preissuedAssetSigner"
                          v-validate="'required|secret_key'"
                          :label="i18n.lbl_token_preissued_asset_signer()"
                          :errorMessage="errorMessage('token preissued asset signer')"
              />
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <input-field id="token-initial-preissued-amount"
                          name="token initial preissued amount"
                          v-model="form.initialPreissuedAmount"
                          v-validate="{required:true, less_than: form.maxIssuanceAmount}"
                          :label="i18n.lbl_token_initial_preissued_amount()"
                          :errorMessage="errorMessage('token initial preissued amount')"
              />
            </div>
            <div class="md-layout-item md-small-size-100">
              <input-field id="token-max-issuance-amount"
                          name="token max issuance amount"
                          v-model="form.maxIssuanceAmount"
                          v-validate="'required'"
                          :label="i18n.lbl_token_max_issuance_amount()"
                          :errorMessage="errorMessage('token max issuance amount')"
              />
            </div>
          </div>
          <div class="md-layout-item">
            <file-field v-validate="'required'"
                        type="image" 
                        v-model="form.iconUrl"
                        :label="i18n.lbl_token_icon()"/>
          </div>

          <div class="md-layout-item">
            <md-checkbox v-model="form.policies"
                          name="is-tranferable-token"
                          id="is-tranferable-token"
                          class="md-primary">
                        {{ i18n.lbl_is_transferable() }}
            </md-checkbox>
          </div>

          <div class="md-layout-item">
            <md-checkbox v-model="form.policies"
                          name="is-additional-issuance-allowed"
                          id="is-additional-issuance-allowed"
                          class="md-primary">
                        {{ i18n.lbl_is_additional_issuance_allowed() }}
            </md-checkbox>
          </div>

          <div class="md-layout-item">
            <md-checkbox  v-model="form.policies"
                          name="is-tradable-token"
                          id="is-tradable-token"
                          class="md-primary"
                          value="">
                        {{ i18n.lbl_is_tradable() }}
            </md-checkbox>
          </div>

          <div class="md-layout-item">
            <file-field class="kyc-form__file-field"
                        v-validate="'required'"
                        v-model="document.url"
                        :label="i18n.lbl_token_terms()"
                        id="document.id"
                        :type="document.type"
            />
          </div>
        </md-card-content>
        <md-card-actions>
          <md-button type="submit" class="md-primary"
            :disabled="isPending"
          >{{ i18n.lbl_submit() }}</md-button>
        </md-card-actions>
      </md-card>
    </form>
  </div>
</template>

<script>
import FormMixin from '../../../common/mixins/form.mixin'
import FileField from '../../../common/fields/FileField'
import ImageInput from '../../../common/DEPRECATED.inputs/ImageInput.vue'

import { i18n } from '../../../../js/i18n'
import { documentTypes } from '../../../../js/const/documents.const'

import { tokensService } from '../../../../js/services/tokens.service'
import { Keypair } from 'swarm-js-sdk'
import { ASSET_POLICIES, ASSET_PAIR_POLICIES } from '../../../../js/const/xdr.const'

export default {
  mixins: [FormMixin],
  components: { ImageInput, FileField },
  data: _ => ({
    form: {
      tokenName: '',
      tokenCode: '',
      preissuedAssetSigner: '',
      maxIssuanceAmount: '',
      iconUrl: '',
      policies: [],
      initialPreissuedAmount: ''
    },
    document: {
      type: documentTypes.tokenTerms,
      url: ''
    },
    i18n,
    documentTypes,
    ASSET_POLICIES,
    ASSET_PAIR_POLICIES
  }),
  methods: {
    async submit () {
      if (!await this.isValid()) return
      try {
        await this.submitRequest()
        await tokensService.loadTokenCreationRequestsForState()
      } catch (error) {
        console.log(error)
      }
    },

    async submitRequest () {
      await tokensService.createTokenCreationRequest({
        requestID: '0',
        code: this.form.tokenCode,
        preissuedAssetSigner: Keypair.fromSecret(this.form.preissuedAssetSigner).accountId(),
        maxIssuanceAmount: this.form.maxIssuanceAmount,
        policies: 0,
        initialPreissuedAmount: this.form.initialPreissuedAmount,
        details: {
          name: this.form.tokenName,
          logo: this.form.iconUrl.getDetailsForSave(),
          terms: this.document.url.getDetailsForSave()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
