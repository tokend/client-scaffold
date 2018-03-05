<template>
  <md-field>
    <md-select
      :multiple="multiple"
      :md-dense="dense"
    >
      <md-option v-for="(value, i) in values" :value="value" :key="i">{{ value }}</md-option>
    </md-select>
  </md-field>
</template>

<script>
  import FieldMixin from './field.mixin'

  export default {
    name: 'select-field',
    mixins: [FieldMixin],
    props: {
      values: { type: Array, default: _ => [] },
      multiple: { type: Boolean, default: false },
      dense: { type: Boolean, default: false }
    }
  }
</script>

<style scoped>

</style>
