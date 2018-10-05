// https://eslint.org/docs/user-guide/configuring

function isDevelopmentBuild () {
  return [
    'production', 'staging', 'dev-build'
  ].indexOf(process.env.NODE_ENV) > -1
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
    'no-debugger': isDevelopmentBuild() ? 2 : 0,
    'no-warning-comments': [isDevelopmentBuild() ? 1 : 0, {
      'terms': ['hardcoded'], location: 'anywhere'
    }],
    'no-console': isDevelopmentBuild()
      ? [2, { allow: ['warn', 'error'] }]
      : [1, { allow: ['warn', 'error'] }],
    'max-len': [1, {
      'code': 80,
      'ignoreUrls': true,
      'ignoreStrings': true,
      'ignoreTemplateLiterals': true,
      'ignoreComments': true
    }],
    'vue/valid-v-for': 2,
    'vue/attributes-order': 0,
    'indent': 2,
    'vue/order-in-components': 2,
    'vue/name-property-casing': [2, "kebab-case"],
    'vue/html-closing-bracket-newline': 0,
    'vue/max-attributes-per-line': 0,
    'vue/attribute-hyphenation': 2,
    'vue/component-name-in-template-casing': [2, "kebab-case"],
    'vue/html-end-tags': 2,
    'vue/html-indent': 2,
    'vue/html-quotes': 2,
    'vue/html-self-closing': 2,
    'vue/multiline-html-element-content-newline': 2,
    'vue/mustache-interpolation-spacing': 2,
    'vue/no-async-in-computed-properties': 2,
    'vue/no-confusing-v-for-v-if': 2,
    'vue/no-dupe-keys': 2,
    'vue/no-duplicate-attributes': 2,
    'vue/no-multi-spaces': 2,
    'vue/no-reserved-keys': 2,
    'vue/no-shared-component-data': 2,
    'vue/no-side-effects-in-computed-properties': 2,
    'vue/no-spaces-around-equal-signs-in-attribute': 2,
    'vue/no-template-key': 2,
    'vue/no-textarea-mustache': 2,
    'vue/no-unused-components': 2,
    'vue/no-unused-vars': 2,
    'vue/no-v-html': 1,
    'vue/prop-name-casing': 2,
    'vue/require-default-prop': 2,
    'vue/require-prop-types': 2,
    'vue/require-valid-default-prop': 2,
    'vue/this-in-template': 2,
    'vue/v-bind-style': 2,
    'vue/v-on-style': 2,
    'vue/valid-template-root': 2,
    'vue/valid-v-bind': 2,
    'vue/valid-v-else-if': 2,
    'vue/valid-v-else': 2,
    'vue/valid-v-model': 2,
    'vue/valid-v-on': 2
  },
  globals: {
    Elm: true
  }
}
