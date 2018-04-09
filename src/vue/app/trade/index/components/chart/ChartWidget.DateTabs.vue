<template>
  <div class="date-tabs">

    <button class="tab-btn"
            @click="$emit(common.inputEvent, tabs.hour)"
            :class="{ selected: value === tabs.hour }"
            :disabled="isPending"
    >
      <span class="mobile-hidden">{{ i18n.trd_chart_hour() }}</span>
    </button>

    <button class="tab-btn"
            @click="$emit(common.inputEvent, tabs.day)"
            :class="{ selected: value === tabs.day }"
            :disabled="isPending"
    >
      <span class="mobile-hidden">{{ i18n.trd_chart_day() }}</span>
    </button>

    <button class="tab-btn"
            @click="$emit(common.inputEvent, tabs.month)"
            :class="{ selected: value === tabs.month }"
            :disabled="isPending"
    >
      <span class="mobile-hidden">{{ i18n.trd_chart_month() }}</span>
    </button>

    <button class="tab-btn"
            @click="$emit(common.inputEvent, tabs.year)"
            :class="{ selected: value === tabs.year }"
            :disabled="isPending"
    >
      <span class="mobile-hidden">{{ i18n.trd_chart_year() }}</span>
    </button>

  </div>
</template>

<script>
  import { commonEvents } from '../../../../../../js/events/common_events'
  import { i18n } from '../../../../../../js/i18n'

  export default {
    name: 'date-tabs',
    props: ['value', 'isPending'],

    data () {
      return {
        common: {
          inputEvent: commonEvents.inputEvent
        },
        tabs: {
          hour: 'hour',
          day: 'day',
          week: 'week',
          month: 'month',
          year: 'year',
          all: 'all'
        },
        i18n
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../../../../scss/variables";
  @import "../../../../../../scss/mixins";

  .date-tabs {
    border-bottom: 1px solid lighten($col-unfocused, 40%);
    display: flex;
    justify-content: flex-start;
  }

  .tab-btn {
    padding: 8px;
    margin: 0 5px;
    cursor: pointer;
    letter-spacing: 0.005em;
    position: relative;
    text-transform: uppercase;
    background-color: transparent;
    border: none;
    font-size: 14px;

    &:after {
      @include center-horizontally;

      background: transparent;
      bottom: -1px;
      content: '';
      display: block;
      height: 1px;
      position: absolute;
      transition: width .25s ease, background-color .25s ease;
      width: 0;    }

    &.selected {

      &:after {
        background: $col-active;
        width: 100%;
      }
    }
  }
</style>
