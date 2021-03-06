<template>
  <div class="dashboard">
    <template v-if="isLoading">
      <loader :message="i18n.dash_loading()" />
    </template>
    <template v-else>
      <portfolio-widget
        class="dashboard__portfolio"
        :current-asset="currentAsset"
        @asset-change="setCurrentAsset"
        :scale="scale"
      />
      <template v-if="currentAsset">
        <div
          class="dashboard__chart"
          v-if="currentAsset !== config.DEFAULT_QUOTE_ASSET"
        >
          <chart
            :base-asset="currentAsset"
            :quote-asset="config.DEFAULT_QUOTE_ASSET"
          />
        </div>
        <info-widget
          class="dashboard__activity"
          :current-asset="currentAsset"
        />
      </template>
    </template>
  </div>
</template>

<script>
import PortfolioWidget from './Dashboard.PortfolioWidget'
import InfoWidget from './Dashboard.InfoWidget'
import Chart from '@/vue/app/common/chart/Chart'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex/types'
import { i18n } from '@/js/i18n'
import Loader from '@/vue/app/common/Loader'
import config from '@/config'

export default {
  name: 'dashboard',
  components: {
    PortfolioWidget,
    InfoWidget,
    Chart,
    Loader
  },
  data: _ => ({
    currentAsset: null,
    isLoading: false,
    scale: 'month',
    i18n,
    config
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountBalances
    ])
  },
  watch: {
    accountBalances () {
      this.setCurrentAsset()
    }
  },
  async created () {
    this.isLoading = true
    await this.loadBalances()
    this.setCurrentAsset()
    this.isLoading = false
  },
  methods: {
    ...mapActions({
      loadBalances: vuexTypes.GET_ACCOUNT_BALANCES
    }),
    setCurrentAsset (value) {
      const regExp = /\s/g.test(value) ? /\(([^)]+)\)/ : /(\w+)/
      if (value) {
        this.currentAsset = regExp.exec(value)[1]
      } else {
        const keys = Object.keys(this.accountBalances)
        this.currentAsset =
          keys.filter(a => a === 'ETH')[0] || keys[0] || null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

$custom-breakpoint: 800px;

.dashboard {
  flex: 1;
  overflow: hidden;
}

.dashboard__chart {
  margin-top: -40px;
}

.dashboard__activity {
  margin-top: 48px;
  width: 100%;
}
</style>
