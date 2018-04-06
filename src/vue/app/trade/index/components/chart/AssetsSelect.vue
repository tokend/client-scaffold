<template>
  <div class="assets-select">

    <div class="md-layout">
      <template v-if="assetPairs.length">
        <select-field
          class="md-layout-item assets-select__select"
          label="Base asset"
          :values="baseAssets"
          v-model="assets.base"
        />

        <select-field
          class="md-layout-item assets-select__select"
          label="Quote asset"
          :values="quoteAssets"
          v-model="assets.quote"
        />
      </template>
    </div>

  </div>
</template>

<script>
  import SelectField from '../../../../../common/fields/SelectField'

  import { mapGetters } from 'vuex'
  import { vuexTypes } from '../../../../../../vuex/types'
  import { dispatchAppEvent } from '../../../../../../js/events/helpers'
  import { commonEvents } from '../../../../../../js/events/common_events'

  export default {
    name: 'assets-select',
    components: { SelectField },
    props: {

    },
    data () {
      return {
        assets: {
          base: '',
          quote: ''
        }
      }
    },
    computed: {
      ...mapGetters([
        vuexTypes.userWalletTokens,
        vuexTypes.assetPairs
      ]),
      tokenCodes () {
        return this.userWalletTokens.map(token => token.code)
      },
      baseAssets () {
        let arr = []
        if (this.assetPairs !== null) {
          for (let el of this.assetPairs) {
            if (!arr.some(item => item === el.base)) {
              arr.push(el.base)
            }
          }
        }
        this.assets.base = arr[0]
        return arr
      },
      quoteAssets () {
        let arr = []
        if (this.assetPairs !== null) {
          for (let el of this.assetPairs) {
            if (this.assets.base === el.base) {
              arr.push(el.quote)
            }
          }
        }
        this.assets.quote = arr[0]
        return arr
      }
    },
    watch: {
      'assets.base' (value) {
        this.assets.quote = this.quoteAssets[0]
        const values = {
          base: value,
          quote: this.assets.quote
        }
        dispatchAppEvent(commonEvents.changePairsAsset, values)
      },
      'assets.quote' (value) {
        const values = {
          base: this.assets.base,
          quote: value
        }
        dispatchAppEvent(commonEvents.changePairsAsset, values)
      }
    }
  }
</script>

<style lang="scss" scoped>

  .assets-select__select {
    width: 70px;
    &:not(:last-child) {
      margin-right: 15px;
    }
  }

</style>
