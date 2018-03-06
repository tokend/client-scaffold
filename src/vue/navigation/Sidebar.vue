<template>
  <div>

    <md-toolbar class="md-transparent" md-elevation="0">TokenD</md-toolbar>

    <md-list>
      <md-list-item to="/dashboard">
        <md-icon>dashboard</md-icon>
        <span class="md-list-item-text">Dashboard</span>
      </md-list-item>

      <md-list-item to="/wallet">
        <md-icon>file_download</md-icon>
        <span class="md-list-item-text">Deposit</span>
      </md-list-item>

      <md-list-item to="/dashboard">
        <md-icon>withdraw</md-icon>
        <span class="md-list-item-text">Withdraw</span>
      </md-list-item>

      <md-list-item to="/dashboard">
        <md-icon>send</md-icon>
        <span class="md-list-item-text">Send</span>
      </md-list-item>

      <md-list-item to="/dashboard">
        <md-icon>featured_play_list</md-icon>
        <span class="md-list-item-text">History</span>
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
