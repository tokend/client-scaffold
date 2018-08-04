import MockAdapter from 'axios-mock-adapter'
import config from '../../../config'
import axios from 'tokend-js-sdk/node_modules/axios'
import Vue from 'vue'
import VueResourse from 'vue-resource'

Vue.use(VueResourse)

export class ServiceTestHelper {
  static doAxiosMockedRequest (service, prefix, response) {
    const mock = new MockAdapter(axios)
    const url = `${config.HORIZON_SERVER}${prefix}`
    mock.onGet(url).reply(200, response)
    return service()
  }

  static letVueResourseRespondFrom (routes) {
    Vue.http.interceptors.push((request, next) => {
      const url = request.getUrl().replace(`${config.HORIZON_SERVER}/`, '')
      const body = {
        data: routes[url],
        meta: {
          method: request.method,
          payload: request.body
        }
      }
      console.log(JSON.stringify(request))
      next(request.respondWith(body, {
        status: 200,
        statusText: 'OK'
      }))
    })
  }
}
