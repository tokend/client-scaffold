<template>
  <router-view/>
</template>

<script>
  import RouteEntryMixin from '../../common/mixins/route-entry'

  export default {
    name: 'creation-token',
    mixins: [RouteEntryMixin],
    data: _ => ({
      routes: [
        { path: '/creation-token/index', label: 'Creating token' }
      ]
    })
  }
</script>

<style scoped>

</style>
