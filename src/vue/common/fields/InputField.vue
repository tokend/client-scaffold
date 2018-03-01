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
      :counter="counter"
      :required="required"
      :disabled="disabled"
      :maxlength="maxlength"
      :placeholder="placeholder"
      @input="onInput"
      @blur="onBlur"
    />
    <span class="md-error" v-if="errorMessage">{{ errorMessage }}</span>
  </md-field>
</template>

<script>
  import InputMixin from './input.mixin'

  export default {
    name: 'input-field',
    mixins: [InputMixin],
    props: {
      value: { type: [String, Number, Boolean, Array], default: '' },
      label: { type: String, default: '' },
      type: { type: String, default: 'text' },
      placeholder: { type: String, default: '' },
      required: { type: Boolean, default: false },
      id: { type: String, default: '' },
      name: { type: String, default: '' },
      disabled: { type: Boolean, default: false },
      maxlength: { type: [Number, null], default: null },
      counter: { type: [Number, null], default: null }
      // TODO: need handle number properties:
      // step: { type: Number, default: 0.000001 },
      // min: { type: Number, default: 0 },
    }
  }
</script>
