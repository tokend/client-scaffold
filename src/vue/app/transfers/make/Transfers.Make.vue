<template>
  <div class="transfer md-layout md-alignment-center-center">
    <form novalidate @submit.prevent="submit"
          class="md-layout-item
                 md-size-50
                 md-medium-size-45
                 md-small-size-100
                 md-xsmall-size-100">
      <md-card>
        <md-progress-bar md-mode="indeterminate" v-if="isPending"/>

        <md-card-header>
          <div class="md-title">{{ i18n.tr_send() }}</div>
        </md-card-header>

        <md-card-content>
            <div class="md-layout md-gutter">
              <div class="md-layout-item md-small-size-100">
                <select-field id="transfer-token"
                              name="token"
                             :label="i18n.lbl_asset()"
                             :values="tokenCodes"
                              v-model="form.tokenCode"

                />
              </div>

              <div class="md-layout-item md-small-size-100">
                <input-field id="transfer-amount"
                             name="amount"
                             type="number"
                           v-model="form.amount"
                           v-validate="'required|amount'"
                            :label="i18n.lbl_amount()"
                            :errorMessage="errorMessage('amount')"
                />
              </div>
            </div>

            <input-field id="transfer-recipient"
                         name="recipient"
                       v-model="form.recipient"
                       v-validate="'required|email_or_account_id'"
                        :label="i18n.lbl_recipient()"
                        :errorMessage="errorMessage('recipient')"
            />

            <textarea-field id="transfer-description"
                            name="description"
                          v-model="form.subject"
                          v-validate="'max: 180'"
                           :label="i18n.lbl_description()"
                           :maxlength="180"
                           :errorMessage="errorMessage('recipient')"
            />

          <div class="md-layout md-alignment-center-right">
            <md-button type="submit" class="md-dense md-raised md-primary" :disabled="isPending">
              {{ i18n.lbl_send() }}
            </md-button>
          </div>

        </md-card-content>
      </md-card>
    </form>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { vuexTypes } from '../../../../vuex/types'
  import { i18n } from '../../../../js/i18n'

  import FormMixin from '../../../common/mixins/form.mixin'

  import { DEFAULT_SELECTED_ASSET } from '../../../../js/const/configs.const'

  export default {
    name: 'transfers-make',
    mixins: [FormMixin],
    data: _ => ({
      form: {
        tokenCode: DEFAULT_SELECTED_ASSET,
        amount: '',
        recipient: '',
        subject: ''
      },
      i18n
    }),
    computed: {
      ...mapGetters([
        vuexTypes.userTransferableTokens
      ]),
      tokenCodes () {
        return this.userTransferableTokens.map(token => token.code)
      }
    },
    methods: {
      async submit () {
        // wip
      }
    }
  }
</script>

<style scoped>
</style>
