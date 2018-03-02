const mutations = {
  // root:
  SET_LOGGED_OUT_STATE: 'SET_LOGGED_OUT_STATE',
  KEEP_SESSION: 'KEEP_SESSION',

  // wallet:
  SET_WALLET_ID: 'SET_WALLET_ID',

  // user:
  SET_USER_EMAIL: 'SET_USER_EMAIL',
  SET_USER_TYPE: 'SET_USER_TYPE',
  SET_USER_STATE: 'SET_USER_STATE',
  SET_USER_REJECT_REASON: 'SET_USER_REJECT_REASON',
  SET_USER_CREATED_AT: 'SET_USER_CREATED_AT',

  // account:
  SET_ACCOUNT_KEYS: 'SET_ACCOUNT_KEYS'
}

const actions = {
  LOG_IN: 'LOG_IN',
  LOG_OUT: 'LOG_OUT',
  STORE_LOGIN_DATA: 'STORE_USER_DATA_FROM_WALLET',
  STORE_USER_DATA_FROM_WALLET: 'STORE_USER_DATA_FROM_WALLET',

  // wallet:
  PROCESS_USER_WALLET: 'PROCESS_USER_WALLET',

  // user:
  GET_USER_DETAILS: 'GET_USER_DETAILS',
  GET_USER_FAVORITES: 'GET_USER_FAVORITES'
}

const getters = {
  isLoggedIn: 'isLoggedIn',

  // user:
  userEmail: 'userEmail',
  userState: 'userState',
  userType: 'userType',
  userRejectReason: 'userRejectReason',
  userCreatedAt: 'userCreatedAt',
  userFavorites: 'userFavorites',

  // account:
  userAccountId: 'userAccountId'
}

export const vuexTypes = {
  ...mutations,
  ...actions,
  ...getters
}
