<template>
  <div class="verification">
    <state-banner/>
    <individual-form/>
  </div>
</template>

<script>
  import IndividualForm from './Verification.Individual'
  import StateBanner from './Verification.StateBanner'

  import { mapGetters, mapActions } from 'vuex'
  import { vuexTypes } from '../../../../vuex/types'

  export default {
    name: 'verification-make',
    components: { IndividualForm, StateBanner },
    async created () {
      await this.reset()
    },
    computed: {
      ...mapGetters([
        vuexTypes.accountLatestBlobId
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
