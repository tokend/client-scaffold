<template>
  <md-field class="textarea-field">
    <label class="textarea-field__label" :for="id" v-if="label">{{ label }}</label>
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
      class="textarea-field__textarea"
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

<style scoped lang="scss">
  @import '~@scss/variables.scss';
  @import './scss/fields-variables.scss';

  .textarea-field:after {
    border-color: $col-md-primary !important;
  }

  .textarea-field__label {
    @include text-font-sizes;
    color: $field-color-unfocused !important;
  }

  .textarea-field.md-focused > .textarea-field__label,
  .textarea-field.md-has-value > .textarea-field__label {
    @include label-font-sizes;
    color: $field-color-focused !important;
  }

  .textarea-field__textarea {
    @include text-font-sizes;
    color: $col-md-primary !important;
    -webkit-text-fill-color: $col-md-primary !important;
  }
</style>
