const merge = require('webpack-merge')
const env = require('./mariniero.env')

module.exports = merge(env, {
  NODE_ENV: '"development"'
})
