<template>
  <div class="deposit md-layout md-alignment-center-center">
    <template v-if="false && accountTypeI === ACCOUNT_TYPES.notVerified">
      <not-available-card icon='file_download'
                          :title="i18n.lbl_not_available()"
                          :descr="i18n.lbl_not_available_exp({ screen: 'Deposit' })"/>
    </template>
    <template v-else>
      <template v-if="form.tokenCode">
        <div class="md-layout-item
                      md-size-50
                      md-medium-size-65
                      md-small-size-95
                      md-xsmall-size-100">
          <md-card>
            <md-card-content>
              <p class="deposit__explanations">
                {{ i18n.dep_how_to({ asset: form.tokenCode }) }}.
                {{ i18n.dep_how_long() }}
              </p>

              <div class="deposit__asset-select">
                <select-field-custom :values="tokenCodes"
                                     v-model="form.tokenCode"
                                     :label="i18n.lbl_asset()"/>
              </div>

              <template v-if="address">
                <div class="deposit__qr-outer">
                  <p class="deposit__qr-tip">{{ i18n.dep_send_only_asset({ asset: form.tokenCode }) }}</p>

                  <qrcode class="deposit__qr-code"
                          :text="address"
                          :size="225"
                          color="#3f4244"
                  />
                </div>

                <clipboard-field
                  :value="address"
                  :label="i18n.dep_where_to({ asset: form.tokenCode })"
                />
              </template>

              <template v-else-if="isPending">
                <div class="deposit__progress-wrp">
                  <md-progress-spinner md-mode="indeterminate"/>
                </div>
              </template>

              <template v-else>
                <p class="deposit__no-available-addresses">
                  {{ i18n.dep_no_address() }}
                </p>
              </template>

            </md-card-content>

          </md-card>
        </div>
      </template>
      <template v-else>
        <md-card class="md-layout-item
                        md-size-50
                        md-medium-size-65
                        md-small-size-95
                        md-xsmall-size-100">
          <md-card-content>
            <div class="app__no-data-msg">
              <md-icon class="md-size-4x">file_download</md-icon>
              <h2>{{ i18n.dep_no_assets() }}</h2>
              <p>{{ i18n.dep_no_assets_exp() }}</p>
            </div>
          </md-card-content>
        </md-card>
      </template>
    </template>
  </div>
</template>

<script>
  import SelectFieldCustom from '@/vue/common/fields/SelectFieldCustom'
  import InputField from '../../../common/fields/InputField'
  import Qrcode from 'vue-qrcode-component'
  import ClipboardField from '../../../common/fields/ClipboardField'
  import NotAvailableCard from '../../common/NotAvailableCard'

  import { mapGetters, mapActions } from 'vuex'
  import { vuexTypes } from '../../../../vuex/types'
  import { i18n } from '../../../../js/i18n'
  import { ACCOUNT_TYPES } from '../../../../js/const/xdr.const'

  import { issuanceService } from '../../../../js/services/issuances.service'

  export default {
    name: 'deposit-make',
    components: {
      SelectFieldCustom,
      InputField,
      Qrcode,
      ClipboardField,
      NotAvailableCard
    },
    data: _ => ({
      form: {
        tokenCode: null
      },
      isPending: false,
      ACCOUNT_TYPES,
      i18n
    }),
    computed: {
      ...mapGetters([
        vuexTypes.userAcquiredTokens,
        vuexTypes.accountDepositAddresses,
        vuexTypes.accountTypeI
      ]),
      tokenCodes () {
        return this.userAcquiredTokens
          .filter(token => token.isDepositable)
          .map(token => token.code)
        // .filter(code => Object.keys(this.accountDepositAddresses).includes(code))
      },
      selectedToken () {
        return this.userAcquiredTokens
          .find(token => token.code === this.form.tokenCode) || null
      },
      address () {
        if (!this.selectedToken) return ''
        return this.accountDepositAddresses[this.selectedToken.externalSystemType]
      }
    },
    methods: {
      ...mapActions({
        loadAccount: vuexTypes.GET_ACCOUNT_DETAILS
      }),
      setTokenCode () {
        this.form.tokenCode = this.tokenCodes[0] || null
      },
      async tryBindAddress (token) {
        console.log('trying to bind address, token: ')
        console.log(token)
        if (!token || !token.externalSystemType) {
          return
        }
        this.isPending = true
        try {
          await issuanceService.bindExternalAccount({
            externalSystemType: +token.externalSystemType
          })
          await this.loadAccount()
        } catch (e) {
          console.error(e)
        }
        this.isPending = false
      }
    },
    watch: {
      tokenCodes: {
        handler: 'setTokenCode',
        immediate: true
      },
      selectedToken: {
        handler: 'tryBindAddress',
        immediate: true
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

  .deposit__progress-wrp {
    text-align: center;
  }

  .deposit__asset-select {
    margin-bottom: 16px;
  }
</style>
