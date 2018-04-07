<template>
  <div class="assets-select">

    <div class="md-layout">
      <template v-if="baseAssets.length && quoteAssets.length">
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
          ref="select"
        />
      </template>
    </div>

  </div>
</template>

<script>
  import SelectField from '../../../../../common/fields/SelectField'

  import { dispatchAppEvent } from '../../../../../../js/events/helpers'
  import { commonEvents } from '../../../../../../js/events/common_events'

  export default {
    name: 'assets-select',
    components: { SelectField },
    props: {
      assets: {
        type: Object,
        required: false
      },
      baseAssets: {
        type: Array,
        require: true,
        default: []
      },
      quoteAssets: {
        type: Array,
        require: true,
        default: []
      }
    },
    data () {
      return {
      }
    },
    mounted () {
    },
    computed: {
    },
    watch: {
      'assets.base' (value) {
        this.assets.quote = this.quoteAssets[0]
        dispatchAppEvent(commonEvents.changePairsAsset, this.assets)
      },
      'assets.quote' (value) {
        dispatchAppEvent(commonEvents.changePairsAsset, this.assets)
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
