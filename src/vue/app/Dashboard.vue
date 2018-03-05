<template>
    <router-view/>
</template>

<script>
  import RouteEntryMixin from '../common/mixins/route-entry'

  export default {
    name: 'dashboard',
    mixins: [RouteEntryMixin]
  }
</script>

<style scoped>

</style>
