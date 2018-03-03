<template>
  <div class="field-outer">
    <div class="field" :class="{ 'field--error': error }">

      <input :type="type" :id="name" :name="name"
             :placeholder="placeholder || ' '"
             :value="value"
             :step="step"
             :min="min"
             :required="required"
             @input="onInput"
             @keypress="onKeypress"
             :disabled="disabled">

      <label> {{ title }} </label>
    </div>
    <div class="error" :class="{ 'error--hidden': !error }">
      {{ error || 'no-err' }}
    </div>
  </div>

</template>

<script>
  import input from './input.mixin'

  export default {
    name: 'input-field',
    mixins: [input]
  }
</script>

<style lang="scss" scoped>
</style>
