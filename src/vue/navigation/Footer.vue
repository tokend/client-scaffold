<template>
  <footer
    class="footer"
    :class="{ 'footer--private': isLoggedIn }">
    <span class="footer__links">
      <button
        class="footer__item footer__link"
        :class="{
          'footer__link--selected': locale === 'en'
        }"
        @click="changeLocale('en')"
        :disabled="locale === 'en'"
      >
        EN
      </button>
      <button
        class="footer__item footer__link"
        :class="{
          'footer__link--selected': locale === 'ru'
        }"
        @click="changeLocale('ru')"
        :disabled="locale === 'ru'"
      >
        RU
      </button>
    </span>
  </footer>
</template>

<script>
import { vueRoutes } from '../../vue-router/const'
import { i18n } from '../../js/i18n'
import { mapGetters } from 'vuex'
import { vuexTypes } from '../../vuex/types'

export default {
  name: 'app-footer',
  data: _ => ({
    vueRoutes,
    i18n,
    locale: 'en'
  }),
  computed: {
    ...mapGetters([
      vuexTypes.isLoggedIn
    ])
  },
  created () {
    this.locale = localStorage.getItem('divs-locale') || 'en'
  },
  methods: {
    changeLocale (l) {
      localStorage.setItem('divs-locale', l)
      location.reload()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../scss/variables';
  @import '../../scss/mixins';

  .footer {
    position: absolute;
    display: flex;
    align-items: center;
    flex-wrap: wrap-reverse;
    justify-content: center;
    bottom: 0;
    left: 0;
    width: 100%;
  }

  .footer__text,
  .footer__link {
    line-height: 2.5 * $point;
  }

  .footer__link {
    border: none;
    padding: 1 * $point .5 * $point;
    cursor: pointer;
    color: $col-text;
    background: none;
    font-size: 1.4 * $point;
    $margin: 1 * $point;
    margin: 0 $margin;
    &:not(:first-child) { margin-left: 0 }

    &:hover {
      text-decoration: underline;
    }

    &--selected {
      font-weight: 600;
    }
  }

</style>
