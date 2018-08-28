<template>
  <div class="warning-banner">
    <p class="warning-banner__message">
      {{ message }}
      <router-link class="warning-banner__message-link" :to="{ name: 'supported-browsers' }">Read more</router-link>
    </p>
  </div>
</template>

<script>
  export default {
    name: 'warning-banner',
    props: {
      message: { type: String, required: true }
    }
  }
</script>

<style lang="scss">
  @import '~@scss/variables';

  .warning-banner {
    height: $warning-banner-height;
    padding: 16px 48px;
    background-color: $col-warning;
    font-size: 20px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;

    & > .warning-banner__message > .warning-banner__message-link {
      color: #fff;
      text-decoration: underline;
      font-size: 18px;
      cursor: pointer;

      &:hover {
        color: #fff;
      }
    }
  }

</style>
