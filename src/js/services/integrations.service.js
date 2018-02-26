import request from '../builders/request_builder'
import store from '../../vuex'

import { googleAnalyticsEventCategories, twitterEvents } from '../const/conversion_events.const'

export default {
  sendDiscourseConfig (params) {
    return request
      .integrations()
      .discourse()
      .setParams(params)
      .sign(this._keypair)
      .json()
      .post()
  }
}

export function sendPixelsEvents (type, data = {}) {
  if (!window.fbq) return
  try {
    window.fbq('trackCustom', type, { ...extendDataForFacebook(), ...data })
    window.twq('track', twitterEvents[type])
  } catch (e) {
    console.error(e)
  }
}

export function sendFacebookPixelStandardEvent (type, data = {}) {
  if (!window.fbq) return
  try {
    window.fbq('track', type, { ...extendDataForFacebook(), ...data })
  } catch (e) {
    console.error(e)
  }
}

export function sendMixPanelEvent (type, data = {}) {
  if (!window.mixpanel) return
  window.mixpanel.track(type, extendDataForMixPanel(data))
}

export function sendTwitterPixelEvent (type, data = {}) {
  if (!window.twq) return
  window.twq('track', type, data)
}

export function sendGoogleAnalyticsEvent (type, data = {}) {
  if (!window.ga) return
  window.ga('send', 'event',
    googleAnalyticsEventCategories[type],
    type)
}

function extendDataForFacebook (data = {}) {
  let extendedData = {}
  try {
    extendedData = {
      ...data,
      em: data.email || store.getters.email || '',
      fn: data.firstName || store.getters.firstName || '',
      ln: data.lastName || store.getters.lastName || ''
    }
  } catch (e) {
    console.error(e)
  }
  return extendedData
}

function extendDataForMixPanel (data = {}) {
  let extendedData = {}
  try {
    extendedData = {
      'Email': data.email || store.getters.email || '',
      'First Name': data.firstName || store.getters.firstName || '',
      'Last Name': data.lastName || store.getters.lastName || '',
      ...data
    }
  } catch (e) {
    console.error(e)
  }
  return extendedData
}
