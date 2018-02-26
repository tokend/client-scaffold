import { vuexTypes } from '../types'
import { RecordFactory } from '../../js/factories/records/record_factory'
import { pricesService } from '../../js/services/prices.service'

const state = {
  asset_pairs: []
}

export const mutations = {
  SET_ASSET_PAIRS: (state, assetPairs) => {
    state.asset_pairs = assetPairs
  }
}

export const actions = {
  async GET_ASSET_PAIRS ({ commit }) {
    const records = await pricesService.loadAssetPairs()
    const pairs = records.map(record => RecordFactory.createAssetPairRecord(record))
    commit(vuexTypes.SET_ASSET_PAIRS, pairs)
  }
}

export const getters = {
  assetPairs: state => state.asset_pairs,
  assetRates: state => state.asset_pairs
    .map(pair => ({ code: pair.base, price: pair.current_price }))
    .reduce((rates, pair) => { rates[pair.code] = pair.price; return rates }, {}),
  assetRatesUSD: state => state.asset_pairs
    .filter(pair => pair.quote === 'USD')
    .map(pair => ({ code: pair.base, price: pair.current_price }))
    .reduce((rates, pair) => { rates[pair.code] = pair.price; return rates }, {}),
  assetRatesSUN: state => state.asset_pairs
    .filter(pair => pair.quote === 'SUN')
    .map(pair => ({ code: pair.base, price: pair.current_price }))
    .reduce((rates, pair) => { rates[pair.code] = pair.price; return rates }, {})
}

export default {
  actions,
  getters,
  mutations,
  state
}
