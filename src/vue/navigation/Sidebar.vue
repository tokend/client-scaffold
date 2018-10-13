<template>
  <div class="sidebar">
    <div
      class="sidebar__backdrop"
      :class="{ 'sidebar__backdrop--active': isSidebarOpened }"
      @click="closeSidebar"
    />

    <button
      @click="openSidebar"
      class="sidebar__burger-btn"
      :class="{ 'sidebar__burger-btn--sidebar-active': isSidebarOpened }"
    >
      <md-icon>menu</md-icon>
    </button>

    <div
      class="sidebar__lists"
      :class="{ 'sidebar__lists--closed': !isSidebarOpened }"
    >
      <section class="sidebar__logotype">
        <router-link
          @click.native="closeSidebar"
          to="/dashboard"
        >
          <logotype class="sidebar__logotype-icon" />
        </router-link>
      </section>

      <section class="sidebar__section sidebar__section--account sidebar__list">
        <div class="sidebar__list-title">{{ i18n.sidebar_manage_docs() }}</div>
        <ul>
          <router-link
            v-ripple
            class="sidebar__list-item"
            @click.native="closeSidebar"
            to="/documents/upload"
            tag="li"
            v-if="config.FEATURE_FLAGS.docReferences"
          >
            <md-icon class="sidebar__list-item-icon">file_upload</md-icon>
            <span class="md-list-item-text">
              {{ i18n.sidebar_upload_docs() }}
            </span>
          </router-link>

          <router-link
            v-ripple
            class="sidebar__list-item"
            @click.native="closeSidebar"
            to="/documents/explore"
            tag="li"
            v-if="config.FEATURE_FLAGS.docReferences"
          >
            <md-icon class="sidebar__list-item-icon">list_alt</md-icon>
            <span class="md-list-item-text">
              {{ i18n.sidebar_explore_docs() }}
            </span>
          </router-link>

          <router-link
            v-ripple
            class="sidebar__list-item"
            @click.native="closeSidebar"
            to="/documents/check"
            tag="li"
            v-if="config.FEATURE_FLAGS.docReferences"
          >
            <md-icon class="sidebar__list-item-icon">search</md-icon>
            <span class="md-list-item-text">
              {{ i18n.sidebar_check_docs() }}
            </span>
          </router-link>
        </ul>
      </section>

      <app-footer />
    </div>
  </div>
</template>

<script>
import config from '@/config'

import { mapGetters } from 'vuex'
import { vuexTypes } from '../../vuex/types'
import { i18n } from '@/js/i18n'
import Logotype from '../app/common/Logotype'
import AppFooter from '../navigation/Footer'
import { ACCOUNT_TYPES } from '@/js/const/const'

export default {
  name: 'sidebar',

  components: {
    Logotype,
    AppFooter
  },

  data () {
    return {
      isSidebarOpened: false,
      i18n,
      config,
      ACCOUNT_TYPES
    }
  },

  computed: {
    ...mapGetters([
      vuexTypes.accountTypeI
    ])
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
@import "~@scss/variables";
@import "~@scss/mixins";

.sidebar {
  position: relative;
  background-color: $col-sidebar-background !important;
  box-shadow: inset -10px -10px 20px 0 rgba(0, 0, 0, 0.03);
  min-height: 100%;
}

.sidebar__lists {
  width: $sidebar-width;
  min-height: 100%;
  padding-bottom: 70px;
  z-index: 120;
  list-style: none;

  @include respond-to-custom($sidebar-hide-bp) {
    opacity: 1;
    width: $sidebar-width;
    background-color: $col-sidebar-background-media-small !important;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &.sidebar__lists--closed {
    @include respond-to-custom($sidebar-hide-bp) {
      opacity: 0;
      width: 0;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }
}

.sidebar__backdrop {
  @include respond-to-custom($sidebar-hide-bp) {
    position: fixed;
    left: -100%;
    top: 0;
    z-index: 115;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    opacity: 0;
    transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &.sidebar__backdrop--active {
    left: $sidebar-width;
    opacity: 1;
    transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1) 0.1s;
  }
}

.sidebar__burger-btn {
  position: absolute;
  left: 5px;
  top: 41px;
  z-index: 110;
  width: 40px;
  height: 40px;
  margin-right: 0;
  margin-left: 8px !important;
  border: none;
  outline: none;
  border-radius: 50%;
  background-color: $col-button-flat-txt !important;
  transform: translateX($sidebar-width);
  opacity: 0;
  cursor: pointer;
  transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  @include respond-to-custom($sidebar-hide-bp) {
    opacity: 1;
    transform: translateX(0);
  }

  &.sidebar__burger-btn--sidebar-active {
    transform: translateX($sidebar-width);
  }

  .md-icon {
    color: $col-button-raised-txt !important;
  }
}

.sidebar__list-item {
  display: flex;
  align-items: center;
  min-height: 48px;
  cursor: pointer;
  color: $col-sidebar-text;

  &.router-link-active {
    background-color: $col-sidebar-active-elem-background;
    color: $col-sidebar-active-elem-text;
  }
}

.sidebar__list-title,
.sidebar__list-item,
.sidebar__logotype {
  padding: 0 8px 0 16px;
}

.sidebar__logotype {
  padding-top: 40px;
  padding-bottom: 50px;
}

.sidebar__logotype-icon {
  max-width: 95px;
  width: 100%;
  height: 31px;
  display: block;
}

.sidebar__list-item-icon {
  margin-right: 16px;
  // TODO: remove important rule when possible
  color: $col-sidebar-text !important;

  .router-link-active & {
    color: $col-sidebar-active-elem-text !important;
  }
}

.sidebar__section--account {
  margin-top: 50px;
}

.sidebar__list-title {
  color: $col-sidebar-active-elem-text;
  font-size: 16px;
  margin-bottom: 8px;
}
</style>
