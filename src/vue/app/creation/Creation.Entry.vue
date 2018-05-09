<template>
  <router-view/>
</template>

<script>
  import RouteEntryMixin from '../../common/mixins/route-entry'

  export default {
    name: 'tokens',
    mixins: [RouteEntryMixin],
    data: _ => ({
      routes: [
        { path: '/creation/index', label: 'Creating tokens' }
      ]
    })
  }
</script>

<style scoped>

</style>
