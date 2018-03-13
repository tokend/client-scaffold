import auth from './to_replace/auth'
import documents from './to_replace/documens'
import offers from './to_replace/offers'
import sales from './to_replace/sales'
import transactions from './to_replace/transactions'
import transfers from './to_replace/transfers'
import defaults from './to_replace/default'

import txHistoryView from './views/tx-history_view'
import depositView from './views/deposit_view'
import signupView from './views/signup_view'
import loginView from './views/login_view'
import labels from './views/labels'
import inactivitymessage from './views/inactivity_message'
import settingsView from './views/settings_view'
import modals from './views/modals'
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
  ...signupView,
  ...depositView,
  ...labels,
  ...inactivitymessage,
  ...txHistoryView,
  ...settingsView,
  ...labels,
  ...modals,
  ...defaults
}

polyglot.extend(dictionary)
export const i18n = Object.keys(dictionary)
  .reduce((obj, key) => {
    obj[key] = (opts) => polyglot.t(key, opts)
    return obj
  }, {})
