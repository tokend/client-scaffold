<template>
  <div class="assets-select">

    <div class="md-layout">
      <template v-if="pairs.length">
        <select-field
          class="md-layout-item assets-select__select"
          label="Assets"
          :values="pairs"
          v-model="currentAsset"
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
      assets: { type: String, required: false },
      pairs: { type: Array, require: true, default: [] }
    },
    data () {
      return {
        currentAsset: ''
      }
    },
    mounted () {
    },
    computed: {
      computedPropAssets () {
        return this.assets
      }
    },
    watch: {
      'currentAsset' (value) {
        dispatchAppEvent(commonEvents.changePairsAsset, value)
      },
      computedPropAssets (val) {
        this.currentAsset = val
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
