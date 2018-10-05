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
import rippleEffect from './directives/rippleEffect'

// filters
import { translate } from './vue/common/filters/translate'
import { localizeFeeType } from './vue/common/filters/localizeFeeType'
import { localizeFeeSubType } from './vue/common/filters/localizeFeeSubType'
import { formatDate } from './vue/common/filters/formatDate'

// ripple effects:
rippleEffect.color = 'rgba(58, 65, 128, .2)'

Vue.directive('table-scroll-shadow', tableScrollShadow)
Vue.directive('ripple', rippleEffect)

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
  components: { App },
  template: '<App/>'
})

/* Vue filters */
Vue.filter('localizeFeeType', localizeFeeType)
Vue.filter('localizeFeeSubType', localizeFeeSubType)
Vue.filter('translate', translate)
Vue.filter('formatDate', formatDate)
