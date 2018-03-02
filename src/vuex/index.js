import Vue from 'vue'
import Vuex from 'vuex'

import isEmptyObject from 'lodash/isEmpty'

import getters from './getters'
import * as actions from './actions'
import * as mutations from './mutations'
import { state } from './state/index'
import plugins from './plugins'

// modules:
import account from './modules/account.module'
import offers from './modules/offers.module'
import prices from './modules/prices.module'
import sales from './modules/sales.module'
import tokens from './modules/tokens.module'
import transactions from './modules/transactions.module'
import user from './modules/user.module'
import wallet from './modules/wallet.module'
import withdrawals from './modules/withdrawals.module'

Vue.use(Vuex)
checkForSavedData()

const store = new Vuex.Store({
  actions,
  getters,
  mutations,
  plugins,
  state,
  modules: {
    account,
    offers,
    prices,
    sales,
    tokens,
    transactions,
    user,
    wallet,
    withdrawals
  }
})

export default store

function checkForSavedData () {
  if (state.account && !isEmptyObject(state.account)) {
    account.state = state.account
  }
  if (state.user && !isEmptyObject(state.user)) {
    user.state = state.user
  }
}
