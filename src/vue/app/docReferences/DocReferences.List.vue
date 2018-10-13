<template>
  <div class="reference-list">
    <div class="reference-list__inner">
      <template v-for="item in list.slice().reverse()">
        <reference-item :item="item" :key="item.reference" />
      </template>
    </div>
  </div>
</template>

<script>
import ReferenceItem from './DocReferences.Item'

export default {
  components: {
    ReferenceItem
  },
  props: {
    list: {
      type: Array,
      default: _ => []
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";

.reference-list__inner {
  display: flex;
  flex-wrap: wrap;
  max-width: 100 * $point;
}
</style>
