<template>
  <div class="dashboard">
    <portfolio-widget class="md-layout-item dashboard__portfolio"
                      :currentAsset="currentAsset"
                      @asset-change="setCurrentAsset"
    />
    <info-widget v-if="currentAsset" class="dashboard__activity" :currentAsset="currentAsset"/>
  </div>
</template>

<script>
  import PortfolioWidget from './Dashboard.PortfolioWidget'
  import InfoWidget from './Dashboard.InfoWidget'
  import { mapGetters, mapActions } from 'vuex'
  import { vuexTypes } from '../../../../vuex/types'

  export default {
    name: 'dashboard',
    components: {
      PortfolioWidget,
      InfoWidget
    },
    data: _ => ({
      currentAsset: null
    }),
    async created () {
      await this.loadBalances()
      this.setCurrentAsset()
    },
    computed: {
      ...mapGetters([
        vuexTypes.accountBalances
      ])
    },
    methods: {
      ...mapActions({
        loadBalances: vuexTypes.GET_ACCOUNT_BALANCES
      }),
      setCurrentAsset (value) {
        if (value) {
          this.currentAsset = value.split(' ')[0]
        } else {
          this.currentAsset = Object.keys(this.accountBalances)[0] || null
        }
      }
    },
    watch: {
      accountBalances () {
        this.setCurrentAsset()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@scss/variables';
  @import '~@scss/mixins';

  .dashboard {
    padding: 0 40px;

    @include respond-to(medium) {
      padding: 0 24px;
    }

    @include respond-to(small) {
      padding: 0 16px;
    }

    @include respond-to(xsmall) {
      padding: 0 8px;
    }
  }

  .dashboard__portfolio {
    margin-bottom: 24px;
  }

  .dashboard__activity {
    width: 100%;
  }
</style>
