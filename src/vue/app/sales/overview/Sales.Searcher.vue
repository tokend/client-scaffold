<template>
  <div class="searcher-wrapper">
    <div class="searcher-header">
      <h4 class="searcher-title"> Search filters </h4>
    </div>

    <div class="searcher__inner">
      <div class="searcher__filters">
        <input-field-unchained
          v-model="filters.token"
          class="searcher__filter"
          name="token-name"
          title="Token symbol"
          :label="i18n.lbl_token_code()"
        />
      </div>
      <div class="searcher__filters">
        <select-field-unchained
          :values="states"
          class="searcher__filter"
          :title="i18n.lbl_state"
          v-model="filters.state"
          :label="i18n.lbl_state()" />
      </div>
      <div class="searcher__filters">
        <select-field-unchained
          :values="sortTypes"
          class="searcher__filter"
          :title="i18n.lbl_sort_by"
          v-model="filters.sortBy"
          :label="i18n.lbl_state()" />
      </div>
    </div>
  </div>
</template>

<script>
import SelectFieldUnchained from '@/vue/common/fields/SelectFieldUnchained'
import InputFieldUnchained from '@/vue/common/fields/InputFieldUnchained'
import { i18n } from '@/js/i18n'
import { commonEvents } from '@/js/events/common_events'
import debounce from 'lodash/debounce'
import { saleSortTypes, saleStates } from '@/js/const/const'

export default {
  name: 'searcher',
  components: {
    SelectFieldUnchained,
    InputFieldUnchained
  },
  data () {
    return {
      filters: {
        token: '',
        state: saleStates.actual.str,
        sortBy: saleSortTypes.created.str
      },
      eventEmitter: null,
      i18n,
      states: Object.values(saleStates).map(state => state.str),
      sortTypes: Object.values(saleSortTypes).map(type => type.str)
    }
  },

  watch: {
    'filters.token': function () { this.debounceSearchEvent() },
    'filters.state': function () { this.emitSearchEvent() },
    'filters.sortBy': function () { this.emitSearchEvent() }
  },

  methods: {
    debounceSearchEvent () {
      if (!this.eventEmitter) {
        this.eventEmitter = debounce(() =>
          this.$emit(
            commonEvents.searchInputEvent,
            this.composeFilters()
          ), 450
        )
      }
      return this.eventEmitter()
    },
    emitSearchEvent () {
      this.$emit(commonEvents.searchInputEvent, this.composeFilters())
    },
    composeFilters () {
      const filters = {
        token: this.filters.token.toUpperCase(),
        state: Object.values(saleStates).find(state =>
          state.str === this.filters.state
        ),
        sortBy: Object.values(saleSortTypes).find(type =>
          type.str === this.filters.sortBy
        )
      }
      return filters
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~@scss/variables';
  @import '~@scss/mixins';

  .searcher-header {
    width: 100%;
  }

  .searcher__inner {
    display: flex;
  }

  .searcher-title {
    font-weight: bold;
    font-size: 1.4 * $point;
    color: $col-text-page-heading;
    padding: 0;
    opacity: 1;
    margin-bottom: 1 * $point;
  }

  .searcher-wrapper {
    margin: 0 0 1.5rem;
  }

  .searcher__filters {
    width: 100%;
    flex: 1;

    &:not(:first-child) {
      margin-left: 1.5 * $point;
    }
  }
</style>
