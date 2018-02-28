import { Keypair } from 'swarm-js-sdk'
import { TxHelper } from '../helpers/tx.helper'
import { walletService, WalletService } from './wallet.service'
import { WalletHelper } from '../helpers/wallet.helper'
import { StateHelper } from '../../vuex/helpers/state.helper'
import { ErrorFactory, errorTypes } from '../errors/error_factory'

export class AuthService extends WalletService {
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
    const kdf = await walletService.loadDefaultKdfParams()

    const { rawKeychainData, accountId } = WalletHelper.getRandomKeychainData()

    const walletAttributes = WalletHelper.getRandomWalletAttributes(
      credentials.password,
      credentials.email,
      kdf.attributes(),
      rawKeychainData,
      accountId
    )

    const factorAttributes = await WalletHelper.getRandomFactorAttributes(
      credentials.password,
      credentials.email,
      kdf.attributes()
    )

    const recoveryAttributes = await WalletHelper.getRandomRecoveryAttributes(
      recoveryKeypair.secret(),
      credentials.email,
      kdf.attributes(),
      rawKeychainData,
      recoveryKeypair.accountId()
    )

    const wallet = await this.createWallet(walletAttributes, kdf.data(), factorAttributes, recoveryAttributes)
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
   * @returns {Promise<void>}
   */
  async login (credentials) {
    const kdf = await this.loadKdfParamsForEmail(credentials.email)
    const { walletId, walletKey } = WalletHelper.calculateWalletParams(
      credentials.password,
      credentials.email,
      kdf.attributes().salt,
      kdf.attributes()
    )
    const wallet = await this.loadWallet(walletId)
    const keychainData = WalletHelper.decryptKeychainData(wallet.attribute('keychain_data'), walletKey)
    StateHelper.storeLoginData(this._deriveLoginData(wallet, keychainData))
  }

  _deriveLoginData (wallet, keychainData) {
    const publicKey = keychainData.accountId
    const seed = keychainData.seed
    const accountId = wallet.attribute('account_id')
    const email = wallet.attribute('email')
    const walletId = wallet.data('id')

    return {
      accountId,
      publicKey,
      walletId,
      email,
      seed
    }
  }

  /**
   * Changes users password
   *
   * @async
   * @param {object} opts
   * @param {string} opts.email
   * @param {string} opts.newPassword
   * @param opts
   * @return {Promise<void>}
   */
  async changePassword (opts) {
    const email = opts.email
    const newPassword = opts.newPassword
    const newKeypair = Keypair.random()
    const envelope = await TxHelper.createChangePasswordTx(newKeypair, this._accountId, this._keypair)
    const kdf = await this.loadDefaultKdfParams()

    const options = this._composeOptions({
      kdf,
      envelope,
      newKeypair,
      newPassword,
      email
    })

    await this.updateWallet(options)

    StateHelper.storeLoginData({
      seed: newKeypair.secret(),
      publicKey: newKeypair.accountId(),
      walletId: options.walletAttributes.id
    })
  }

  /**
   * Makes account recovery
   *
   * @async
   * @param {object} opts
   * @param {string} opts.recoverySeed
   * @param {string} opts.email
   * @param {string} opts.newPassword
   * @return {Promise<void>}
   */
  async makeRecovery (opts) {
    const recoverySeed = opts.recoverySeed
    const newPassword = opts.newPassword
    const email = opts.email
    const newKeypair = Keypair.random()
    const kdf = await this.loadKdfParamsForEmail(email, true)

    const walletParams = WalletHelper.calculateWalletParams(recoverySeed,
      email,
      kdf.attributes().salt,
      kdf.attributes()
    )

    const recoveryWalletId = walletParams.walletId
    const wallet = await this.loadWallet(recoveryWalletId)
    const envelope = await TxHelper.createRecoveryTx(newKeypair, recoverySeed, wallet.attribute('account_id'))

    const options = this._composeOptions({
      kdf,
      envelope,
      newKeypair,
      newPassword,
      email
    })

    await this.updateWallet({
      ...options,
      recoveryWalletId,
      recoverySeed
    })
  }

  /**
   * @param {object} opts
   * @param {ResponseBuilder} opts.kdf
   * @param {string} opts.envelope
   * @param {} opts.newKeypair
   * @param {string} opts.newPassword
   * @param {string} opts.email
   * @return {object}
   */
  _composeOptions (opts) {
    const kdf = opts.kdf
    const envelope = opts.envelope
    const keypair = opts.newKeypair
    const newPassword = opts.newPassword
    const email = opts.email

    const keychainData = { seed: keypair.secret(), accountId: keypair.accountId() }
    const transactionAttributes = { data: { attributes: { envelope } } }
    const kdfAttributes = kdf.data()

    const walletAttributes = WalletHelper.getRandomWalletAttributes(
      newPassword,
      email,
      kdf.attributes(),
      JSON.stringify(keychainData),
      keychainData.accountId
    )

    const factorAttributes = WalletHelper.getRandomFactorAttributes(
      newPassword,
      email,
      kdf.attributes()
    )

    return {
      factorAttributes,
      kdfAttributes,
      transactionAttributes,
      walletAttributes
    }
  }

  /**
   * Checks provided password is correct
   *
   * @param opts
   * @param opts.email
   * @param opts.password
   * @param opts.walletId
   * @return {Promise<void>}
   */
  async checkPassword (opts) {
    const email = opts.email
    const password = opts.password
    const targetWalletId = opts.walletId || this._walletId
    const kdf = await walletService.loadKdfParamsForEmail(email)

    const { walletId } = WalletHelper.calculateWalletParams(
      password,
      email,
      kdf.attributes().salt,
      kdf.attributes()
    )
    if (targetWalletId !== walletId) ErrorFactory.throwError(errorTypes.WrongPasswordError)
  }
}

export const authService = new AuthService()
