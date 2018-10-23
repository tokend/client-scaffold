<template>
  <!-- eslint-disable -->
  <router-link
    to="/dashboard"
    class="logotype">
    <img src="/static/blockchain.png" alt="">
  </router-link>
  <!-- eslint-enable -->
</template>

<script>
export default {
  name: 'tokend-logo'
}
</script>

<style scoped>
  .logotype {
    position: relative;
    left: 44px;
    bottom: 10px;
    width: 120px;
  }
</style>
