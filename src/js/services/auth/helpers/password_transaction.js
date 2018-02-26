import { Keypair, TransactionBuilder, SetOptionsBuilder } from 'swarm-js-sdk'
import store from '../../../store/index'
import { defaultSignerParams } from '../../../const/const'
import { initHorizonServer } from '../../../helpers/server.helper'

export async function createTransaction (keypair, account = store.getters.userAccountId) {
  const tx = await composeMultiplePasswordTransaction(keypair, account)
  return tx
}

export async function createRecoveryTransaction (newKeypair, recoverySeed, accountId) {
  const signer = {
    pubKey: newKeypair.accountId(),
    ...defaultSignerParams
  }
  const operations = [SetOptionsBuilder.setOptions({ signer })]
  const recoveryKeypair = Keypair.fromSecret(recoverySeed)
  const server = initHorizonServer()
  const account = await server.loadAccountWithSign(accountId, recoveryKeypair)

  const tx = new TransactionBuilder(account)
  tx.operations = operations

  const txEnv = tx.build()
  txEnv.sign(recoveryKeypair)

  return txEnv.toEnvelope().toXDR().toString('base64')
}

// TODO: need to replace with usage TransactionHelper class
async function composeMultiplePasswordTransaction (newKeypair) {
  const operations = [createAddSignerOperation(newKeypair.accountId()), ...createRemoveSignerOperations(newKeypair.accountId())]
  const server = initHorizonServer()
  const accountId = store.getters.userAccountId
  const keypair = store.getters.keypair
  const account = await server.loadAccountWithSign(accountId, keypair)

  const tx = new TransactionBuilder(account)
  tx.operations = operations

  const txEnv = tx.build()
  txEnv.sign(keypair)

  return txEnv.toEnvelope().toXDR().toString('base64')
}

function createAddSignerOperation (newAccountId) {
  const signer = {
    ...findCurrentSigner(),
    pubKey: newAccountId
  }
  const operation = SetOptionsBuilder.setOptions({ signer })
  return operation
}

function createRemoveSignerOperations () {
  const currentAccountId = store.getters.userAccountId
  const currentUserPublicKey = store.getters.publicKey
  const operations = []
  const account = store.getters.account

  account.signers
    .sort(signer => signer.publicKey === currentUserPublicKey ? 1 : 0)
    .reverse()
    .forEach(signer => {
      if (signer.public_key === currentAccountId) {
        operations.push(createRemoveMasterOperation())
      } else if (signer.public_key === currentUserPublicKey) {
        operations.push(createRemoveSignerOperation(signer))
      }
    })

  return operations
}

function findCurrentSigner () {
  const currentAccountId = store.getters.publicKey
  const account = store.getters.account

  for (const signer of account.signers) {
    if (signer.public_key === currentAccountId) {
      return {
        signerType: signer.signer_type_i,
        weight: signer.weight,
        identity: signer.signer_identity
      }
    }
  }
  return {}
}

function createRemoveMasterOperation () {
  return SetOptionsBuilder.setOptions({
    masterWeight: 0
  })
}

function createRemoveSignerOperation (signer) {
  return SetOptionsBuilder.setOptions({
    signer: {
      pubKey: signer.public_key,
      weight: 0,
      identity: signer.signer_identity,
      signerType: 1
    }
  })
}
