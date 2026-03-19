<template>
  <div class="bottom-nav-container fixed bottom-0 left-0 right-0 z-[1000]">
    <div class="bottom-nav relative bg-sky-950 border-t border-white rounded-t-3xl shadow-2xl">

      <div class="flex items-end justify-around h-[65px] pb-2">
        <!-- Home -->
        <div class="nav-item flex flex-col items-center">
          <button @click="handleMenuClick" :class="navBtnClass('home')">
            <HomeIcon class="w-6 h-6" />
          </button>
          <span :class="navTextClass('home')">Home</span>
        </div>

        <!-- Sports -->
        <div class="nav-item flex flex-col items-center">
          <button @click="handleSportsClick" :class="navBtnClass('sports')">
            <span class="text-xl">⚽</span>
          </button>
          <span :class="navTextClass('sports')">Sport</span>
        </div>

        <!-- Betslip -->
        <div class="nav-item flex flex-col items-center">
          <button @click="handleBetslipClick" :class="navBtnClass('betslip')">
            <div class="relative">
              <div v-if="betslipCount > 0" class="relative flex items-center justify-center h-5 w-5">
                  <span class="absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75 animate-ping"></span>
                  
                  <span class="relative inline-flex items-center justify-center rounded-full h-5 w-5 bg-sky-800 text-sm  text-amber-400 shadow-lg">
                    {{ betslipCount > 99 ? '99+' : betslipCount }}
                  </span>
                </div>
              <svg v-else class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="4" y="4" width="16" height="16" rx="2"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
            </div>
          </button>
          <span :class="navTextClass('betslip')">Betslip</span>
        </div>

        <!-- Mybets / Login -->
        <div class="nav-item flex flex-col items-center">
          <button @click="handleMybetsLoginClick" :class="navBtnClass('mybets')">
            <span class="text-xl">
              {{ isAuthenticated ? '📋' : '🔑' }}
            </span>
          </button>
          <span :class="navTextClass('mybets')">
            {{ isAuthenticated ? 'Mybets' : 'Login' }}
          </span>
        </div>

        <!-- Account -->
        <div class="nav-item flex flex-col items-center">
          <button @click="handleAccountClick" :class="navBtnClass('account')">
            <UserIcon class="w-6 h-6" />
          </button>
          <span :class="navTextClass('account')">Account</span>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../store/authStore'
import { HomeIcon, UserIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const betslipCount = ref(0)
const isAuthenticated = computed(() => authStore.isAuthenticated)

// ================= AUTOMATIC ACTIVE TAB LOGIC =================
// Hii computed inasoma URL moja kwa moja. URL ikibadilika, tab inabadilika.
const activeTab = computed(() => {
  const path = route.path
  if (path === '/') return 'home'
  if (path.startsWith('/sports')) return 'sports'
  if (path.startsWith('/betSlip')) return 'betslip'
  if (path.startsWith('/bets') || path.startsWith('/login')) return 'mybets'
  if (path.startsWith('/account')) return 'account'
  return ''
})

// ================= NAV STYLE HELPERS =================
const navBtnClass = (tab) => {
  const isActive = activeTab.value === tab
  return [
    'w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer',
    isActive
      ? 'bg-sky-600 text-white -translate-y-4 shadow-xl scale-110 border-2 border-sky-950 ring-1 ring-amber-400'
      : 'text-gray-400 hover:text-white'
  ]
}

const navTextClass = (tab) => {
  const isActive = activeTab.value === tab
  return [
    'text-[10px] font-bold transition-all duration-300',
    isActive
      ? 'text-[#0AF0B5] -translate-y-2 opacity-100'
      : 'text-gray-400 opacity-80'
  ]
}

// ================= NAV ACTIONS =================
// Hakuna haja ya setActiveTab tena, router.push inatosha
const handleMenuClick = () => router.push('/')
const handleSportsClick = () => router.push('/sports')
const handleBetslipClick = () => router.push('/betSlip')

const handleMybetsLoginClick = () => {
  if (isAuthenticated.value) {
    router.push('/bets')
  } else {
    router.push('/login')
  }
}

const handleAccountClick = () => {
  if (isAuthenticated.value) {
    router.push('/account')
  } else {
    router.push('/login')
  }
}

// ================= BETSLIP COUNT LOGIC =================
const updateBetslipCount = () => {
  try {
    const savedBets = localStorage.getItem('betslip_selections')
    if (savedBets) {
      const bets = JSON.parse(savedBets)
      betslipCount.value = Array.isArray(bets) ? bets.length : 0
    } else {
      betslipCount.value = 0
    }
  } catch (e) {
    betslipCount.value = 0
  }
}

const handleBetslipUpdate = (event) => {
  const bets = event.detail || []
  betslipCount.value = bets.length
}

const handleStorageChange = (event) => {
  if (event.key === 'betslip_selections') {
    updateBetslipCount()
  }
}

// ================= LIFECYCLE =================
onMounted(() => {
  updateBetslipCount()
  window.addEventListener('betslip-update', handleBetslipUpdate)
  window.addEventListener('storage', handleStorageChange)
})

onBeforeUnmount(() => {
  window.removeEventListener('betslip-update', handleBetslipUpdate)
  window.removeEventListener('storage', handleStorageChange)
})
</script>

<style scoped>
.bottom-nav-container {
  padding-bottom: env(safe-area-inset-bottom);
}

.bottom-nav {
  transition: background 0.3s ease;
}

/* Kuzuia text kuchagua/highlight pindi ukibonyeza */
.nav-item {
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}
</style>