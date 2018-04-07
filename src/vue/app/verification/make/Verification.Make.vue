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
      this.loadKycRequests()
    },
    computed: {
      ...mapGetters([
        vuexTypes.userKycSequence
      ])
    },
    methods: {
      ...mapActions({
        loadUser: vuexTypes.GET_USER_DETAILS,
        loadKycRequests: vuexTypes.GET_ACCOUNT_KYC_REQUESTS,
        loadAccountKyc: vuexTypes.GET_ACCOUNT_KYC
      })
    }
  }
</script>

<style scoped>

</style>
