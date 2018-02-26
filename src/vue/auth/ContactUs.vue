<template>
  <div :class="{'app-content': $store.getters.isLoggedIn }">
    <div class="contact-us">
      <app-navbar :routes="[]" v-if="$store.getters.isLoggedIn"/>

      <div class="contact-us__form material">

        <div class="contact-us__icon">
          <i class="mdi mdi-message-alert"></i>
        </div>

        <div class="contact-us__text">
          <h2>Support</h2>
          <p class="email">
            To contact us, feel free to use the <button class="open-intercom-btn"> Intercom support form</button>
          </p>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
  import AppNavbar from '../navigation/AppNavbar'

  export default {
    name: 'contact-us',
    components: { AppNavbar }
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/style/variables';

  .contact-us {
    /*padding: 50px 100px;*/
    margin: 30px auto 0;
    max-width: 770px;
    width: 100%;
  }

  .contact-us__form {
    display: flex;
    padding: 30px 40px;
  }

  .contact-us__icon {
    margin-right: 30px;
    i {
      font-size: 128px;
    }
  }

  .contact-us__text {
    display: flex;
    flex-direction: column;

    h2 {
      padding-top: 25px;
      margin-bottom: 10px;
    }

    p {
      a {
        color: $col-active;
      }
    }
  }

  $padding: 50px;

  @media (max-width: 767px) {
    $padding: 15px;
  }

  .app-content {
    padding-top: 85px;
    padding-left: $sidebar-width + $padding;
    padding-right: $padding;

    @media (max-width: 1023px) {
      $sidebar-width: $material-icon-big + 80px;
      padding-top: 55px;
      padding-bottom: 45px;
      padding-left: $sidebar-width;
    }

    @media (max-width: 767px) {
      $padding: 0;
      padding-left: $padding;
      padding-right: $padding;
    }
  }

  .open-intercom-btn {
    color: $col-active;
    cursor: pointer;
    text-decoration: underline;
  }

</style>
