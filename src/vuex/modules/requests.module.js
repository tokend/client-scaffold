import { tokensService } from '../../js/services/tokens.service'

import { RecordFactory } from '../../js/records/factory'
import { Paginator } from '../../js/helpers/paginator'
import { vuexTypes } from '../types'
import config from '../../config'
import cloneDeep from 'lodash/cloneDeep'

const state = {
  tokenCreationRequests: new Paginator({
    txPerPage: config.REQUESTS_PER_PAGE,
    recordWrp: RecordFactory.createTokenСreationRecord.bind(RecordFactory)
  }),
  preissuanceUploadRequests: new Paginator({
    txPerPage: config.REQUESTS_PER_PAGE,
    recordWrp: RecordFactory.createPreissuanceUploadRecord.bind(RecordFactory)
  })
    recordWrp: RecordFactory.createOfferRecord.bind(RecordFactory)
  }),
  saleCreationRequests: {},
  isInitialized: false
}

const mutations = {
  UPDATE_SALE_REQUEST_LIST (state, tokenCodes) {
    tokenCodes.forEach(code => {
      state.saleCreationRequests[code] = new Paginator({
        recordWrp: (record) => RecordFactory.createSaleСreationRecord(record, code)
      })
    })
  },

  UPDATE_SALE_REQUEST_LIST_ITEM (state, { code, paginator }) {
    const lists = cloneDeep(state.saleCreationRequests)
    lists[code] = paginator
    state.saleCreationRequests = lists
  },

  SET_SALE_REQUEST_LIST_INITIALIZED (state) {
    state.isInitialized = true
  }
}

const actions = {
  INIT_SALE_REQUESTS_LIST ({ commit, rootGetters }) {
    const tokenCodes = Object.keys(rootGetters.accountOwnedTokens)
    commit(vuexTypes.UPDATE_SALE_REQUEST_LIST, tokenCodes)
    commit(vuexTypes.SET_SALE_REQUEST_LIST_INITIALIZED)
  },

  async GET_USER_TOKENS_CREATION_REQUESTS ({ state }) {
    state.tokenCreationRequests.attachInitLoader(() => tokensService.loadTokenCreationRequestsForState())
    return state.tokenCreationRequests.init()
  },

  async NEXT_USER_TOKENS_CREATION_REQUESTS ({ state }) {
    return state.tokenCreationRequests.next()
  }
}

const getters = {
  tokenCreationRequests: state => state.tokenCreationRequests
}

export default {
  actions,
  getters,
  mutations,
  state
}
