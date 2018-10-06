<template>
  <div id="app">
    <template v-if="isLoggedIn && $route.meta.routeWithFeatures">
      <warning-banner
        v-if="isNotSupportedBrowser"
        :message="i18n.cm_edge_warning()"
      />
      <div class="app__container">
        <sidebar />

        <div class="app__main-content">
          <div class="app__navbar">
            <navbar />
          </div>

          <div class="app__main">
            <router-view />
            <snackbar />
            <file-viewer />
            <loader-bar />
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="!isLoggedIn && $route.meta.routeWithAuth">
      <warning-banner
        v-if="isNotSupportedBrowser"
        :message="i18n.cm_edge_warning()"
      />
      <router-view />
      <loader-bar />
      <snackbar />
    </template>
    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<script>
import Navbar from '../navigation/Navbar.vue'
import Sidebar from '../navigation/Sidebar.vue'
import Snackbar from '../common/messages/Snackbar'
import FileViewer from '../common/modals/FileViewer'
import LoaderBar from '../common/messages/LoaderBar'
import WarningBanner from '@/vue/app/common/WarningBanner'

import { vueRoutes } from '@/vue-router/const'

import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex/types'

import { dispatchAppEvent } from '@/js/events/helpers'
import { commonEvents } from '@/js/events/common_events'
import { i18n } from '@/js/i18n'

import moment from 'moment'

export default {
  name: 'app',

  components: {
    Navbar,
    Sidebar,
    Snackbar,
    FileViewer,
    LoaderBar,
    WarningBanner
  },

  data: () => ({
    isNotSupportedBrowser: false,
    i18n
  }),

  computed: {
    ...mapGetters([
      vuexTypes.userAccountId,
      vuexTypes.isLoggedIn,
      vuexTypes.userEmail
    ]),
    year () {
      return moment().year() // can use in footer, ex: (c) TokenD 2018
    }
  },

  mounted () {
    if (this.isLoggedIn) {
      this.performLoggedInActions()
    } else {
      this.performLoggedOutActions()
    }
  },

  created () {
    window.setTimeout(() => {
      this.$store.commit(vuexTypes.KEEP_SESSION)
    }, 1000)
    this.subscribeToUserLogout()
    this.detectIE()
  },

  methods: {
    ...mapActions({
      loadAccount: vuexTypes.GET_ACCOUNT_DETAILS,
      loadBalances: vuexTypes.GET_ACCOUNT_BALANCES
    }),
    detectIE () {
      const edge = window.navigator.userAgent.indexOf('Edge/')

      if (edge > 0) this.isNotSupportedBrowser = true
    },
    performLoggedInActions () {
      dispatchAppEvent(commonEvents.enterAppEvent)
      this.loadUserData()
    },
    performLoggedOutActions () {
      /**
       * Here can be some conversion tracking logic for site visitors
       */
    },
    loadUserData () {
      this.loadAccount()
      this.loadBalances()
    },
    subscribeToUserLogout () {
      this.$store.subscribe(mutation => {
        switch (mutation.type) {
          case vuexTypes.SET_LOGGED_OUT_STATE:
            this.$router.push(vueRoutes.login)
            break
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import "~@scss/mixins";
@import "~@scss/variables";

.app__container {
  display: flex;
  align-items: stretch;
  overflow-x: hidden;
  flex: 1;
}

.app__main-content {
  flex: 1;
  overflow: hidden;
}

.app__navbar {
  position: relative;
  z-index: 100;
  min-height: 64px;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: space-between;
  transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transition-property: opacity, background-color, box-shadow, transform, color,
    min-height, -webkit-transform;
  will-change: opacity, background-color, box-shadow, transform, color,
    min-height;
}

.app__main {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 4 * $point $content-side-paddings;
  background-color: $col-app-content-background;

  @include respond-to-custom($sidebar-hide-bp) {
    width: 100vw;
    padding: 0 $content-side-paddings-sm;
  }
}
</style>
