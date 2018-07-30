<template>
  <footer class="footer">
    <span class="footer__item footer__text">{{ i18n.auth_copyright() }}</span>
    <span class="footer__links">
      <router-link class="footer__item footer__link" :to="vueRoutes.terms">{{ i18n.auth_terms() }}</router-link>
      <router-link class="footer__item footer__link" :to="vueRoutes.mobileApps">{{ i18n.auth_download_apps() }}</router-link>
    </span>
  </footer>
</template>

<script>
  import { vueRoutes } from '../../vue-router/const'
  import { i18n } from '../../js/i18n'

  export default {
    name: 'Footer',
    data: _ => ({
      vueRoutes,
      i18n
    })
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

  .footer__link:before {
    content: '•';
    color: $col-md-primary;
    margin: 0 .75 * $point;
  }

</style>
