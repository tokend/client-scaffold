<template>
  <div class="overview">
    <template v-if="description">
      <markdown-formatter
        class="description__markdown-formatter"
        :source="description" />
    </template>

    <template v-else>
      <p class="text danger">
        {{ i18n.cm_error_occured() }}
      </p>
    </template>
  </div>
</template>

<script>
import MarkdownFormatter from '../components/DescriptionTab.MarkDownFormatter'
import { i18n } from '../../../../../js/i18n'
export default {
  components: {
    MarkdownFormatter
  },
  props: {
    description: { type: String, default: '' }
  },
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
    color: $col-md-primary;
  }
</style>
