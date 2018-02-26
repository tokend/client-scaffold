import { Keypair } from 'swarm-js-sdk'
// import config from '../../config'
import store from '../../store/index'

import common from './helpers/common'

import { createTransaction } from './helpers/password_transaction'
import { ErrorFactory, errorTypes } from '../../factories/errors/error_factory'
import { TxHelper } from '../../helpers/tx.helper'
import request from '../../builders/request_builder/index'

import { walletService } from '../wallet.service'

export default {
  async changePassword (newPassword) {
    const email = store.getters.email
    const newKeypair = Keypair.random()
    const envelope = await createTransaction(newKeypair)
    const kdf = await common.getDefaultKDF()
    const factorData = await common.generateFactorData(
      newPassword,
      email,
      kdf.attributes()
    )
    const options = composeOptions(kdf, envelope, newKeypair, newPassword)
    await updateWallet({ ...options, factorData })
    const loginData = {
      seed: newKeypair.secret(),
      publicKey: newKeypair.accountId(),
      accountId: store.getters.userAccountId,
      email,
      walletId: options.walletData.id
    }
    common.storeLoginData(loginData)
    return Promise.resolve(true)
  },

  async makeRecovery (recoverySeed, email, newPassword) {
    const newKeypair = Keypair.random()
    const kdf = await common.getWalletKDF(email, true)
    const factorData = await common.generateFactorData(
      newPassword,
      email,
      kdf.attributes()
    )
    const walletParams = common.calculateWalletParams(recoverySeed,
      email,
      kdf.attributes().salt,
      kdf.attributes()
    )
    const recoveryWalletId = walletParams.walletId
    const walletData = await walletService.loadWallet(recoveryWalletId)
    const envelope = await TxHelper.createRecoveryTx(newKeypair, recoverySeed, walletData.attribute('account_id'))
    const options = composeOptions(kdf, envelope, newKeypair, newPassword, email)
    await updateWalletToRecover({ ...options, factorData, recoveryWalletId, recoverySeed })
  }
}

export async function checkPassword (password) {
  const email = store.getters.email
  const targetWalletId = store.getters.walletId
  const kdf = await common.getWalletKDF(email)
  const { walletId } = common.calculateWalletParams(
    password,
    email,
    kdf.attributes().salt,
    kdf.attributes()
  )
  const isPasswordCorrect = Boolean(targetWalletId === walletId)
  if (!isPasswordCorrect) {
    ErrorFactory.throwError(errorTypes.WrongPasswordError)
  }
}

function composeOptions (kdf, envelope, keypair, newPassword, email = store.getters.email) {
  const keychainData = {
    seed: keypair.secret(),
    accountId: keypair.accountId()
  }

  const transactionData = {
    data: {
      attributes: {
        envelope
      }
    }
  }

  const kdfData = kdf.data()

  const walletData = common.generateWalletData(
    newPassword,
    email,
    kdf.attributes(),
    JSON.stringify(keychainData),
    keychainData.accountId
  )

  return { walletData, transactionData, kdfData }
}

async function updateWallet ({ walletData, transactionData, kdfData, factorData }) {
  const walletId = store.getters.walletId
  const kdf = { data: { type: kdfData.type, id: kdfData.id } }
  const requestBuilder = request.wallets()

  const response = await requestBuilder
    .walletId(walletId)
    .data(walletData)
    .type('wallet')
    .relationship('transaction', transactionData)
    .relationship('kdf', kdf)
    .relationship('factor', factorData)
    .sign(this._keypair)
    .json()
    .put()
  return response
}

async function updateWalletToRecover ({ recoveryWalletId, transactionData, walletData, kdfData, factorData, recoverySeed }) {
  const walletId = recoveryWalletId
  const kdf = { data: { type: kdfData.type, id: kdfData.id } }
  const requestBuilder = request.wallets()

  return requestBuilder
    .walletId(walletId)
    .data(walletData)
    .type('wallet')
    .relationship('transaction', transactionData)
    .relationship('kdf', kdf)
    .relationship('factor', factorData)
    .sign(Keypair.fromSecret(recoverySeed))
    .json()
    .put()
}
