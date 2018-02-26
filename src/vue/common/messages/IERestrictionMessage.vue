<template>
  <div class="ie-restriction-message"
       v-if="isBrowserDeprecated"
       :class="{ 'ie-restriction-message--logged-in': isLoggedIn }"
  >

    <p>
      It seems that your web browser is out-of-date. We can't guarantee that all features will work properly.
      Please update your browser for more security, comfort and the best experience.
    </p>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { vuexTypes } from '../../../store/types'
  import UAParser from 'ua-parser-js'

  export default {
    name: 'ie-restriction-message',

    computed: {
      ...mapGetters([
        vuexTypes.isLoggedIn
      ]),
      isBrowserDeprecated () {
        const parser = new UAParser()
        const browser = parser.getBrowser()
        return (browser.name === 'IE[Mobile]' || browser.name === 'IE')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../assets/style/variables';

  .ie-restriction-message {
    background: lighten($col-active, 15%);
    color: $col-btn-text;
    padding: 20px 0;
    text-align: center;
    width: 100%;

    &--logged-in {
      margin-top: 50px;
    }
  }
</style>
