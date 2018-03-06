import { vuexTypes } from '../types'

import { tokensService } from '../../js/services/tokens.service'
import { RecordFactory } from '../../js/records/factory'
import { StateHelper } from '../helpers/state.helper'

export const state = {
  tokens: [],
  userOwnedTokens: [],
  acquired_tokens: []
}

export const mutations = {
  SET_ALL_TOKENS: (state, tokens) => {
    state.tokens = tokens
  },
  SET_USER_OWNED_TOKENS: (state, tokens) => {
    state.user_tokens = tokens
  },
  SET_USER_ACQUIRED_TOKENS: (state, tokens) => {
    state.acquired_tokens = tokens
  }
}

export const actions = {
  async GET_ALL_TOKENS ({ commit }) {
    commit(vuexTypes.SET_ALL_TOKENS, (await tokensService.loadTokens()).map(record => RecordFactory.createTokenRecord(record)))
  },

  async GET_USER_OWNED_TOKENS ({ commit }) {
    const userOwnedTokens = (await tokensService.loadTokensForOwner()).map(token => RecordFactory.createTokenRecord(token))
    await Promise.all(userOwnedTokens.map(token => token.loadAttachedSale()))
    commit(vuexTypes.SET_USER_OWNED_TOKENS, userOwnedTokens)
  }
}

export const getters = {
  tokens: state => state.tokens,
  userOwnedTokens: state => state.userOwnedTokens,
  userAcquiredTokens: _ => StateHelper.deriveTokensFromBalancesDetails(),
  userWalletTokens: _ => StateHelper.deriveTokensFromBalancesDetails(token => token.isWalletToken)
}

export default {
  actions,
  getters,
  mutations,
  state
}
