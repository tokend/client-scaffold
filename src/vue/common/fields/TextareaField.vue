<template>
  <md-field>
    <label :for="id">{{ label }}</label>
    <md-textarea
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :maxlength="maxlength"
      :md-counter="counter"
      :value="value"
      :name="name"
      :id="id"
      @input="onInput"
    />
    <span class="md-error" v-if="errorMessage">{{ errorMessage }}</span>
  </md-field>
</template>

<script>
  import FieldMixin from './field.mixin'

  export default {
    name: 'textarea-field',
    mixins: [FieldMixin],
    props: {
      maxlength: { type: [Number, null], default: null },
      counter: { type: [Number, null], default: null }
    }
  }
</script>

<style scoped>

</style>
