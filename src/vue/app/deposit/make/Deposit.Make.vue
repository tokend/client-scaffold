<template>
  <div class="deposit md-layout md-alignment-center-center">
    <md-card class="md-layout-item
                    md-size-35
                    md-medium-size-65
                    md-small-size-100
                    md-xsmall-size-100"
    >
      <md-card-header>
        <div class="md-title">{{ i18n.dep_deposit() }}</div>
      </md-card-header>

      <md-card-content>
        <p class="deposit__explanations">
          {{ i18n.dep_how_to() }}.
          {{ i18n.dep_how_long() }}
        </p>

        <div class="md-layout">
          <select-field
            class="md-layout-item"
            :label="i18n.lbl_asset()"
            :values="tokenCodes"
            v-model="form.tokenCode"
          />
        </div>


        <div class="deposit__qr-outer">
          <p class="deposit__qr-tip">{{ i18n.dep_send_only_asset({ asset: this.form.tokenCode }) }}</p>

          <qrcode class="deposit__qr-code"
                  :text="address"
                  :size="225"
                  color="#3f4244"
          />
        </div>

        <div class="deposit__clipboard-outer">
          <p class="deposit__clipboard-tip">{{ i18n.dep_where_to() }}</p>
          <div class="deposit__clipboard md-layout md-alignment-center-space-between">
            <span class="deposit__address" id="clipboard-target">{{ address }}</span>
            <md-button
              class="md-icon-button"
              id="clipboard-btn"
              @click="showSuccess"
              ref="clipboardBtn"
              data-clipboard-target="#clipboard-target"
            >
              <md-icon class="deposit__clipboard-icon">content_copy</md-icon>
              <md-tooltip>Copy</md-tooltip>
            </md-button>
          </div>
        </div>

      </md-card-content>

    </md-card>
  </div>
</template>

<script>
  import SelectField from '../../../common/fields/SelectField'
  import InputField from '../../../common/fields/InputField'
  import Qrcode from 'vue-qrcode-component'

  import { mapGetters } from 'vuex'
  import { vuexTypes } from '../../../../vuex/types'
  import { i18n } from '../../../../js/i18n'
  import { EventDispatcher } from '../../../../js/events/event_dispatcher'
  import { DEFAULT_SELECTED_ASSET } from '../../../../js/const/configs.const'

  import Clipboard from 'clipboard'

  export default {
    name: 'deposit-make',
    components: { SelectField, InputField, Qrcode },
    data: _ => ({
      form: {
        tokenCode: DEFAULT_SELECTED_ASSET
      },
      clipboard: null,
      i18n
    }),
    mounted () {
      this.clipboard = new Clipboard(document.querySelector('#clipboard-btn'))
    },
    computed: {
      ...mapGetters([
        vuexTypes.userWalletTokens,
        vuexTypes.accountDepositAddresses
      ]),
      tokenCodes () {
        return this.userWalletTokens.map(token => token.code)
      },
      address () {
        return this.accountDepositAddresses[this.form.tokenCode]
      }
    },
    methods: {
      showSuccess () {
        EventDispatcher.dispatchShowSuccessEvent(i18n.dep_copied())
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../scss/variables';

  .deposit__explanations {
    margin-bottom: 1.5rem;
  }

  .deposit__qr-outer {
    margin: 0 auto 2rem;
    text-align: center;
    width: 225px;
  }

  .deposit__qr-tip {
    color: $col-md-unfocused;
    font-size: $fs-tip-smaller;
  }

  .deposit__clipboard-tip {
    color: $col-md-unfocused;
    font-size: $fs-tip;
  }

  .deposit__clipboard {
    border: 1px solid $col-md-unfocused;
    font-size: $fs-tip;
    padding-left:.8rem;
  }

  .deposit__clipboard-icon {
    font-size: $fs-root !important;
  }
</style>
