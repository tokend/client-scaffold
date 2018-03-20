<template>
  <md-card class="portfolio-widget">
    <md-card-header>
      <div class="md-title">Your {{ currentAsset }} activity</div>
    </md-card-header>

    <md-card-content class="portfolio-widget__asset">
      <div class="portfolio-widget__asset-picture">
        <img class="portfolio-widget__asset" src="../../../../../static/bitcoin-picture.png">
      </div>
      <div class="portfolio-widget__asset-value">{{ balance }} {{ currentAsset }}</div>
      <div class="portfolio-widget__asset-usd">{{ convertedBalance }} USD</div>
    </md-card-content>

    <md-card-actions>
      <md-button to="/withdrawal" class="md-primary">Send</md-button>
    </md-card-actions>
  </md-card>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { vuexTypes } from '../../../../vuex/types'

  export default {
    name: 'portfolio-widget',
    components: {},
    data: _ => ({
    }),
    computed: {
      ...mapGetters([
        vuexTypes.accountBalances
      ]),
      balance () {
        return this.accountBalances[this.currentAsset].balance
      },
      convertedBalance () {
        return this.accountBalances[this.currentAsset].converted_balance
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
  }

  .portfolio-widget__asset {
    text-align: center;
    margin-bottom: 17px;
  }

  .portfolio-widget__asset-picture {
    margin-bottom: 32px;

    img {
      width: 142px;
      height: 142px;
    }
  }

  .portfolio-widget__asset-value {
    margin-bottom: 16px;
    font-size: 24px;
    letter-spacing: .2px;
  }

  .portfolio-widget__asset-usd {
    font-size: 16px;
    letter-spacing: .2px;
    color: rgba(0, 0, 0, .55);
  }

</style>
