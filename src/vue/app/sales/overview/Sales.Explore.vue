<template>
  <div class="explore-sales">
    <searcher
          class="sales-overview__searcher"
          @search-input="loadFilteredSales"
    />
    <template v-if="sales.length > 0">
      <div class="sales-overview__sale-overview-inner">
        <div class="sales-overview__card-wrapper-outer"
          v-for="sale in sales"
          :key="sale.id">
          <router-link :to="{name: 'sales.sale-details', params: { id: sale.id }}"
                      tag="button"
                      class="sales-overview__card-wrapper">
            <sale-card class="sales-overview__card" :sale="sale"/>
          </router-link>
        </div>
      </div>
    </template>
    <template v-if="sales.length === 0 && isLoaded">
      <div class="sales-overview__no-sales-found-msg">
        <div class="icon">
          <i class="mdi mdi-inbox"></i>
        </div>

        <h2>No sales found</h2>

        <p>Unfortunately, there are no sales matching your criteria.</p>
      </div>
    </template>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { vuexTypes } from '../../../../vuex/types'
  import { i18n } from '../../../../js/i18n'
  import SaleCard from '../sale_card/Sales.SaleCard'
  import Searcher from './Sales.Searcher'
  import FormMixin from '../../../common/mixins/form.mixin'
  import { saleSortTypes, saleStates } from '../../../../js/const/const'

  const initialState = saleStates.actual
  const initialSort = saleSortTypes.created

  export default {
    name: 'SalesExplore',
    mixins: [FormMixin],
    components: { SaleCard, Searcher },
    data: _ => ({
      isLoaded: false,
      filters: {
        openOnly: initialState.openOnly,
        upcoming: initialState.upcoming,
        sortBy: initialSort.num,
        order: initialSort.order,
        baseAsset: ''
      },
      i18n
    }),
    async created () {
      await this.loadFilteredSales()
      this.isLoaded = true
    },
    computed: {
      ...mapGetters([
        vuexTypes.sales
      ])
    },
    methods: {
      ...mapActions({
        loadSales: vuexTypes.GET_SALES
      }),
      loadFilteredSales (filters) {
        if (filters) {
          this.filters.openOnly = filters.state.openOnly
          this.filters.upcoming = filters.state.upcoming
          this.filters.sortBy = filters.sortBy.num
          this.filters.order = filters.sortBy.order
          this.filters.baseAsset = filters.token
        }
        return this.loadSales(this.filters)
      }
    },
    watch: {
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../scss/variables';
  @import '../../../../scss/mixins';

  .explore-sales {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    margin: auto;
  }

  .sales-overview__sale-overview-inner {
    margin: 0 auto;
    margin: -1.2 * $point;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: flex-start;
  }

  .sales-overview__card-wrapper-outer {
    padding: 1.2 * $point;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;

    flex: 0.333;
    min-width: 33.333%;
    max-width: 33.333%;

    @include respond-to(xmedium) {
      flex: 0.5;
      min-width: 49.999%;
      max-width: 50%;
    }

    @media only screen and (max-width: 767px) {
      flex: 1;
      min-width: 100%;
    }
  }

  .sales-overview__card-wrapper {
    display: block;
    background: $col-block;
    box-shadow: 0px 2px 4px 0 rgba(0, 0, 0, 0.08);
    border: none;
    flex: 1;
    cursor: pointer;
    font-size: initial;
    text-align: initial;
    width: 100%;
  }

  .sales-overview__btn {
    color: $col-text-accented;
  }

  .sales-overview__no-sales-found-msg {
    padding: 10px 40px;
    text-align: center;
    margin: 0 auto;

    .icon {
      margin-bottom: 20px;

      i {
        font-size: $size-icon-super-big;
        line-height: 1;
      }
    }
  }
</style>
