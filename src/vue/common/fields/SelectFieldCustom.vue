<template>
  <div class="select">
    <div
      v-if="label"
      class="select__label">
      {{ label }}
    </div>
    <div
      class="select__selected"
      @click="toggleListVisibility()">
      <div class="select__selected-value">{{ selected }}</div>
      <md-icon
        class="select__selected-icon"
        :class="{ 'select__selected-icon--active': showList }">
        keyboard_arrow_down
      </md-icon>
    </div>
    <div
      class="select__list"
      :class="{ 'select__list--active': showList }">
      <template v-for="(value, i) in values">
        <div
          class="select__list-item"
          :key="i"
          :class="{ 'select__list-item--selected': selected === value }"
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
  name: 'select-field-custom',
  props: {
    value: { type: [String, Number, Boolean, Array, Object, Date], default: '' },
    values: { type: Array, default: _ => [] },
    label: { type: String, default: '' }
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
      this.selected = item
      this.$emit(commonEvents.inputEvent, item)
      this.toggleListVisibility()
    },
    toggleListVisibility () {
      this.showList = !this.showList
    }
  }
}
</script>

<style scoped lang="scss">
  @import '../../../scss/variables';

  .select {
    position: relative;
  }

  .select__selected {
    color: $col-md-primary;
    white-space: nowrap;
    font-size: 18px;
    display: flex;
    cursor: pointer;
  }

  .select__selected-icon {
    margin: 0;
    will-change: transform;
    color: $col-md-primary !important;
    transition: .2s ease-out;
    margin-top: -2px;

    &.select__selected-icon--active {
      transform: rotate(-180deg)
    }
  }

  .select__list {
    opacity: 0;
    visibility: hidden;
    transition: .2s ease-out;
    margin-top: -10px;
    position: absolute;
    left: 0;
    min-width: 170px;
    top: calc(100% + 4px);
    background-color: #fff;
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, .15);
    border-radius: 3px;
    z-index: 5;
    max-height: 244px;
    overflow-y: auto;
    padding: 8px 0;
  }

  .select__list--active {
    visibility: visible;
    opacity: 1;
    margin-top: 0;
  }

  .select__list-item {
    padding: 8px 16px;
    font-size: 16px;
    transition: .15s ease-out;
    cursor: pointer;

    &:hover {
      background-color: rgba(58, 65, 128, .1);
    }
  }

  .select__label {
    color: $col-md-primary-inactive;
    font-size: 12px;
  }

  .select__list-item--selected {
    color: $col-md-primary;
  }
</style>
