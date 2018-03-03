import Vue from 'vue'
import Router from 'vue-router'

import store from '../vuex'

import { resolveRedirect } from './redirection_resolver'

// route components:
import Login from '../vue/auth/Login.vue'
import Signup from '../vue/auth/Signup.vue'
import Recovery from '../vue/auth/Recovery.vue'
import EmailResend from '../vue/auth/EmailResend.vue'

import AppContent from '../vue/root/AppContent.vue'

import Dashboard from '../vue/app/Dashboard'
import Dashboard1 from '../vue/app/Dashboard1'
import Dashboard2 from '../vue/app/Dashboard2'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: { name: 'app' }
    },
    {
      path: '/r/*',
      name: 'horizon-redirect',
      beforeEnter: resolveRedirect
    },
    {
      path: '/sign-in',
      name: 'login',
      component: Login,
      beforeEnter: authPageGuard
    },
    {
      path: '/sign-up',
      name: 'signup',
      component: Signup,
      beforeEnter: authPageGuard
    },
    {
      path: '/verify-email',
      name: 'email',
      component: EmailResend,
      beforeEnter: authPageGuard
    },
    {
      path: '/recovery',
      name: 'recovery',
      component: Recovery,
      beforeEnter: authPageGuard
    },
    {
      path: '/',
      name: 'app',
      component: AppContent,
      beforeEnter: inAppRouteGuard,
      redirect: { name: 'app.dashboard' },
      children: [
        {
          name: 'app.dashboard',
          path: '/dashboard',
          component: Dashboard,
          redirect: { name: 'dashboard.p1' },
          children: [
            {
              name: 'dashboard.p1',
              path: '/dashboard/1',
              component: Dashboard1
            },
            {
              name: 'dashboard.p2',
              path: '/dashboard/2',
              component: Dashboard2
            }
          ]
        }
      ]
    }
  ]
})
export default router

// doesn't allow to visit auth page if user is already logged in
function authPageGuard (to, from, next) {
  const isLoggedIn = store.getters.isLoggedIn
  isLoggedIn ? next({ name: 'app' }) : next()
}

// doesn't allow to visit in-app page if user is not already logged in
function inAppRouteGuard (to, from, next) {
  const isLoggedIn = store.getters.isLoggedIn
  isLoggedIn ? next() : next({ name: 'login' })
}
