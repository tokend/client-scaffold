const merge = require('webpack-merge')
const env = require('./default.env')

module.exports = merge(env, {
  NODE_ENV: '"development"',
  HORIZON_SERVER: '"https://api-dev.swarm.fund"',
  FILE_STORAGE: '"https://storage-dev.swarm.fund/api"',
  NETWORK_PASSPHRASE: '"Swarm New Dev; Feb 18"'
})
