<template>
  <md-list-item class="tfa-settings">
    <span class="md-list-item-text"> {{ i18n.set_tfa_enable() }}</span>
    <md-switch class="md-primary" @change="changeState" :value="tfaState"/>

    <md-dialog class="app__dialog" :md-active.sync="isSettingsOpened">
      <md-dialog-title>{{ i18n.set_tfa_enable() }}</md-dialog-title>
      <p class="tfa-settings__explain">{{ i18n.set_tfa_scan_the_qr_code() }}</p>

      <div class="tfa-settings__qr-outer" v-if="inputMode === INPUT_MODES.qr">
        <qrcode class="tfa-settings__qr-code"
                :text="factor.qr"
                :size="225"
                color="#3f4244"
        />
      </div>

      <p class="tfa-settings__explain-additional">{{ i18n.set_or_manually_enter() }}</p>

      <clipboard-field
        class="tfa-settings__copy-secret"
        :value="factor.secret"
        :label="i18n.lbl_secret()"
      />

      <md-dialog-actions class="md-layout md-alignment-center-right">
        <md-button @click="updateFactor" class="md-raised md-primary">Confirm</md-button>
      </md-dialog-actions>

    </md-dialog>

  </md-list-item>
</template>

<script>
  import ClipboardField from '../../../common/fields/ClipboardField'

  import { EventDispatcher } from '../../../../js/events/event_dispatcher'
  import { factorsService } from '../../../../js/services/factors.service'
  import { i18n } from '../../../../js/i18n'

  import Qrcode from 'vue-qrcode-component'

  const ENABLED_FACTOR_PRIORITY = 1
  const TFA_STATES = {
    on: false,
    off: true
  }
  const INPUT_MODES = {
    qr: 'qr',
    manual: 'manual'
  }

  export default {
    name: 'tfa-settings',
    components: { Qrcode, ClipboardField },
    data: _ => ({
      tfaState: TFA_STATES.off,
      inputMode: INPUT_MODES.qr,
      isSettingsOpened: false,
      factor: {
        id: -1,
        secret: null,
        qr: null
      },
      i18n,
      INPUT_MODES
    }),
    created () {
      this.checkState()
    },
    methods: {
      async changeState () {
        switch (this.tfaState) {
          case TFA_STATES.off:
            await this.createFactor()
            this.isSettingsOpened = true
            break
          case TFA_STATES.on: {
            this.tfaState = TFA_STATES.off
          }
        }
      },
      async checkState () {
        let factors
        try {
          factors = (await factorsService.loadFactors())
            .data()
            .filter(factor => factor.type === 'totp')
        } catch (error) {
          console.error(error)
          EventDispatcher.dispatchShowErrorEvent(i18n.unexpected_error())
          return
        }

        if (!factors.length) {
          return
        }

        const disabledFactors = factors
          .filter(factor => factor.attributes.priority === 0)
          .map(factor => factor.id)

        if (disabledFactors.length) {
          await Promise.all(disabledFactors.map(id => factorsService.deleteFactor(id)))
          return
        }

        this.tfaState = TFA_STATES.on
        this.factor.id = factors[0].id
      },
      async createFactor () {
        try {
          const factor = await factorsService.createFactor('totp')
          this.factor.secret = factor.attribute('secret')
          this.factor.qr = factor.attribute('seed')
          this.factor.id = factor.data('id')
        } catch (error) {
          console.error(error)
          if (error.showBanner) {
            error.showBanner(i18n.unexpected_error())
            return
          }
          EventDispatcher.dispatchShowErrorEvent(i18n.unexpected_error())
        }
      },
      async updateFactor () {
        try {
          await factorsService.updateFactor(
            this.factor.id,
            ENABLED_FACTOR_PRIORITY
          )
        } catch (error) {
          if (error.showBanner) {
            error.showBanner(i18n.unexpected_error())
            return
          }
          EventDispatcher.dispatchShowErrorEvent(i18n.unexpected_error())
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import './settings.scss';

  .md-dialog {
    width: 25rem;
  }

  .tfa-settings__qr-outer {
    max-width: 225px;
    margin: 0 auto 20px;
  }

  .tfa-settings__explain {
    margin-bottom: 20px;
  }

  .tfa-settings__explain-additional,
  .tfa-settings__copy-secret {
    margin-bottom: 10px;
  }
</style>
