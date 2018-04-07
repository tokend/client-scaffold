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
  SET_USER_KYC_SEQUENCE: 'SET_USER_KYC_SEQUENCE',
  SET_USER_KYC_DETAILS: 'SET_USER_KYC_DETAILS',
  SET_USER_KYC_DOCUMENTS: 'SET_USER_KYC_DOCUMENTS',

  // account:
  SET_ACCOUNT_KEYS: 'SET_ACCOUNT_KEYS',
  SET_ACCOUNT_BALANCES: 'SET_ACCOUNT_BALANCES',
  SET_ACCOUNT_DETAILS: 'SET_ACCOUNT_DETAILS',

  // transactions:
  SET_TX_LIST_INITIALIZED: 'SET_TX_LIST_INITIALIZED',
  UPDATE_TX_LIST: 'UPDATE_TX_LIST',
  UPDATE_TX_LIST_ITEM: 'UPDATE_TX_LIST_ITEM',

  // pairs:
  SET_ASSET_PAIRS: 'SET_ASSET_PAIRS',

  // trades:
  SET_SELL_OFFERS: 'SET_SELL_OFFERS',
  SET_BUY_OFFERS: 'SET_BUY_OFFERS'
}

const actions = {
  LOG_IN: 'LOG_IN',
  LOG_OUT: 'LOG_OUT',

  // wallet:
  PROCESS_USER_WALLET: 'PROCESS_USER_WALLET',
  STORE_USER_DATA_FROM_WALLET: 'STORE_USER_DATA_FROM_WALLET',

  // user:
  GET_USER_DETAILS: 'GET_USER_DETAILS',
  GET_USER_FAVORITES: 'GET_USER_FAVORITES',
  GET_USER_KYC: 'GET_USER_KYC',
  UPDATE_USER_KYC_DETAILS: 'UPDATE_USER_KYC_DETAILS',
  UPDATE_USER_KYC_DOCUMENTS: 'UPDATE_USER_KYC_DOCUMENTS',

  // account:
  GET_ACCOUNT_DETAILS: 'GET_ACCOUNT_DETAILS',
  GET_ACCOUNT_BALANCES: 'GET_ACCOUNT_BALANCES',

  // transactions:
  INIT_TX_LIST: 'INIT_TX_LIST',
  GET_TX_LIST: 'GET_TX_LIST',
  NEXT_TX_LIST: 'NEXT_TX_LIST',
  UPDATE_TX_COUNTERPARTIES: 'UPDATE_TX_COUNTERPARTIES',

  // pairs:
  GET_ASSET_PAIRS: 'GET_ASSET_PAIRS',

  // trades:
  GET_TRADES: 'GET_TRADES',
  GET_SM_OFFERS: 'GET_SM_OFFERS',
  GET_BUY_OFFERS: 'GET_BUY_OFFERS',
  GET_SELL_OFFERS: 'GET_SELL_OFFERS',
  GET_USER_OFFERS: 'GET_USER_OFFERS'
}

const getters = {
  isLoggedIn: 'isLoggedIn',

  // user:
  userEmail: 'userEmail',
  userState: 'userState',
  userType: 'userType',
  userRejectReason: 'userRejectReason',
  userCreatedAt: 'userCreatedAt',
  userKycSequence: 'userKycSequence',
  userFavorites: 'userFavorites',

  // wallet:
  walletId: 'walletId',

  // account:
  // TODO: need 'userAccountId' and 'keypair' for backwards compatibility only
  userAccountId: 'accountId',
  keypair: 'accountKeypair',
  account: 'account',
  accountId: 'accountId',
  accountSeed: 'accountSeed',
  accountPublicKey: 'accountPublicKey',
  accountKeypair: 'accountKeypair',
  accountCreatedAt: 'accountCreatedAt',
  accountTokens: 'accountTokens',
  accountBalances: 'accountBalances',
  accountRawBalances: 'accountRawBalances',
  accountDepositAddresses: 'accountDepositAddresses',

  // tokens:
  userAcquiredTokens: 'userAcquiredTokens',
  userWalletTokens: 'userWalletTokens',
  userTransferableTokens: 'userTransferableTokens',
  userKycDetails: 'userKycDetails',
  userKycDocuments: 'userKycDocuments',

  // transactions:
  transactions: 'transactions',

  // pairs:
  assetPairs: 'assetPairs',

  // trades:
  trades: 'trades',
  buyOffers: 'buyOffers',
  sellOffers: 'sellOffers',
  userOffers: 'userOffers'
}

export const vuexTypes = {
  ...mutations,
  ...actions,
  ...getters
}
