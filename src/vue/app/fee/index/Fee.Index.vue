<template>
  <div class="fee">
    <md-card>
      <md-card-content v-if="fees">
        <div class="fee__asset-info" v-for="(assetFees, index) in fees">
          <div class="fee__header">{{ i18n.fees_your()}} <span
            class="fee__asset"> {{index}}</span> {{ i18n.fees_fees()}}
          </div>
          <md-table>
            <md-table-row>
              <md-table-head>{{i18n.fees_fee_type()}}</md-table-head>
              <md-table-head>{{i18n.fees_subtype()}}</md-table-head>
              <md-table-head>{{i18n.fees_fixed()}}</md-table-head>
              <md-table-head>{{i18n.fees_percent()}}</md-table-head>
              <md-table-head>{{i18n.fees_lower_bound()}} ({{index}})</md-table-head>
              <md-table-head>{{i18n.fees_upper_bound()}} ({{index}})</md-table-head>
            </md-table-row>
            <template v-for="(fee, i) in assetFees">
              <md-table-row>
                <md-table-cell>{{fee.fee_type | filterFeeType}}</md-table-cell>
                <md-table-cell>{{fee.subtype | filterSubtype}}</md-table-cell>
                <md-table-cell>{{i18n.c(fee.fixed)}} {{fee.fee_asset}}</md-table-cell>
                <md-table-cell>{{i18n.c(fee.percent)}}%</md-table-cell>
                <md-table-cell>{{i18n.c(fee.lower_bound)}}</md-table-cell>
                <md-table-cell>{{i18n.c(fee.upper_bound)}}</md-table-cell>
              </md-table-row>
            </template>
          </md-table>
        </div>
      </md-card-content>
      <md-card-content v-else>
        {{ i18n.lbl_loading() }}
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
  import { i18n } from '../../../../js/i18n'
  import { feeService } from '../../../../js/services/fees.service'

  export default {
    components: {},
    data: _ => ({
      i18n,
      fees: null
    }),
    methods: {},
    watch: {},
    computed: {},
    mounted () {
    },
    async created () {
      try {
        this.fees = await feeService.loadAccountFees()
        console.log(this.fees)
      } catch (error) {
        console.error(error)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../scss/variables';

  .fee {
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    max-width: 1100px;
  }

  .fee__asset-info {
    margin-bottom: 2rem;
  }

  .fee__header {
    padding-left: 1.5rem;
    font-weight: 600;
  }

  .fee__asset {
    font-weight: 600;
  }

</style>
