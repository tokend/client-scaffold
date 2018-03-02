const mutations = {
  // root:
  SET_LOGGED_OUT_STATE: 'SET_LOGGED_OUT_STATE',
  KEEP_SESSION: 'KEEP_SESSION',

  // wallet:
  SET_WALLET_ID: 'SET_WALLET_ID',

  // user:
  SET_USER_EMAIL: 'SET_USER_EMAIL',

  // account:
  SET_ACCOUNT_KEYS: 'SET_ACCOUNT_KEYS'
}

const actions = {
  LOG_IN: 'LOG_IN',
  LOG_OUT: 'LOG_OUT',
  STORE_LOGIN_DATA: 'STORE_USER_DATA_FROM_WALLET',
  STORE_USER_DATA_FROM_WALLET: 'STORE_USER_DATA_FROM_WALLET',

  // wallet:
  PROCESS_USER_WALLET: 'PROCESS_USER_WALLET'
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
