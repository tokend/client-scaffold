<template>
  <div class="sidebar">
    <md-list>
      <md-list-item @click="closeSidebar" to="/dashboard" v-if="config.FEATURE_FLAGS.dashboard">
        <md-icon>dashboard</md-icon>
        <span class="md-list-item-text">{{ i18n.lbl_dashboard() }}</span>
      </md-list-item>

      <md-list-item @click="closeSidebar" to="/deposit" v-if="config.FEATURE_FLAGS.deposit">
        <md-icon>file_download</md-icon>
        <span class="md-list-item-text">{{ i18n.lbl_deposit() }}</span>
      </md-list-item>

      <md-list-item @click="closeSidebar" to="/withdrawal" v-if="config.FEATURE_FLAGS.withdrawal">
        <md-icon>file_upload</md-icon>
        <span class="md-list-item-text">{{ i18n.lbl_withdraw() }}</span>
      </md-list-item>

      <md-list-item @click="closeSidebar" to="/transfers" v-if="config.FEATURE_FLAGS.transfers">
        <md-icon>send</md-icon>
        <span class="md-list-item-text">{{ i18n.lbl_send() }}</span>
      </md-list-item>

      <md-list-item @click="closeSidebar" to="/tokens" v-if="config.FEATURE_FLAGS.tokens">
        <md-icon>toll</md-icon>
        <span class="md-list-item-text">{{ i18n.lbl_explore_tokens() }}</span>
      </md-list-item>

      <md-list-item @click="closeSidebar" to="/token-creation" v-if="config.FEATURE_FLAGS.tokenCreation">
        <md-icon>add_circle</md-icon>
        <span class="md-list-item-text">{{ i18n.lbl_create_token() }}</span>
      </md-list-item>

      <md-list-item @click="closeSidebar" to="/sale-creation" v-if="config.FEATURE_FLAGS.saleCreation">
        <md-icon>bar_chart</md-icon>
        <span class="md-list-item-text">{{ i18n.lbl_create_sale() }}</span>
      </md-list-item>

      <md-list-item to="/requests" v-if="config.FEATURE_FLAGS.requests">
        <md-icon>import_contacts</md-icon>
        <span class="md-list-item-text">{{ i18n.lbl_requests() }}</span>
      </md-list-item>

      <md-list-item @click="closeSidebar" to="/history" v-if="config.FEATURE_FLAGS.history">
        <md-icon>featured_play_list</md-icon>
        <span class="md-list-item-text">{{ i18n.lbl_history() }}</span>
      </md-list-item>

      <md-list-item @click="closeSidebar" to="/trade" v-if="config.FEATURE_FLAGS.trade">
        <md-icon>compare_arrows</md-icon>
        <span class="md-list-item-text">{{ i18n.lbl_trade() }}</span>
      </md-list-item>

      <md-divider></md-divider>

      <md-list-item to="/verification" v-if="config.FEATURE_FLAGS.verification">
        <md-icon>verified_user</md-icon>
        <span class="md-list-item-text">{{ i18n.lbl_verification() }}</span>
      </md-list-item>

      <md-list-item to="/settings" v-if="config.FEATURE_FLAGS.settings">
        <md-icon>settings</md-icon>
        <span class="md-list-item-text">{{ i18n.lbl_settings() }}</span>
      </md-list-item>

      <!--<md-list-item to="/help">-->
        <!--<md-icon>help</md-icon>-->
        <!--<span class="md-list-item-text">{{ i18n.lbl_help() }}</span>-->
      <!--</md-list-item>-->

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
        i18n,
        config
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
        this.$emit('hide-sidebar', this.isSidebarOpened)
      }
    }
  }
</script>
