<template>
    <router-view/>
</template>

<script>
  import { dispatchAppEvent } from '../../js/events/helpers'
  import { commonEvents } from '../../js/events/common_events'

  export default {
    name: 'dashboard',

    data: () => ({
      routes: []
    }),

    created () {
      dispatchAppEvent(commonEvents.routesUpdateEvent, this.routes)
    },

    updated () {
      dispatchAppEvent(commonEvents.routesUpdateEvent, this.routes)
    }
  }
</script>

<style scoped>

</style>
