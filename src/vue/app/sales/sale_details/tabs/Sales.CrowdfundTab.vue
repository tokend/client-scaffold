<template>
  <div class="crowdfund">
     <h3>{{ i18n.sale_corporate_details() }}</h3>
     <detail-row :prop="i18n.com_name()"
                 :value="`${sale.syndicateDetails.name}`" />
     <detail-row :prop="i18n.com_date_of_foundation()"
                 :value="`${sale.syndicateDetails.founded}`" />
     <detail-row :prop="i18n.com_homepage()"
                 :value="`<a href='${sale.syndicateDetails.homepage}' target='_blank'>${sale.syndicateDetails.homepage}</a>`" />
     <detail-row :prop="i18n.com_industry_tags()"
                 :value="`${sale.syndicateDetails.industry}`" />
     <detail-row :prop="i18n.com_team_size()"
                 :value="`${sale.syndicateDetails.teamSize}`" />
     <detail-row :prop="i18n.com_type()"
                 :value="`${sale.syndicateDetails.company}`" />
     <detail-row :prop="i18n.com_headquarters()"
                 :value="`${sale.syndicateDetails.headquarters}`" />
  </div>
</template>

<script>
  import MarkdownFormatter from '../components/MarkDownFormatter'
  import DetailRow from '../../../common/Detail.Row'
  import { i18n } from '../../../../../js/i18n'
  export default {
    name: 'description-tab',

    components: {
      MarkdownFormatter,
      DetailRow
    },
    props: ['sale'],
    data: _ => ({
      i18n
    })
  }
</script>

<style lang="scss" scoped>
  @import '../../../../../scss/variables';
  @import '../../../../../scss/mixins';

  .description__markdown-formatter {
    text-align: justify;
  }
</style>
