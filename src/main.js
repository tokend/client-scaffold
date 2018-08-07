// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './vue/root/App'
import './scss/app.scss'

// vue default plugins
import router from './vue-router'
import store from './vuex'

// vue http-client
import VueResource from 'vue-resource'

// vue-markdown-editor
import VueSimpleMDE from 'vue-simplemde'

// vue-material design plugin
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'

// validator:
import VeeValidate from 'vee-validate'
import { extendValidator } from './validator/validator'

// directives
import tableScrollShadow from './directives/tableScrollShadow'
// import rippleEffect from './directives/rippleEffect' // TODO: hardcode

// ripple effect:
import Ripple from 'vue-ripple-directive'
Ripple.color = 'rgba(58, 65, 128, .2)'
Ripple.zIndex = 1

Vue.directive('table-scroll-shadow', tableScrollShadow)
Vue.directive('ripple', Ripple)

Vue.config.productionTip = false
Vue.use(VueResource)
Vue.use(VeeValidate)
Vue.use(VueMaterial)
Vue.use(VueSimpleMDE)

VeeValidate.Validator = extendValidator(VeeValidate.Validator)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
