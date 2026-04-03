<template>
  <div class="bottom-nav-container fixed bottom-0 left-0 right-0 z-[1000]">
    <div class="bottom-nav relative bg-sky-950 border-t border-white rounded-t-3xl shadow-2xl">

      <!-- Skeleton Loading -->
      <div v-if="loading" class="flex items-end justify-around h-[65px] pb-2">
        <div v-for="i in 5" :key="i" class="nav-item flex flex-col items-center">
          <div class="w-10 h-10 bg-sky-800 rounded-full animate-pulse"></div>
          <div class="w-12 h-2 bg-sky-800 rounded mt-1 animate-pulse"></div>
        </div>
      </div>

      <!-- Actual Content -->
      <div v-else class="flex items-end justify-around h-[65px] pb-2">
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
                <span class="relative inline-flex items-center justify-center rounded-full h-5 w-5 bg-sky-800 text-sm text-amber-400 shadow-lg border border-sky-700">
                  {{ betslipCount > 99 ? '9' : betslipCount }}
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
            <div class="relative">
              <!-- Hii ndio Badge ya Open Bets -->
              <div v-if="isAuthenticated && openBets.length > 0" class="absolute -top-2 -right-2 flex h-4 w-4">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-4 w-4 bg-gray-500 text-[10px] items-center justify-center text-white font-bold">
                  {{ openBets.length }}
                </span>
              </div>
              
              <span class="text-xl">
                {{ isAuthenticated ? '📋' : '🔑' }}
              </span>
            </div>
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
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../store/authStore'
import { useBets } from '../../screen/composables/useBets'
import { HomeIcon, UserIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const loading = ref(true)

// Tumia useBets hapa
const { openBets, fetchUserBets } = useBets()

const betslipCount = ref(0)
const isAuthenticated = computed(() => authStore.isAuthenticated)

// Logic ya kusoma bets pindi tu user akilogin
watch(isAuthenticated, (newVal) => {
  if (newVal) {
    fetchUserBets()
  }
}, { immediate: true })

const activeTab = computed(() => {
  const path = route.path
  if (path === '/') return 'home'
  if (path.startsWith('/sports')) return 'sports'
  if (path.startsWith('/betSlip')) return 'betslip'
  if (path.startsWith('/bets') || path.startsWith('/login')) return 'mybets'
  if (path.startsWith('/account')) return 'account'
  return ''
})

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

// ================= BETSLIP LOGIC =================
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

onMounted(() => {
  // Simulate loading
  setTimeout(() => {
    updateBetslipCount()
    // Pia fetch bets wakati wa kuanza kama user tayari yuko logged in
    if (isAuthenticated.value) {
      fetchUserBets()
    }
    loading.value = false
  }, 1200)
  
  window.addEventListener('betslip-update', handleBetslipUpdate)
  window.addEventListener('storage', handleStorageChange)
})

onBeforeUnmount(() => {
  window.removeEventListener('betslip-update', handleBetslipUpdate)
  window.removeEventListener('storage', handleStorageChange)
})
</script>

<style scoped>
/* Optional: Add any additional styles if needed */
</style>