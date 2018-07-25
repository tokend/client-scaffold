<template>
  <div class="portfolio-widget">
    <div class="portfolio-widget__wrapper" v-if="currentAsset">
      <div class="portfolio-widget__select">
        <div class="portfolio-widget__select-picture">
          <img class="portfolio-widget__asset" :src="imgUrl">
        </div>
        <div class="portfolio-widget__select-field">
          <!-- :key is a hack to ensure that the component will be updated after computed calculated -->
          <select-field-custom :value="currentAssetForSelect"
                               :values="tokensList"
                               :key="currentAssetForSelect"
                               @input="$emit(events.assetChange, $event)"
          />
        </div>
      </div>
      <div class="portfolio-widget__asset-btns">
        <router-link tag="button"
                      to="/issuance-creation"
                      :disabled="checkTransferable"
                      class="portfolio-widget__asset-btn"
                      v-ripple>
          <md-icon class="portfolio-widget__asset-btn-icon">add</md-icon>
          {{ i18n.lbl_create_issuance() }}
        </router-link>
        <router-link tag="button"
                      :to="'/transfers/make/' + currentAsset"
                      :disabled="checkTransferable"
                      class="portfolio-widget__asset-btn"
                      v-ripple>
          <md-icon class="portfolio-widget__asset-btn-icon portfolio-widget__asset-btn-icon--rotate">send</md-icon>
          {{ i18n.lbl_send() }} {{ currentAsset }}
        </router-link>
      </div>
    </div>
    <template v-if="currentAsset">
      <div class="portfolio-widget__wrapper portfolio-widget__wrapper--values">
        <div class="portfolio-widget__asset-available">
          <div class="portfolio-widget__asset-value">{{ balance }} {{ currentAsset }}</div>
          <div class="portfolio-widget__asset-usd">{{ convertedBalance }} {{ config.DEFAULT_QUOTE_ASSET }}</div>
        </div>
        <div class="portfolio-widget__select-scale" v-if="showTabls">
          <button class="portfolio-widget__select-scale-btn"
                  :class="{ 'portfolio-widget__select-scale-btn--selected': scale === tabs.hour }"
                  @click="$emit(events.changeDashboardScale, tabs.hour)">
            Hour
          </button>
          <button class="portfolio-widget__select-scale-btn"
                  :class="{ 'portfolio-widget__select-scale-btn--selected': scale === tabs.day }"
                  @click="$emit(events.changeDashboardScale, tabs.day)">
            Day
          </button>
          <button class="portfolio-widget__select-scale-btn"
                  :class="{ 'portfolio-widget__select-scale-btn--selected': scale === tabs.month }"
                  @click="$emit(events.changeDashboardScale, tabs.month)">
            Month
          </button>
          <button class="portfolio-widget__select-scale-btn"
                  :class="{ 'portfolio-widget__select-scale-btn--selected': scale === tabs.year }"
                  @click="$emit(events.changeDashboardScale, tabs.year)">
            Year
          </button>
        </div>
      </div>
    </template>
    <template v-if="!currentAsset">
      <no-data-message icon-name="toll"
                       :msg-title="i18n.th_no_assets_in_your_wallet()"
                       :msg-message="i18n.th_here_will_be_tokens()"/>
    </template>

  </div>
</template>

<script>
  import config from '../../../../config'
  import SelectFieldCustom from '@/vue/common/fields/SelectFieldCustom'
  import NoDataMessage from '@/vue/common/messages/NoDataMessage'

  import { mapGetters, mapActions } from 'vuex'
  import { vuexTypes } from '../../../../vuex/types'
  import { i18n } from '../../../../js/i18n'
  import { commonEvents } from '../../../../js/events/common_events'
  import get from 'lodash/get'

  export default {
    name: 'portfolio-widget',
    components: {
      SelectFieldCustom,
      NoDataMessage
    },
    props: {
      scale: { type: String, required: true },
      currentAsset: { type: [String, Object], default: 'USD' },
      showTabls: { type: Boolean, default: false }
    },
    data: _ => ({
      i18n,
      events: {
        assetChange: commonEvents.assetChangeEvent,
        changeDashboardScale: commonEvents.changeDashboardScale
      },
      tabs: {
        hour: 'hour',
        day: 'day',
        week: 'week',
        month: 'month',
        year: 'year',
        all: 'all'
      },
      config
    }),
    computed: {
      ...mapGetters([
        vuexTypes.accountBalances,
        vuexTypes.userTransferableTokens,
        vuexTypes.tokens
      ]),
      tokensList () {
        return this.tokens.filter(token => Object.keys(this.accountBalances).includes(token.code))
                          .filter(token => token.name) // TODO: temp. hack
                          .map(item => `${item.name} (${item.code})`)
      },
      currentAssetForSelect () {
        return this.tokens.filter(token => token.code === this.currentAsset)
                          .map(item => `${item.name} (${item.code})`)[0]
      },
      balance () {
        return i18n.c(get(this.accountBalances, `${this.currentAsset}.balance`) || 0)
      },
      convertedBalance () {
        return i18n.cc(get(this.accountBalances, `${this.currentAsset}.converted_balance`) || 0)
      },
      imgUrl () {
        const logoKey = get(this.accountBalances, `${this.currentAsset}.asset_details.details.logo.key`)
        if (logoKey) {
          return `${config.FILE_STORAGE}/${logoKey}`
        }
        const defaultUrl = '../../../../../static/coin-picture.png'
        return defaultUrl
      },
      checkTransferable () {
        return !(this.userTransferableTokens.map(token => token.code)).includes(this.currentAsset)
      }
    },
    async created () {
      await this.loadTokens()
    },
    methods: {
      ...mapActions({
        loadTokens: vuexTypes.GET_ALL_TOKENS
      })
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@scss/variables.scss';
  @import '~@scss/mixins.scss';

  $custom-breakpoint: 800px;

  .portfolio-widget__wrapper {
    display: flex;
    justify-content: space-between;

    @include respond-to-custom($custom-breakpoint) {
      flex-direction: column-reverse;
    }
  }

  .portfolio-widget__wrapper--values {
    align-items: flex-end;

    @include respond-to(medium) {
      align-items: flex-end;
    }

    @include respond-to-custom($custom-breakpoint) {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  .portfolio-widget__select-scale {
    @include respond-to-custom($custom-breakpoint) {
      margin-top: 16px;
    }
  }

  .portfolio-widget__select {
    display: flex;
    align-items: center;
    margin-right: 16px;
  }

  .portfolio-widget__select-picture {
    width: 55px;
    height: 55px;
    padding: 4px;
    border-radius: 2px;
    background-color: #fff;
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, .15);
    margin-right: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;

    @include respond-to(small) {
      width: 40px;
      height: 40px;
    }
  }

  .portfolio-widget__asset-btns {
    align-items: center;
    justify-content: flex-end;
    display: flex;
    flex-wrap: wrap;
    margin: -4px;

    @include respond-to-custom($custom-breakpoint) {
      justify-content: flex-start;
      margin-bottom: 16px;
    }

    // @include respond-to-custom($custom-breakpoint) {
    //   flex-direction: row;
    // }
  }

  .portfolio-widget__select-scale-btn {
    @include button();
    @include button-flat();
    font-weight: 400;
  }

  .portfolio-widget__select-scale-btn--selected {
    font-weight: 700;
  }

  .portfolio-widget__asset-btn {
    @include button();
    @include button-raised();
    margin: 4px;

    width: 180px;
    position: relative;
    height: 36px;

    @include respond-to-custom($custom-breakpoint) {
      width: 160px;
      margin-bottom: 0;
      padding-left: 30px;
    }
  }

  .portfolio-widget__asset-available {
    margin-top: 32px;
  }

  .portfolio-widget__asset-value {
    font-size: 30px;
    color: $col-md-primary;
  }

  .portfolio-widget__asset-usd {
    margin-top: 8px;
    font-size: 16px;
    color: rgba($col-md-primary, .5);
  }

  .portfolio-widget__asset-btn-icon {
    color: $white !important;
    transform: scale(.8);
    margin-top: -10px;
    position: absolute;
    left: 10px;
    top: calc(50% - 1px);

    @include respond-to-custom($custom-breakpoint) {
      left: 6px;
    }
  }

  .portfolio-widget__asset-btn-icon--rotate {
    transform: rotate(-45deg) scale(.8);
    top: calc(50% - 4px);
  }

</style>
