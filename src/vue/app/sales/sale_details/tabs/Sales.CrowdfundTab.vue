<template>
  <div class="crowdfund">
    <div class="crowdfund-details">
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
    <div class="crowdfund-team">
      <h3>{{ i18n.sale_crowdfund_team() }}</h3>
      <div class="crowdfund-team-list">
        <template v-for="(item, i) in sale.syndicateDetails.members">
          <div  class="crowdfund-team-member"
                :key="i">
            <img :src="getUrl(item)"
                 alt="crowdfund team member photo"
                 class="crowdfund-team-member-photo">
            <h3 class="crowdfund-team-member-name">{{item.name}}</h3>
            <p v-if="item.isLeader">{{ i18n.sale_crowdfund_leader() }}</p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import DetailRow from '../../../common/Detail.Row'
  import { i18n } from '../../../../../js/i18n'
  import config from '../../../../../config'
  import _get from 'lodash/get'
  export default {
    name: 'description-tab',

    components: {
      DetailRow
    },
    props: ['sale'],
    data: _ => ({
      i18n
    }),
    methods: {
      getUrl (item) {
        const key = _get(item, 'image.key')
        return `${config.FILE_STORAGE}/${key}`
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../../scss/variables';
  @import '../../../../../scss/mixins';

  .crowdfund-details {
    margin-bottom: 1rem;
  }

  .crowdfund-team-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  .crowdfund-team-member {
    margin: 1rem 0;
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    @include respond-to(medium) {
      width: 100%;
    }
  }

  .crowdfund-team-member-photo {
    width: 12rem;
    height: 12rem;
    border-radius: 50%;
    margin-bottom: 1rem;
  }

</style>
