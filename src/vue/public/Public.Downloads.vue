<template>
  <div class="downloads">
    <div class="downloads__android">
      <div class="downloads__android-inner">
        <div class="downloads__android-img">

          <img src="../../../static/android.png" alt="">
        </div>

        <div class="downloads__android-content">

          <div class="downloads__android-content-section">
            <h1 class="downloads__heading">{{ i18n.dl_download_android() }}</h1>
            <p class="downloads__paragraph">{{ i18n.dl_about_android() }}</p>
            <a class="downloads__pm-link"
               href="https://play.google.com/store/apps/details?id=org.tokend.template"
               target="_blank" rel="noopener"
            >
              <img src="../../../static/googleplay.png">
            </a>
          </div>

          <div class="downloads__android-content-section">
            <h1 class="downloads__heading">{{ i18n.dl_use_config() }}</h1>
            <p class="downloads__paragraph">{{ i18n.dl_android_qr() }}</p>
            <qr-code :text="qrValue"
                     :margin="0"
                     :size="175"/>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import QrCode from 'vue-qr'

  import { i18n } from '../../js/i18n'
  import config from '../../config'

  export default {
    name: 'PublicMobiles',
    components: { QrCode },
    data: _ => ({
      i18n
    }),
    computed: {
      qrValue () {
        return JSON.stringify({
          api: config.HORIZON_SERVER,
          storage: config.FILE_STORAGE,
          kyc: `${config.HORIZON_SERVER}/verification`,
          terms: `${config.HORIZON_SERVER}/terms`
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../scss/variables';

  .downloads {
    max-width: 90 * $point;
  }

  .downloads__android-img {
    margin-right: 3 * $point;
    max-width: 30 * $point;
    width: 100%;

    img { width: 100% }
  }

  .downloads__android-inner { display: flex }
  .downloads__android-content { padding-top: 5 * $point }
  .downloads__android-content-section { margin-bottom: 6 * $point }
  .downloads__heading { margin-bottom: 3 * $point }
  .downloads__paragraph {
    margin-bottom: 1.25 * $point;
    max-width: 40 * $point;
    text-align: justify
  }
  .downloads__heading,
  .downloads__paragraph {
    color: $col-md-primary
  }

  .downloads__pm-link {
    display: block;
    max-width: 20 * $point;
    width: 100%;
    margin-left: -.9 * $point;

    img { width: 100% }
  }
</style>
