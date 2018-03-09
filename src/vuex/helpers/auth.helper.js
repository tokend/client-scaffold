import { WalletHelper } from '../../js/helpers/wallet.helper'
import { walletService } from '../../js/services/wallet.service'
import { vuexTypes } from '../types'
import store from '../index'

export class AuthStateHelper {
  /**
   * Checks provided password is correct
   *
   * @param password
   * @return {Boolean}
   */
  static async isPasswordCorrect (password) {
    const email = store.getters[vuexTypes.userEmail]
    const targetWalletId = store.getters[vuexTypes.walletId]

    const kdf = await walletService.loadKdfParamsForEmail(email)

    const { walletId } = WalletHelper.calculateWalletParams(
      password,
      email,
      kdf.attributes().salt,
      kdf.attributes()
    )
    return targetWalletId === walletId
  }
}
