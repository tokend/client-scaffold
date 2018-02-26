export const LOG_IN = ({ commit, dispatch, getters }) => {
  commit('SET_LOGGED_IN_STATE')
  dispatch('UPDATE_STORAGE')
}

export const LOG_OUT = ({ commit }) => {
  commit('SET_LOGGED_OUT_STATE')
  location.reload()
}
