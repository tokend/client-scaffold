const chai = require('chai')
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

import common from './common'
import { Keypair } from 'swarm-js-sdk'

import store from '../../../store/index'

describe('common auth metods', () => {
  it ('new keypair is valid', () => {
    const { accountId, rawKeychainData } = common.generateKeychainData()
    const keypair = JSON.parse(rawKeychainData)

    expect(Keypair.isValidPublicKey(keypair.accountId)).to.equal(true)
    expect(Keypair.isValidPublicKey(accountId)).to.equal(true)
    expect(Keypair.isValidSecretKey(keypair.seed)).to.equal(true)
  })

  it('correctly calculates wallet id', () => {
    const correctId = 'a3fb18e6a8802a63487a2f07b42531d1d80a77f76025d261b0becee243d4833c'
    const correctKey = [837860596, -133566155, -1160729477, -354928495, 1793618548, -347071477, 169273494, -1270669153]
    const email = 'logvinenko.js@gmail.com'
    const password = 'qwe123'
    const kdf = {algorithm: 'scrypt', bits: 256, n: 4096, p: 1, r: 8, salt: 'SHZz77a3lqQ67euvoHr7Lw=='}
    const salt = 'SHZz77a3lqQ67euvoHr7Lw=='
    const { walletKey, walletId } = common.calculateWalletParams(password, email, salt, kdf)
    expect(walletId).to.equal(correctId)
    expect(walletKey).to.deep.equal(correctKey)
  })

  it('do not lose credentials when generating wallet data', () => {
    const rawKeychainData = '{"seed":"SAKJX233SF67OR7KX5KG2SJUPYGKXH26NUHKKQN5WKLDWAXR3HS6GHHT","accountId":"GBZVL6LPMVMGUI66N2BSBLSBEFYEN2CN7ERWB2YFWPDOZLIJZGOVM5RA"}'
    const kdf = {algorithm: 'scrypt', bits: 256, n: 4096, p: 1, r: 8, salt: 'x/Z0nL17AqP6dwGdNhm+nA=='}
    const email = 'logvinenko.js@gmail.com'
    const password = 'qwe123'
    const accountId = 'GBZVL6LPMVMGUI66N2BSBLSBEFYEN2CN7ERWB2YFWPDOZLIJZGOVM5RA'
    const walletData = common.generateWalletData(password, email, kdf, rawKeychainData, accountId)

    expect(walletData.attributes.email).to.be.equal(email)
    expect(walletData.attributes.account_id).to.be.equal(accountId)
  })

  it('correctly decrypts keychain data', () => {
    const encryptedKeychainData = 'eyJJViI6IjRJRloxWDdFWGx4VFVPbGoiLCJjaXBoZXJUZXh0IjoiemgwY3BsN2taUkdvbGhsTFFEQ2Y4RzFVYm8rZzl3dmcvWWlvUWMxKy9oQThGRFc3NFl3QndmY0t0TXRaaUVmNTd6U0RtVDhRQXJDK0RxNndvQzhvSVBQRnJtVEFqWktRR0phbHpTeExXa1E1YzA0Ung1eFRja2J2QjFNSXBaYlpsYjFGbWF5cmNzeXJTU2Y5c1FhblFBTTFiMkFCdVhaMjVxUkt2dWhvbHNxVG1SSHp4cmdrM09hbE9LT3FHcGN1TVl6SzREUlN6ZWNZTmc9PSIsImNpcGhlck5hbWUiOiJhZXMiLCJtb2RlTmFtZSI6ImdjbSJ9'
    const key = [837860596, -133566155, -1160729477, -354928495, 1793618548, -347071477, 169273494, -1270669153]
    const decryptedKeychainData = common.decryptKeychainData(encryptedKeychainData, key)
    const correctSeed = 'SAKJX233SF67OR7KX5KG2SJUPYGKXH26NUHKKQN5WKLDWAXR3HS6GHHT'
    const correctAccountID = 'GBZVL6LPMVMGUI66N2BSBLSBEFYEN2CN7ERWB2YFWPDOZLIJZGOVM5RA'

    expect(decryptedKeychainData.seed).to.equal(correctSeed)
    expect(Keypair.isValidSecretKey(decryptedKeychainData.seed)).to.equal(true)
    expect(decryptedKeychainData.accountId).to.equal(correctAccountID)
    expect(Keypair.isValidPublicKey(decryptedKeychainData.accountId)).to.equal(true)
  })

  it('login data is available from vuex store after dispatching an action', () => {
    const accountId = 'GBZVL6LPMVMGUI66N2BSBLSBEFYEN2CN7ERWB2YFWPDOZLIJZGOVM5RA'
    const email = 'logvinenko.js@gmail.com'
    const publicKey = 'GBZVL6LPMVMGUI66N2BSBLSBEFYEN2CN7ERWB2YFWPDOZLIJZGOVM5RA'
    const seed = 'SAKJX233SF67OR7KX5KG2SJUPYGKXH26NUHKKQN5WKLDWAXR3HS6GHHT'
    const walletId = 'a3fb18e6a8802a63487a2f07b42531d1d80a77f76025d261b0becee243d4833c'

    common.storeLoginData({ accountId, email, publicKey, seed, walletId })

    expect(store.getters.walletId).to.equal(walletId)
    expect(store.getters.email).to.equal(email)
    expect(store.getters.publicKey).to.equal(publicKey)
    expect(store.getters.userAccountId).to.equal(accountId)
    expect(store.getters.seed).to.equal(seed)
  })
})
