<template>
  <p class="detail-row">
    <span class="detail-row__key">{{ prop }}</span>
    <span class="detail-row__value">{{ value }}</span>
  </p>
</template>

<script>
  export default {
    name: 'detail-row',
    props: {
      prop: { type: String, default: '' },
      value: { type: String, default: '' },
      clipboard: { type: Boolean, default: false }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../../scss/variables';

  .detail-row {
    display: flex;
    justify-content: space-between;
    line-height: 1.6rem;
    width: 100%;
  }

  .detail-row__key {
    color: $col-md-unfocused;
  }
</style>
