<template>
  <form class="step"
        novalidate
        @submit.prevent="submit">
    <template v-for="row in schema.rows">
      <div class="step__row">
        <template v-for="item in row">
          <h3 v-if="item.heading">{{ item.heading }}</h3>

          <p v-if="item.subheading">{{ item.subheading }}</p>

          <input-field v-if="item.field === 'text'"

                       v-model="form[item.model]"
                       v-validate="item.validate"
                       class="step__input-field"
                       :name="item.name"
                       :id="item.id"
                       :required="item.required"
                       :label="item.label"
                       :type="item.type"
                       :key='item.id'
                       :errorMessage="errorMessage(item.name)"
                       :disabled="accountState === ACCOUNT_STATES.pending"
          />
          <textarea-field v-if="item.field === 'textarea'"
                          v-model="form[item.model]"
                          v-validate="item.validate"
                          class="step__input-field"
                          :name="item.name"
                          :id="item.id"
                          :required="item.required"
                          :label="item.label"
                          :type="item.type"
                          :key='item.id'
                          :maxlength="item.maxlength"
                          :errorMessage="errorMessage(item.name)"
                          :disabled="accountState === ACCOUNT_STATES.pending"
          />
          <file-field v-if="item.field === 'file'"
                      v-model="documents[item.type]"
                      class="step__file-field"
                      :fileType="item.fileType"
                      :private="item.private"
                      :label="item.label"
                      :type="item.type"
                      :id="item.id"
                      :key='item.id'
                      :disabled="accountState === ACCOUNT_STATES.pending"
          />

          <select-field v-if="item.field === 'select' && values[item.values].length"
                      :name="item.name"
                      :id="item.id"
                      :label="item.label"
                      v-model="form[item.model]"
                      :values="values[item.values]"
                      :key='item.id'
                    
                      :disabled="accountState === ACCOUNT_STATES.pending"/>

          <date-field v-if="item.field === 'date'"
                         v-model="form[item.model]"
                         v-validate="'required'"
                         :name="item.name"
                         :id="item.id"
                         :required="item.required"
                         :label="item.label"
                         :disableAfter="item.disableAfter"
                         :disableBefore="item.disableBefore"
                         :key='item.id'
                         :errorMessage="errorMessage(item.name)"
                         :disabled="accountState === ACCOUNT_STATES.pending"
          />

        </template>
      </div>
    </template>
    <md-card-actions class="step__action">
      <md-button type="submit" class="md-primary md-flat step__submit-btn"
              :disabled="isPending || accountState === ACCOUNT_STATES.pending"
              v-if="finished">
        {{ i18n.lbl_submit() }}
      </md-button>
      <md-button type="submit" class="md-primary md-flat step__submit-btn"
              :disabled="isPending"
              v-else>
        {{ i18n.sale_next_step() }}
      </md-button>
    </md-card-actions>
  </form>
</template>

<script>
  import StepMixin from '../spec/step.mixin'
  import _pick from 'lodash/pick'
  import { ErrorHandler } from '../../../../js/errors/error_handler'
  import { commonEvents } from '../../../../js/events/common_events'
  import { ACCOUNT_STATES } from '../../../../js/const/const'
  import { mapGetters } from 'vuex'
  import { vuexTypes } from '../../../../vuex/types'
  export default {
    name: 'Step-default',
    mixins: [ StepMixin ],
    props: ['schema'],
    data: _ => ({
      finished: false,
      ACCOUNT_STATES
    }),
    created () {
      this.finished = (this.activeStep === this.finalStep)
    },
    computed: {
      ...mapGetters([
        vuexTypes.accountKycData,
        vuexTypes.accountKycDocuments,
        vuexTypes.accountState
      ])
    },

    methods: {
      async submit () {
        if (!await this.isValid()) return
        // if (!this.isValidDocs(this.schema.requiredDocs)) return
        this.disable()
        try {
          await this.uploadDocuments()
          this.$emit(commonEvents.kycUpdateEvent, {
            form: this.form,
            documents: this.documents
          })
        } catch (error) {
          ErrorHandler.processUnexpected(error)
        }
        this.enable()
      },

      stubData () {
        if (this.schema) {
          this.form = _pick(this.kyc, Object.keys(this.schema.form))
          delete this.form.docs
          this.documents = this.accountKycDocuments
        }
      }
    },

    watch: {
      kyc: {
        handler: 'stubData',
        immediate: true
      },
      activeStep (value) {
        this.finished = (value === this.finalStep)
      }
    }
  }
</script>

<style scoped>
  /* @import './step.scss'; */
</style>
