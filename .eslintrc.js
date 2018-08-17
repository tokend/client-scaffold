// https://eslint.org/docs/user-guide/configuring

function checkNodeEnv () {
  return [ 'production', 'staging', 'dev-build' ].indexOf(process.env.NODE_ENV) > -1
}

module.exports = {
  root: true,
  extends: [
    'distributed-lab',
    'plugin:vue/recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  env: {
    browser: true
  },
  plugins: [
    'vue'
  ],
  rules: {
    // 0 – off, 1 – warning, 2 – error
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': checkNodeEnv() ? 2 : 0,
    'no-warning-comments': [checkNodeEnv() ? 1 : 0, {
      'terms': ['hardcoded'], location: 'anywhere'
    }],
    'no-console': checkNodeEnv()
                    ? [1, { allow: ['warn', 'error'] }]
                    : [2, { allow: ['warn', 'error'] }],
    'max-len': [1, {
      'code': 80,
      'ignoreUrls': true,
      'ignoreStrings': true,
      'ignoreTemplateLiterals': true,
      'ignoreComments': true
    }],
    'vue/valid-v-for': 1,
    'vue/attributes-order': 0,
    'vue/attributes-order': 0,
    'indent': 0,
    'vue/order-in-components': 0,
    'vue/name-property-casing': 0,
    'vue/html-closing-bracket-newline': 0,
    'vue/max-attributes-per-line': 0
  },
  globals: {
    Elm: true
  }
}
