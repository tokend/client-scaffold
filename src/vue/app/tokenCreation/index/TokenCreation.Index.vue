<template>
  <div class="create-token md-layout md-alignment-center-center">
    <div class="md-layout-item
                    md-size-50
                    md-medium-size-65
                    md-small-size-95
                    md-xsmall-size-100"
         v-if="accountTypeI === ACCOUNT_TYPES.notVerified || accountTypeI !== ACCOUNT_TYPES.syndicate">
      <not-available-card icon='work'
                        :title="i18n.lbl_not_available()"
                        :descr="i18n.lbl_token_not_available_exp()"
                        />
    </div>
    <token-creation-manager v-else :id = "id" :rejectedId = "rejectedId"/>
    </div>
  </div>
</template>

<script>
import TokenCreationManager from './TokenCreation.Manager'
import NotAvailableCard from '../../common/NotAvailableCard'
import { vuexTypes } from '../../../../vuex/types'
import { ACCOUNT_TYPES } from '../../../../js/const/const'
import { i18n } from '../../../../js/i18n'
import { mapGetters } from 'vuex'
export default {
  components: { TokenCreationManager, NotAvailableCard },
  props: ['id', 'rejectedId'],
  data: _ => ({
    i18n,
    ACCOUNT_TYPES
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountTypeI
    ])
  }
}
</script>

<style lang="scss" scoped>
</style>
