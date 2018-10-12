<template>
  <nav class="navbar">
    <h2 class="navbar__title">{{ $route.meta.pageName }}</h2>
  </nav>
</template>

<script>
import { vuexTypes } from '@/vuex/types'
import { i18n } from '@/js/i18n'
import { mapActions, mapGetters } from 'vuex'
import { commonEvents } from '@/js/events/common_events'
import { attachEventHandler } from '@/js/events/helpers'
import { vueRoutes } from '@/vue-router/const'
import { ACCOUNT_TYPES } from '@/js/const/xdr.const'
import { closeElement } from '@/js/helpers/closeElement'

export default {
  name: 'root-navbar',

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
      vuexTypes.accountTypeI,
      vuexTypes.accountBlocked
    ])
  },
  watch: {
    isUserCardOpen (value) {
      closeElement('navbar__user-card', value, this.toggleUserCardVisibility)
    },
    isNotificationCardOpen (value) {
      closeElement(
        'navbar__user-notif',
        value,
        this.toggleNotificationCardVisibility
      )
    }
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
@import "~@scss/mixins";
@import "~@scss/variables";

$custom-breakpoint: 800px;

.navbar {
  width: 100%;
  min-height: 121px;
  background-color: $col-navbar-background;
  padding: 0 $content-side-paddings;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @include respond-to-custom($sidebar-hide-bp) {
    padding: 0 $content-side-paddings-sm 0 $content-side-paddings-sm + 5.2 *
      $point;
  }
}

.navbar__user-info {
  @include respond-to-custom($custom-breakpoint) {
    display: none;
  }
}

.navbar__title {
  color: $col-text-page-heading;
}

.navbar__user {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar__user-picture {
  width: 55px;
  height: 55px;
  font-size: 24px;
  box-shadow: 0 4px 10px 0 $col-avatar-instead-bg;
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: $col-avatar-instead-bg;
  color: $col-avatar-instead-text;

  @include respond-to-custom($custom-breakpoint) {
    margin-right: 0;
  }
}

.navbar__user-action {
  @include button-flat();
}

.navbar__user-name,
.navbar__user-name-icon {
  font-size: 18px;
  cursor: pointer;
  // TODO: remove important rule when possible
  color: $col-text-field-hint !important;
}

.navbar__user-name:hover > .navbar__user-email {
  text-decoration: underline;
}

.navbar__account-type {
  color: $col-text-field-hint;
  font-size: 12px;
}

.navbar__user-name-icon {
  transition: 0.3s ease-out;
  will-change: transform;

  &.navbar__user-name-icon--active {
    transform: rotate(-180deg);
  }
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

.navbar__user-card {
  position: absolute;
  right: 0;
  top: calc(100% + 14px);
  overflow: visible;
  visibility: hidden;
  opacity: 0;
  margin-top: -15px;
  transition: 0.3s ease-out;

  & > .md-card-content {
    padding: 0;
  }

  &:before {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 8px 8px 8px;
    border-color: transparent transparent #ffffff transparent;
    top: -8px;
    right: 4px;
  }
}

.navbar__user-card {
  padding: 24px 24px 0 24px;

  @include respond-to-custom($custom-breakpoint) {
    width: calc(100vw - 230px - 40px); // 230px - sidebar width
  }
  @include respond-to(small) {
    padding: 16px;
    width: calc(100vw - 16px);
    max-width: 404px;
  }
  @include respond-to(xsmall) {
    width: calc(100vw - 32px);
  }

  &:before {
    @include respond-to-custom($custom-breakpoint) {
      right: 19px;
    }
  }
}

.navbar__user-card--active {
  visibility: visible;
  opacity: 1;
  margin-top: 0;
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
  padding: 8px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:after {
    content: "";
    position: absolute;
    height: 1px;
    width: calc(100% + 48px);
    background-color: $col-navbar-background;
    left: -24px;
    top: 0;
  }
}

.navbar__user-avatar {
  width: 102px;
  height: 102px;
  border-radius: 50%;
  font-size: 48px;
  color: $col-navbar-avatar-color;
  background-color: $col-navbar-avatar-background;
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

.navbar__user-card-name {
  font-size: 16px;
  line-height: 1;
  text-align: left;
  color: $col-text-field-hint;
  margin-top: 4px;
  margin-bottom: 4px;
  white-space: nowrap;

  @include respond-to-custom($custom-breakpoint) {
    word-break: break-word;
  }
}

.navbar__user-card-status {
  font-size: 12px;
  line-height: 1;
  text-align: left;
  color: $col-text-field-hint;

  @include respond-to(small) {
    text-align: center;
  }
}

.navbar__user-card-account-btn {
  margin: 26px 0 0 0;
  white-space: nowrap;

  @include button-raised();

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
  color: rgba(0, 0, 0, 0.75) !important;
}

.navbar__user-card-ctn {
  padding: 0 !important;
}

.navbar__user-card-status--blocked {
  color: red;
}
</style>
