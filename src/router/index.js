import { createRouter, createWebHistory } from 'vue-router'
import Games from '../screen/Games/AvailableGames.vue'
import AuthTabs from '../screen/Auth/AuthPage.vue'
import LoginForm from '../screen/Auth/Login.vue'    // This is now just the form
import RegisterForm from '../screen/Auth/Register.vue'
import BetSlip from '../components/Betlslip/BetSlip.vue'
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
    // Login route - uses AuthTabs as wrapper, LoginForm as child
    {
      path: '/login',
      component: AuthTabs,     // This has the tabs
      children: [
        {
          path: '',            // Empty path means /login shows this
          component: LoginForm // This is just the form
        }
      ]
    },
    
    // Join Now route - uses AuthTabs as wrapper, RegisterForm as child
    {
      path: '/register',
      component: AuthTabs,     // This has the tabs
      children: [
        {
          path: '',            // Empty path means /join-now shows this
          component: RegisterForm // This is just the form
        }
      ]
    },
  {
    path: '/bets',
    name: 'bets',
    component: () => import('../screen/Bets/Bets.vue'),
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

export default router