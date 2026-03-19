import { createRouter, createWebHistory } from 'vue-router'
import Games from '../screen/Games/AvailableGames.vue'
import AuthTabs from '../screen/Auth/AuthPage.vue'
import LoginForm from '../screen/Auth/Login.vue'    // This is now just the form
import RegisterForm from '../screen/Auth/Register.vue'
import BetSlip from '../components/Betlslip/BetSlip.vue'
import Withdraw from '../screen/Money/Withdraw.vue'
import Deposite from '../screen/Money/Deposite.vue'
import Account from '../screen/profile/Profile.vue'
import { useAuthStore } from '../store/authStore'

const routes = [
  {
    path: '/',
    name: 'games',
    component: Games
  },
  {
    path: '/betSlip',
    name: 'betslip',
    component: BetSlip
  },
  {
    path: '/account',
    name: 'account',
    component: Account
  },
  {
    path: '/withdraw',
    name: 'withdraw',
    component: Withdraw
  },
  {
    path: '/betList',
    name: 'betList',
    component: () => import('../screen/Bets/ApproveBet/BetsList.vue'),
  },
  {
    path: '/sports',
    name: 'sport',
    component: () => import('../screen/sport/SportScreen.vue'),
  },
  {
    path: '/betList/:id',
    name: 'bet-details',
    component: () => import('../screen/Bets/ApproveBet/BetDetails.vue'),
    props: true // This passes route params as props
  },
  {
    path: '/deposite',
    name: 'deposite',
    component: Deposite
  },
    // Login route - uses AuthTabs as wrapper, LoginForm as child
    {
      path: '/login',
      name:'login',
      component: () => import('../screen/Auth/Login.vue'),     // This has the tabs
      
    },
    
    // Join Now route - uses AuthTabs as wrapper, RegisterForm as child
    {
      path: '/register',
      name:'register',
      component: () => import('../screen/Auth/Register.vue'),     // This has the tabs
    },
  {
    path: '/bets',
    name: 'bets',
    component: () => import('../screen/Bets/Bets.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Open',
        component: () => import('../screen/Bets/Open.vue')
      },
      {
        path: 'settled',
        name: 'Settled',
        component: () => import('../screen/Bets/Settled.vue'),
        meta: { requiresSettledData: true },
      },
     
      {
        path: 'jackpots',
        name: 'Jackpots',
        component: () => import('../screen/Bets/Jackpots.vue')
      },
      {
        path: 'virtuals',
        name: 'Virtuals',
        component: () => import('../screen/Bets/Virtuals.vue')
      }
    ]
  },
  {
    path: '/bets/regular/:id', 
    name: 'SettledDetail',
    component: () => import('../screen/Bets/SettledDetail.vue'),
    props: true
  },
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


// 2. WEKA HAPA (Kati ya router na export)
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Angalia kama route inayofuatwa ina 'requiresAuth'
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) {
      // Kama haja-login, mpeleke login
      next({
        name: 'login',
        query: { redirect: to.fullPath } 
      })
    } else {
      next() // Ameshalogin, mruhusu
    }
  } else {
    next() // Haihitaji ulinzi, mruhusu
  }
})

export default router