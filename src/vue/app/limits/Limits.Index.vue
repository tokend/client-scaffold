<template>
  <div class="">Limits</div>
</template>

<script>
  import LimitsRequestsList from './Limits.List'
  import LimitsIndexMixin from './limits-index.mixin'

  export default {
    name: 'LimitsIndex',
    mixins: [LimitsIndexMixin],
    components: { LimitsRequestsList }
  }
</script>
