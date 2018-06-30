<template>
  <md-card class="user-type-selector
                  md-layout-item
                  md-size-90
                  md-medium-size-95
                  md-small-size-90
                  md-xsmall-size-100">

    <md-card-content class="md-layout">
      <div class="user-type-selector__user-types md-layout-item md-layout">
        <md-card class="user-type-selector__user-types-item md-layout-item md-size-30">
          <md-card-header class="user-type-selector__card-header">
            <span class="user-type-selector__user-types-item-title md-title">{{ i18n.kyc_general() }}</span>
            <md-icon>
              info
              <md-tooltip md-direction="top">{{ i18n.kyc_inv_tip() }}</md-tooltip>
            </md-icon>
          </md-card-header>
          <md-card-content class="user-type-selector__user-types-item-content">
            <md-icon class="md-size-5x md-medium-size-3x user-type-selector__user-type-icon">person</md-icon>
          </md-card-content>
          <md-card-actions>
            <md-button class="user-type-selector__user-type-button md-primary" @click="selectType(userTypes.general)" :disabled="isPending">SUBMIT KYC</md-button>
          </md-card-actions>
        </md-card>
        <md-card class="user-type-selector__user-types-item md-layout-item md-size-30">
          <md-card-header class="user-type-selector__card-header">
            <span class="md-title">{{ i18n.kyc_corporate() }}</span>
            <md-icon>
              info
              <md-tooltip md-direction="top">{{ i18n.kyc_corporate_tip() }}</md-tooltip>
            </md-icon>
          </md-card-header>
          <md-card-content class="user-type-selector__user-types-item-content">
            <md-icon class="md-size-5x md-medium-size-3x user-type-selector__user-type-icon">domain</md-icon>
          </md-card-content>
          <md-card-actions>
            <md-button class="user-type-selector__user-type-button md-primary" @click="selectType(userTypes.syndicate)" :disabled="isPending">SUBMIT KYC</md-button>
          </md-card-actions>
        </md-card>
      </div>
    </md-card-content>
  </md-card>
</template>

<script>
  import { commonEvents } from '../../../../../js/events/common_events'
  import { userTypes } from '../../../../../js/const/const'
  import { i18n } from '../../../../../js/i18n'

  export default {
    name: 'user-type-selector',
    props: ['isPending'],
    data () {
      return {
        i18n,
        userTypes,
        events: {
          selectUserType: commonEvents.selectUserTypeEvent
        }
      }
    },
    methods: {
      selectType (type) {
        this.$emit(this.events.selectUserType, type)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../../scss/variables';
  @import '../../../../../scss/mixins';

  .user-type-selector {
    margin: auto;
    padding: 25px 30px;
    width: 100%;
    background: transparent;
    box-shadow: none;
    @include respond-to-custom(1130px) {
      max-width: 860px;
    }
  }

  .user-type-selector__heading {
    text-align: center;
  }

  .user-type-selector__card-header {
    align-items: center;
    display: flex;
    justify-content: space-between;


    .md-icon {
      position: relative;
      bottom: .2rem;
      margin: 0;
    }
  }

  .user-type-selector__user-types {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;

    @include respond-to-custom(960px) {
      flex-direction: column;
    }
  }

  .user-type-selector__user-type-btn {
    align-items: center;
    border-radius: 3px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    padding: 20px 40px;
    transition: .2s;
    background-color: transparent;

    i {
      font-size: $material-icon-xx-super-big;
    }

    &:hover {
      background-color: lighten($col-unfocused, 30%);
    }
  }

  .user-type-selector__user-types-item {
    min-width: 320px;
    margin: auto;
    /*margin: 2rem;*/
    .user-type-selector__user-types-item-title {
      white-space: nowrap;
    }

    .user-type-selector__user-types-item-content {
      display: flex;
      justify-content: center;
      position: relative;
    }

    .user-type-selector__user-type-icon--secondary {
      position: absolute;
      right: 3.5rem;
      top: 1rem;

    }
  }

  .user-type-selector__user-type {
    font-size: $fs-root;
    margin: 0 16px;
  }
</style>
