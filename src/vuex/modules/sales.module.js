import { Keypair } from 'swarm-js-sdk'
import { Paginator } from '../../js/helpers/paginator'
import { RecordFactory } from '../../js/factories/records/record_factory'
import { vuexTypes } from '../types'
import { accountsService } from '../../js/services/accounts.service'
import { salesService } from '../../js/services/sales.service'
import { StateHelper } from '../helpers/state.helper'

const state = {
  sales: new Paginator({
    recordWrp: RecordFactory.createSaleRecord.bind(RecordFactory)
  }),
  starred: []
}

const mutations = {
  RESET_STARRED_SALES: (state) => {
    state.starred = []
  },
  ADD_STARRED_SALE: (state, sale) => {
    state.starred.push(sale)
  }
}

const actions = {
  async GET_SALES ({ dispatch, state }, filters) {
    const sales = state.sales
    sales.attachInitLoader(salesService.loadSales.bind(salesService))
    await sales.init(filters)
    await dispatch(vuexTypes.GET_OWNERS, sales.records)
  },

  async NEXT_SALES ({ commit, dispatch, state }) {
    const records = await state.sales.next()
    await dispatch(vuexTypes.GET_OWNERS, records)
  },

  async GET_OWNERS ({ commit }, sales) {
    const owners = sales
      .map(sale => sale.owner)
      .filter(owner => Keypair.isValidPublicKey(owner))
    const details = (await accountsService.loadMultipleAccountDetails(owners)).data('users')
    sales.forEach(sale => {
      const owner = sale.owner
      if (details[owner]) {
        sale.syndicate = details[owner].email
      }
    })
    return Promise.resolve(true)
  },

  async GET_STARRED_SALES ({ commit, dispatch, rootGetters }) {
    const tokenCodes = rootGetters.userFavorites.map(item => item.key)
    const sales =
        (await Promise.all(tokenCodes.map(code => salesService.loadSaleByTokenCode(code))))
          .map(sale => RecordFactory.createSaleRecord(sale))

    await dispatch('GET_OWNERS', sales)
    commit(vuexTypes.RESET_STARRED_SALES)
    sales.forEach(sale => commit(vuexTypes.ADD_STARRED_SALE, sale))
  }
}

const getters = {
  sales: state => state.sales.records,
  isSalesLoaded: state => state.sales.isLoaded,
  saleIds: _ => StateHelper.getSaleIdWhereUSerParticipated(),
  starredSales: state => state.starred
}

export default {
  mutations,
  actions,
  getters,
  state
}
