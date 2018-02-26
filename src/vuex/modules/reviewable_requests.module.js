import { vuexTypes } from '../types'
import config from '../../config'
import { reviewableRequestTypes } from '../../js/factories/reviewable_requests/reviewable_request_types'
import { reviewableRequestsService } from '../../js/services/reviewable_requests.service'

const state = {
  reviewable_requests: [],
  pending_reviewable_requests: [],
  paired_reviewable_requests: [],
  next: () => {},
  isPendingRequestsLoaded: false
}

const mutations = {
  SET_REVIEWABLE_REQUESTS: (state, requests) => {
    state.reviewable_requests = requests
  },
  SET_PENDING_REVIEWABLE_REQUESTS: (state, requests) => {
    state.pending_reviewable_requests = requests
  },
  SET_PAIRED_REVIEWABLE_REQUESTS: (state, requests) => {
    state.paired_reviewable_requests = requests
  },
  UPDATE_PAIRED_REVIEWABLE_REQUESTS: (state, requests) => {
    state.paired_reviewable_requests = state.paired_reviewable_requests.concat(requests)
  },
  SET_REQUEST_STATE: (state, { requestId, stateToSet }) => {
    state.paired_reviewable_requests.forEach(requestPair => {
      const tokenRequest = requestPair.tokenRequest
      if (tokenRequest.requestID === requestId) {
        tokenRequest.state = stateToSet
      }
    })
  },
  SET_NEXT_PAIRED_REVIEWABLE_REQUEST_PAGE: (state, next) => {
    state.next = next
  },
  SET_LOADED_STATE () {
    state.isPendingRequestsLoaded = true
  },
  SET_NOT_LOADED_STATE () {
    state.isPendingRequestsLoaded = false
  }
}

const actions = {
  async GET_REVIEWABLE_REQUESTS ({ commit }) {
    commit(vuexTypes.SET_REVIEWABLE_REQUESTS, await reviewableRequestsService.loadTokensReviewableRequests())
  },
  async GET_PENDING_REVIEWABLE_REQUESTS ({ commit }) {
    commit(vuexTypes.SET_REVIEWABLE_REQUESTS, await reviewableRequestsService.loadTokensReviewableRequests())
  },
  async GET_PAIRED_REVIEWABLE_REQUESTS ({ commit }) {
    commit(vuexTypes.SET_NOT_LOADED_STATE)
    const { requestPairs, next } = await reviewableRequestsService.loadAssetsReviewableRequestsWithCorrespondingFund()
    commit(vuexTypes.SET_NEXT_PAIRED_REVIEWABLE_REQUEST_PAGE, next)
    commit(vuexTypes.SET_PAIRED_REVIEWABLE_REQUESTS, requestPairs)
    if (requestPairs.length < config.TRANSACTIONS_PER_PAGE) {
      commit(vuexTypes.SET_LOADED_STATE)
    }
  },
  async GET_NEXT_PAIRED_REVIEWABLE_REQUESTS ({ commit, state }) {
    commit(vuexTypes.SET_NOT_LOADED_STATE)
    const { requestPairs, next } = await reviewableRequestsService.loadAssetsReviewableRequestsWithCorrespondingFund(state.next)
    commit(vuexTypes.SET_NEXT_PAIRED_REVIEWABLE_REQUEST_PAGE, next)
    commit(vuexTypes.UPDATE_PAIRED_REVIEWABLE_REQUESTS, requestPairs)
    if (requestPairs.length < config.TRANSACTIONS_PER_PAGE) {
      commit(vuexTypes.SET_LOADED_STATE)
    }
  },
  SET_REQUEST_STATE ({ commit }, { requestId, state }) {
    commit(vuexTypes.SET_REQUEST_STATE, { requestId, stateToSet: state })
  }
}

const getters = {
  reviewableRequests: state => state.reviewable_requests,
  pendingReviewableRequests: state => state.pending_reviewable_requests,
  tokenCreationRequests: state => state.reviewable_requests.filter(request => request instanceof reviewableRequestTypes.TokenCreationRequest),
  pendingTokenCreationRequests: state => state.pending_reviewable_requests.map(request => request instanceof reviewableRequestTypes.TokenCreationRequest),
  saleCreationRequests: state => state.reviewable_requests.filter(request => request instanceof reviewableRequestTypes.SaleCreationRequest),
  pendingSaleCreationRequests: state => state.pending_reviewable_requests.map(request => request instanceof reviewableRequestTypes.SaleCreationRequest),
  pairedPendingReviewableRequests: state => state.paired_reviewable_requests,
  isAllPendingRequestsLoaded: state => state.isPendingRequestsLoaded
}

export default {
  actions,
  getters,
  mutations,
  state
}
