import password from './auth/password.service'

import integrations from './integrations.service'
import users from './OLD.users.service'

const http = {
  integrations,
  password,
  users
}

export default {
  install (Vue, options) {
    Vue.prototype.$services = http
  }
}
