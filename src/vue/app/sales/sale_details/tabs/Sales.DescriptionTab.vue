<template>
  <div class="overview">
    <template v-if="sale.description">
      <markdown-formatter class="description__markdown-formatter"
                          :source="sale.description"/>
    </template>

    <template v-else>
      <p class="text danger">
        {{ i18n.cm_error_occured() }}
      </p>
    </template>
  </div>
</template>

<script>
  import MarkdownFormatter from '../components/MarkDownFormatter'
  import { i18n } from '../../../../../js/i18n'
  export default {
    name: 'description-tab',

    components: {
      MarkdownFormatter
    },
    props: ['sale'],
    data: _ => ({
      i18n
    })
  }
</script>

<style lang="scss" scoped>
  @import '../../../../../scss/variables';
  @import '../../../../../scss/mixins';

  .description__markdown-formatter {
    text-align: justify;
  }
</style>
