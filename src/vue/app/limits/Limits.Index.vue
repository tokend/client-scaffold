<template>
  <div class="limits">
    <div class="limits__header">
      <h2 class="app__page-heading">{{ i18n.lim_heading() }}</h2>
    </div>
    <div class="limits__content">
      <div class="limits__select-wrp">
        <select-field v-model="filters.tokenCode"
                      :values="Object.keys(accountBalances)"
                      :label="i18n.lbl_asset()"
                      class="limits_select-field"
        />
        <div class="app__form-field-description">
          <p v-if="filters.tokenCode">
            {{ i18n.tr_transfer_balance({ amount: balance.balance, asset: filters.tokenCode }) }}
          </p>
        </div>
      </div>
      <template v-if="filters.tokenCode">
        <div class="limits__list-wrapper">
          <template v-for="([op, name],i) in Object.entries(LIMIT_OPS)">
            <div class="limits__list" :key="i">

              <h3 class="limits__op-name">{{ name }}</h3>

              <div class="limits__list-content">
                <p class="limits__list-item">
                  <span class="limits__list-item-label">{{ i18n.lim_daily() }}:</span>
                  {{ limits[op].dailySpent ? i18n.c(limits[op].dailySpent) : '—' }}
                  <template v-if="limits[op].dailySpent">{{ i18n.lim_spent() }}</template>
                  /
                  {{ limits[op].dailyLimit ? i18n.c(limits[op].dailyLimit) : '—' }}
                  <template v-if="limits[op].dailyLimit">{{ i18n.lim_total() }}</template>
                </p>


                <p class="limits__list-item">
                  <span class="limits__list-item-label">{{ i18n.lim_weekly() }}:</span>
                  {{ limits[op].weeklySpent ? i18n.c(limits[op].weeklySpent) : '—' }}
                  <template v-if="limits[op].weeklySpent">{{ i18n.lim_spent() }}</template>
                  /
                  {{ limits[op].weeklyLimit ? i18n.c(limits[op].weeklyLimit) : '—' }}
                  <template v-if="limits[op].weeklyLimit">{{ i18n.lim_total() }}</template>
                </p>


                <p class="limits__list-item">
                  <span class="limits__list-item-label">{{ i18n.lim_monthly() }}:</span>
                  {{ limits[op].monthlySpent ? i18n.c(limits[op].monthlySpent) : '—' }}
                  <template v-if="limits[op].monthlySpent">{{ i18n.lim_spent() }}</template>
                  /
                  {{ limits[op].monthlyLimit ? i18n.c(limits[op].monthlyLimit) : '—' }}
                  <template v-if="limits[op].monthlyLimit">{{ i18n.lim_total() }}</template>
                </p>


                <p class="limits__list-item">
                  <span class="limits__list-item-label">{{ i18n.lim_annual() }}:</span>
                  {{ limits[op].annualSpent ? i18n.c(limits[op].annualSpent) : '—' }}
                  <template v-if="limits[op].annualSpent">{{ i18n.lim_spent() }}</template>
                  /
                  {{ limits[op].annualLimit ? i18n.c(limits[op].annualLimit) : '—' }}
                  <template v-if="limits[op].annualLimit">{{ i18n.lim_total() }}</template>
                </p>

              </div>
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import FormMixin from '../../common/mixins/form.mixin'
  import LimitsIndexMixin from './limits-index.mixin'

  export default {
    name: 'LimitsIndex',
    mixins: [LimitsIndexMixin, FormMixin],
    components: { }
  }
</script>

<style lang="scss">
  @import '../../../scss/variables';

  // md-card alternative
  .limits {
    flex: 1;
    width: 100%;
    background-color: $col-content-block;
    max-width: calc(65 * 0.625rem);
    margin: auto;
    border-radius: 2px;
    box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
  }

  .limits__header,
  .limits__content { padding: 1.5rem; }

  .limits__select-wrp {
    margin-bottom: 1rem;
  }

  .limits__list { width: 50% }
  .limits__op-name { margin-bottom: 1.6rem }
  .limits__list-item { margin-bottom: .75rem }
  .limits__list-item-label {
    display: inline-block;
    margin-right: 1rem;
    width: 8rem;
    /*width: 100%;*/
  }

  .limits__list-wrapper {
    display: flex;
  }

  .limits_select-field { width: 10rem }
</style>
