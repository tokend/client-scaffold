<template>
  <div class="error-small flex-row flex-row--justify-between flex-row--align-center">
    <i class="mdi mdi-alert"></i>
    <p class="mobile-hidden">{{ title }}. {{ message }}</p>
  </div>
</template>

<script>
  export default {
    name: 'error-tip',

    props: ['title', 'message']
  }
</script>

<style lang="scss" scoped>
  @import '../../../assets/style/variables';

  .error-small {
    border-radius: 3px;
    color: $col-danger;
    font-size: $fs-tip;
    padding: 10px 30px;
    max-width: 330px;
    width: 300px;

    i {
      color: $col-danger;
      margin-right: 15px;
    }

    @media (max-width: 767px) {
      padding: 0;
      width: auto;

      i {
        margin-right: 0;
      }
    }
  }

</style>
