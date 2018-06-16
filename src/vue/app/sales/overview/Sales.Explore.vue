<template>
  <div class="explore-sales md-layout md-alignment-center-center">
    <searcher
          class="funds-overview__searcher"
          @search-input="loadFilteredSales"
    /> 
    <template v-if="sales.length > 0">
      <div class="md-layout md-gutter md-layout-item md-size-90 md-alignment-center-space-around sales-overview__sale-overview-inner">
        <router-link v-for="sale in sales"
                    :key="sale.id"
                    :to="{name: 'sales.sale-details', params: { id: sale.id }}"
                    tag="div"
                    class="sales-overview__card-wrapper">
          <fund-card class="sales-overview__card" :sale="sale"/>
        </router-link>
      </div>
    </template>
    <template v-if="sales.length && !isSalesLoaded">
      <div class="btn-outer btn-outer--center btn-outer--no-margin"
    >
        <button class="more-btn material material--flat"
                :disabled="isPending"
                @click="loadMore">More</button>
      </div>
    </template>
    <template v-if="sales.length === 0 && isLoaded">
      <div class="sales-overview__no-sales-found-msg md-layout-item md-size-95 md-alignment-center-center">
        <div class="icon">
          <i class="mdi mdi-inbox"></i>
        </div>

        <h2>No funds found</h2>

        <p>Unfortunately, there are no funds matching your criteria.</p>
      </div>
    </template>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { vuexTypes } from '../../../../vuex/types'
  import { i18n } from '../../../../js/i18n'
  import FundCard from '../sale_card/Sales.Fundcard'
  import Searcher from './Sales.Searcher'
  import FormMixin from '../../../common/mixins/form.mixin'
  import { saleSortTypes, saleStates } from '../../../../js/const/const'

  const initialState = saleStates.actual
  const initialSort = saleSortTypes.created

  export default {
    name: 'TokensExplore',
    mixins: [FormMixin],
    components: { FundCard, Searcher },
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
      this.isLoaded = true
      this.loadSales()
      await this.loadFilteredSales()
    },
    computed: {
      ...mapGetters([
        vuexTypes.isSalesLoaded,
        vuexTypes.sales
      ])
    },
    methods: {
      ...mapActions({
        loadSales: vuexTypes.GET_SALES,
        loadNext: vuexTypes.NEXT_SALES
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
      },
      loadMore () {
        this.disable()
        this.next()
        this.enable()
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

    @media (max-width: 767px) {
      justify-content: center;
    }
  }

  .sales-overview__card-wrapper {
    display: block;
    background: $col-content-block;
    box-shadow: 0px 2px 4px 0 rgba(0, 0, 0, 0.08);
    cursor: pointer;
    margin-bottom: 1.5rem;
    font-size: initial;
    text-align: initial;
  }

  .sales-overview__btn {
    color: $col-active;
  }

  .sales-overview__no-sales-found-msg {
    padding: 10px 40px;
    text-align: center;
    background-color: $col-content-block;
    margin: 0 auto;
    .icon {
      margin-bottom: 20px;
      i {
        font-size: $material-icon-xx-super-big;
        line-height: 1;
      }
    }
  }
</style>
