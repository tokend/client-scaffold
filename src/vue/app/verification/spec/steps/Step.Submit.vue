<template>
  <form class="step" @submit.prevent="submit">
    <div class="step__row">
      <file-field class="kyc-form__file-field"
                  id="kyc-business-model"
                  v-model="documents[documentTypes.kycBusinessModel]"
                  v-validate="'required'"
                  :label="i18n.kyc_upload_business_model()"
                  :type="documentTypes.kycBusinessModel"
                  :data-vv-as="i18n.kyc_upload_business_model()"
      />
    </div>
    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <md-checkbox v-model="form.privacyPolicy"
                      name="privacy-policy"
                      id="privacy-policy"
                      :errorMessage="errorMessage('privacy-policy')"
                      class="md-primary privacy-policy__cb">
                    I confirm that I have read, consent and agree to Mariniero <a @click.stop.prevent>User Agreement</a> and <a @click.stop.prevent>Privacy Policy</a>,
                    and I am of legal age. I understand that I can change my communication preferences any time in my Mariniero Ventures Account.
        </md-checkbox>
      </div>
    </div>
    <md-card-actions class="step__action">
      <md-button type="submit" class="md-primary md-flat"
                :disabled="isPending">
        {{ i18n.lbl_agree_submit() }}
      </md-button>
    </md-card-actions>
  </form>
</template>

<script>
  import StepMixin from '../step.mixin'

  import { ASSET_POLICIES, documentTypes } from '../../../../../js/const/const'
  import { commonEvents } from '../../../../../js/events/common_events'
  import { ErrorHandler } from '../../../../../js/errors/error_handler'
  import { i18n } from '../../../../../js/i18n'
  import { EventDispatcher } from '../../../../../js/events/event_dispatcher'
  import _cloneDeep from 'lodash/cloneDeep'

  export default {
    name: 'StepCreateToken',
    mixins: [StepMixin],
    data: _ => ({
      form: {},
      documents: {},
      i18n,
      documentTypes,
      ASSET_POLICIES,
      makeAdditional: false
    }),

    methods: {
      async submit () {
        if (!await this.isValid()) return
        // if (!this.isValidDocs(this.schema.requiredDocs)) return
        if (!this.form.privacyPolicy) {
          EventDispatcher.dispatchShowErrorEvent(i18n.kyc_not_privacy_policy())
          return false
        }
        this.disable()
        try {
          await this.uploadDocuments()
          this.$emit(commonEvents.kycUpdateEvent, {
            form: this.form,
            documents: this.documents
          })
        } catch (error) {
          this.enable()
          ErrorHandler.processUnexpected(error)
        }
      },
      stubData () {
        this.form = _cloneDeep(this.kyc)
        this.documents = _cloneDeep(this.kyc.documents)
      }
    },
    watch: {
      kyc: {
        handler: 'stubData',
        immediate: true
      }
    }
  }
</script>

<style scoped>
  .privacy-policy__cb {
    margin-bottom: 6rem;
  }
</style>
