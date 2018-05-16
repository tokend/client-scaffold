import { TokensService } from '../../js/services/tokens.service'

import { RecordFactory } from '../../js/records/factory'
import { Paginator } from '../../js/helpers/paginator'

const state = {
  tokenCreationRequests: new Paginator({
    txPerPage: 10,
    recordWrp: RecordFactory.createOfferRecord.bind(RecordFactory)
  })
}

const mutations = {

}

const actions = {
  async GET_USER_TOKENS_CREATION_REQUESTS ({ state }) {
    const tokensService = new TokensService({})
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
