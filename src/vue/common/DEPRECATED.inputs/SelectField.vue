<template>
    <div class="select-field ">
      <div class="field">
        <select
          :type="type" :id="name" :name="name"
          :placeholder="placeholder || ' '"
          :value="value"
          @change="onInput"
          :disabled="disabled"
          required
        >
          <option v-for="value in values" :value="value">{{ value }}</option>

        </select>

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
    name: 'select-field',

    mixins: [input],

    props: {
      values: {
        type: Array,
        default: []
      }
    }
  }
</script>

<style lang="scss">
  @import '../../../assets/style/variables';
  @import '../../../assets/style/helpers/mixins';

  .select-field {

    .dropdown-arrow {
      bottom: 8px;
      position: absolute;
      right: 5px;

      svg path {
        fill: $col-unfocused;
      }
    }

    select:focus ~ .dropdown-arrow {
      svg path {
        fill: $col-active;
      }
    }
  }
</style>
