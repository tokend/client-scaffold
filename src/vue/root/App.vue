<template>
  <div id="app">
    <template v-if="isLoggedIn">
      <md-app md-waterfall md-mode="fixed">

        <md-app-toolbar class="md-primary app__sidebar" v-if="isLoggedIn">
          <div class="md-toolbar-row">
            <md-button class="md-icon-button app__sidebar-icon"
                      @click="menuVisible = !menuVisible">
              <md-icon>menu</md-icon>
            </md-button>
            <navbar/>
          </div>
        </md-app-toolbar>

        <md-app-drawer md-permanent="full"
                      :md-active.sync="menuVisible"
                      v-if="isLoggedIn">
          <sidebar @hide-sidebar="hideSidebar"/>
        </md-app-drawer>

        <md-app-content>
          <router-view/>
          <snackbar/>
          <file-viewer/>
          <loader-bar/>
        </md-app-content>

      </md-app>
    </template>
    <template v-else>
      <router-view/>
      <loader-bar/>
      <snackbar/>
    </template>
  </div>
</template>

<script>
  import Navbar from '../navigation/Navbar.vue'
  import Sidebar from '../navigation/Sidebar.vue'
  import Snackbar from '../common/messages/Snackbar'
  import FileViewer from '../common/modals/FileViewer'
  import LoaderBar from '../common/messages/LoaderBar'

  import { vueRoutes } from '../../vue-router/const'

  import { mapGetters, mapActions } from 'vuex'
  import { vuexTypes } from '../../vuex/types'

  import { dispatchAppEvent } from '../../js/events/helpers'
  import { commonEvents } from '../../js/events/common_events'

  import moment from 'moment'

  export default {
    name: 'app',

    components: {
      Navbar,
      Sidebar,
      Snackbar,
      FileViewer,
      LoaderBar
    },

    data: () => ({
      menuVisible: false
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
    },

    methods: {
      ...mapActions({
        loadAccount: vuexTypes.GET_ACCOUNT_DETAILS,
        loadBalances: vuexTypes.GET_ACCOUNT_BALANCES
      }),
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
      },
      hideSidebar (status) {
        this.menuVisible = status
      }
    }
  }
</script>

<style lang="scss">
  @import '../../scss/mixins';
  @import '../../scss/variables';

  .md-app {
    height: 100%;
  }

  .md-app-content {
    padding-top: 40px;
  }

  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }

  .app__sidebar-icon {
    display: none;

    @include respond-to(small) {
      display: initial;
    }
  }

  .app__sidebar {
    @include respond-to(small) {
      background-color: $col-md-background !important;
    }
  }

  .app__sidebar-icon {
    @include respond-to(small) {
      background-color: $col-md-primary;
      margin-right: 0;
      margin-left: 8px !important;
    }
  }

</style>
