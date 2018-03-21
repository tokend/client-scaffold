<template>
  <div>
    <router-view/>
  </div>
</template>

<script>
  import RouteEntryMixin from '../../common/mixins/route-entry'

  export default {
    name: 'dashboard',
    mixins: [RouteEntryMixin],
    data: _ => ({
      routes: [
        { path: '/dashboard/index', label: 'Dashboard' }
      ]
    })
  }
</script>

<style scoped>

</style>
