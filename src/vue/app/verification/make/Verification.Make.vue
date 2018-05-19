<template>
  <div class="verification">
    <template v-if="accountTypeI === ACCOUNT_TYPES.syndicate">
      <syndicate-banner/>
    </template>
    <template v-else>
      <state-banner/>
      <individual-form/>
    </template>
  </div>
</template>

<script>
  import IndividualForm from './Verification.Individual'
  import StateBanner from './Verification.StateBanner'
  import SyndicateBanner from './Verification.SyndicateBanner'

  import { mapGetters, mapActions } from 'vuex'
  import { vuexTypes } from '../../../../vuex/types'

  import { ACCOUNT_TYPES } from '../../../../js/const/xdr.const'

  export default {
    name: 'verification-make',
    components: {
      IndividualForm,
      SyndicateBanner,
      StateBanner
    },
    data: _ => ({
      ACCOUNT_TYPES
    }),
    async created () {
      await this.reset()
    },
    computed: {
      ...mapGetters([
        vuexTypes.accountLatestBlobId,
        vuexTypes.accountTypeI
      ])
    },
    methods: {
      ...mapActions({
        loadUser: vuexTypes.GET_USER_DETAILS,
        loadKycRequests: vuexTypes.GET_ACCOUNT_KYC_REQUESTS,
        loadKycData: vuexTypes.GET_ACCOUNT_KYC_DATA
      }),
      async reset () {
        await this.loadKycRequests()
        if (!this.accountLatestBlobId) {
          return
        }
        await this.loadKycData(this.accountLatestBlobId)
      }
    }
  }
</script>

<style scoped>

</style>
