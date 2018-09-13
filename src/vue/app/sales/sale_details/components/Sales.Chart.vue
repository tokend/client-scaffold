<template>
  <div class="sale-chart-container">
    <chart
      :baseAsset="sale.baseAsset"
    />
  </div>
</template>

<script>
  import Chart from '@/vue/app/common/chart/Chart'
  import config from '@/config'

  export default {
    name: 'sales-chart-tab',
    components: {
      Chart
    },
    props: ['sale'],
    data: _ => ({
      config
    })
  }
</script>

<style lang="scss">
</style>
