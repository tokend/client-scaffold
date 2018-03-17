<template>
  <md-field
    :class="fieldClass"
    :inline="inline"
    :clearable="clearable"
    :togglePassword="togglePassword"
  >
    <label :for="id">{{ label }}</label>
    <md-input
      :id="id"
      :type="type"
      :name="name"
      :value="value"
      :counter="counter"
      :required="required"
      :disabled="disabled"
      :maxlength="maxlength"
      :placeholder="placeholder"
      :readonly="readonly"
      :class="'text-align-' + align"
      @input="onInput"
      @blur="onBlur"
    />
    <span class="md-error" v-if="errorMessage">{{ errorMessage }}</span>
  </md-field>
</template>

<script>
  import FieldMixin from './field.mixin'

  export default {
    name: 'input-field',
    mixins: [FieldMixin],
    props: {
      type: { type: String, default: 'text' },
      maxlength: { type: [Number, null], default: null },
      counter: { type: [Number, null], default: null },
      readonly: { type: Boolean, default: false },
      align: { type: String, default: 'left' }
      // TODO: need handle number properties:
      // step: { type: Number, default: 0.000001 },
      // min: { type: Number, default: 0 },
    }
  }
</script>
