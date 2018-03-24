<template>
  <md-list-item class="account-id" @click="isDialogOpened = !isDialogOpened">

    <span class="md-list-item-text">{{ i18n.set_account_id() }}</span>
    <md-icon class="md-icon--half-sized">play_arrow</md-icon>

    <md-dialog class="account-id__dialog" :md-active.sync="isDialogOpened">
      <md-dialog-title>{{ i18n.set_your_account_id() }}</md-dialog-title>

      <md-card-content class="account-id__content">
        <div class="account-id__wrapper">
          <qrcode class="qr-code account-id__qr-code"
                :text="accountId"
                :size="250"
                color="#3f4244"
          />

          <clipboard-field class="account-id__clipboard"
            :value="accountId"
          />
        </div>
      </md-card-content>

      <md-dialog-actions class="md-layout md-alignment-center-right">
        <md-button type="button" class="md-primary" @click="isDialogOpened = !isDialogOpened">{{ i18n.lbl_cancel() }}</md-button>
      </md-dialog-actions>

    </md-dialog>
  </md-list-item>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { vuexTypes } from '../../../../vuex/types'
  import { i18n } from '../../../../js/i18n'

  import ClipboardField from '../../../common/fields/ClipboardField'

  import Qrcode from 'vue-qrcode-component'

  export default {
    name: 'account-id',
    components: { Qrcode, ClipboardField },
    data: _ => ({
      isDialogOpened: false,
      i18n
    }),
    computed: {
      ...mapGetters([
        vuexTypes.accountId
      ])
    }
  }
</script>

<style lang="scss" scoped>

  @import '../../../../scss/mixins';

  .account-id__wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .account-id__qr-code {
    @include respond-to-height(650px) {
      zoom: .5;
    }
  }

  .account-id__clipboard {
    width: calc(100% - 50px);
    margin-right: auto;

    @include respond-to(xsmall) {
      width: 100%;
    }
  }

  .account-id__content {
    @include respond-to-height(650px) {
      overflow: auto;
    }
  }

</style>
