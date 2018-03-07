<template>
  <p class="detail-row">
    <span class="key">{{ key }}</span>
    <span class="value">{{ value }}</span>
  </p>
</template>

<script>
  export default {
    name: 'detail-row',
    props: {
      key: { type: String, default: '' },
      value: { type: String, default: '' },
      clipboard: { type: Boolean, default: false }
    }
  }
</script>

<style scoped>

</style>
