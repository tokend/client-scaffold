const featureFlags = {
  dashboard: true,
  deposit: true,
  withdrawal: true,
  transfers: true,
  history: true,
  trade: true,
  verification: true,
  creationToken: true,
  settings: true,
  tfa: true,
  tokens: true
}

export default {
  HORIZON_SERVER: process.env.HORIZON_SERVER,
  FILE_STORAGE: process.env.FILE_STORAGE,
  NETWORK_PASSPHRASE: process.env.NETWORK_PASSPHRASE,
  DISCOURSE_CLIENT: 'https://discuss.swarm.fund',
  SWARM_ORIGIN: 'https://swarm.fund',
  TRANSACTIONS_PER_PAGE: 12,
  DECIMAL_POINTS: 6,
  VALIDATE_EMAILS: process.env.NODE_ENV === 'production',
  AIRDROP_REGISTRATION_END: new Date('2018-02-25T12:00:00'),
  FEATURE_FLAGS: featureFlags
}
