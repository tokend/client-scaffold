<template>
  <div class="sale-details" v-if="this.sale && this.token">
    <div class="sale-details__header">
      <div class="sale-details__name-wrapper">
        <a class="back-btn"
                   @click="goBack">
          <i class="mdi mdi-arrow-left"></i>
        </a>
        <div class="sale-details__header-item">
          <span class="sale-details__name">{{ sale.name }} ({{ sale.baseAsset }})</span>
          <span class="sale-details__owner"> {{ i18n.sale_by_owner({ owner: sale.syndicateEmail }) }}</span>
        </div>
      </div>
      <p class="sale-details__description">{{ sale.shortDescription }}</p>
    </div>
    <div class="sale-details__content">
      <div class="sale-details__banner">
        <img class="sale-details__banner-image" 
             :src="sale.image" 
             alt="">
      </div>
      <div class="sale-details__information">
        <div class="sale-details__information-item">
          <h2 class="information-item__title">{{ i18n.lbl_information() }}</h2>
          <invest-progress-bar :sale="sale" :barHeight="'1.2rem'"/>
        </div>
        <div class="sale-details__information-item">
          <sale-invest :sale="sale"
                       @invest-in-sale="loadDetails" />
        </div>
      </div>
    </div>
    <div class="sale-details__content sale-details__main-info">
      <sale-tabs class="sale-details__tabs" :sale="sale"/>
      <div class="sale-details__information">
          <sale-token class="sale-details__information-item" :sale="sale" :token="token" />
      </div>
    </div>
  </div>
</template>

<script>
  // import { mapGetters, mapActions } from 'vuex'
  import { salesService } from '../../../../js/services/sales.service'
  import { tokensService } from '../../../../js/services/tokens.service'
  import { SaleRecord } from '../../../../js/records/sale.record'
  import { TokenRecord } from '../../../../js/records/token.record'
  import { i18n } from '../../../../js/i18n'

  import SaleToken from './components/Sales.Token'
  import SaleInvest from './components/Sales.Invest'
  import SaleTabs from './Sales.Tabs'
  import InvestProgressBar from '../sale_card/Sales.ProgressBar'

  export default {
    name: 'sale-details',
    props: ['id'],
    components: {
      SaleInvest,
      InvestProgressBar,
      SaleTabs,
      SaleToken },

    data: _ => ({
      sale: '',
      token: '',
      i18n
    }),

    async created () {
      if (this.id) {
        await this.loadDetails()
      }
    },

    methods: {
      goBack () {
        this.$router.push({ name: 'sales.explore' })
      },
      async loadDetails () {
        this.sale = new SaleRecord(await salesService.loadSaleById(this.id))
        this.token = new TokenRecord(await tokensService.loadTokenByCode(this.sale.baseAsset))
        await Promise.all([
          this.sale.loadDescriptionIfExists(),
          this.sale.loadSyndicateDetails()
        ])
      }
    },

    watch: {
    }
  }
</script>

<style lang="scss">
  @import '../../../../scss/variables';
  @import '../../../../scss/mixins';
  $ratio_16: 370px;
  $ratio_9: $ratio_16 * (9/16);
  
  .sale-details {
    padding: 24px;
    background: $col-content-block;
    border-radius: 2px;
    box-shadow: 0px 2px 4px 0 rgba(0, 0, 0, 0.08);
  }

  .sale-details__header-item {
    display: flex;
    flex-wrap: wrap;
  }

  .sale-details__content {
    display: flex;
    justify-content: space-between;
    margin-bottom: 24px;
    flex-wrap: wrap;
    @include respond-to(large) {
      flex-direction: column;
    }
    .sale-details__banner,
    .sale-details__tabs {
      width: 60%;
      @include respond-to(large) {
        width: 100%;
      }
    }

    .sale-details__banner-image {
      width: $ratio_16;
      height: $ratio_9;
      min-width: 100%;
      min-height: 100%;
      vertical-align: middle;
    }
    
    .sale-details__information {
      width: 38%;
      border-top: 2px solid $col-active;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      flex-wrap: wrap;
      justify-content: space-between;
      .sale-details__information-item {
        width: 100%;
      }
      @include respond-to(large) {
        width: 100%;
        flex-direction: row;
        .sale-details__information-item {
          width: 45%;
        }
      }
      @include respond-to(small) {
        .sale-details__information-item {
          width: 100%;
        }
      }
    }
  }

  .sale-details__main-info {
    @include respond-to(large) {
      flex-direction: column-reverse;
    }
  }

  .sale-details__name-wrapper {
    display: flex;
    font-size: 24px;
    margin-bottom: 24px;
    .sale-details__name {
      font-weight: bold;
    }
    .sale-details__owner {
      font-size: 75%;
      margin-left: 1rem;
      @include respond-to(small) {
        margin-left: 0;
        margin-top: 1rem;
    }
    }
  }

 .sale-details__description {
    font-size: 16px;
    margin-bottom: 48px;
  }

 .back-btn {
    margin: 0;
    margin-right: 24px;
    min-width: 0;
    border-radius: 50%;
    cursor: pointer;
    i {
     font-size: $material-icon-medium;
    }
  }

  .information-item__title {
    margin-top: 24px;
    margin-bottom: 48px;
  }
</style>
