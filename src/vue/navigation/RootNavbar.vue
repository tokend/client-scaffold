<template>
  <div class="root-navbar">
    <header>

      <div class="container flex-row flex-row--justify-between flex-row--align-center">

        <div class="links flex-row flex-column--justify-end">

          <router-link class="nav-btn signup-btn" v-if="!isLoggedIn"
                       :to="{ name: 'signup' }">
            Sign up
          </router-link>

          <router-link class="nav-btn login-btn" v-if="!isLoggedIn"
                       :to="{ name: 'login' }">
            Sign in
          </router-link>

          <button class="nav-btn" @click="logout" v-else>Log out</button>

        </div>
      </div>

    </header>
  </div>
</template>

<script>
  export default {
    name: 'root-navbar',

    computed: {
      isLoggedIn () {
        return this.$store.getters.isLoggedIn
      }
    },
    methods: {
      logout () {
        this.$store.dispatch('LOG_OUT')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/style/variables.scss';

  header {
    background-color: $col-primary;
    padding: 10px 0;

    .nav-btn {
      cursor: pointer;
      font-size: initial;
      color: $col-nav-text;
      padding: 5px 20px;
      transition: .2s;
      text-decoration: none;

      &:hover {
        border-color: $col-active;
        color: $col-active;
      }
    }

    .signup-btn {
      border: 1px solid $col-nav-text;
      border-radius: 20px;
      margin-right: 10px;
    }
  }
</style>
