const merge = require('webpack-merge')
const env = require('./default.env')

module.exports = merge(env, {
  NODE_ENV: '"dev"',
  HORIZON_SERVER: '"https://api.divs.tokend.io"',
  FILE_STORAGE: '"https://storage.divs.tokend.io"',
  NETWORK_PASSPHRASE: '"divs Stage Network!"'
})
