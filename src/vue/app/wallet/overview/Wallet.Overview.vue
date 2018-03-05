<template>
  <md-card>
    <md-card-header>
      <div class="md-title">Wallet tokens</div>
    </md-card-header>
    <token-list :tokens="userWalletTokens"/>
  </md-card>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { vuexTypes } from '../../../../vuex/types'
  import TokenList from '../../common/token_list/TokenList'

  export default {
    name: 'wallet-overview',
    components: { TokenList },
    computed: {
      ...mapGetters([
        vuexTypes.userWalletTokens
      ])
    }
  }
</script>

<style scoped>

</style>
