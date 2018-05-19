<template>
  <div class="syndicate-banner
              md-layout
              md-alignment-center-center">
    <md-card class="md-layout-item
                    md-size-50
                    md-medium-size-65
                    md-small-size-95
                    md-xsmall-size-100"
    >
      <md-card-content class="syndicate-banner__inner">
        <md-icon class="syndicate-banner__icon
                        md-size-5x"
        >
          check
        </md-icon>
        <h2>{{ i18n.kyc_approved_title() }}</h2>
        <p>{{ i18n.kyc_approved_msg() }}</p>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
  import { i18n } from '../../../../js/i18n'

  export default {
    name: 'VerificationSyndicateBanner',
    data: _ => ({
      i18n
    })
  }
</script>

<style lang="scss" scoped>
  @import '../../../../scss/variables';

  .syndicate-banner__inner {
    text-align: center;
  }

</style>
