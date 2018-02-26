<template>
  <div id="app">

    <root-navbar v-if="!isLoggedIn"/>
    <sidebar v-if="isLoggedIn"/>

    <router-view/>

  </div>
</template>

<script>
  import RootNavbar from '../navigation/RootNavbar.vue'
  import Sidebar from '../navigation/Sidebar.vue'

  import { vueRoutes } from '../../vue-router/const'

  import { mapGetters, mapActions } from 'vuex'
  import { vuexTypes } from '../../vuex/types'

  import { dispatchEvent } from '../../js/events/helpers'
  import { commonEvents } from '../../js/events/common_events'

  import moment from 'moment'

  export default {
    name: 'app',

    components: { RootNavbar, Sidebar },

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
        loadBalances: vuexTypes.GET_BALANCES
      }),
      performLoggedInActions () {
        dispatchEvent(commonEvents.enterAppEvent)
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

</style>
