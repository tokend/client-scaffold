const merge = require('webpack-merge')
const env = require('./default.env')

module.exports = merge(env, {
  HORIZON_SERVER: '"https://testnet.tokend.org/_/api"',
  FILE_STORAGE: '"https://storage.testnet.tokend.org/api"',
  NETWORK_PASSPHRASE: '"TokenD Testnet Network"',
  NODE_ENV: '"dev"'
})
