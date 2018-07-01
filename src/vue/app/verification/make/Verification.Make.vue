<template>
  <div class="verification md-layout md-alignment-center-center">
    <user-type-selector v-if="!selectedUserType" @select-user-type="handleUserType"/>
    <template v-if="selectedUserType">
      <template v-if="accountState === ACCOUNT_STATES.approved">
        <syndicate-banner/>
      </template>
      <template v-if="accountState === ACCOUNT_STATES.pending">
        <state-banner/>
        <template v-if="selectedUserType === userTypes.general">
          <individual-form />
        </template>

        <template v-if="selectedUserType === userTypes.syndicate">
          <syndicate-form />
        </template>

      </template>
      <template v-if="accountState === ACCOUNT_STATES.rejected">
        <md-card class="verification__card
                        verification__card--rejected
                        md-size-55
                        md-medium-size-75
                        md-small-size-100
                        md-layout-item"
                 v-show="!showForm" >
          <md-card-content>
            <div class="verification__card-message">
              <md-icon class="md-size-4x verification__card-message-icon">warning</md-icon>
              <h2 class="verification__card-message-title">{{i18n.kyc_rejected_title()}}</h2>
              <p class="verification__card-message-text" v-html="i18n.kyc_rejected_msg_html({ reason: accountKycLatestRequest.rejectReason }) "></p>
            </div>
          </md-card-content>

          <md-card-actions class="md-layout">
            <md-button  @click="showForm = true"
                        class="md-primary">
            {{ i18n.lbl_edit_details() }}
            </md-button>
          </md-card-actions>

        </md-card>
        <template v-if="showForm">
          <template v-if="selectedUserType === userTypes.general">
            <individual-form />
          </template>

          <template v-if="selectedUserType === userTypes.syndicate">
            <syndicate-form />
          </template>
        </template>
      </template>
      <template v-if="accountState === ACCOUNT_STATES.nil">

        <template v-if="selectedUserType === userTypes.general">
          <individual-form />
        </template>

        <template v-else-if="selectedUserType === userTypes.syndicate">
          <syndicate-form />
        </template>

      </template>
    </template>
  </div>
</template>

<script>
  import IndividualForm from './Verification.Individual'
  import SyndicateForm from './Verification.Syndicate'
  import StateBanner from './Verification.StateBanner'
  import SyndicateBanner from './Verification.SyndicateBanner'
  import UserTypeSelector from './components/Verification.UserTypeSelector'

  import { i18n } from '../../../../js/i18n'
  import { mapGetters, mapActions } from 'vuex'
  import { vuexTypes } from '../../../../vuex/types'
  import { userTypes, ACCOUNT_TYPES, ACCOUNT_STATES } from '../../../../js/const/const'

  export default {
    name: 'verification-make',
    components: {
      IndividualForm,
      SyndicateForm,
      SyndicateBanner,
      StateBanner,
      UserTypeSelector
    },
    data: _ => ({
      selectedUserType: '',
      ACCOUNT_TYPES,
      ACCOUNT_STATES,
      userTypes,
      showForm: false,
      i18n
    }),
    async created () {
      await this.reset()

      switch (this.accountLatestKycLevel) {
        case 0:
          if (this.accountKycLatestRequest.accountTypeToSet === userTypes.syndicate) {
            this.selectedUserType = userTypes.syndicate
          } else {
            this.selectedUserType = userTypes.general
          }
          break
        case 1:
          this.selectedUserType = userTypes.general
          break
        default:
          this.selectedUserType = ''
      }
    },
    computed: {
      ...mapGetters([
        vuexTypes.accountLatestBlobId,
        vuexTypes.accountState,
        vuexTypes.accountType,
        vuexTypes.accountTypeI,
        vuexTypes.accountKycData,
        vuexTypes.accountLatestKycLevel,
        vuexTypes.accountKycLatestRequest
      ])
    },
    methods: {
      ...mapActions({
        loadAccount: vuexTypes.GET_ACCOUNT_DETAILS,
        loadUser: vuexTypes.GET_USER_DETAILS,
        loadKycRequests: vuexTypes.GET_ACCOUNT_KYC_REQUESTS,
        loadKycData: vuexTypes.GET_ACCOUNT_KYC_DATA
      }),
      async reset () {
        await Promise.all([
          this.loadKycRequests(),
          this.loadAccount()
        ])
        if (!this.accountLatestBlobId) {
          return
        }
        switch (this.accountLatestKycLevel) {
          case 0:
            if (this.accountKycLatestRequest.accountTypeToSet === userTypes.syndicate) {
              await this.loadKycData({
                blobId: this.accountLatestBlobId,
                type: ACCOUNT_TYPES.syndicate
              })
            } else {
              await this.loadKycData({
                blobId: this.accountLatestBlobId,
                type: ACCOUNT_TYPES.general
              })
            }
            break
          case 1:
            await this.loadKycData({
              blobId: this.accountLatestBlobId,
              type: ACCOUNT_TYPES.general
            })
            break
          default:
            this.selectedUserType = ''
        }
      },
      handleUserType (type) {
        this.selectedUserType = type
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../scss/variables';
  @import '../../../../scss/mixins';
  .verification__card-message {
    display: flex;
    flex-direction: column;
    text-align: center;

    @include respond-to(medium) {
      padding: 0 .625rem;
    }
  }

  .verification__card-message-title {
    margin-top: 1rem;
  }

  .verification__card-action--to-right:first-child {
    margin-left: auto;
  }

  .verification__card-message-icon {
    .verification__card--pending & {
      color: $orange;
    }

    .verification__card--rejected & {
      color: $red;
    }

    .verification__card--approved & {
      color: $green;
    }
  }
</style>
