<template>
  <div>

    <md-toolbar class="md-transparent" md-elevation="0">TokenD</md-toolbar>

    <md-list>
      <md-list-item to="/dashboard">
        <md-icon>dashboard</md-icon>
        <span class="md-list-item-text">Dashboard</span>
      </md-list-item>

      <md-list-item to="/dashboard">
        <md-icon>account_balance_wallet</md-icon>
        <span class="md-list-item-text">Wallet</span>
      </md-list-item>

      <md-list-item to="/dashboard">
        <md-icon>work</md-icon>
        <span class="md-list-item-text">Portfolio</span>
      </md-list-item>

      <md-list-item to="/dashboard">
        <md-icon>show_chart</md-icon>
        <span class="md-list-item-text">Invest</span>
      </md-list-item>

      <md-list-item to="/dashboard">
        <md-icon>swap_horiz</md-icon>
        <span class="md-list-item-text">Trade</span>
      </md-list-item>

      <md-divider></md-divider>

      <md-subheader>Syndicate</md-subheader>

      <md-list-item to="/dashboard">
        <md-icon>monetization_on</md-icon>
        <span class="md-list-item-text">Create fund</span>
      </md-list-item>

      <md-list-item to="/dashboard">
        <md-icon>gavel</md-icon>
        <span class="md-list-item-text">My funds</span>
      </md-list-item>

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
