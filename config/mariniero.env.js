const merge = require('webpack-merge')
const env = require('./default.env')

module.exports = merge(env, {
  NODE_ENV: '"dev"',
  FILE_STORAGE: '"https://storage.stage.mariniero.tokend.io/api"',
  HORIZON_SERVER: '"https://api.stage.mariniero.tokend.io"',
  NETWORK_PASSPHRASE: '"Mariniero Stage Network!"'
})
