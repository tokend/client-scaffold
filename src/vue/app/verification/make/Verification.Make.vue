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
      await this.loadUser()
      await this.loadUserKyc(this.userKycSequence)
    },
    computed: {
      ...mapGetters([
        vuexTypes.userKycSequence
      ])
    },
    methods: {
      ...mapActions({
        loadUser: vuexTypes.GET_USER_DETAILS,
        loadUserKyc: vuexTypes.GET_USER_KYC
      })
    }
  }
</script>

<style scoped>

</style>
