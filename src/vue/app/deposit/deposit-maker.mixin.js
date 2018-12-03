import {
  mapGetters,
  mapActions
} from 'vuex'
import { vuexTypes } from '@/vuex/types'

import SelectFieldUnchained from '../../common/fields/SelectFieldUnchained'
import Qrcode from 'vue-qrcode-component'
import ClipboardField from '../../common/fields/ClipboardField'

export default {
  components: {
    SelectFieldUnchained,
    Qrcode,
    ClipboardField
  },
  data: _ => ({
    form: {
      tokenCode: ''
    },
    isPending: false
  }),
  computed: {
    ...mapGetters([
      vuexTypes.userAcquiredTokens
    ]),
    tokenCodes () {
      return this.userAcquiredTokens
        .filter(token => token.isDepositable)
        .map(token => token.code)
    },
    selectedToken () {
      return this.userAcquiredTokens
        .find(token => token.code === this.form.tokenCode) || null
    }
  },
  methods: {
    ...mapActions({
    }),
    setTokenCode () {
      this.form.tokenCode = this.tokenCodes[0] || null
    }
  },
  watch: {
    // NOTE: you probably will want to override the tokenCodes prop in your
    // component:
    tokenCodes: {
      handler: 'setTokenCode',
      immediate: true
    }
  }
}
