<template>
  <div class="md-layout md-alignment-center-center">
    <div class="md-layout-item
              md-size-50
              md-medium-size-65
              md-small-size-95
              md-xsmall-size-100">
      <template v-if=" accountTypeI !== ACCOUNT_TYPES.syndicate">
        <not-available-card icon='work'
                            :title="i18n.lbl_not_available()"
                            :descr="i18n.sale_not_available_exp()"/>
      </template>
      <template v-else-if="!accountOwnedTokens.length">
        <not-available-card icon='work'
                            :title="i18n.lbl_not_available()"
                            :descr="i18n.lbl_token_not_available_yet()"/>
      </template>
      <template v-else>
        <preissuance-upload-manager/>
      </template>
    </div>
  </div>
</template>

<script>
  import PreissuanceUploadManager from './PreissuanceUpload.Manager'
  import NotAvailableCard from '../../common/NotAvailableCard'

  import { vuexTypes } from '../../../../vuex/types'
  import { mapGetters } from 'vuex'
  import { i18n } from '../../../../js/i18n'

  import { ACCOUNT_TYPES } from '../../../../js/const/const'

  export default {
    components: {
      PreissuanceUploadManager,
      NotAvailableCard
    },
    data: _ => ({
      i18n,
      ACCOUNT_TYPES
    }),
    computed: {
      ...mapGetters([
        vuexTypes.accountTypeI,
        vuexTypes.accountOwnedTokens
      ])
    }
  }
</script>

<style lang="scss" scoped>

</style>
