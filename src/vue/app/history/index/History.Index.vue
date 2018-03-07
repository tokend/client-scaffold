<template>
  <div class="tx-history">
    tx history
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { vuexTypes } from '../../../../vuex/types'

  export default {
    name: 'history-index',
    data: _ => ({
      tokenCode: 'BTC'
    }),
    created () {
      this.loadList(this.tokenCode)
    },
    computed: {
      ...mapGetters([
        vuexTypes.transactions
      ]),
      list () {
        return this.transactions[this.tokenCode]
      }
    },
    methods: {
      ...mapActions({
        loadList: vuexTypes.GET_TX_LIST
      })
    },
    watch: {
      tokenCode (code) {
        this.loadList(code)
      }
    }
  }
</script>

<style scoped>

</style>
