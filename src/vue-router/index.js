import Vue from 'vue'
import Router from 'vue-router'

import store from '../vuex'
import config from '../config'

import { resolveRedirect } from './redirect'

// route components:
import Login from '../vue/auth/Login.vue'
import Signup from '../vue/auth/Signup.vue'
import Recovery from '../vue/auth/Recovery.vue'
import EmailResend from '../vue/auth/ConfirmEmail.vue'

import AppContent from '../vue/root/AppContent.vue'

import Dashboard from '../vue/app/dashboard/Dashboard.Entry'
import DashboardIndex from '../vue/app/dashboard/index/Dashboard.Index'

import Deposit from '../vue/app/deposit/Deposit.Entry'
import DepositMake from '../vue/app/deposit/make/Deposit.Make'

import Transfers from '../vue/app/transfers/Transfers.Entry'
import TransfersMake from '../vue/app/transfers/make/Transfers.Make'

import Withdrawal from '../vue/app/withdrawal/Withdrawal.Entry'
import WithdrawalMake from '../vue/app/withdrawal/make/Withdrawal.Make'

import Tokens from '../vue/app/tokens/Tokens.Entry'
import TokensExplore from '../vue/app/tokens/Tokens.Explore'

import History from '../vue/app/history/History.Entry'
import HistoryIndex from '../vue/app/history/index/History.Index'

import Trade from '../vue/app/trade/Trade.Entry'
import TradeIndex from '../vue/app/trade/index/Trade.Index'

import Settings from '../vue/app/settings/Settings.Entry'
import SettingsSecurity from '../vue/app/settings/security/Settings.Security'

import Verification from '../vue/app/verification/Verification.Entry'
import VerificationMake from '../vue/app/verification/make/Verification.Make'

import TokenCreation from '../vue/app/tokenCreation/TokenCreation.Entry'
import TokenCreationIndex from '../vue/app/tokenCreation/index/TokenCreation.Index'

import IssuanceCreation from '../vue/app/issuanceCreation/IssuanceCreation.Entry'
import IssuanceCreationIndex from '../vue/app/issuanceCreation/index/IssuanceCreation.Index'

import SaleCreation from '../vue/app/saleCreation/SaleCreation.Entry'
import SaleCreationIndex from '../vue/app/saleCreation/SaleCreation.Index'

import Requests from '../vue/app/requests/Requests.Entry'
import RequestsIndex from '../vue/app/requests/index/Requests.Index'

import Sales from '../vue/app/sales/Sales.Entry'
import SalesDetails from '../vue/app/sales/sale_details/Sales.Details'
import SalesExplore from '../vue/app/sales/overview/Sales.Explore'

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
          feature_flag: config.FEATURE_FLAGS.dashboard,
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
          feature_flag: config.FEATURE_FLAGS.deposit,
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
          feature_flag: config.FEATURE_FLAGS.transfers,
          name: 'app.transfers',
          path: '/transfers',
          component: Transfers,
          redirect: { path: '/transfers/make' },
          children: [
            {
              path: '/transfers/make',
              name: 'transfers.make',
              component: TransfersMake
            },
            {
              path: '/transfers/make/:tokenCode',
              name: 'transfers.make:tokenCode',
              component: TransfersMake
            }
          ]
        },
        {
          feature_flag: config.FEATURE_FLAGS.withdrawal,
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
          feature_flag: config.FEATURE_FLAGS.tokens,
          name: 'app.tokens',
          path: '/tokens',
          component: Tokens,
          redirect: { path: '/tokens/explore' },
          children: [
            {
              path: '/tokens/explore',
              name: 'tokens.explore',
              component: TokensExplore
            }
          ]
        },
        {
          feature_flag: config.FEATURE_FLAGS.history,
          name: 'app.history',
          path: '/history',
          component: History,
          redirect: { path: '/history/index' },
          children: [
            {
              path: '/history/index',
              name: 'history.index',
              component: HistoryIndex
            },
            {
              path: '/history/index/:tokenCode',
              name: 'history.index:tokenCode',
              component: HistoryIndex
            }
          ]
        },
        {
          feature_flag: config.FEATURE_FLAGS.trade,
          name: 'app.trade',
          path: '/trade',
          component: Trade,
          redirect: { path: '/trade/index' },
          children: [
            {
              path: '/trade/index',
              name: 'trade.index',
              component: TradeIndex
            }
          ]
        },
        {
          feature_flag: config.FEATURE_FLAGS.settings,
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
          feature_flag: config.FEATURE_FLAGS.verification,
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
        },
        {
          feature_flag: config.FEATURE_FLAGS.tokenCreation,
          name: 'app.tokenCreation',
          path: '/token-creation',
          component: TokenCreation,
          redirect: { path: '/token-creation/index' },
          children: [
            {
              path: '/token-creation/index',
              name: 'token-creation.index',
              component: TokenCreationIndex,
              props: true
            },
            {
              path: '/token-creation/index/:id',
              name: 'token-creation.index:id',
              component: TokenCreationIndex,
              props: true
            }
          ]
        },
        {
          feature_flag: config.FEATURE_FLAGS.saleCreation,
          name: 'app.saleCreation',
          path: '/sale-creation',
          component: SaleCreation,
          redirect: { path: '/sale-creation/index' },
          children: [
            {
              path: '/sale-creation/index',
              name: 'sale-creation.index',
              component: SaleCreationIndex,
              props: true
            },
            {
              path: '/sale-creation/index/:id',
              name: 'sale-creation.index:id',
              component: SaleCreationIndex,
              props: true
            }
          ]
        },
        {
          feature_flag: config.FEATURE_FLAGS.issuanceCreation,
          name: 'app.issuanceCreation',
          path: '/issuance-creation',
          component: IssuanceCreation,
          redirect: { path: '/issuance-creation/index' },
          children: [
            {
              path: '/issuance-creation/index',
              name: 'issuance-creation.index',
              component: IssuanceCreationIndex,
              props: true
            }
          ]
        },
        {
          feature_flag: config.FEATURE_FLAGS.requests,
          name: 'app.requests',
          path: '/requests',
          component: Requests,
          redirect: { path: '/requests/index' },
          children: [
            {
              path: '/requests/index',
              name: 'requests.index',
              component: RequestsIndex
            },
            {
              path: '/requests/token-creation',
              name: 'requests.token-creation',
              component: RequestsIndex
            },
            {
              path: '/requests/sale-creation',
              name: 'requests.sale-creation',
              component: RequestsIndex
            }
          ]
        },
        {
          feature_flag: config.FEATURE_FLAGS.sales,
          name: 'app.sales',
          path: '/sales',
          component: Sales,
          redirect: { path: '/sales/explore' },
          children: [
            {
              path: '/sales/explore',
              name: 'sales.explore',
              component: SalesExplore
            },
            {
              path: '/sales/details/:id',
              name: 'sales.sale-details',
              component: SalesDetails,
              props: true
            }
          ]
        }
      ].filter(route => route.feature_flag !== false)
    }
  ]
})

router.beforeEach((to, from, next) => {
  try {
    console.log('window.Appcues.start()')
    window.Appcues.start()
  } catch (e) {
    console.error(e)
  }
  next()
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
