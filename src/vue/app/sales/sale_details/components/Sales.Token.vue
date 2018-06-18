<template>
  <div class="token-info">
    <div class="token-info__header">
      <img class="token-info__logo" :src="token.logoUrl" alt="">
      <div class="token-info__name-wrapper">
        <h2 class="token-info__name">{{ token.name }}</h2>
        <h2 class="token-info__code">({{ token.code }})</h2>
      </div>
    </div>
    <div class="token-info__main">
      <p class="token-info__soft-cap">
        {{ i18n.sale_soft_cap() }}:
        <span class="token-info__value">{{ i18n.cc(sale.softCap) }}</span>
      </p>
      <p class="token-info__hard-cap">
        {{ i18n.sale_hard_cap() }}:
        <span class="token-info__value">{{ i18n.cc(sale.hardCap) }}</span>
      </p>
    </div>
    <a :href="token.termsUrl" target="_blank">{{ i18n.sale_token_sale_agreement() }}</a>
  </div>
</template>

<script>
  import { i18n } from '../../../../../js/i18n'

  export default {
    name: 'sale-details-tokenInfo',
    props: ['sale', 'token'],
    data: _ => ({
      i18n
    })
  }
</script>

<style lang="scss">
  @import '../../../../../scss/variables';
  @import '../../../../../scss/mixins';

  .token-info{ 
    padding: 1.5rem;
  }

  .token-info__header {
    display: flex;
    align-items: center;
    .token-info__logo {
      width: 5rem;
      height: 5rem;
      margin-right: 2rem;
      border-radius: 50%;
      border: 1px solid $col-primary;
    }
 }

  .token-info__main {
    margin: 1rem 0;
  }

  .token-info__value {
    font-weight: bold;
  }

  .token-info__name {
    padding-bottom: 0.5rem;
  }
</style>
