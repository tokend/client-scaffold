// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './components/OLD/root/App.vue'
import './assets/style/app.scss'

import { extendValidator } from './utils/validator'

// vue default plugins
import router from './router'
import store from './store'

// some custom vue plugins
import plugins from './plugins'
import http from './services/index'

// vue http-client
import VueResource from 'vue-resource'

// vue-markdown-editor
import VueSimpleMDE from 'vue-simplemde'

// vue-material design plugin
import Vuetify from 'vuetify'

// for async computed props:
import AsyncComputed from 'vue-async-computed'

// Raven
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'
import ravenConfig from '../OLD/src/raven_config'
import { needSendErrorLog } from '../OLD/src/parseerror'
import { ravenCaptureException } from './plugins/raven'

// validator
import VeeValidate from 'vee-validate'
VeeValidate.Validator = extendValidator(VeeValidate.Validator)

Vue.config.productionTip = false

Vue.use(VueResource)
Vue.use(VeeValidate)
Vue.use(Vuetify)
Vue.use(VueSimpleMDE)
Vue.use(AsyncComputed)

plugins.forEach(plugin => {
  Vue.use(plugin)
})
Vue.use(http)

// Sentry integration
if (process.env.SENTRY_DSN) {
  Raven.config(process.env.SENTRY_DSN, ravenConfig)
    .addPlugin(RavenVue, Vue)
    .install()
  Raven.setTagsContext({
    environment: process.env.NODE_ENV
  })
  // wrap console.error to capture exceptions
  const logger = console.error
  console.error = (error) => {
    if (needSendErrorLog(error)) {
      ravenCaptureException(error)
    }
    logger(error)
  }
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
