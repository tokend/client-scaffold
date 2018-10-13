<template>
  <div>
    <!---->
  </div>
</template>

<script>
import ReferenceLoader from './reference-loader'

export default {
  mixins: [ReferenceLoader],
  props: {
    id: {
      type: String,
      required: true
    }
  },
  async created () {
    await this.loadReference(this.id)
  }
}
</script>

<style lang="scss" scoped>

</style>
