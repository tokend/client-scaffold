const mutations = {
  // root:
  SET_LOGGED_OUT_STATE: 'SET_LOGGED_OUT_STATE',
  KEEP_SESSION: 'KEEP_SESSION'
}

const actions = {
  LOG_IN: 'LOG_IN',
  LOG_OUT: 'LOG_OUT',
  STORE_LOGIN_DATA: 'STORE_LOGIN_DATA'
}

const getters = {
  isLoggedIn: 'isLoggedIn',
  userEmail: 'userEmail',
  userAccountId: 'userAccountId'
}

export default {
  ...mutations,
  ...actions,
  ...getters
}

export const vuexTypes = {
  ...mutations,
  ...actions,
  ...getters
}
