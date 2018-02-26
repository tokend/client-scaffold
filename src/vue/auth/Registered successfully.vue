<template>
  <div class="">

    <div class="form-block registered-block material">
      <i class="mdi mdi-human-greeting"></i>

      <h2>Welcome to Swarm!</h2>

      <p>You've successfully registered. We will notify you as soon as the app is released.</p>

      <div class="btn-outer">
        <button class="btn" @click="goRoot">Got it</button>
      </div>

    </div>

  </div>
</template>

<script>
  import { vueRoutes } from '../../vue-router/const'

  export default {
    name: 'registered-successfully',

    methods: {
      goRoot () {
        this.$store.dispatch('LOG_OUT')
        this.$router.push(routes.signup)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/style/variables';

  .registered-block {
    max-width: 770px;
    text-align: center;
    i {
      font-size: $material-icon-xx-super-big;
    }

    .check-email {
      margin-bottom: 50px;
    }

    .bad-happens {
      font-size: $fs-tip;
      color: $col-unfocused;
      margin-bottom: 10px;
    }
  }
</style>
