import { tokensService } from '../../js/services/tokens.service'
import { reviewableRequestsService } from '../../js/services/reviewable_requests.service'
import { salesService } from '../../js/services/sales.service'
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
  preIssuanceUploadRequests: new Paginator({
    txPerPage: config.REQUESTS_PER_PAGE,
    recordWrp: RecordFactory.createPreIssuanceRequestRecord.bind(RecordFactory)
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
  },

  async GET_USER_PREISSUANCE_UPLOAD_REQUESTS ({ state }) {
    state.preIssuanceUploadRequests.attachInitLoader(() => reviewableRequestsService.loadPreIssuanceRequests())
    return state.preIssuanceUploadRequests.init()
  },

  async NEXT_USER_PREISSUANCE_UPLOAD_REQUESTS ({ state }) {
    return state.preIssuanceUploadRequests.next()
  },

  async GET_USER_SALE_CREATION_REQUESTS ({ state, dispatch, commit }, tokenCode) {
    if (!state.isInitialized) dispatch(vuexTypes.INIT_SALE_REQUESTS_LIST)
    let paginator
    if (state.saleCreationRequests[tokenCode]) {
      paginator = state.saleCreationRequests[tokenCode]
    } else {
      state.saleCreationRequests[tokenCode] = new Paginator({
        recordWrp: record => RecordFactory.createSaleСreationRecord(record, tokenCode)
      })
      paginator = state.saleCreationRequests[tokenCode]
    }

    paginator.attachInitLoader(() => salesService.loadSalesRequests(tokenCode))

    await paginator.init()
    commit(vuexTypes.UPDATE_SALE_REQUEST_LIST_ITEM, { tokenCode, paginator })
  },

  async NEXT_USER_SALE_CREATION_REQUESTS ({ state, commit, dispatch }, tokenCode) {
    const paginator = state.saleCreationRequests[tokenCode]
    await paginator.next()
    commit(vuexTypes.UPDATE_SALE_REQUEST_LIST_ITEM, paginator)
  }
}

const getters = {
  tokenCreationRequests: state => state.tokenCreationRequests,
  preIssuanceUploadRequests: state => state.preIssuanceUploadRequests,
  saleCreationRequests: state => state.saleCreationRequests
}

export default {
  actions,
  getters,
  mutations,
  state
}
