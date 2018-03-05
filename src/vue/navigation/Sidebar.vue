<template>
  <div>
    <md-list>
      <router-link :to="{ name: 'app.dashboard' }">
        <md-list-item>
          <md-icon>dashboard</md-icon>
          <span class="md-list-item-text">Dashboard</span>
        </md-list-item>
      </router-link>

      <router-link :to="{ name: 'app.SUN-wallet' }">
        <md-list-item>
          <md-icon>account_balance_wallet</md-icon>
          <span class="md-list-item-text">Wallet</span>
        </md-list-item>
      </router-link>

      <router-link :to="{ name: 'app.portfolio' }">
        <md-list-item>
          <md-icon>work</md-icon>
          <span class="md-list-item-text">Portfolio</span>
        </md-list-item>
      </router-link>

      <router-link :to="{ name: 'app.invest' }">
        <md-list-item>
          <md-icon>show_chart</md-icon>
          <span class="md-list-item-text">Invest</span>
        </md-list-item>
      </router-link>

      <router-link :to="{ name: 'app.trade' }">
        <md-list-item>
          <md-icon>swap_horiz</md-icon>
          <span class="md-list-item-text">Trade</span>
        </md-list-item>
      </router-link>


      <router-link :to="{ name: 'app.create-fund' }">
        <md-list-item>
          <md-icon>monetization_on</md-icon>
          <span class="md-list-item-text">Create fund</span>
        </md-list-item>
      </router-link>

      <router-link :to="{ name: 'app.my-funds' }">
        <md-list-item>
          <md-icon>gavel</md-icon>
          <span class="md-list-item-text">My funds</span>
        </md-list-item>
      </router-link>

    </md-list>
  </div>
</template>

<script>
  import config from '../.././config'

  import { mapGetters } from 'vuex'
  import { vuexTypes } from '../../vuex/types'

  export default {
    name: 'sidebar',

    data () {
      return {
        isSidebarOpened: false
      }
    },

    computed: {
      ...mapGetters([
        vuexTypes.userType,
        vuexTypes.userState
      ]),
      discourseURL () {
        return `${config.DISCOURSE_CLIENT}`
      }
    },

    methods: {
      openSidebar () {
        this.isSidebarOpened = true
      },
      closeSidebar () {
        this.isSidebarOpened = false
      }
    }
  }
</script>
