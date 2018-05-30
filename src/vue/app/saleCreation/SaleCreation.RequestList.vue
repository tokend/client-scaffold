<template>
  <div class="request-list">
    <md-list class="md-triple-line">
      <template v-for="request in list">
        <md-list-item :key="request.name" @click="$emit(commonEvents.saleSelectEvent, request)">
          <md-avatar class="md-avatar-icon">
            <img v-if="request.logoUrl" :src="request.logoUrl" alt="">
            <span v-else>{{ cookUpHeading(request).charAt(0) }}</span>
          </md-avatar>

          <div class="md-list-item-text">
            <span>{{ cookUpHeading(request) }}</span>
            <span>{{ request.name }}</span>
            <span :class="`request-list__request
                           request-list__request--${request.state}`">
              {{ request.state || i18n.sale_in_process_of_creation() }}
            </span>
          </div>
          <md-icon class="md-primary">mode_edit</md-icon>
        </md-list-item>
      </template>
    </md-list>
  </div>
</template>

<script>
  import { commonEvents } from '../../../js/events/common_events'
  import { i18n } from '../../../js/i18n'

  export default {
    name: 'RequestList',
    props: { list: { type: Array, required: true } },
    data: _ => ({
      i18n,
      commonEvents
    }),
    methods: {
      cookUpHeading (request) {
        return request.name
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../scss/variables';

  .request-list__request {
    &--pending  { color: $col-pending !important; }
    &--approved { color: $col-approve !important; }
    &--rejected { color: $col-reject  !important; }
  }
  .request-list {
    .request-list-button {
      align-self: auto !important;
    }
  }
</style>
