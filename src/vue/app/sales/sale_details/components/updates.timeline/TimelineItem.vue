<template>
  <div class="timeline-item">

    <div class="timeline-item__date">{{ date }}</div>

    <h2 class="timeline-item__title">{{ title }}</h2>
    <p class="timeline-item__message" v-html="message"></p>

  </div>
</template>

<script>
  export default {
    name: 'UpdatesTimeline-item',

    props: ['title', 'message', 'date']
  }
</script>

<style lang="scss" scoped>  
  @import "../../../../../../scss/variables";

  .timeline-item__date {
    color: lighten($col-text, 10%);
    font-weight: bold;
    margin-bottom: 15px;
  }

</style>
