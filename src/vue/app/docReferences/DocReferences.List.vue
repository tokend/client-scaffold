<template>
  <div class="reference-list">
    <div class="reference-list__inner">
      <template v-for="item in list.slice().reverse()">
        <router-link
          class="reference-list__item-link"
          :key="item.reference"
          :to="{ name: 'documents.view', params: { id: item.reference } }"
        >
          <reference-item :item="item" />
        </router-link>
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

$item-width: 25 * $point;

.reference-list__item-link {
  display: block;
  margin-bottom: 3 * $point;
  margin-right: 3 * $point;
  text-decoration: none;
  max-width: $item-width;
  width: 100%;

  &:hover {
    text-decoration: none;
  }
}
</style>
