<template>
  <md-field>
    <md-select
      :placeholder="placeholder"
      :disabled="disabled"
      :multiple="multiple"
      :required="required"
      :md-dense="dense"
      :value="value"
      :name="name"
      :id="id"
      @change="onInput"
    >
      <md-option v-for="(value, i) in values" :value="value" :key="i">{{ value }}</md-option>
    </md-select>
    <span class="md-error" v-if="errorMessage">{{ errorMessage }}</span>
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
