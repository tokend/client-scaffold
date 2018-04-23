import env from '../config/default.env'

const featureFlags = {
  dashboard: true,
  deposit: true,
  withdrawal: true,
  transfers: true,
  history: true,
  trade: true,
  verification: true,
  settings: true,
  tfa: true,
  tokens: true
}

const workspaces = {
  dev: {
    horizonServer: env.HORIZON_SERVER,
    fileStorage: env.FILE_STORAGE,
    networkPassphrase: env.NETWORK_PASSPHRASE
  },
  prod: {
    horizonServer: env.HORIZON_SERVER,
    fileStorage: env.FILE_STORAGE,
    networkPassphrase: env.NETWORK_PASSPHRASE
  },
  staging: {
    horizonServer: env.HORIZON_SERVER,
    fileStorage: env.FILE_STORAGE,
    networkPassphrase: env.NETWORK_PASSPHRASE
  }
}

const currentMode = 'dev'

export default {
  HORIZON_SERVER: (() => process.env.NODE_ENV === 'development' ? workspaces[currentMode].horizonServer : process.env.HORIZON_SERVER)(),
  FILE_STORAGE: (() => process.env.NODE_ENV === 'development' ? workspaces[currentMode].fileStorage : process.env.FILE_STORAGE)(),
  NETWORK_PASSPHRASE: (() => process.env.NODE_ENV === 'development' ? workspaces[currentMode].networkPassphrase : process.env.NETWORK_PASSPHRASE)(),
  DISCOURSE_CLIENT: 'https://discuss.swarm.fund',
  SWARM_ORIGIN: 'https://swarm.fund',
  TRANSACTIONS_PER_PAGE: 12,
  DECIMAL_POINTS: 6,
  VALIDATE_EMAILS: process.env.NODE_ENV === 'production',
  AIRDROP_REGISTRATION_END: new Date('2018-02-25T12:00:00'),
  FEATURE_FLAGS: featureFlags
}
