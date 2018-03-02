<template>
  <div class="root-navbar container md-layout md-alignment-center-space-between">
    <div class="md-layout-item logo md-title">TokenD</div>

    <div class="root-navbar__links md-layout-item md-layout md-alignment-center-right">
      <router-link tag="button"
                   class="md-button"
                   v-if="!isLoggedIn"
                   :to="{ name: 'signup' }">
        Sign up
      </router-link>
      <router-link tag="button"
                   class="md-button md-accent"
                   v-if="!isLoggedIn"
                   :to="{ name: 'login' }">
        Sign in
      </router-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'root-navbar',

    computed: {
      isLoggedIn () {
        return this.$store.getters.isLoggedIn
      }
    },
    methods: {
      logout () {
        this.$store.dispatch('LOG_OUT')
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
