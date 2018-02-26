import Vue from 'vue'
import router from '../../src/router'
import store from '../../src/store'
import plugins from '../../src/plugins'
import http from '../../src/services/index'
import VueResource from 'vue-resource'

import VeeValidate from 'vee-validate'

export function initTestEnvironment () {
  Vue.use(VueResource)
  Vue.use(VeeValidate)

  plugins.forEach(plugin => {
    Vue.use(plugin)
  })
  Vue.use(http)
}

export function mountComponent (Component) {
  const Ctor = Vue.extend(Component)
  const vm = new Ctor({ router, store }).$mount()
  applyMockData(vm)
  return vm
}

export function getRenderedTextFromSelector (Component, selector) {
  const vm = mountComponent(Component)
  return vm.$el.querySelector(selector).textContent
}

function applyMockData (component) {
  // component.$services = mockHttpSubmitter
}
