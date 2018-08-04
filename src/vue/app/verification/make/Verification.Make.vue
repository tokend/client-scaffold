<template>
  <div class="verification">
    <template v-if="isLoading">
      <loader :message="i18n.kyc_loading()"/>
    </template>
    <user-type-selector v-else-if="!selectedUserType" @select-user-type="handleUserType"/>
    <template v-else>
      <template v-if="accountState === ACCOUNT_STATES.approved">
        <div class="verification__approved-wrapper" v-if="!requestedToUpdate">
          <syndicate-banner/>
          <button v-ripple
              @click="requestedToUpdate = true"
              class="verification__update-btn app__form-submit-btn">
              {{ i18n.lbl_update_information() }}
          </button>
        </div>
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
        <div class="verification__rejected-wrapper
                    verification__card
                    verification__card--rejected"
            v-show="!showForm">
          <div class="verification__card-message">
            <md-icon class="md-size-4x verification__card-message-icon">warning</md-icon>
            <h2 class="verification__card-message-title">{{i18n.kyc_rejected_title()}}</h2>
            <p class="verification__card-message-text" v-html="i18n.kyc_rejected_msg_html({ reason: accountKycLatestRequest.rejectReason }) "></p>
          </div>
          <button v-ripple
              @click="showForm = true"
              class="app__form-submit-btn verification__update-btn">
              {{ i18n.lbl_update_information() }}
          </button>
        </div>

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

      <template v-if="requestedToUpdate && accountState === ACCOUNT_STATES.approved" >
        <state-banner/>
        <template v-if="selectedUserType === userTypes.general">
          <individual-form />
        </template>

        <template v-if="selectedUserType === userTypes.syndicate">
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
  import UserTypeSelector from './Verification.Selector'
  import Loader from '@/vue/app/common/Loader'

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
      UserTypeSelector,
      Loader
    },
    data: _ => ({
      selectedUserType: '',
      ACCOUNT_TYPES,
      ACCOUNT_STATES,
      userTypes,
      showForm: false,
      isLoading: false,
      i18n,
      requestedToUpdate: false
    }),
    async created () {
      await this.reset()
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
        this.isLoading = true
        await Promise.all([
          this.loadKycRequests(),
          this.loadAccount()
        ])
        if (!this.accountLatestBlobId) {
          this.isLoading = false
          return
        }
        switch (this.accountLatestKycLevel) {
          case 0:
            if (this.accountKycLatestRequest.accountTypeToSet === userTypes.syndicate) {
              await this.loadKycData({
                blobId: this.accountLatestBlobId,
                type: ACCOUNT_TYPES.syndicate
              })
              this.selectedUserType = userTypes.syndicate
            } else {
              await this.loadKycData({
                blobId: this.accountLatestBlobId,
                type: ACCOUNT_TYPES.general
              })
              this.selectedUserType = userTypes.general
            }
            break
          case 1:
            await this.loadKycData({
              blobId: this.accountLatestBlobId,
              type: ACCOUNT_TYPES.general
            })
            this.selectedUserType = userTypes.general
            break
          default:
            this.selectedUserType = ''
        }
        this.isLoading = false
      },
      handleUserType (type) {
        console.log(type)
        this.selectedUserType = type
      }
    }
  }
</script>

<style lang="scss">
  @import '../../../../scss/variables';
  @import '../../../../scss/mixins';

  .verification {
    flex-direction: column;
  }

  .verification__card-message {
    display: flex;
    flex-direction: column;
    text-align: center;
    max-width: 520px;
    margin: 0 auto;
    padding: 0 8px;
    @include respond-to(medium) {
      padding: 0 .625rem;
    }
  }

  .verification__card-message-title {
    margin-bottom: 0.5rem;
    color: $col-md-primary;
  }

  .verification__card-message-text {
    color: $col-md-primary-inactive;
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

  .verification__card--rejected {
    align-self: center;
  }

// overwrite styles of md
.verification {
  .md-steppers {
    margin-left: -23px;
    max-width: 560px;
    background-color: transparent;

    .md-stepper-content.md-active {
      padding-top: 20px;
      padding-left: 80px;
    }
  }
}

.verification__approved-wrapper,
.verification__rejected-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  .verification__update-btn {
    margin-top: 1rem;
  }
}



</style>
