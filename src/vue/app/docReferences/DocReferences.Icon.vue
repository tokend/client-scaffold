<template>
  <div class="doc-icon-wrp">
    <template v-if="mimeType === PDF_MIME">
      <md-icon
        :class="`doc-icon
                 doc-icon--pdf
                 md-size-${size}`">
        picture_as_pdf
      </md-icon>
    </template>
    <template v-else-if="mimeType">
      <md-icon
        :class="`doc-icon
                 doc-icon--pdf
                 md-size-${size}`">
        filter
      </md-icon>
    </template>
    <template v-else>
      <md-icon
        :class="`doc-icon
                 doc-icon--pdf
                 md-size-${size}`">
        filter_none
      </md-icon>
    </template>
  </div>
</template>

<script>
const PDF_MIME = 'application/pdf'

export default {
  props: {
    mimeType: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: '3x'
    }
  },
  data: _ => ({
    PDF_MIME
  })
}
</script>

<style lang="scss" scoped>
  @import "~@scss/variables";

  .doc-icon--pdf,
  .doc-icon--img,
  .doc-icon--err {
    color: $col-primary !important;
  }

  .doc-icon--img.md-icon.md-size-3x,
  .doc-icon--err.md-icon.md-size-3x {
    padding-top: 8px;
    font-size: 64px !important;
    height: 64px !important;
    min-width: 64px !important;
    width: 64px !important;
  }
</style>
