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
          <div class="md-title">{{ i18n.kyc_account_verification() }}</div>
        </md-card-header>

        <md-card-content>

          <div class="md-layout md-gutter">

            <div class="md-layout-item md-small-size-100">
              <input-field id="kyc-form-first-name"
                           name="first-name"
                         v-model="form.first_name"
                         v-validate="'required'"
                          :required="true"
                          :label="i18n.lbl_first_name()"
                          :errorMessage="errorMessage('first-name')"
              />
            </div>

            <div class="md-layout-item md-small-size-100">
              <input-field id="kyc-form-last-name"
                           name="last-name"
                         v-model="form.last_name"
                         v-validate="'required'"
                          :required="true"
                          :label="i18n.lbl_last_name()"
                          :errorMessage="errorMessage('last-name')"
              />
            </div>

          </div>

          <h4>{{ i18n.kyc_address_details() }}</h4>

          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <input-field id="kyc-form-line-1"
                           name="line-1"
                         v-model="form.address.line_1"
                         v-validate="'required'"
                   data-vv-as="line 1"
                          :required="true"
                          :label="i18n.lbl_line_1()"
                          :errorMessage="errorMessage('line-1')"
              />
            </div>
            <div class="md-layout-item md-small-size-100">
              <input-field id="kyc-form-line-2"
                           name="line-2"
                         v-model="form.address.line_2"
                          :label="i18n.lbl_line_2()"
                          :errorMessage="errorMessage('line-2')"
              />
            </div>
          </div>


          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">

              <input-field id="kyc-form-city"
                           name="city"
                         v-model="form.address.city"
                         v-validate="'required'"
                          :required="true"
                          :label="i18n.lbl_city()"
                          :errorMessage="errorMessage('city')"
              />
            </div>

            <div class="md-layout-item md-small-size-100">
              <input-field id="kyc-form-country"
                           name="country"
                         v-model="form.address.country"
                         v-validate="'required'"
                          :required="true"
                          :label="i18n.lbl_country()"
                          :errorMessage="errorMessage('country')"
              />
            </div>
          </div>

          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <input-field id="kyc-form-state"
                           name="state"
                         v-model="form.address.state"
                         v-validate="'required'"
                          :required="true"
                          :label="i18n.lbl_state()"
                          :errorMessage="errorMessage('state')"
              />
            </div>
            <div class="md-layout-item md-small-size-100">
              <input-field id="kyc-form-postal-code"
                           name="postal-code"
                         v-model="form.address.postal_code"
                         v-validate="'required'"
                           data-vv-as="postal code"
                          :required="true"
                          :label="i18n.lbl_postal_code()"
                          :errorMessage="errorMessage('postal-code')"
              />
            </div>
          </div>

          <h4>{{ i18n.kyc_required_documents() }}</h4>

          <file-field id="kyc-file-id" class="kyc-form__file-field"
                     :type="documentTypes.kycIdDocument"
                     :private="true"
                     :label="i18n.lbl_kyc_id()"
                    v-model="documents[documentTypes.kycIdDocument]"/>
          <file-field id="kyc-file-poa" class="kyc-form__file-field"
                     :type="documentTypes.kycProofOfAddress"
                     :private="true"
                     :label="i18n.lbl_kyc_proof()"
                    v-model="documents[documentTypes.kycProofOfAddress]"/>

          <h4>{{ i18n.kyc_photo_verification() }}</h4>
          <p>
            {{ i18n.kyc_photo_explain() }}<br>
            <md-button @click="isDialogOpened = true">
              {{ i18n.kyc_show_key() }}
            </md-button>
          </p>
          <file-field id="kyc-file-photo" class="kyc-form__file-field"
                     :type="documentTypes.kycPhoto"
                     :private="true"
                     :label="i18n.lbl_kyc_photo()"
                    v-model="documents[documentTypes.kycPhoto]"/>

          <div class="md-layout md-alignment-center-right">
            <md-button type="submit" class="md-dense md-raised md-primary" :isPending="isPending">
              {{ i18n.lbl_submit() }}
            </md-button>
          </div>
        </md-card-content>
      </md-card>
    </form>

    <md-dialog :md-active.sync="isDialogOpened">
      <md-dialog-title>
        {{ i18n.kyc_verification_key() }}
      </md-dialog-title>
      <div class="app__dialog__inner">
        <p class="kyc-form__verification-key">
          {{ verificationKey }}
        </p>
      </div>
      <md-dialog-actions class="md-layout md-alignment-center-right">
        <md-button class="md-primary" @click="isDialogOpened = false" :disabled="isPending">{{ i18n.lbl_done() }}</md-button>
      </md-dialog-actions>
    </md-dialog>

  </div>
</template>

<script>
  import FormMixin from '../../../common/mixins/form.mixin'
  import FileField from '../../../common/fields/FileField'

  import { mapGetters, mapActions } from 'vuex'
  import { ErrorHandler } from '../../../../js/errors/error_handler'
  import { EventDispatcher } from '../../../../js/events/event_dispatcher'
  import { documentTypes } from '../../../../js/const/documents.const'
  import { vuexTypes } from '../../../../vuex/types'
  import { i18n } from '../../../../js/i18n'
  import isEmpty from 'lodash/isEmpty'

  export default {
    name: 'verification-individual',
    mixins: [FormMixin],
    components: { FileField },
    data: _ => ({
      form: {
        first_name: '',
        last_name: '',
        address: {
          line_1: '',
          line_2: '',
          city: '',
          country: '',
          state: '',
          postal_code: ''
        }
      },
      documents: {
        [documentTypes.kycIdDocument]: null,
        [documentTypes.kycProofOfAddress]: null,
        [documentTypes.kycPhoto]: null
      },
      isDialogOpened: false,
      documentTypes,
      i18n
    }),
    created () {
      if (!isEmpty(this.userKycDetails)) {
        this.stubDetails()
      }
    },
    computed: {
      ...mapGetters([
        vuexTypes.accountId,
        vuexTypes.userKycDetails,
        vuexTypes.userKycDocuments,
        vuexTypes.userKycSequence
      ]),
      verificationKey () {
        return this.accountId.slice(1, 6)
      }
    },
    methods: {
      ...mapActions({
        loadUser: vuexTypes.GET_USER_DETAILS,
        loadUserKyc: vuexTypes.GET_USER_KYC,
        updateKycDetails: vuexTypes.UPDATE_USER_KYC_DETAILS,
        updateKycDocuments: vuexTypes.UPDATE_USER_KYC_DOCUMENTS
      }),
      async submit () {
        if (!await this.isValid()) return
        if (!this.isAllDocsUploaded()) return
        this.disable()
        try {
          const newDocuments = await this.updateKycDocuments(this.documents)
          console.log('newDocuments')
          console.log(newDocuments)
          const oldDocuments =
            Object.entries(this.documents)
              .reduce((documents, [ type, document ]) => {
                if (!newDocuments[type]) {
                  documents[type] = document.getDetailsForSave()
                }
                return documents
              }, {})
          console.log('oldDocuments')
          console.log(oldDocuments)
          const kycSequence = String(this.userKycSequence + 1)
          await this.updateKycDetails({
            sequence: kycSequence,
            details: this.form,
            documents: {
              ...oldDocuments,
              ...newDocuments
            }
          })
          await this.loadUser()
          await this.loadUserKyc(this.userKycSequence)
        } catch (error) {
          ErrorHandler.processUnexpected(error)
        }
        this.enable()
      },
      isAllDocsUploaded () {
        for (const document of Object.values(this.documents)) {
          if (!document) {
            EventDispatcher.dispatchShowErrorEvent(i18n.kyc_not_all_docs())
            return false
          }
        }
        return true
      },
      stubDetails () {
        const details = this.userKycDetails
        const documents = this.userKycDocuments
        this.form = details
        Object.keys(documents)
          .forEach(documentType => {
            this.documents[documentType] = documents[documentType]
          })
      }
    },
    watch: {
      userKycDetails () { this.stubDetails() },
      userKycDocuments () { this.stubDetails() }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../scss/variables';

  .kyc-form__verification-key {
    font-size: $fs-big;
    font-weight: bold;
    margin: 2rem 0;
    text-align: center;
  }
</style>
