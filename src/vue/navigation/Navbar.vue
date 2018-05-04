<template>
  <nav class="container md-layout md-alignment-center-space-between"
      :class="{ 'container--wide': isLoggedIn }"
  >
    <div class="md-layout-item logo md-title"><logotype/></div>

    <div class="navbar__root-links md-layout-item md-layout md-alignment-center-right" v-if="!isLoggedIn">
      <router-link class="md-button"
                   tag="button"
                 v-if="!isLoggedIn"
                  :to="{ name: 'signup' }"
      >{{ i18n.lbl_signup() }}</router-link>
      <router-link class="md-button md-accent"
                   tag="button"
                  v-if="!isLoggedIn"
                  :to="{ name: 'login' }"
      >{{ i18n.lbl_signin() }}</router-link>
    </div>

    <div class="md-layout md-layout-item md-alignment-center-right" v-else>
      <div class="navbar__notif">
        <md-button class="navbar__open-notif-btn" @click="toggleNotificationCardVisibility">
          <span v-if="!hasSeenNotif && accountType === ACCOUNT_TYPES.notVerified" class="navbar__notif-counter">1</span>
          <md-icon>notifications</md-icon>
        </md-button>
        <md-card class="navbar__notif-card" v-show="isNotificationCardOpen">
          <md-card-content>
            <div class="navbar__notif-card-content">
              <p v-if="accountType === ACCOUNT_TYPES.notVerified" class="navbar__notif-status">Your account functionality is restricted. To get advanced functionality
go to <a class="notif-link" @click="goKyc">KYC</a>.</p>
              <p v-else class="navbar__notif-status">No new notifications!</p>
            </div>
          </md-card-content>
        </md-card>
      </div>
      <div class="navbar__user">
        <md-button class="navbar__open-info-btn" @click="toggleUserCardVisibility">
          <span class="navbar__user-email">{{ userEmail }}</span>
          <md-icon>account_circle</md-icon>
        </md-button>
        <md-card class="navbar__user-card" v-show="isUserCardOpen">
          <md-card-content class="navbar__user-card-ctn">
            <div class="navbar__user-card-content">
              <div class="navbar__user-avatar">
                {{ userEmail.substr(0, 1).toUpperCase() }}
              </div>
              <div class="navbar__user-info">
                <p class="navbar__user-name">{{ userEmail }}</p>
                <p class="navbar__user-status" v-if="!accountBlocked">{{ `${i18n.lbl_account()} ${accountState === 'nil' ? 'not verifed' : accountState }` }}</p>
                <p class="navbar__user-status navbar__user-status-blocked" v-else>{{ i18n.lbl_userBlocked() }}</p>
                <md-button class="md-primary md-raised navbar__user-account-btn" @click="goKyc">
                  {{ i18n.lbl_my_account() }}
                </md-button>
              </div>
            </div>
            <div class="navbar__user-actions md-layout md-alignment-center-space-between">
              <md-button class="navbar__user-action-btn" @click="goSettings">{{ i18n.lbl_settings() }}</md-button>
              <md-button class="navbar__user-action-btn" @click="signOut">{{ i18n.lbl_signout() }}</md-button>
            </div>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </nav>
</template>

<script>
  import { vuexTypes } from '../../vuex/types'
  import { i18n } from '../../js/i18n'
  import { mapActions, mapGetters } from 'vuex'
  import { commonEvents } from '../../js/events/common_events'
  import { attachEventHandler } from '../../js/events/helpers'
  import { vueRoutes } from '../../vue-router/const'
  import { ACCOUNT_TYPES } from '../../js/const/xdr.const'
  import Logotype from '../app/common/Logotype'

  export default {
    name: 'root-navbar',

    components: { Logotype },

    data: () => ({
      routes: [],
      isUserCardOpen: false,
      isNotificationCardOpen: false,
      hasSeenNotif: null,
      i18n,
      ACCOUNT_TYPES
    }),

    computed: {
      ...mapGetters([
        vuexTypes.isLoggedIn,
        vuexTypes.userEmail,
        vuexTypes.userType,
        vuexTypes.accountState,
        vuexTypes.accountType,
        vuexTypes.accountBlocked
      ])
    },

    created () {
      attachEventHandler(commonEvents.routesUpdateEvent, this.updateRoutes)
      this.hasSeenNotif = localStorage.hasOwnProperty('seen')
    },

    methods: {
      ...mapActions([
        vuexTypes.LOG_OUT
      ]),
      updateRoutes (routes) {
        this.routes = routes
      },
      toggleUserCardVisibility () {
        this.isUserCardOpen = !this.isUserCardOpen
        this.isNotificationCardOpen = false
      },

      toggleNotificationCardVisibility () {
        this.isNotificationCardOpen = !this.isNotificationCardOpen
        this.isUserCardOpen = false
        if (!this.hasSeenNotif) {
          localStorage.setItem('seen', 'User saw it')
          this.hasSeenNotif = true
        }
      },
      signOut () {
        this.LOG_OUT()
      },
      goSettings () {
        this.isUserCardOpen = false
        this.$router.push(vueRoutes.settings)
      },
      goKyc () {
        this.isUserCardOpen = false
        this.isNotificationCardOpen = false
        this.$router.push(vueRoutes.verification)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../scss/mixins";
  @import "../../scss/variables";

  nav {
    min-height: 64px;
    padding-left: 0;
    padding-right: 0;
  }

  .navbar {
    width: 100%;
  }

  .navbar__root-links {
    display: flex;
    flex-wrap: nowrap;
  }

  .navbar__notif,
  .navbar__user {
    position: relative;
  }

  .navbar__open-info-btn {
    text-transform: none;
    margin-left: 0;
  }

  .navbar__user-email {
    position: relative;
    margin-right: 1rem;
    top: .1rem;
    @include respond-to(small) {
      display: none;
    }
  }

  .navbar__notif-card,
  .navbar__user-card {
    position: absolute;
    right: 10px;
    top: calc(100% + 14px);
    overflow: visible;
    padding: 24px 24px 0 24px;

    & > .md-card-content {
      padding: 0;
    }

    &:before {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 8px 8px 8px;
      border-color: transparent transparent #ffffff transparent;
      top: -8px;
      right: 4px;
    }

    @include respond-to-custom(800px) {
      width: calc(100vw - 230px - 24px); // 230px - sidebar width
    }

    @include respond-to(small) {
      padding: 16px;
      width: calc(100vw - 24px);
      max-width: 404px;
    }
  }

  .navbar__open-notif-btn {
    position: relative;
    & .navbar__notif-counter {
      position: absolute;
      top: 0;
      right: 0;
      width: 15px;
      height: 15px;
      background-color: #ffa000;
      border-radius: 50%;
      color: #ffffff;
    }
  }

  .navbar__notif-card {
    padding: 0;
    background-color: #fcf6ed;
    width: 404px;
    & .navbar__notif-card-content {
      font-size: 12px;
    }
    &:before {
      border-color: transparent transparent #fcf6ed transparent;
    }
    @include respond-to-custom(800px) {
      width: calc(100vw - 230px - 24px); // 230px - sidebar width
    }

    @include respond-to(small) {
      width: calc(100vw - 24px);
    }
  }

  .navbar__user-card-content {
    display: flex;
    padding-bottom: 21px;
    position: relative;

    @include respond-to(small) {
      flex-direction: column;
      align-items: center;
    }
  }

  .navbar__user-actions {
    position: relative;

    &:after {
      content: '';
      position: absolute;
      height: 1px;
      width: calc(100% + 48px);
      background-color: #e8e8e8;
      left: -24px;
      top: 0;
    }
  }

  .navbar__user-avatar {
    width: 102px;
    height: 102px;
    border-radius: 50%;
    font-size: 48px;
    color: #fff;
    background-color: #ccc;
    margin-right: 27px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;

    @include respond-to(small) {
      margin-right: 0;
      margin-bottom: 12px;
    }
  }

  .navbar__user-name {
    font-size: 16px;
    line-height: 1;
    text-align: left;
    color: #000;
    margin-bottom: 12px;

    @include respond-to-custom(800px) {
      word-break: break-word;
    }
  }

  .navbar__user-status {
    font-size: 12px;
    line-height: 1;
    text-align: left;
    color: rgba(0, 0, 0, .5);
    margin-bottom: 26px;

    @include respond-to(small) {
      text-align: center;
    }
  }

  .navbar__user-account-btn {
    margin: 0;

    @include respond-to(small) {
      display: block;
      margin-right: auto;
      margin-left: auto;

      &:last-child {
        margin-right: auto;
        margin-left: auto;
      }
    }
  }

  .navbar__user-action-btn {
    color: rgba(0, 0, 0, .75) !important;
  }

  .notif-link {
    cursor: pointer;
    text-decoration: underline;
    color: #03a9f4;
  }

  .navbar__user-card-ctn {
    padding: 0 !important;
  }

  .navbar__user-status-blocked {
    color: red;
  }
</style>
