import { Service } from './service'
import common from './auth/helpers/common'

export class WalletService extends Service {
  /**
   * Sign up user to the system
   *
   * @async
   *
   * @param credentials
   * @param credentials.email
   * @param credentials.password
   * @param recoveryKeypair - random keypair containing recovery seed. IMPORTANT: User will need to copy this seed to make account
   *                          recovery possible. Seed itself is NOT being stored anywhere, so user should know he has the
   *                          only possibility to save it
   * @returns {string} walletId - wallet id of created wallet
   */
  async signup (credentials, recoveryKeypair) {
    const kdf = await common.getDefaultKDF()
    const { rawKeychainData, accountId } = common.generateKeychainData()
    const walletData = common.generateWalletData(
      credentials.password,
      credentials.email,
      kdf.attributes(),
      rawKeychainData,
      accountId
    )
    const factorData = await common.generateFactorData(
      credentials.password,
      credentials.email,
      kdf.attributes()
    )
    const recoveryData = await common.generateRecoveryData(
      recoveryKeypair.secret(),
      credentials.email,
      kdf.attributes(),
      rawKeychainData,
      recoveryKeypair.accountId()
    )
    const wallet = await this.createWallet(walletData, kdf.data(), factorData, recoveryData)
    return wallet.data('id')
  }

  /**
   * Log in user to the system
   *
   * @async
   * @param credentials
   * @param credentials.email
   * @param credentials.password
   *
   * @returns {Promise<boolean>}
   */
  async login (credentials) {
    const kdf = await common.getWalletKDF(credentials.email)
    const { walletId, walletKey } = common.calculateWalletParams(
      credentials.password,
      credentials.email,
      kdf.attributes().salt,
      kdf.attributes()
    )
    const wallet = await this.loadWallet(walletId)
    const keychainData = common.decryptKeychainData(wallet.attribute('keychain_data'), walletKey)
    common.storeLoginData(deriveLoginData(wallet, keychainData))
    return Promise.resolve(true)
  }

  /**
   * Loads wallet details by id
   *
   * @param {string} id - wallet id
   * @return {ResponseBuilder}
   */
  loadWallet (id) {
    return this._apiRequestBuilder.wallets()
      .walletId(id)
      .get()
  }

  /**
   * Creates user wallet
   *
   * @param walletData
   * @param kdfData
   * @param factorData
   * @param recoveryData
   * @return {*|void}
   */
  // TODO: write proper detailed doc
  createWallet (walletData, kdfData, factorData, recoveryData) {
    const kdf = { data: { type: kdfData.type, id: kdfData.id } }
    return this._apiRequestBuilder.wallets()
      .data(walletData)
      .type('wallet')
      .relationship('kdf', kdf)
      .relationship('factor', factorData)
      .relationship('recovery', recoveryData)
      .json()
      .post()
  }
}

export const walletService = new WalletService()

function deriveLoginData (wallet, keychainData) {
  const publicKey = keychainData.accountId
  const seed = keychainData.seed
  const accountId = wallet.attribute('account_id')
  const email = wallet.attribute('email')
  const walletId = wallet.data('id')

  return { accountId, publicKey, seed, walletId, email }
}
