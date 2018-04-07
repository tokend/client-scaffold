const mutations = {
  // root:
  SET_LOGGED_OUT_STATE: 'SET_LOGGED_OUT_STATE',
  KEEP_SESSION: 'KEEP_SESSION',

  // wallet:
  SET_WALLET_ID: 'SET_WALLET_ID',

  // user:
  SET_USER_EMAIL: 'SET_USER_EMAIL',
  SET_USER_TYPE: 'SET_USER_TYPE',
  SET_USER_CREATED_AT: 'SET_USER_CREATED_AT',

  // account:
  SET_ACCOUNT_KEYS: 'SET_ACCOUNT_KEYS',
  SET_ACCOUNT_BALANCES: 'SET_ACCOUNT_BALANCES',
  SET_ACCOUNT_DETAILS: 'SET_ACCOUNT_DETAILS',
  // account.kyc:
  SET_ACCOUNT_KYC_DETAILS: 'SET_ACCOUNT_KYC_DETAILS',
  SET_ACCOUNT_KYC_DOCUMENTS: 'SET_ACCOUNT_KYC_DOCUMENTS',

  // transactions:
  SET_TX_LIST_INITIALIZED: 'SET_TX_LIST_INITIALIZED',
  UPDATE_TX_LIST: 'UPDATE_TX_LIST',
  UPDATE_TX_LIST_ITEM: 'UPDATE_TX_LIST_ITEM'
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

  // account:
  GET_ACCOUNT_DETAILS: 'GET_ACCOUNT_DETAILS',
  GET_ACCOUNT_BALANCES: 'GET_ACCOUNT_BALANCES',
  // account.kyc:
  GET_ACCOUNT_KYC: 'GET_ACCOUNT_KYC',
  UPDATE_ACCOUNT_KYC_DETAILS: 'UPDATE_ACCOUNT_KYC_DETAILS',
  UPDATE_ACCOUNT_KYC_DOCUMENTS: 'UPDATE_ACCOUNT_KYC_DOCUMENTS',

  // transactions:
  INIT_TX_LIST: 'INIT_TX_LIST',
  GET_TX_LIST: 'GET_TX_LIST',
  NEXT_TX_LIST: 'NEXT_TX_LIST',
  UPDATE_TX_COUNTERPARTIES: 'UPDATE_TX_COUNTERPARTIES'
}

const getters = {
  isLoggedIn: 'isLoggedIn',

  // user:
  userEmail: 'userEmail',
  userType: 'userType',
  userCreatedAt: 'userCreatedAt',
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
  // account.kyc:
  accountState: 'accountState',
  accountKycRejectReason: 'accountKycRejectReason',
  accountKycDetails: 'accountKycDetails',
  accountKycDocuments: 'accountKycDocuments',

  // tokens:
  userAcquiredTokens: 'userAcquiredTokens',
  userWalletTokens: 'userWalletTokens',
  userTransferableTokens: 'userTransferableTokens',

  // transactions:
  transactions: 'transactions'
}

export const vuexTypes = {
  ...mutations,
  ...actions,
  ...getters
}
