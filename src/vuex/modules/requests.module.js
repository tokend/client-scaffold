import { tokensService } from '../../js/services/tokens.service'
import { reviewableRequestsService } from '../../js/services/reviewable_requests.service'
import { RecordFactory } from '../../js/records/factory'
import { Paginator } from '../../js/helpers/paginator'
import config from '../../config'

const state = {
  tokenCreationRequests: new Paginator({
    txPerPage: config.REQUESTS_PER_PAGE,
    recordWrp: RecordFactory.createTokenСreationRecord.bind(RecordFactory)
  }),
  preissuanceUploadRequests: new Paginator({
    txPerPage: config.REQUESTS_PER_PAGE,
    recordWrp: RecordFactory.createPreissuanceUploadRecord.bind(RecordFactory)
  })
}

const mutations = {

}

const actions = {
  async GET_USER_TOKENS_CREATION_REQUESTS ({ state }) {
    state.tokenCreationRequests.attachInitLoader(() => tokensService.loadTokenCreationRequestsForState())
    return state.tokenCreationRequests.init()
  },

  async NEXT_USER_TOKENS_CREATION_REQUESTS ({ state }) {
    return state.tokenCreationRequests.next()
  },

  async GET_USER_PREISSUANCE_UPLOAD_REQUESTS ({state}) {
    state.preissuanceUploadRequests.attachInitLoader(() => reviewableRequestsService.loadPreissuanceUploadRequests())
    return state.preissuanceUploadRequests.init()
  },

  async NEXT_USER_PREISSUANCE_UPLOAD_REQUESTS ({ state }) {
    return state.preissuanceUploadRequests.next()
  }
}

const getters = {
  tokenCreationRequests: state => state.tokenCreationRequests,
  preissuanceUploadRequests: state => state.preissuanceUploadRequests
}

export default {
  actions,
  getters,
  mutations,
  state
}
