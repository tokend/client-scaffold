<template>
  <md-card class="portfolio-widget">
    <md-card-header class="portfolio-widget__header">
      <div class="md-title portfolio-widget__title">{{ i18n.dash_wallet() }}</div>

      <div class="portfolio-widget__select-wrp">
        <select-field v-if="currentAsset"
                      :value="currentAsset"
                      :values="Object.keys(accountBalances)"
                      @input="$emit(events.assetChange, $event)"
        />
      </div>
    </md-card-header>


    <template v-if="currentAsset">
      <md-card-content class="portfolio-widget__asset">
        <div class="portfolio-widget__asset-picture">
          <img class="portfolio-widget__asset" src="../../../../../static/coin-picture.png">
        </div>
        <div class="portfolio-widget__asset-available">
          <div class="portfolio-widget__asset-value">{{ balance }} {{ currentAsset }}</div>
          <div class="portfolio-widget__asset-usd">{{ convertedBalance }} USD</div>
        </div>
      </md-card-content>
      <md-card-actions class="portfolio-widget__actions">
        <md-button to="/transfers" 
                   class="md-primary"
                   :disabled="checkTransferable"
                   >{{ i18n.lbl_send() }}</md-button>
      </md-card-actions>
    </template>

    <template v-else>
      <md-card-content>
        <div class="app__no-data-msg">
          <md-icon class="md-size-4x">toll</md-icon>
          <h2>{{ i18n.th_no_assets_in_your_wallet() }}</h2>
          <p>{{ i18n.th_here_will_be_tokens() }}</p>
        </div>
      </md-card-content>
    </template>

  </md-card>
</template>

<script>
  import SelectField from '../../../common/fields/SelectField'

  import { mapGetters } from 'vuex'
  import { vuexTypes } from '../../../../vuex/types'
  import { i18n } from '../../../../js/i18n'
  import { commonEvents } from '../../../../js/events/common_events'
  import get from 'lodash/get'

  export default {
    name: 'portfolio-widget',
    components: { SelectField },
    data: _ => ({
      i18n,
      events: {
        assetChange: commonEvents.assetChangeEvent
      }
    }),
    computed: {
      ...mapGetters([
        vuexTypes.accountBalances
      ]),
      balance () {
        return i18n.c(get(this.accountBalances, `${this.currentAsset}.balance`) || 0)
      },
      convertedBalance () {
        return i18n.cc(get(this.accountBalances, `${this.currentAsset}.converted_balance`) || 0)
      },
      checkTransferable () {
        const transferableTokens = this.$store.getters.userTransferableTokens.map(token => token.code)
        return !transferableTokens.includes(this.currentAsset)
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

  $custom-breakpoint: 860px;

  .portfolio-widget {
    max-height: 445px;
    width: 100%;
    max-width: 370px;
    min-width: 248px;

    @include respond-to(medium) {
      width: 100%;
      max-width: inherit;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      flex-wrap: wrap;
      flex: 1 1 auto;
      padding: 16px;
    }

    @include respond-to(medium) {
      margin-bottom: 24px;
    }

    @include respond-to(small) {
      padding: 8px;
    }
  }

  .portfolio-widget__header {
    display: flex;
    justify-content: space-between;
    @include respond-to(medium) {
      display: none;
    }
  }

  .portfolio-widget__title {
    @include respond-to(medium) {
      display: none;
    }
  }

  .portfolio-widget__select-wrp {
    max-width: 5rem;
    position: relative;
    bottom: .95rem;
  }

  .portfolio-widget__asset {
    text-align: center;
    margin-bottom: 17px;

    @include respond-to(medium) {
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

    @include respond-to(medium) {
      margin-right: 16px;
      margin-bottom: 0;
    }

    img {
      width: 142px;
      height: 142px;

      @include respond-to(medium) {
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

    @include respond-to(medium) {
      font-size: 20px;
      margin-bottom: 4px;
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

  .portfolio-widget__actions {
    @include respond-to(medium) {
      padding: 0;
      margin-left: auto;
    }
  }

</style>
