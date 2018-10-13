import { CryptoUtil } from './crypto.util'

export default {
  methods: {
    calculateHash (file) {
      return CryptoUtil.sha256(file)
    }
  }
}
