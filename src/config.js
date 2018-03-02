const workspaces = {
  dev: {
    horizonServer: 'http://18.196.70.215:8000',
    fileStorage: 'http://18.196.70.215:9000/api',
    networkPassphrase: 'SUN Staging Network ; December 2017'
  },
  prod: {
    horizonServer: 'https://invest.swarm.fund/_/api/',
    fileStorage: 'https://storage.swarm.fund/api',
    networkPassphrase: 'Swarm Production Network!'
  },
  staging: {
    horizonServer: 'https://staging.app.sun.swarm.fund/_/api/',
    fileStorage: 'https://staging.storage.sun.swarm.fund/api',
    networkPassphrase: 'SUN Staging Network ; December 2017'
  }
}

const currentMode = 'staging'

export default {
  HORIZON_SERVER: (() => process.env.NODE_ENV === 'development' ? workspaces[currentMode].horizonServer : process.env.HORIZON_SERVER)(),
  FILE_STORAGE: (() => process.env.NODE_ENV === 'development' ? workspaces[currentMode].fileStorage : process.env.FILE_STORAGE)(),
  NETWORK_PASSPHRASE: (() => process.env.NODE_ENV === 'development' ? workspaces[currentMode].networkPassphrase : process.env.NETWORK_PASSPHRASE)(),
  DISCOURSE_CLIENT: 'https://discuss.swarm.fund',
  SWARM_ORIGIN: 'https://swarm.fund',
  TRANSACTIONS_PER_PAGE: 12,
  DECIMAL_POINTS: 6,
  VALIDATE_EMAILS: process.env.NODE_ENV === 'production',
  AIRDROP_REGISTRATION_END: new Date('2018-02-25T12:00:00')
}
