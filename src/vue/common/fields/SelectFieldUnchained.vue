<template>
  <div class="select-field" :class="{ 'select-field--readonly': readonly }">
    <div v-if="label" class="select-field__label">
      {{ label }}
    </div>
    <div class="select-field__selected" @click="toggleListVisibility()">
      <div class="select-field__selected-value">{{ selected }}</div>
      <md-icon class="select-field__selected-icon" :class="{ 'select-field__selected-icon--active': showList }">
        keyboard_arrow_down
      </md-icon>
    </div>
    <div class="select-field__list" :class="{ 'select-field__list--active': showList }">
      <template v-for="(value, i) in values">
        <div class="select-field__list-item"
             :key="i"
             :class="{ 'select-field__list-item--selected': selected === value }"
             @click="selectItem(value)">
          {{ value }}
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { commonEvents } from '../../../js/events/common_events'

export default {
  name: 'select-field-unchanined',
  props: {
    value: { type: [String, Number, Boolean, Array, Object, Date], default: '' },
    values: { type: Array, default: _ => [] },
    label: { type: String, default: '' },
    readonly: { type: Boolean, default: false }
  },
  data: _ => ({
    selected: '',
    showList: false
  }),
  created () {
    this.selected = this.value
  },
  methods: {
    selectItem (item) {
      if (this.readonly) {
        return null
      }
      this.selected = item
      this.$emit(commonEvents.inputEvent, item)
      this.toggleListVisibility()
    },
    toggleListVisibility () {
      if (this.readonly) {
        return null
      }
      this.showList = !this.showList
    }
  }
}
</script>

<style scoped lang="scss">
@import "./scss/fields-variables";

.select-field {
  width: 100%;
  flex: 1;
  position: relative;
}

.select-field__selected {
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  width: 100%;
  background: none;
  border: none;
  caret-color: $field-color-focused;
  color: $field-color-text;
  padding: $field-input-padding;
  @include material-border($field-color-focused, $field-color-unfocused);
  @include text-font-sizes;
}

.select-field--readonly > .select-field__selected {
  cursor: default;
  @include readonly-material-border($field-color-focused);
}

.select-field__selected-icon {
  margin: 0;
  will-change: transform;
  color: $col-md-primary !important;
  transition: 0.2s ease-out;
  margin-top: -2px;

  &.select-field__selected-icon--active {
    transform: rotate(-180deg);
  }
}

.select-field__list {
  opacity: 0;
  visibility: hidden;
  transition: 0.2s ease-out;
  margin-top: -10px;
  position: absolute;
  left: 0;
  min-width: 170px;
  top: calc(100% + 4px);
  background-color: #fff;
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.15);
  border-radius: 3px;
  z-index: 5;
  max-height: 244px;
  overflow-y: auto;
  padding: 8px 0;
}

.select-field__list--active {
  visibility: visible;
  opacity: 1;
  margin-top: 0;
}

.select-field__list-item {
  padding: 8px 16px;
  font-size: 16px;
  transition: 0.15s ease-out;
  cursor: pointer;

  &:hover {
    background-color: rgba(58, 65, 128, 0.1);
  }
}

.select-field__label {
  position: absolute;
  left: 0;
  top: 0;
  transition: all $field-transition-duration;
  pointer-events: none;
  color: $field-color-unfocused;
  @include label-font-sizes;
}

.select-field__list-item--selected {
  top: $field-input-padding-top;
  @include text-font-sizes;
}
</style>
