<template>
  <div class="date-field-flatpickr">
    <label
      class="date-field-flatpickr__label"
      :class="{ 'date-field-flatpickr__label--unfocus': !value }"> {{ label }}</label>

    <div class="date-field-flatpickr__field">
      <flat-pickr
        :id="id"
        class="date-field-flatpickr__input"
        :class="{ 'date-field-flatpickr__input--disabled': disabled }"
        :config="config"
        :value="value"
        :disabled="disabled"
        @input.native="dateFieldUpdated" />
    </div>

    <div
      class="date-field-flatpickr__err-mes"
      v-if="errorMessage">
      {{ errorMessage }}
    </div>
  </div>

</template>

<script>
import FlatPickr from 'vue-flatpickr-component'
import moment from 'moment'
import field from './field.mixin'

export default {
  name: 'date-field-flatpickr',

  components: {
    FlatPickr
  },

  mixins: [field],

  props: {
    enableTime: { type: Boolean, default: true },
    disableBefore: { type: String, default: '' },
    disableAfter: { type: String, default: '' },
    label: { type: String, default: '' }
  },

  data () {
    return {
      date: ''
    }
  },
  computed: {
    config () {
      return {
        altInput: true,
        altFormat: this.enableTime ? 'F j, Y at H:i' : 'F j, Y',
        disableMobile: true,
        disable: [
          (date) => {
            if (!this.disableBefore) return false
            const stamp = moment(this.disableBefore)
            return moment(date).isBefore(stamp)
          },
          (date) => {
            if (!this.disableAfter) return false
            const stamp = moment(this.disableAfter)
            return moment(date).isAfter(stamp)
          }
        ],
        enableTime: this.enableTime,
        time_24hr: true
      }
    }
  },
  methods: {
    dateFieldUpdated (event) {
      this.onInput(event.target.value)
    }
  }
}
</script>

<style lang="scss">
  @import "./scss/fields-variables";

  .date-field-flatpickr {
    position: relative;
    width: 100%;
    flex: 1;
  }

  .date-field-flatpickr__input {
    width: 100%;
    background-color: transparent;
    border: none;
    caret-color: $field-color-focused;
    color: $field-color-text;
    padding: $field-input-padding;

    @include material-border($field-color-focused, $field-color-unfocused);
    @include text-font-sizes;
  }

  .date-field-flatpickr__input--disabled {
    cursor: default;
    filter: grayscale(100%);
    -webkit-text-fill-color: $field-color-unfocused;
    color: $field-color-unfocused;

    & ~ .input-field__label {
      filter: grayscale(100%);
    }
  }

  .date-field-flatpickr__label {
    position: absolute;
    left: 0;
    top: 0;
    transition: all $field-transition-duration;
    pointer-events: none;
    color: $field-color-unfocused;
    @include label-font-sizes;
  }

  .date-field-flatpickr__label {
    position: absolute;
    left: 0;
    top: 0;
    transition: all $field-transition-duration;
    pointer-events: none;
    color: $field-color-unfocused;
    @include label-font-sizes;
  }

  .date-field-flatpickr__label--unfocus {
    top: $field-input-padding-top;
    @include text-font-sizes;
  }

  .date-field-flatpickr__err-mes {
    color: $field-color-error;
    margin-top: $field-error-margin-top;
    font-size: $field-error-font-size;
    line-height: $field-error-line-height;
  }

</style>
