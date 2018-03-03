<template>
    <router-view/>
</template>

<script>
  import { dispatchAppEvent } from '../../js/events/helpers'
  import { commonEvents } from '../../js/events/common_events'

  export default {
    name: 'dashboard',

    data: () => ({
      routes: [
        { name: 'dashboard.p1', path: '/dashboard/1', label: 'dash 1' },
        { name: 'dashboard.p2', path: '/dashboard/2', label: 'dash 2' }
      ]
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
