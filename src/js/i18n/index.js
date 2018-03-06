import auth from './auth'
import documents from './documens'
import offers from './offers'
import sales from './sales'
import transactions from './transactions'
import transfers from './transfers'

import loginView from './views/login_view'
import signupView from './views/signup_view'

import Polyglot from 'node-polyglot'

const polyglot = new Polyglot()

const dictionary = {
  ...auth,
  ...documents,
  ...offers,
  ...sales,
  ...transactions,
  ...transfers,
  ...loginView,
  ...signupView
}

polyglot.extend(dictionary)
export const i18n = Object.keys(dictionary)
  .reduce((obj, key) => {
    obj[key] = (opts) => polyglot.t(key, opts)
    return obj
  }, {})
