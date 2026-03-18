<template>
  <div class="bottom-nav-container fixed bottom-0 left-0 right-0">
    <div class="bottom-nav relative bg-[#1a1e24] rounded-t-full shadow-2xl">
      
      <!-- Navigation Items -->
      <div class="flex items-end justify-around px-2 relative" style="height: 55px;">
        <!-- Menu Item -->
        <div class="relative flex flex-col items-center" style="width: 70px;">
          <button 
             @click="handleMenuClick"
            class=" rounded-full  flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
            :class="{
              'translate-y-[-20px] p-2 border-6 bg-sky-700  border-amber-200 rounded-full': activeTab === 'betList',
              'translate-y-0': activeTab !== 'betList'
            }"
          >
          <svg 
                class="w-6 h-6 fill-[#fff] text-white group-hover:fill-[#0AF0B5] transition-colors"
                viewBox="0 0 24 24"
              >
                <rect x="4" y="6" width="16" height="2" fill="currentColor"/>
                <rect x="4" y="11" width="16" height="2" fill="currentColor"/>
                <rect x="4" y="16" width="16" height="2" fill="currentColor"/>
              </svg>
          </button>
          <span class="text-[10px] font-medium mt-1 transition-all duration-300"
                :class="activeTab === 'betList' ? 'text-[#0AF0B5] translate-y-[-20px]' : 'text-gray-400'">
                Menu
          </span>
        </div>

        <!-- Sports Item -->
        <div class="relative flex flex-col items-center" style="width: 70px;">
          <button 
            @click="handleSportsClick"
            class="rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
            :class="{
              'translate-y-[-20px] p-2 border-6 bg-sky-700  border-amber-200 rounded-full': activeTab === 'sports',
              'translate-y-0': activeTab !== 'sports'
            }"
          >
            <span>⚽</span>
          </button>
          <span class="text-[10px] font-medium mt-1 transition-all duration-300"
                :class="activeTab === 'sports' ? 'text-[#0AF0B5] translate-y-[-20px]' : 'text-gray-400'">
            Sport
          </span>
        </div>

        <!-- Center FAB - Betslip with Counter -->
        <div class="relative flex flex-col items-center" style="width: 70px;">
          <button 
            @click="handleBetslipClick"
            class=" rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 relative"
            :class="{
              'translate-y-[-20px] p-2 border-6 bg-sky-700  border-amber-200 rounded-full': activeTab === 'betslip',
              'translate-y-0': activeTab !== 'betslip'
            }"
          >
            <div v-if="betslipCount > 0">
              <span class="text-white font-bold text-">
                {{ betslipCount > 99 ? '99+' : betslipCount }}
             
            </span>

            </div>
            <div v-else>
              <svg class="w-7 h-7 text-white font-bold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="4" y="4" width="16" height="16" stroke="currentColor" fill="none"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            </div>
            
            <!-- Counter Badge - Shows number of bets -->
            <!-- <span 
              v-if="betslipCount > 0"
              class="absolute -top-1 -right-1 bg-[#0AF0B5] text-[#1a1e24] text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 border-2 border-[#1a1e24]"
            >
              {{ betslipCount > 99 ? '99+' : betslipCount }}
            </span> -->
          </button>
          <span class="text-[10px] font-medium mt-1 transition-all duration-300"
                :class="activeTab === 'betslip' ? 'text-[#0AF0B5] translate-y-[-20px]' : 'text-gray-400'">
            Betslip
          </span>
        </div>

        <!-- Mybets/Join Item -->
        <div class="relative flex flex-col items-center" style="width: 70px;">
          <button 
            @click="handleMybetsLoginClick"
            class=" rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
            :class="{
              'translate-y-[-20px] p-2 border-6 bg-sky-700  border-amber-200 rounded-full': activeTab === 'mybets' || activeTab === 'login',
              'translate-y-0': activeTab !== 'mybets' && activeTab !== 'login'
            }"
          >
            <span v-if="isAuthenticated" class="text-white text-xl">📋</span>
            <span v-else class="text-white text-xl">🔑</span>
          </button>
          <span class="text-[10px] font-medium mt-1 transition-all duration-300"
                :class="activeTab === 'mybets' || activeTab === 'login' ? 'text-[#0AF0B5] translate-y-[-20px]' : 'text-gray-400'">
            {{ isAuthenticated ? 'Mybets' : 'Login' }}
          </span>
        </div>

        <!-- Account Item -->
        <div class="relative flex flex-col items-center" style="width: 70px;">
          <button 
             @click="handleAccountClick"
            class="  rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
            :class="{
              'translate-y-[-20px] p-2 border-6 bg-sky-700  border-amber-200 rounded-full': activeTab === 'account',
              'translate-y-0': activeTab !== 'account'
            }"
          >
          <UserIcon class="w-6 h-6 text-white" />
          </button>
          <span class="text-[10px] font-medium mt-1 transition-all duration-300"
                :class="activeTab === 'account' ? 'text-[#0AF0B5] translate-y-[-20px]' : 'text-gray-400'">
                Account
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../store/authStore'
import { UserIcon } from '@heroicons/vue/24/outline'
import NavItem from './NavItem.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const activeIndex = ref(1) // Default to Sports (index 1)
const activeTab = ref('sports')
const betslipCount = ref(0) // Add this line

// Map routes to tabs - SAHIHISHA HAPA
const routeToTab = {
  '/': { tab: 'sports', index: 1 },
  '/menu': { tab: 'menu', index: 0 },
  '/betSlip': { tab: 'betslip', index: 2 },
  '/bets': { tab: 'mybets', index: 3 },
  '/account': { tab: 'account', index: 4 },
  '/join-now': { tab: 'mybets', index: 3 },  // Register inaenda kwa mybets tab
  '/login': { tab: 'login', index: 3 }        // Login inaenda kwa login tab
}

// Function to get betslip count from localStorage
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
    console.error('Error reading betslip count:', e)
    betslipCount.value = 0
  }
}

// Listen for betslip updates
const handleBetslipUpdate = (event) => {
  const bets = event.detail || []
  betslipCount.value = bets.length
  console.log('Betslip count updated:', betslipCount.value)
}

// Handle storage changes from other tabs
const handleStorageChange = (event) => {
  if (event.key === 'betslip_selections') {
    updateBetslipCount()
  }
}

// Helper function kwa mybets/login button
const handleMybetsLoginClick = () => {
  if (isAuthenticated.value) {
    // Ameingia - nenda kwa mybets
    setActiveTab('mybets', 3)
    router.push('/bets')
  } else {
    // Hajaingia - nenda kwa login
    setActiveTab('login', 3)
    router.push('/login')
  }
}

const setActiveTab = (tab, index) => {
  activeTab.value = tab
  activeIndex.value = index
  // TUMEONDOA navigation kutoka hapa - navigation inafanywa na handleMybetsLoginClick
}

// Badilisha setActiveTab kwenye buttons zingine
const handleMenuClick = () => {
  setActiveTab('betList', 0)
  router.push('/betList')
}

const handleSportsClick = () => {
  setActiveTab('sports', 1)
  router.push('/')
}

const handleBetslipClick = () => {
  setActiveTab('betslip', 2)
  router.push('/betSlip')
}

const handleAccountClick = () => {
  setActiveTab('account', 4)
  router.push('/account')
}

const isAuthenticated = computed(() => authStore.isAuthenticated)

// Lifecycle hooks - Add these
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
  backdrop-filter: blur(10px);
  background: rgba(26, 30, 36, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  height: 80px;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .bottom-nav {
    border-radius: 20px 20px 0 0;
  }
}
</style>