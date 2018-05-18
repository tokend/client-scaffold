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
          <div class="md-title">{{ i18n.lbl_create_sale() }}</div>
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
                <select-field :label="i18n.lbl_base_asset()" />
              </div>
              <div class="md-layout-item md-small-size-100">
                <select-field :label="i18n.lbl_default_quote_asset()" />
              </div>
            </div>
            <div class="md-layout md-gutter">
              <div class="md-layout-item md-small-size-100">
                <date-field label="Start time" />
              </div>
              <div class="md-layout-item md-small-size-100">
                <date-field label="End time" />
              </div>
            </div>
            <div class="md-layout md-gutter">
              <div class="md-layout-item md-small-size-100">
                <input-field label="Soft cap" />
              </div>
              <div class="md-layout-item md-small-size-100">
                <input-field label="Hard cap" />
              </div>
            </div>
          </div>
          <div class="md-card-content-item">
            <div class="md-layout md-gutter">
              <div class="md-layout-item md-small-size-100">
                <input-field :label="i18n.lbl_sale_name()" />
                <input-field :label="i18n.lbl_short_description()" />
                <textarea-field :label="i18n.lbl_description()" />
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
import SelectField from '../../../common/fields/SelectField'
import FileField from '../../../common/fields/FileField'
import DateField from '../../../common/fields/DateField'
import InputField from '../../../common/fields/InputField'
import TextareaField from '../../../common/fields/TextareaField'
// import get from 'lodash/get'

import { i18n } from '../../../../js/i18n'
import { documentTypes } from '../../../../js/const/documents.const'

// import { salesService } from '../../../../js/services/sales.service'
// import { tokensService } from '../../../../js/services/tokens.service'
import { ASSET_POLICIES } from '../../../../js/const/xdr.const'
// import { EventDispatcher } from '../../../../js/events/event_dispatcher'
// import { ErrorHandler } from '../../../../js/errors/error_handler'

// import { fileService } from '../../../../js/services/file.service'
// import { DocumentContainer } from '../../../../js/helpers/DocumentContainer'

export default {
  mixins: [FormMixin],
  components: { FileField, SelectField, DateField, InputField, TextareaField },
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

  methods: {
  }
}
</script>

<style lang="scss" scoped>
  .md-card-content-item:not(:last-child) {
    margin-bottom: 24px;
  }
</style>
