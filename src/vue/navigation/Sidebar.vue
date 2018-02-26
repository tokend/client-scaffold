<template>

  <div class="sidebar-outer">

    <button class="open-sidebar-btn icon-btn mobile-only" @click="openSidebar">
      <i class="mdi mdi-menu"></i>
    </button>

    <div class="cover cover--sidebar mobile-only" v-show="isSidebarOpened" @click="isSidebarOpened = false"></div>

    <transition name="slide">
      <div class="sidebar force-show-on-big-screens" v-show="isSidebarOpened">

        <div class="logo-outer flex-row flex-row--align-center">

          <button class="close-sidebar-btn icon-btn mobile-only" @click="closeSidebar">
            <i class="mdi mdi-backburger"></i>
          </button>

          <router-link class="logo-link" :to="{ name: 'app.dashboard' }">
            TokenD
          </router-link>

        </div>

        <div class="nav-group">
          <router-link class="nav-link" :to="{ name: 'app.dashboard' }" @click.native="closeSidebar">
            <i class="mdi mdi-view-dashboard"></i>
            <span class="tablet-hidden-only">Dashboard</span>
          </router-link>

          <router-link class="nav-link" :to="{ name: 'app.SUN-wallet' }" @click.native="closeSidebar">
            <i class="mdi mdi-wallet"></i>
            <span class="tablet-hidden-only">Wallet</span>
          </router-link>

          <router-link class="nav-link" :to="{ name: 'app.portfolio' }" @click.native="closeSidebar">
            <i class="mdi mdi-briefcase"></i>
            <span class="tablet-hidden-only">Portfolio</span>
          </router-link>

          <router-link class="nav-link" :to="{ name: 'app.invest' }" @click.native="closeSidebar">
            <i class="mdi mdi-chart-line-variant"></i>
            <span class="tablet-hidden-only">Invest</span>
          </router-link>

          <router-link class="nav-link" :to="{ name: 'app.trade' }" @click.native="closeSidebar">
            <i class="mdi mdi-swap-horizontal"></i>
            <span class="tablet-hidden-only">Trade</span>
          </router-link>
        </div>

        <div class="nav-group" v-if="userType === 'syndicate' && userState === 'approved'">
          <div class="nav-heading tablet-hidden-only">Syndicate</div>

          <router-link class="nav-link" :to="{ name: 'app.create-fund' }" @click.native="closeSidebar">
            <i class="mdi mdi-coin"></i>
            <span class="tablet-hidden-only">Create fund</span>
          </router-link>

          <router-link class="nav-link" :to="{ name: 'app.my-funds' }" @click.native="closeSidebar">
            <i class="mdi mdi-gavel"></i>
            <span class="tablet-hidden-only">My funds</span>
          </router-link>
        </div>

        <div class="nav-group settings-group">
          <a :href="discourseURL" class="nav-link">
            <span class="tablet-hidden-only">Discourse</span>

            <i class="mdi mdi-open-in-new"></i>
          </a>

          <router-link class="nav-link" :to="{ name: 'app.settings' }" @click.native="closeSidebar">
            <i class="mdi mdi-settings"></i>
            <span class="tablet-hidden-only">Settings</span>
          </router-link>
        </div>

      </div>
    </transition>

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

<style lang="scss" scoped>
  @import '../../assets/style/variables';
  @import '../../assets/style/helpers/mixins';

  .sidebar {
    background: $col-primary;
    color: $col-nav-text;
    height: 100vh;
    left: 0;
    width: $sidebar-width;
    position: fixed;
    padding: 15px 0;
    top: 0;
    z-index: $z-sidebar;

    &.force-show-on-big-screens {
      @media (min-width: 768px) {
        display: block !important;
      }
    }

    @media (max-width: 1023px) and (min-width: 768px) {
      $sidebar-width: $material-icon-big + 25px;
      width: $sidebar-width;
    }

    .logo-outer {
      margin-bottom: 35px;
      justify-content: center;

      @media (max-width: 767px) {
        justify-content: space-between;
        padding: 15px;
      }
    }

    .close-sidebar-btn i {
      color: $col-nav-text;
      font-size: $material-icon-big;
    }


    .nav-group {
      margin-bottom: 35px;
      padding: 0;

      @media (max-width: 1023px) and (min-width: 768px) {
        padding: 0 5px;
      }
      $padding-left: 20px;

      .nav-heading {
        font-size: $fs-label;
        letter-spacing: 0.13em;
        opacity: .6;
        padding-left: $padding-left;
        margin-bottom: 20px;
        text-transform: uppercase;
      }

      .nav-link {
        $icon-size: 16px;
        color: $col-nav-text;
        display: block;
        line-height: 230%;
        padding-left: $icon-size + $padding-left + 25px;
        position: relative;
        text-decoration: none;
        transition: .1s;

        .mdi {
          @include center-vertically;
          color: $col-nav-text;
          left: $padding-left;
          position: absolute;
        }

        @media(max-width: 1023px) and (min-width: 768px) {
          line-height: 190%;
          padding: 5px;
         .mdi {
           font-size: $material-icon-big;
           position: static;
         }
        }

        &:hover {
          background: darken($col-primary, 3%);
        }

        &.router-link-active {
          background: darken($col-primary, 10%);
        }
      }
    }
  }

  .settings-group {
    bottom: 10px;
    left: 0;
    width: 100%;
    position: absolute;
  }

  .open-sidebar-btn {
    position: fixed;
    left: 10px;
    top: 10px;
    z-index: $z-open-sidebar-btn;
    i {
      font-size: $material-icon-big;
    }
  }

  .alpha {
    bottom: 5px;
    color: $col-nav-text;
    position: relative;
    font-size: $fs-tip;
    letter-spacing: 0.1em;
    opacity: .75;
    text-align: right;
    text-transform: uppercase;
    text-decoration: none;
  }

  .logo-link {
    text-decoration: none;
  }
</style>
