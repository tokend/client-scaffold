<template>
  <div class="verification">
    <individual-form/>
  </div>
</template>

<script>
  import IndividualForm from './Verification.Individual'
  import { mapGetters, mapActions } from 'vuex'
  import { vuexTypes } from '../../../../vuex/types'

  export default {
    name: 'verification-make',
    components: { IndividualForm },
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
