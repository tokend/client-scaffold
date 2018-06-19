<template>
  <div class="sale-details" v-if="this.sale && this.token">
    <div class="sale-details__header">
      <div class="sale-details__name-wrapper">
        <router-link to='/sales/explore' class="back-btn">
          <i class="material-icons">arrow_back</i>
        </router-link>
        <div class="sale-details__header-item">
          <span class="sale-details__name">{{ sale.name }} ({{ sale.baseAsset }})</span>
          <!-- <span class="sale-details__owner"> {{ i18n.sale_by_owner({ owner: syndicateEmail }) }}</span> -->
        </div>
      </div>
      <p class="sale-details__description">{{ sale.shortDescription }}</p>
    </div>
    <div class="sale-details__content">
      <div class="sale-details__banner">
        <img class="sale-details__banner-image" 
             :src="sale.image" 
             alt="crowdfund banner">
      </div>
      <div class="sale-details__information">
        <div class="sale-details__information-item">
          <invest-progress-bar class="invest-progress-bar"
                               :sale="sale" 
                               :barHeight="'1.2rem'"/>
        </div>
        <div class="sale-details__information-item">
          <sale-invest :sale="sale"
                       @invest-in-sale="loadDetails" />
        </div>
      </div>
    </div>
    <div class="sale-details__content sale-details__main-info">
      <sale-tabs class="sale-details__tabs" 
                 :sale="sale"
                 :description="description"
                 :syndicate="syndicate"
                 :token="token"
                 />
      <div class="sale-details__information">
        <sale-chart class="sale-details__information-item" :sale="sale" />
      </div>
    </div>
  </div>
</template>

<script>
  import { salesService } from '../../../../js/services/sales.service'
  import { tokensService } from '../../../../js/services/tokens.service'
  import { SaleRecord } from '../../../../js/records/sale.record'
  import { TokenRecord } from '../../../../js/records/token.record'
  import { i18n } from '../../../../js/i18n'

  import SaleChart from './components/Sales.Chart'
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
      SaleChart },

    data: _ => ({
      sale: '',
      token: '',
      description: '',
      syndicate: {},
      syndicateEmail: '',
      i18n
    }),

    async created () {
      if (this.id) {
        await this.loadDetails()
      }
    },

    methods: {
      async loadDetails () {
        this.sale = new SaleRecord(await salesService.loadSaleById(this.id))
        this.token = new TokenRecord(await tokensService.loadTokenByCode(this.sale.baseAsset))
        this.description = await salesService.loadDescriptionIfExists(this.sale.owner, this.sale.descriptionID)
        // const syndicateDetails = await salesService.loadSyndicateDetails(this.sale.owner)
        // this.syndicateEmail = syndicateDetails.syndicateEmail
        // this.syndicate = syndicateDetails.syndicateDetails
      }
    }
  }
</script>

<style lang="scss">
  @import '../../../../scss/variables';
  @import '../../../../scss/mixins';
  $ratio_16: 370px;
  $ratio_9: $ratio_16 * (9/16);
  
  .sale-details {
    padding: 1.5rem;
    background: $col-content-block;
    border-radius: 2px;
    box-shadow: 0px 2px 4px 0 rgba(0, 0, 0, 0.08);
  }

  .sale-details__header-item {
    display: flex;
    flex-wrap: wrap;
    @include respond-to(medium) {
      flex-direction: column;
    }
  }

  .sale-details__content {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    @include respond-to(medium) {
      flex-direction: column;
    }
    .sale-details__banner,
    .sale-details__tabs {
      width: 50%;
      @include respond-to(medium) {
        width: 100%;
      }
    }

    .sale-details__banner-image {
      width: $ratio_16;
      height: $ratio_9;
      min-width: 100%;
      min-height: 100%;
      object-fit: cover;
      vertical-align: middle;
    }
    
    .sale-details__information {
      width: 45%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      flex-wrap: wrap;
      justify-content: space-between;
      .sale-details__information-item {
        width: 100%;
        margin-bottom: 2rem;
      }
      @include respond-to(medium) {
        width: 100%;
      }
    }
  }

  .sale-details__main-info {
    @include respond-to(medium) {
      flex-direction: column-reverse;
    }
  }

  .sale-details__name-wrapper {
    display: flex;
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    .sale-details__name {
      font-weight: bold;
      line-height: 2rem;
    }
    .sale-details__owner {
      font-size: 75%;
      margin-left: 1rem;
      @include respond-to(medium) {
        margin-left: 0;
        margin-top: 1rem;
    }
    }
  }

 .sale-details__description {
    font-size: 1rem;
    margin-bottom: 3rem;
  }

 .back-btn {
    margin: 0;
    margin-right: 1.5rem;
    min-width: 0;
    border-radius: 50%;
    cursor: pointer;
    i {
     font-size: $material-icon-medium;
    }
  }

  .information-item__title {
    margin-top: 1.5rem;
    margin-bottom: 3rem;
  }

  .invest-progress-bar {
    margin-top: 1rem;
  }
</style>
