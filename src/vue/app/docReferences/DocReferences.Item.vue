<template>
  <div class="reference-item">
    <div class="reference-item__inner">
      <div class="reference-item__doc-icon-wrp">
        <doc-icon :mime-type="item.mimeType" />
      </div>

      <div class="reference-item__details">
        <p class="reference-item__file-name">
          {{ item.firstName }} {{ item.lastName }}
        </p>
        <p class="reference-item__doc-type">{{ item.documentType }}</p>
        <p class="reference-item__created-at">{{ item.createdAt }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import DocIcon from './DocReferences.Icon'
import { i18n } from '../../../js/i18n'

export default {
  components: { DocIcon },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data: _ => ({
    i18n
  })
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

$item-width: 25 * $point;

.reference-item {
  @include box-shadow();

  cursor: pointer;
  background: $col-block-bg;
  max-width: $item-width;
  width: 100%;
  text-align: center;
  padding: 1 * $point 0;
}

.reference-item__doc-icon-wrp {
  margin-bottom: 1.5 * $point;
}

.reference-item__file-name,
.reference-item__doc-type,
.reference-item__created-at {
  max-width: $item-width * 0.75;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: auto;
}

.reference-item__file-name {
  color: $col-text;
}

.reference-item__doc-type,
.reference-item__created-at {
  color: $col-unfocused;
  font-size: 1.2 * $point;
}
</style>
