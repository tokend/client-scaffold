import { Keypair, TransactionBuilder, SetOptionsBuilder } from 'swarm-js-sdk'
import { defaultSignerParams } from '../const/const'
import { initHorizonServer } from './server.helper'
import { parseError } from '../parsers/error.parser'
import { errors } from '../errors/error_factory'
import get from 'lodash/get'

export class TxHelper {
  static createRecoveryTx (newKeypair, recoverySeed, accountId) {
    return this._createReplaceSignerTransaction(newKeypair, accountId, Keypair.fromSecret(recoverySeed))
  }

  /**
   * @param newKeypair
   * @param accountId
   * @param keypair
   * @return {Promise<string>} transactionEnvelope
   */
  static createChangePasswordTx (newKeypair, accountId, keypair) {
    return this._createReplaceSignerTransaction(newKeypair, accountId, keypair)
  }

  static async _createReplaceSignerTransaction (newKeypair, accountId, keypair) {
    let signers
    let operations
    try {
      signers = get(await this._loadAccountSigners(accountId), 'signers')
      operations = [ this._addSignerOp(newKeypair.accountId()), ...this._removeAllSignersOps(signers, accountId) ]
    } catch (error) {
      switch (parseError(error).constructor) {
        case errors.NotFoundError:
          operations = [ this._addSignerOp(newKeypair.accountId()), this._removeMasterOp() ]
          break
        default:
          throw new Error(error)
      }
    }

    const tx = new TransactionBuilder(this._createFakeAccountStruct(accountId))
    tx.operations = operations

    const txEnv = tx.build()
    txEnv.sign(keypair)

    return txEnv.toEnvelope().toXDR().toString('base64')
  }

  static _removeAllSignersOps (signers, accountId) {
    return signers
      .map(signer => isMaster(signer, accountId) ? this._removeMasterOp() : this._removeOneSignerOp(signer))

    function isMaster (signer, masterAccountId) {
      return signer.public_key === masterAccountId
    }
  }

  static _removeMasterOp () {
    return SetOptionsBuilder.setOptions({
      masterWeight: 0
    })
  }

  static _removeOneSignerOp (signer) {
    return SetOptionsBuilder.setOptions({
      signer: {
        pubKey: signer.public_key,
        weight: 0,
        identity: signer.signer_identity,
        signerType: 1
      }
    })
  }

  static _addSignerOp (newAccountId) {
    return SetOptionsBuilder.setOptions({
      signer: {
        ...defaultSignerParams,
        pubKey: newAccountId
      }
    })
  }

  static _loadAccountSigners (id) {
    const server = initHorizonServer()
    return server.accounts()
      .signers(id)
      .call()
  }

  static _createFakeAccountStruct (id) {
    return {
      accountId () {
        return id
      }
    }
  }
}
