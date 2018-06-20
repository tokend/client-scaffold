<template>
  <div class="searcher-wrapper md-layout md-layout-item md-size-95 md-alignment-center-center">

    <div class="searcher-header">
      <h2 class="searcher-title"> Search crowdfunding campaign </h2>
    </div>

    <div class="searcher__inner md-layout md-gutter md-layout-item md-size-95 md-alignment-top-space-between">

      <div class="searcher__filters md-layout-item">
        <input-field
          v-model="filters.token"
          class="searcher__filter"
          name="token-name"
          title="Token symbol"
          :label="i18n.lbl_token_code()"
        />
      </div>
      <div class="searcher__filters md-layout-item">
        <select-field
          v-model="filters.state"
          class="searcher__filter"
          title="Status"
          :label="i18n.lbl_state()"
          :values="states"
        />
      </div>
      <div class="searcher__filters md-layout-item">
        <select-field
          v-model="filters.sortBy"
          class="searcher__filter"
          title="Sort by"
          :label="i18n.lbl_sort_by()"
          :values="sortTypes"
        />
      </div>
    </div>

  </div>
</template>

<script>
  import InputField from '../../../common/fields/InputField'
  import SelectField from '../../../common/fields/SelectField'
  import { i18n } from '../../../../js/i18n'
  import { commonEvents } from '../../../../js/events/common_events'
  import debounce from 'lodash/debounce'
  import { saleSortTypes, saleStates } from '../../../../js/const/const'

  export default {
    name: 'searcher',

    components: {
      InputField,
      SelectField
    },

    props: [],

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

    methods: {
      debounceSearchEvent () {
        if (!this.eventEmitter) {
          this.eventEmitter = debounce(() => this.$emit(commonEvents.searchInputEvent, this.composeFilters()), 450)
        }
        return this.eventEmitter()
      },
      emitSearchEvent () {
        this.$emit(commonEvents.searchInputEvent, this.composeFilters())
      },
      composeFilters () {
        const filters = {
          token: this.filters.token.toUpperCase(),
          state: Object.values(saleStates).find(state => state.str === this.filters.state),
          sortBy: Object.values(saleSortTypes).find(type => type.str === this.filters.sortBy)
        }
        return filters
      }
    },

    watch: {
      'filters.token': function () { this.debounceSearchEvent() },
      'filters.state': function () { this.emitSearchEvent() },
      'filters.sortBy': function () { this.emitSearchEvent() }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../scss/variables';
  @import '../../../../scss/mixins';

  .searcher-header {
    width: 100%;
  }

  .searcher-title {
    font-weight: 400;
    font-size: 1.5rem;
    font-family: inherit;
    padding: 1.5rem;
  }

  .searcher-wrapper {
    background: $col-content-block;
    box-shadow: 0px 2px 4px 0 rgba(0, 0, 0, 0.08);
    border-radius: 2px;
    margin: 0 auto 1.5rem;
  }

</style>
