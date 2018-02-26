<template>
  <div class="nav-outer">

    <div class="app-navbar material flex-row flex-row--justify-between flex-row--align-center">

      <div class="mobile-hidden flex-row flex-row--align-center">

        <router-link v-for="(route, key) in routes"
                     :to="{ name: route.name }"
                     :key="key"
        >
          <span class="mobile-hidden">{{ route.title }}</span>
          <span class="mobile-only">
          <i :class="`mobile-icon mdi mdi-${route.icon}`"></i>
        </span>
        </router-link>

      </div>

      <user-account-widget></user-account-widget>

      <load-indicator class="load-indicator"/>

    </div>

    <div class="mobile-menu mobile-only material">
      <router-link v-for="(route, key) in routes"
                   :to="{ name: route.name }"
                   :key="key"
      >
        <span class="mobile-hidden">{{ route.title }}</span>
        <span class="mobile-only">
          <i :class="`mobile-icon mdi mdi-${route.icon}`"></i>
        </span>
        <span class="small-title">{{ route.title }}</span>
      </router-link>
    </div>


  </div>

</template>

<script>
  import UserAccountWidget from './UserAccountWidget.vue'
  import LoadIndicator from '../common/LoadIndicator'

  export default {
    name: 'app-navbar',

    components: {
      UserAccountWidget,
      LoadIndicator
    },

    props: {
      routes: {
        type: Array,
        default: []
      }
    },

    data () {
      return {
        // data
      }
    },

    created () {
      // created
    },

    computed: {
      // computed
    },

    methods: {
      openSidebar () {
        this.$store.dispatch('OPEN_SIDEBAR')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/style/variables';
  @import '../../assets/style/helpers/mixins';

  $padding: 50px;
  $height: 50px;
  $menu-icon-size: $material-icon-big;

  .app-navbar {
    height: $height;
    left: 0;
    margin-bottom: 60px;
    padding-left: $sidebar-width + $padding;
    padding-right: $padding;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: $z-secondary-navbar;

    @media (max-width: 1023px) {
      $sidebar-width: $material-icon-big + 80px;
      padding-left: $sidebar-width;
    }

    @media (max-width: 767px) {
      padding-left: $padding + $menu-icon-size;
      padding-right: $menu-icon-size;
      justify-content: flex-end;
    }
  }

  .app-navbar,
  .mobile-menu {
    a {
      color: $col-text;
      display: inline-block;
      margin-right: 40px;
      padding: 15px 0;
      position: relative;
      text-decoration: none;

      &:after {
        @include center-horizontally;

        background: transparent;
        bottom: 0;
        content: '';
        display: block;
        height: 2px;
        position: absolute;
        transition: width .25s ease, background-color .25s ease;
        width: 0;
      }
    }

    .router-link-exact-active {
      &:after {
        background: $col-active;
        width: 100%;
      }
    }

    .small-title {
      font-size: $fs-label;
      color: $col-nav-text;
    }
  }

  .mobile-menu {
    background: $col-primary;
    bottom: 0;
    left: 0;
    position: fixed;
    text-align: center;
    width: 100%;
    z-index: $z-secondary-navbar;

    a {
      margin: 0 15px;
      padding: 5px 8px;
    }

    @media (max-width: 767px) {
      display: flex;
      justify-content: center;
      a {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }

    .mobile-icon {
      font-size: $material-icon-medium;
      color: $col-nav-text;
      width: $material-icon-medium;
      height: $material-icon-medium;
    }
  }
</style>
