<template>
  <div class="user-account-widget">
    <button class="user-account-widget__btn" @click="togglePane()">

      <span class="user-account-widget__btn-content">


        <span class="user-account-widget__initials" >
          <span v-if="char">{{char}}</span>
          <swarm-logo class="swarm-logo" v-else/>
        </span>

        <p class="user-account-widget__name tablet-hidden">
          {{email}}
        </p>

        <span class="user-account-widget__expand-art"></span>

      </span>
    </button>

    <div class="user-account-widget__pane" v-if="isPaneShown">

      <div class="user-account-widget__user-details">
        <div class="user-account-widget__initials">
          <span v-if="char">{{ char }}</span>
          <swarm-logo class="swarm-logo" v-else/>
        </div>
        <p class="user-account-widget__full-name">
          {{ user.firstName }} {{ user.lastName }}
        </p>
        <p class="user-account-widget__email">
          {{ email }}
        </p>
      </div>

      <div class="user-account-widget__price-details">
        <div class="user-account-widget__price-details-item">Current <span class="active">SUN</span> rates</div>
        <div class="user-account-widget__price-details-item" v-for="(price, asset) in prices">
          <span class="user-account-widget__pair">1 {{ asset }} = </span>
          <span class="user-account-widget__price">{{ localizeQuote(price) }} SUN</span>
        </div>
      </div>


      <ul class="user-account-widget__action-list">

        <li class="user-account-widget__action-list-item">
          <button class="user-account-widget__action-btn" @click="goContactUs">
            <i class="mdi mdi-message-alert"></i>
            <span>Contact us</span>
          </button>
        </li>

        <li class="user-account-widget__action-list-item">
          <button class="user-account-widget__action-btn" @click="goSettings">
            <i class="mdi mdi-settings"></i>
            <span>Settings</span>
          </button>
        </li>

        <li class="user-account-widget__action-list-item">
          <button class="user-account-widget__action-btn" @click="logout()">
            <i class="mdi mdi-exit-to-app"></i>
            <span>Sign Out</span>
          </button>
        </li>

      </ul>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { localizeQuote } from '../../js/utils/format-num.util'
  import { vuexTypes } from '../../vuex/types'
  import { blobTypes, blobFilters } from '../../js/const/documents.const'
  import { usersService } from '../../js/services/users.service'

  export default {
    data () {
      return {
        user: {
          firstName: '',
          lastName: ''
        },
        isPaneShown: false
      }
    },

    created () {
      this.getPairs()
      this.tryLoadCredentials()
    },

    computed: {
      ...mapGetters([
        vuexTypes.email,
        vuexTypes.assetRatesSUN,
        vuexTypes.userKycSequence
      ]),
      char () {
        const firstName = this.user.firstName
        const lastName = this.user.lastName
        if (!firstName || !lastName) return null
        return `${firstName.charAt(0)}${lastName.charAt(0)}`
      },
      prices () {
        return {
          'ETH': this.assetRatesSUN['ETH'],
          'BTC': this.assetRatesSUN['BTC'],
          'SWM': this.assetRatesSUN['SWM'],
          'USD': 1
        }
      }
    },
    methods: {
      ...mapActions({
        getPairs: vuexTypes.GET_ASSET_PAIRS
      }),
      togglePane () {
        this.isPaneShown = !this.isPaneShown
      },
      logout () {
        this.$store.dispatch('LOG_OUT')
      },
      goContactUs () {
        this.$router.push({ name: 'contact-us' })
        this.isPaneShown = false
      },
      goSettings () {
        this.$router.push({ name: 'app.settings' })
        this.isPaneShown = false
      },
      async tryLoadCredentials () {
        const blobs = await usersService.blobsOf()
          .getAll({
            [blobFilters.type]: blobTypes.kycForm.num,
            [blobFilters.kycSequence]: this.userKycSequence
          })
        const form = blobs[0]
        if (form) {
          this.user.firstName = form.first_name
          this.user.lastName = form.last_name
        }
      },
      localizeQuote
    }
  }
</script>


<style scoped lang="scss">
  @import "../../scss/variables";
  @import "../../scss/mixins";

  .user-account-widget {
    display: inline-block;
    position: relative;
    height: 100%;
  }

  .user-account-widget__btn {
    text-align: initial;
    border: none;
    background: none;
    cursor: pointer;
    height: 100%;
  }

  .user-account-widget__btn-content {
    display: flex;
    align-items: center;
  }

  .user-account-widget__initials {
    border: 1px solid $col-text;
    border-radius: 50%;
    height: 40px;
    margin-right: 0.7rem;
    position: relative;
    width: 40px;
    text-transform: uppercase;
    font-size: $fs-root;

    span,
    .swarm-logo {
      position: absolute;
      @include center;
    }
  }

  .user-account-widget__name {
    margin-right: 0.7rem;
  }

  .user-account-widget__expand-art {
    width: 1rem;
    height: 0.5rem;
    position: relative;
    display: inline-block;

    &:after {
      content: "";
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      border: 0.5rem solid;
      border-color: $col-text transparent transparent transparent;
    }
  }

  .user-account-widget__pane {
    background-color: $col-content-block;
    position: absolute;
    top: 100%;
    right: 0;
    min-width: 12rem;
    box-shadow: 0.07rem 0.07rem 0.56rem 0.04rem rgba(170, 170, 170, 0.72);
  }

  .user-account-widget__action-btn {
    border: none;
    background: none;
    cursor: pointer;
    height: 3rem;
    transition: .1s;
    width: 100%;

    i {
      @include center-vertically;

      font-size: $material-icon-medium;
      left: 15px;
      position: absolute;
    }

    &:hover {
      background: $col-background;
    }
  }

  .user-account-widget__action-list {
    list-style: none;
  }

  .user-account-widget__action-list-item {
    position: relative;
  }

  .user-account-widget__user-details {
    padding: 10px 20px;
    text-align: center;
    .user-account-widget__initials {
      width: 50px;
      height: 50px;
      font-size: $fs-root + 10px;
      margin: 0 auto 20px;
    }
  }

  .user-account-widget__full-name {
    margin-bottom: 5px;
  }


  .user-account-widget__email {
    font-size: $fs-tip;
    text-align: center;
    color: $col-unfocused;
  }

  .user-account-widget__price-details {
    border-top: 1px solid lighten($col-unfocused, 10%);
    border-bottom: 1px solid lighten($col-unfocused, 10%);
    padding: 10px 0 10px 45px;
  }

  .user-account-widget__price-details-item {
    font-size: $fs-tip;
    margin-bottom: 5px;

    &:first-child {
      margin-bottom: 10px;
    }
  }
</style>
