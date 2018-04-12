<template>
  <div class="explore-tokens md-layout md-alignment-center-center">
    <md-card class="explore-tokens__card">

      <md-card-header>
        <div class="md-title">Explore tokens</div>
      </md-card-header>

      <div class="explore-tokens__inner">

        <div class="explore-tokens__list-wrp">
          <div class="explore-tokens__list">
            <template v-if="tokens.length">
              <md-list class="md-double-line">
                <template v-for="token in tokens">
                  <md-list-item @click="selectToken(token)">

                    <md-avatar class="md-avatar-icon md-accent">{{ token.code.charAt(0) }}</md-avatar>

                    <div class="md-list-item-text explore-tokens__token-name">
                      <span>{{ token.code }}</span>
                      <span>{{ token.name }}</span>
                    </div>
                  </md-list-item>
                </template>
              </md-list>
            </template>
          </div>
        </div>

        <template v-if="selected">
          <div class="explore-tokens__token-details">
            <md-list class="md-double-line">
              <md-list-item>
                <md-avatar class="md-avatar-icon md-accent">{{ selected.code.charAt(0) }}</md-avatar>
                <div class="md-list-item-text">
                  <span>{{ selected.code }}</span>
                  <span>{{ selected.name }}</span>
                </div>
              </md-list-item>
            </md-list>
            <h4>{{ i18n.lbl_token_details() }}</h4>
            <div class="explore-token__token-details-inner">
              <detail :prop="i18n.lbl_code()" :value="selected.code"/>
              <detail :prop="i18n.lbl_avalilable_for_iss()" :value="selected.available"/>
              <detail :prop="i18n.lbl_name()" :value="selected.name"/>
              <detail :prop="i18n.lbl_max_issuance()" :value="i18n.c(selected.max)"/>
              <detail :prop="i18n.lbl_issued()" :value="i18n.c(selected.issued)"/>
              <!--<detail :prop="i18n.lbl_policy()" :value="selected.policy"/>-->
              <!--<detail :prop="i18n.lbl_policies()" :value="selected.policies"/>-->
              <detail :prop="i18n.lbl_terms()" :value="selected.terms"/>
            </div>
          </div>
        </template>
      </div>

    </md-card>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { vuexTypes } from '../../../vuex/types'
  import { i18n } from '../../../js/i18n'
  import Detail from '../common/Detail.Row'

  export default {
    name: 'TokensExplore',
    components: { Detail },
    data: _ => ({
      selected: null,
      i18n
    }),
    async created () {
      await this.loadTokens()
      this.selectToken(this.tokens[0])
    },
    computed: {
      ...mapGetters([
        vuexTypes.tokens
      ])
    },
    methods: {
      ...mapActions({
        loadTokens: vuexTypes.GET_ALL_TOKENS
      }),
      selectToken (token) {
        this.selected = token || null
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../scss/variables';
  @import '../../../scss/mixins';

  .explore-tokens__card {
    max-width: 50rem;
    width: 100%;
  }

  .explore-tokens__inner {
    display: flex;
    width: 100%;
  }

  .explore-tokens__list-wrp {
    border-right: 1px solid lighten($col-unfocused, 20%);
    margin-right: 2rem;
    max-width: 15rem;

    @include respond-to(small) {
      margin-right: .5rem;
    }
  }

  .explore-tokens__token-name {
    @include respond-to(medium) {
      display: none;
    }
  }

  .explore-tokens__token-details {
    width: 100%;
    padding: 1rem 2rem 1rem 0;
    min-width: 10rem;

    @include respond-to(small) {
      padding-right: 1rem;
    }
  }


</style>
