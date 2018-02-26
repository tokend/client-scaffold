import integrations from '../js/services/integrations.service'
import i18n from '../js/i18n/default'
import store from '../vuex'
import get from 'lodash/get'
import { dispatchEvent } from '../js/events/helpers'
import { commonEvents } from '../js/events/common_events'

const REDIRECT_TYPES = {
  email: 1,
  discourse: 2
}

export const resolveRedirect = (to, from, next) => {
  const encodedValue = to.path.replace('/r/', '')
  //
  const action = JSON.parse(atob(encodedValue))
  switch (action.type) {
    case REDIRECT_TYPES.email:
      handleEmailRedirect(action, next)
      break
    case REDIRECT_TYPES.discourse:
      return handleDiscourseRedirect(action, next, to)
  }
}

function handleEmailRedirect (action, next) {
  const token = action.meta.token
  const walletId = action.meta.wallet_id
  next({ name: 'login', params: { token, walletId } })
}

async function handleDiscourseRedirect (action, next, to) {
  if (!store.getters.isLoggedIn) {
    next({
      name: 'login',
      params: {
        redirect: to.fullPath
      }
    })
  }
  const nonce = get(action, 'meta.nonce')
  const signature = get(action, 'meta.signature')
  const _return = get(action, 'meta.return')
  try {
    const response = await integrations.sendDiscourseConfig({ nonce, signature, return: _return, address: store.getters.userAccountId })
    const link = response.data('Location')
    dispatchEvent(commonEvents.openDiscourseConfirmation, link)
  } catch (error) {
    console.error(error)
    error.showBanner(i18n.default)
  }
}
