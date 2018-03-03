<template>
  <nav class="container md-layout md-alignment-center-space-between" v-if="!isLoggedIn">
    <div class="md-layout-item logo md-title">TokenD</div>

    <div class="navbar__root-links md-layout-item md-layout md-alignment-center-right">
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
  </nav>

  <nav class="md-layout md-alignment-bottom-left" v-else>
    <md-tabs class="md-layout-item md-primary" md-sync-route>
      <md-tab v-for="(route, key) in routes"
              :md-label="route.label"
              :to="route.path"
              :key="key"
      />
    </md-tabs>
  </nav>
</template>

<script>
  import { vuexTypes } from '../../vuex/types'
  import { mapGetters } from 'vuex'
  import { commonEvents } from '../../js/events/common_events'
  import { attachEventHandler } from '../../js/events/helpers'

  export default {
    name: 'root-navbar',

    data: () => ({
      routes: []
    }),

    computed: {
      ...mapGetters([
        vuexTypes.isLoggedIn
      ])
    },

    created () {
      attachEventHandler(commonEvents.routesUpdateEvent, this.updateRoutes)
    },

    methods: {
      updateRoutes (routes) {
        this.routes = routes
      }
    }
  }
</script>

<style scoped>
  nav {
    min-height: 64px;
  }
</style>
