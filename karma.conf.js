const webpackConfig = require('./build/webpack.base.conf')

module.exports = function (config) {
  config.set({
    autoWatch: false,
    singleRun: true,
    browsers: ['ChromeHeadless'],
    files: [
      'src/vuex/account.spec.js'
      // 'src/**/*.e2e.js'
    ],
    preprocessors: {
      // 'src/**/*.spec.js': [ 'webpack' ],
      'src/vuex/account.spec.js': [ 'webpack' ]
    },

    webpack: webpackConfig,
    frameworks: ['mocha', 'sinon', 'chai'],
    reporters: ['progress']
  })
}
