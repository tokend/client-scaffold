import Vue from 'vue'
import Router from 'vue-router'

import store from '../vuex'

import { resolveRedirect } from './redirect'

// route components:
import Login from '../vue/auth/Login.vue'
import Signup from '../vue/auth/Signup.vue'
import Recovery from '../vue/auth/Recovery.vue'
import EmailResend from '../vue/auth/ConfirmEmail.vue'

import AppContent from '../vue/root/AppContent.vue'

import Dashboard from '../vue/app/dashboard/Dashboard.Entry'
import DashboardIndex from '../vue/app/dashboard/index/Dashboard.Index'

import Wallet from '../vue/app/wallet/Wallet.Entry'
import WalletOverview from '../vue/app/wallet/overview/Wallet.Overview'

import Deposit from '../vue/app/deposit/Deposit.Entry'
import DepositMake from '../vue/app/deposit/make/Deposit.Make'

import Transfers from '../vue/app/transfers/Transfers.Entry'
import TransfersMake from '../vue/app/transfers/make/Transfers.Make'

import Withdrawal from '../vue/app/withdrawal/Withdrawal.Entry'
import WithdrawalMake from '../vue/app/withdrawal/make/Withdrawal.Make'

import History from '../vue/app/history/History.Entry'
import HistoryIndex from '../vue/app/history/index/History.Index'

import Settings from '../vue/app/settings/Settings.Entry'
import SettingsSecurity from '../vue/app/settings/security/Settings.Security'

import Verification from '../vue/app/verification/Verification.Entry'
import VerificationMake from '../vue/app/verification/make/Verification.Make'

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
          redirect: { path: '/dashboard/index' },
          children: [
            {
              path: '/dashboard/index',
              name: 'dashboard.index',
              component: DashboardIndex
            }
          ]
        },
        {
          name: 'app.wallet',
          path: '/wallet',
          component: Wallet,
          redirect: { path: '/wallet/overview' },
          children: [
            {
              path: '/wallet/overview',
              name: 'wallet.overview',
              component: WalletOverview
            }
          ]
        },
        {
          name: 'app.deposit',
          path: '/deposit',
          component: Deposit,
          redirect: { path: '/deposit/make' },
          children: [
            {
              path: '/deposit/make',
              name: 'deposit.make',
              component: DepositMake
            }
          ]
        },
        {
          name: 'app.transfers',
          path: '/transfers',
          component: Transfers,
          redirect: { path: '/transfers/make' },
          children: [
            {
              path: '/transfers/make',
              name: 'transfers.make',
              component: TransfersMake
            }
          ]
        },
        {
          name: 'app.withdrawal',
          path: '/withdrawal',
          component: Withdrawal,
          redirect: { path: '/withdrawal/make' },
          children: [
            {
              path: '/withdrawal/make',
              name: 'withdrawal.make',
              component: WithdrawalMake
            }
          ]
        },
        {
          name: 'app.history',
          path: '/history',
          component: History,
          redirect: { path: '/history/index' },
          children: [
            {
              path: '/history/index',
              name: 'history.index',
              component: HistoryIndex
            }
          ]
        },
        {
          name: 'app.settings',
          path: '/settings',
          component: Settings,
          redirect: { path: '/settings/security' },
          children: [
            {
              path: '/settings/security',
              name: 'settings.security',
              component: SettingsSecurity
            }
          ]
        },
        {
          name: 'app.verification',
          path: '/verification',
          component: Verification,
          redirect: { path: '/verification/make' },
          children: [
            {
              path: '/verification/make',
              name: 'verification.make',
              component: VerificationMake
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
