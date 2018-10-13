<template>
  <div class="reference-item">
    <div class="reference-item__inner">
      <div class="reference-item__icon-wrp">
        <template v-if="item.mimeType === PDF_MIME">
          <md-icon
            class="reference-item__icon
                   reference-item__icon--pdf
                   md-size-3x">
            picture_as_pdf
          </md-icon>
        </template>
        <template v-else-if="item.mimeType">
          <md-icon
            class="reference-item__icon
                   reference-item__icon--img
                   md-size-3x">
            filter
          </md-icon>
        </template>
        <template v-else>
          <md-icon
            class="reference-item__icon
                   reference-item__icon--err
                   md-size-3x">
            filter_none
          </md-icon>
        </template>
      </div>

      <div class="reference-item__details">
        <p class="reference-item__file-name">{{ item.fileName }}</p>
        <p class="reference-item__doc-type">{{ item.documentType }}</p>
        <p class="reference-item__created-at">{{ item.createdAt }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { i18n } from '../../../js/i18n'

const PDF_MIME = 'application/pdf'

export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data: _ => ({
    i18n,
    PDF_MIME
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
    margin-bottom: 3 * $point;
    margin-right: 3 * $point;
    text-align: center;
    padding: 1 * $point 0;
  }

  .reference-item__icon-wrp {
    height: 10 * $point;
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

  .reference-item__icon--pdf,
  .reference-item__icon--img,
  .reference-item__icon--err {
    color: $col-primary !important;
  }

  .reference-item__icon--img.md-icon.md-size-3x,
  .reference-item__icon--err.md-icon.md-size-3x {
    padding-top: 8px;
    font-size: 64px !important;
    height: 64px !important;
    min-width: 64px !important;
    width: 64px !important;
  }
</style>
