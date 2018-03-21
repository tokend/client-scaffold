<template>
  <md-card class="portfolio-widget">
    <md-card-header class="portfolio-widget__header">
      <div class="md-title portfolio-widget__title">{{ i18n.dash_activity({ asset: currentAsset }) }}</div>
    </md-card-header>

    <md-card-content class="portfolio-widget__asset">
      <div class="portfolio-widget__asset-picture">
        <img class="portfolio-widget__asset" src="../../../../../static/bitcoin-picture.png">
      </div>
      <div class="portfolio-widget__asset-available">
        <div class="portfolio-widget__asset-value">{{ balance }} {{ currentAsset }}</div>
        <div class="portfolio-widget__asset-usd">{{ convertedBalance }} USD</div>
      </div>
    </md-card-content>

    <md-card-actions>
      <md-button to="/transfers" class="md-primary">{{ i18n.lbl_send() }}</md-button>
    </md-card-actions>
  </md-card>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { vuexTypes } from '../../../../vuex/types'
  import { i18n } from '../../../../js/i18n'

  export default {
    name: 'portfolio-widget',
    components: {},
    data: _ => ({
      i18n
    }),
    computed: {
      ...mapGetters([
        vuexTypes.accountBalances
      ]),
      balance () {
        return this.accountBalances[this.currentAsset].balance
      },
      convertedBalance () {
        return parseFloat(this.accountBalances[this.currentAsset].converted_balance).toFixed(2).toString()
      }
    },
    props: ['currentAsset'],
    methods: {

    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../scss/variables.scss';
  @import '../../../../scss/mixins.scss';

  .portfolio-widget {
    max-height: 408px;
    width: 100%;
    max-width: 370px;
    min-width: 248px;

    @include respond-to(medium) {
      margin-bottom: 24px;
    }
  }

  .portfolio-widget__header {
    @include respond-to(small) {
      padding: 8px 0;
    }
  }

  .portfolio-widget__title {
    @include respond-to(small) {
      display: none;
    }
  }

  .portfolio-widget__asset {
    text-align: center;
    margin-bottom: 17px;

    @include respond-to(small) {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0;
      padding-bottom: 0;
      padding: 0 8px;
    }
  }

  .portfolio-widget__asset-picture {
    margin-bottom: 32px;

    @include respond-to(small) {
      margin-right: 16px;
      margin-bottom: 0;
    }

    img {
      width: 142px;
      height: 142px;

      @include respond-to(small) {
        width: 80px;
        height: 80px;
        padding: 0;
      }
    }
  }

  .portfolio-widget__asset-value {
    margin-bottom: 16px;
    font-size: 24px;
    letter-spacing: .2px;

    @include respond-to(small) {
      font-size: 20px;
    }

    @include respond-to(xsmall) {
      font-size: 16px;
    }
  }

  .portfolio-widget__asset-usd {
    font-size: 16px;
    letter-spacing: .2px;
    color: rgba(0, 0, 0, .55);

    @include respond-to(xsmall) {
      font-size: 14px;
    }
  }

</style>
