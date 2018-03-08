<template>
  <div>

    <md-toolbar class="md-transparent" md-elevation="0">TokenD</md-toolbar>

    <md-list>
      <md-list-item to="/dashboard">
        <md-icon>dashboard</md-icon>
        <span class="md-list-item-text">{{ i18n.lbl_dashboard() }}</span>
      </md-list-item>

      <md-list-item to="/deposit">
        <md-icon>file_download</md-icon>
        <span class="md-list-item-text">{{ i18n.lbl_deposit() }}</span>
      </md-list-item>

      <md-list-item to="/dashboard">
        <md-icon>withdraw</md-icon>
        <span class="md-list-item-text">{{ i18n.lbl_withdraw() }}</span>
      </md-list-item>

      <md-list-item to="/dashboard">
        <md-icon>send</md-icon>
        <span class="md-list-item-text">{{ i18n.lbl_send() }}</span>
      </md-list-item>

      <md-list-item to="/history">
        <md-icon>featured_play_list</md-icon>
        <span class="md-list-item-text">{{ i18n.lbl_history() }}</span>
      </md-list-item>

      <md-list-item to="/settings">
        <md-icon>settings</md-icon>
        <span class="md-list-item-text">{{ i18n.lbl_settings() }}</span>
      </md-list-item>

    </md-list>
  </div>
</template>

<script>
  import config from '../.././config'

  import { mapGetters } from 'vuex'
  import { vuexTypes } from '../../vuex/types'
  import { i18n } from '../../js/i18n'

  export default {
    name: 'sidebar',

    data () {
      return {
        isSidebarOpened: false,
        i18n
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
