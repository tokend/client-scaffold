<template>
  <div class="empty-timeline-message">

    <i class="empty-timeline-message__icon material-icons">search</i>
    <p v-if="sale.isMy">{{i18n.sale_upd_tab_share_updates()}}</p>
    <p v-else>{{i18n.sale_upd_tab_important_updated()}}</p>

    <div class="btn-outer" v-if="sale.isMy">
      <button class="btn"
              v-if="isAllowedToEdit"
              @click="$emit(common.timelineAddClick)">{{i18n.sale_upd_tab_add_timeline()}}</button>
    </div>

  </div>
</template>

<script>
  import { commonEvents } from '../../../../../../js/events/common_events'
  import { i18n } from '../../../../../../js/i18n'
  export default {
    name: 'empty-UpdatesTimeline-message',

    props: ['sale'],

    data: _ => ({
      i18n,
      common: {
        timelineAddClick: commonEvents.timelineAddClick
      }
    }),

    computed: {
      isAllowedToEdit () {
        return true
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../../../../scss/variables";

  .empty-timeline-message {
    text-align: center;
  }

  .empty-timeline-message__icon {
    font-size: $material-icon-xx-super-big;
  }
</style>
