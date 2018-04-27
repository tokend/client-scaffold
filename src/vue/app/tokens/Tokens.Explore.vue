<template>
  <div class="explore-tokens md-layout md-alignment-center-center md-layout-item md-size-80">
    <template v-if="!tokens.length">
      <div class="app__no-data-msg">
        <md-card class="md-layout-item
                      md-size-100">
          <md-card-content>
            <md-icon class="md-size-4x">toll</md-icon>
            <h2>{{ i18n.tr_no_assets() }}</h2>
            <p>{{ i18n.tr_no_assets_exp() }}</p>
          </md-card-content>
        </md-card>
      </div>
    </template>

    <md-card class="explore-tokens__card" v-else>

      <md-card-header>
        <div class="md-title">{{ i18n.lbl_explore_tokens() }}</div>
      </md-card-header>

      <div class="explore-tokens__inner">
        <div class="explore-tokens__list-wrp">
          <div class="explore-tokens__list">
            <template v-if="tokens.length">
              <md-list class="md-double-line">
                <md-content class="md-scrollbar">
                  <template v-for="(token, i) in tokens">
                    <md-list-item @click="selectToken(token)">

                      <md-avatar class="md-avatar-icon"
                                 :class="`${hasBalance(token) ? 'md-primary' : 'md-accent'}`"
                      >
                        <template v-if="token.logoUrl">
                          <img :src="token.logoUrl" :alt="avatar(token.code)">
                        </template>

                        <template v-else>{{ avatar(token.code) }}</template>

                      </md-avatar>

                      <div class="md-list-item-text explore-tokens__token-name"
                           :class="{ 'selected': selected.code === token.code }"
                      >
                        <span>
                          {{ token.code }}
                          <md-icon class="explore-tokens__balance-exists-icon md-icon--half-sized"
                                 v-if="hasBalance(token)"
                          >check_circle</md-icon>
                        </span>
                        <span>{{ token.name }}</span>
                      </div>
                    </md-list-item>
                  </template>
                </md-content>
              </md-list>
            </template>
          </div>
        </div>

        <template v-if="selected">
          <md-card class="explore-tokens__token-ctn">
            <md-card-content class="explore-tokens__token-details">
              <md-list class="md-triple-line">
                <md-list-item>
                  <md-avatar class="md-avatar-icon"
                            :class="`${hasBalance(selected) ? 'md-primary' : 'md-accent'}`"
                  >
                    <template v-if="selected.logoUrl">
                      <img :src="selected.logoUrl" :alt="avatar(selected.code)">
                    </template>

                    <template v-else>{{ avatar(selected.code) }}</template>

                  </md-avatar>
                  <div class="md-list-item-text">
                    <span>{{ selected.code }}</span>
                    <span>{{ selected.name }}</span>
                    <span class="explore-tokens__balance-exists-msg" v-if="hasBalance(selected)">
                      {{ i18n.lbl_balance_exists()  }}
                      <md-icon class="explore-tokens__balance-exists-icon md-icon--half-sized">check_circle</md-icon>
                    </span>
                  </div>
                </md-list-item>
              </md-list>
              <h4>{{ i18n.lbl_token_details() }}</h4>
              <div class="explore-tokens__token-details-inner">
                <detail :prop="i18n.lbl_code()" :value="selected.code"/>
                <detail :prop="i18n.lbl_avalilable_for_iss()" :value="selected.available"/>
                <detail :prop="i18n.lbl_name()" :value="selected.name"/>
                <detail :prop="i18n.lbl_max_issuance()" :value="i18n.c(selected.max)"/>
                <detail :prop="i18n.lbl_issued()" :value="i18n.c(selected.issued)"/>
                <!--<detail :prop="i18n.lbl_policy()" :value="selected.policy"/>-->
                <!--<detail :prop="i18n.lbl_policies()" :value="selected.policies"/>-->
                <detail :prop="i18n.lbl_terms()"
                        :value="selected.termsUrl
                        ? `<a target='_blank' rel='noopener' href='${selected.termsUrl}'>${selected.terms.name}</a>`
                        : ''"
                />
              </div>
            </md-card-content>
            <md-card-actions class="explore-tokens__token-actions">
                <md-button class="md-primary" @click="createBalance"
                          v-if="!hasBalance(selected)"
                          :disabled="isPending">
                  {{ i18n.lbl_add_to_balances() }}
                </md-button>
                <md-button class="md-primary" @click="goHistory" v-else>{{ i18n.lbl_view_history() }}</md-button>
            </md-card-actions>
          </md-card>
        </template>
      </div>

    </md-card>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { accountsService } from '../../../js/services/accounts.service'
  import { EventDispatcher } from '../../../js/events/event_dispatcher'
  import { ErrorHandler } from '../../../js/errors/error_handler'
  import { vuexTypes } from '../../../vuex/types'
  import { confirmAction } from '../../../js/modals/confirmation_message'
  import { i18n } from '../../../js/i18n'

  import Detail from '../common/Detail.Row'
  import SubmitterMixin from '../../common/mixins/submitter.mixin'

  export default {
    name: 'TokensExplore',
    mixins: [SubmitterMixin],
    components: { Detail },
    data: _ => ({
      selected: null,
      i18n
    }),
    async created () {
      this.selectToken(this.tokens[0])
      await Promise.all([
        this.loadTokens(),
        this.loadBalances()
      ])
    },
    computed: {
      ...mapGetters([
        vuexTypes.accountBalances,
        vuexTypes.tokens
      ])
    },
    methods: {
      ...mapActions({
        loadTokens: vuexTypes.GET_ALL_TOKENS,
        loadBalances: vuexTypes.GET_ACCOUNT_BALANCES
      }),
      selectToken (token) {
        this.selected = token || null
      },
      hasBalance (token) {
        if (!token) return false
        return Object.keys(this.accountBalances).includes(token.code)
      },
      avatar (code) {
        return code.length <= 2 ? code : code.charAt(0)
      },
      async createBalance () {
        if (!await confirmAction()) return
        const code = this.selected.code
        this.disable()
        try {
          await accountsService.createBalance(code)
          await this.loadBalances()
          EventDispatcher.dispatchShowSuccessEvent(i18n.cm_balance_created({ code }))
        } catch (e) {
          ErrorHandler.processUnexpected(e)
        }
        this.enable()
      },
      goHistory () {
        this.$router.push({ name: 'history.index', params: { tokenCode: this.selected.code } })
      }
    },
    watch: {
      tokens () {
        this.selectToken(this.tokens[0])
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../scss/variables';
  @import '../../../scss/mixins';

  .explore-tokens {
    margin: auto;
  }

  .explore-tokens__token-ctn {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin: 0 !important;
    box-shadow: none !important;
  }

  .explore-tokens__card {
    width: 100%;
  }

  .explore-tokens__inner {
    display: flex;
    width: 100%;
  }

  .explore-tokens__list-wrp {
    border-right: 1px solid lighten($col-unfocused, 40%);
    max-width: 15rem;

    @include respond-to(small) {
      margin-right: .5rem;
    }
  }

  .explore-tokens__list {

    .md-content {
      max-height: 70vh;
      overflow: auto;
    }
  }

  .explore-tokens__token-name {
    @include respond-to(medium) {
      display: none;
    }
  }

  .explore-tokens__token-details-inner {
    margin-bottom: 1rem;
  }

  .explore-tokens__token-details {
    width: 100%;
    padding: 1rem 2rem 1rem 0;
    min-width: 10rem;

    @include respond-to(small) {
      padding-right: 1rem;
    }
  }

  .explore-tokens__balance-exists-msg {
    color: $col-success;
  }


  .explore-tokens__balance-exists-icon {
    color: $col-success !important;
    margin-left: .15rem;
    position: relative;
    bottom: .1rem;
  }

  .selected {
    span {
      color: $col-md-primary;
    }
  }

</style>
