<template>
  <div class="crowdfund-token">
    <div class="crowdfund-token-header">
      <div class="crowdfund-token__icon-wrapper md-layout-item md-size-35 md-layout md-alignment-center-center">
        <img class="crowdfund-token__icon" v-if="token.logoUrl" :src='token.logoUrl' :alt="documentTypes.tokenIcon">
        <div class="crowdfund-token__icon" v-else>{{ token.name.substr(0, 1).toUpperCase() }}</div>
      </div>
      <div class="crowdfund-token__name-wrapper">
        <h2 class="crowdfund-token__name">{{ token.name }}</h2>
        <h2 class="crowdfund-token__code">({{ token.code }})</h2>
      </div>
    </div>
    <div class="crowdfund-token-main">
      <div class="details-column md-layout-item">
        <detail-row :prop="i18n.lbl_token_max_issuance_amount()" :value="`${i18n.cc(token.max)}`"/>
        <detail-row :prop="i18n.lbl_token_initial_preissued_amount()" :value="`${i18n.cc(token.issued)}`"/>
        <detail-row :prop="i18n.lbl_avalilable_for_iss()" :value="`${i18n.cc(token.available)}`"/>
        <detail-row :prop="i18n.lbl_terms()" v-if="token.termsUrl" :value="`<a href='${token.termsUrl}' target='_blank'>Open file</a>`"/>
        <detail-row :prop="i18n.lbl_terms()" v-else />
        <detail-row :prop="i18n.lbl_policies()" :value="`${getPolicies(token.policies)}`"/>
      </div>
    </div>
  </div>
</template>

<script>
  import DetailRow from '../../../common/Detail.Row'
  import { i18n } from '../../../../../js/i18n'
  import { ASSET_POLICIES } from '../../../../../js/const/xdr.const'
  import { documentTypes } from '../../../../../js/const/documents.const'
  export default {
    name: 'token-tab',

    components: {
      DetailRow
    },
    props: ['token'],
    data: _ => ({
      i18n,
      documentTypes,
      ASSET_POLICIES
    }),
    methods: {
      getPolicies (item) {
        const policies = []
        item.forEach(element => {
          policies.push(Object.keys(ASSET_POLICIES)
            .filter(policy => ASSET_POLICIES[policy] === element))
        })
        return policies.join(', ').replace(/([a-z])([A-Z])/g, '$1 $2')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../../scss/variables';
  @import '../../../../../scss/mixins';

  .crowdfund-token-header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 1rem;
  }

  .crowdfund-token__icon {
    width: 6rem;
    height: 6rem;
    margin-right: 2rem;
    border-radius: 50%;
    border: 1px solid $col-primary;
  }

  .crowdfund-token__name {
    padding-bottom: 0.5rem;
  }
</style>
