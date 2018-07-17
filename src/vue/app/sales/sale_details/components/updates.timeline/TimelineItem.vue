<template>
  <div class="timeline-item">
    <h3 class="timeline-item__title">{{ title }}</h3>
    <span class="timeline-item__date" >{{ date }}</span>
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
  }
  
  .timeline-item__title {
    margin-bottom: 0.75rem;
  }

  .timeline-item {
    margin-bottom: 2rem;
  }

</style>
