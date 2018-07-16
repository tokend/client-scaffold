<template>
  <md-list-item class="account-seed" @click="isDialogOpened = !isDialogOpened">

    <span class="md-list-item-text">{{ i18n.set_secret_seed() }}</span>
    <md-icon class="md-icon--half-sized">play_arrow</md-icon>

    <md-dialog class="account-seed__dialog" :md-active.sync="isDialogOpened">
      <md-dialog-title>{{ i18n.set_copy_secret_seed() }}</md-dialog-title>

      <md-card-content class="account-seed__content">
        <p class="account-seed__description">{{ i18n.set_seed_description() }}</p>

        <clipboard-field class="account-seed__clipboard"
          :value="accountSeed"
        />

      </md-card-content>

      <md-dialog-actions class="md-layout md-alignment-center-right">
        <button v-ripple
                type="button"
                @click="isDialogOpened = !isDialogOpened"
                class="app__button-flat">
          {{ i18n.lbl_cancel() }}
        </button>
      </md-dialog-actions>

    </md-dialog>
  </md-list-item>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { vuexTypes } from '../../../../vuex/types'
  import { i18n } from '../../../../js/i18n'

  import ClipboardField from '../../../common/fields/ClipboardField'

  export default {
    name: 'account-seed',
    components: { ClipboardField },
    data: _ => ({
      isDialogOpened: false,
      i18n
    }),
    computed: {
      ...mapGetters([
        vuexTypes.accountSeed
      ])
    }
  }
</script>

<style lang="scss" scoped>

  @import '../../../../scss/mixins';

  .account-seed__description {
    margin-bottom: 16px;
    font-size: 14px;
  }

  .account-seed__clipboard {
    margin-right: 30px;

    @include respond-to(xsmall) {
      margin-right: 0;
    }
  }

</style>
