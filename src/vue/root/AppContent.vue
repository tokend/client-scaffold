<template>
  <div class="app-content" :class="{ 'app-content--logged-in': isLoggedIn }">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'app-content',

    computed: {
      isLoggedIn () {
        return this.$store.getters.isLoggedIn
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
