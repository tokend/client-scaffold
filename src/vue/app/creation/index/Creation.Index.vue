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
          <div class="md-title">{{ i18n.lbl_create_tokens() }}</div>
        </md-card-header>
        <md-card-content>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <input-field id="token-name"
                          name="token-name"
                          v-model="form.tokenName"
                          v-validate="'required'"
                          :label="i18n.lbl_token_name()"
                          :errorMessage="errorMessage('recipient')"
              />
            </div>
            <div class="md-layout-item md-small-size-100">
              <input-field id="token-code"
                          name="token-code"
                          v-model="form.tokenCode"
                          v-validate="'required'"
                          :label="i18n.lbl_token_code()"
                          :errorMessage="errorMessage('recipient')"
              />
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <input-field id="token-preissued-asset-signer"
                          name="token-preissued-asset-signer"
                          v-model="form.preissuedAssetSigner"
                          v-validate="'required'"
                          :label="i18n.lbl_token_preissued_asset_signer()"
                          :errorMessage="errorMessage('recipient')"
              />
            </div>
            <div class="md-layout-item md-small-size-100">
              <input-field id="token-max-issuance-amount"
                          name="token-max-issuance-amount"
                          v-model="form.maxIssuanceAmount"
                          v-validate="'required'"
                          :label="i18n.lbl_token_max_issuance_amount()"
                          :errorMessage="errorMessage('recipient')"
              />
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <input-field id="token-policies"
                          name="token-policies"
                          v-model="form.policies"
                          v-validate="'required|numeric'"
                          :label="i18n.lbl_token_policies()"
                          :errorMessage="errorMessage('recipient')"
              />
            </div>
            <div class="md-layout-item md-small-size-100">
              <input-field id="token-initial-preissued-amount"
                          name="token-initial-preissued-amount"
                          v-model="form.initialPreissuedAmount"
                          v-validate="'required'"
                          :label="i18n.lbl_token_initial_preissued_amount()"
                          :errorMessage="errorMessage('recipient')"
              />
            </div>
          </div>
          <div class="md-layout-item">
            <md-checkbox v-model="form.isTransferable"
                          name="copy-address"
                          id="copy-address"
                          class="md-primary">
                        {{ i18n.lbl_is_transferable() }}
            </md-checkbox>
          </div>

          <div class="md-layout-item">
            <md-checkbox v-model="form.isAdditionalIssuanceAllowed"
                          name="copy-address"
                          id="copy-address"
                          class="md-primary">
                        {{ i18n.lbl_is_additional_issuance_allowed() }}
            </md-checkbox>
          </div>

          <div class="md-layout-item">
            <md-checkbox v-model="form.isTradeable"
                          name="copy-address"
                          id="copy-address"
                          class="md-primary">
                        {{ i18n.lbl_is_tradable() }}
            </md-checkbox>
          </div>

          <div class="md-layout-item">
            <span class="image-input--label">{{ i18n.lbl_token_icon() }}</span>
            <image-input v-validate="'required'" />
          </div>

          <div class="md-layout-item">
            <file-field class="kyc-form__file-field"
                        v-validate="'required'"
                        v-model="document[document.type]"
                        :label="document.label"
                        :id="document.id"
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
import { kycIndividualSchema as schema } from '../spec/creation.schema'

// import { KycTemplateParser } from '../spec/creation-parser'
export default {
  mixins: [FormMixin],
  components: { ImageInput, FileField },
  data: _ => ({
    form: {
      tokenName: '',
      tokenCode: '',
      isTransferable: false,
      isAdditionalIssuanceAllowed: false,
      isTradeable: false,
      preissuedAssetSigner: '',
      maxIssuanceAmount: '',
      policies: '',
      initialPreissuedAmount: ''
    },
    document: {
      label: i18n.lbl_token_terms(),
      id: 'token-terms',
      type: documentTypes.tokenTerms
    },
    i18n,
    schema,
    documentTypes
  }),
  methods: {
    async submit () {
      if (!await this.isValid()) return
      console.log(Object.values(this.form))
    }
  }
}
</script>

<style lang="scss" scoped>
  .image-input--label {
    font-size: 0.8rem;
    color: #8a8f92;
  }
</style>
