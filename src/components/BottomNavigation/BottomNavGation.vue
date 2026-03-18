<template>
  <div class="bottom-nav-container fixed bottom-0 left-0 right-0">
    <div class="bottom-nav relative bg-sky-950 border-t border-white rounded-t-3xl shadow-2xl">

      <div class="flex items-end justify-around h-[60px] ">

        <!-- Menu -->
        <div class="nav-item">
          <button @click="handleMenuClick" :class="navBtnClass('betList')">
            <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <rect x="4" y="6" width="16" height="2"/>
              <rect x="4" y="11" width="16" height="2"/>
              <rect x="4" y="16" width="16" height="2"/>
            </svg>
          </button>
          <span :class="navTextClass('betList')">Menu</span>
        </div>

        <!-- Sports -->
        <div class="nav-item">
          <button @click="handleSportsClick" :class="navBtnClass('sports')">
            ⚽
          </button>
          <span :class="navTextClass('sports')">Sport</span>
        </div>

        <!-- Betslip -->
        <div class="nav-item">
          <button @click="handleBetslipClick" :class="navBtnClass('betslip')">

            <span v-if="betslipCount > 0" class="text-white font-bold text-sm">
              {{ betslipCount > 99 ? '99+' : betslipCount }}
            </span>

            <svg v-else class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="4" y="4" width="16" height="16"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>

          </button>
          <span :class="navTextClass('betslip')">Betslip</span>
        </div>

        <!-- Mybets / Login -->
        <div class="nav-item">
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
        <div class="nav-item">
          <button @click="handleAccountClick" :class="navBtnClass('account')">
            <UserIcon class="w-6 h-6 text-white"/>
          </button>
          <span :class="navTextClass('account')">Account</span>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/authStore'
import { UserIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref('sports')
const betslipCount = ref(0)

const isAuthenticated = computed(() => authStore.isAuthenticated)


// ================= NAV STYLE HELPERS =================
const navBtnClass = (tab) => {
  return [
    'w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300',
    activeTab.value === tab
      ? 'bg-sky-700 text-white -translate-y-3 shadow-xl scale-110 border-3 border-amber-300'
      : 'text-gray-400'
  ]
}

const navTextClass = (tab) => {
  return [
    'text-[10px] mt-1 transition-all duration-300',
    activeTab.value === tab
      ? 'text-[#0AF0B5] -translate-y-2'
      : 'text-gray-400'
  ]
}


// ================= NAV ACTIONS =================
const setActiveTab = (tab) => {
  activeTab.value = tab
}



const handleMenuClick = () => {
  setActiveTab('betList')
  router.push('/betList')
}

const handleSportsClick = () => {
  setActiveTab('sports')
  router.push('/')
}

const handleBetslipClick = () => {
  setActiveTab('betslip')
  router.push('/betSlip')
}

const handleMybetsLoginClick = () => {
  if (isAuthenticated.value) {
    setActiveTab('mybets')
    router.push('/bets')
  } else {
    setActiveTab('mybets')
    router.push('/login')
  }
}

const handleAccountClick = () => {
  if (isAuthenticated.value) {
    setActiveTab('account')
    router.push('/account')
  }else {
    setActiveTab('account')
    router.push('/login')
  }
  
}


// ================= BETSLIP COUNT =================
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

/* .bottom-nav {
  /* background: rgb(38, 38, 90); 
  border-top: 1px solid #fff;
} */

/* Optional smooth animation feel */
.nav-item button {
  transition: all 0.25s ease;
}
</style>