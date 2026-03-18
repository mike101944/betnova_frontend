<template>
  <div class="bottom-nav-container fixed bottom-0 left-0 right-0 z-50">
    <div class="bottom-nav relative bg-[#1a1e24] rounded-t-3xl shadow-2xl border-t border-gray-800">
      
      <!-- Navigation Items - Fixed height for proper positioning -->
      <div class="flex items-end justify-around px-2 relative h-[80px]">
        
        <!-- Floating Background Indicator -->
        <div 
          class="absolute bottom-0 w-14 h-14 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full transition-all duration-300 ease-out shadow-lg border-4 border-amber-200"
          :style="floatingIndicatorStyle"
          v-if="activeTab !== 'none'"
        ></div>

        <!-- Menu Item -->
        <div class="relative flex flex-col items-center justify-end flex-1 h-full pb-2 z-10">
          <button 
            @click="handleMenuClick"
            class="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ease-out hover:scale-110 active:scale-95"
            :class="activeTab === 'betList' ? 'text-white' : 'text-gray-400 hover:bg-gray-800'"
          >
            <svg 
              class="w-6 h-6 transition-colors duration-300"
              :class="activeTab === 'betList' ? 'fill-white' : 'fill-gray-400'"
              viewBox="0 0 24 24"
            >
              <rect x="4" y="6" width="16" height="2" fill="currentColor"/>
              <rect x="4" y="11" width="16" height="2" fill="currentColor"/>
              <rect x="4" y="16" width="16" height="2" fill="currentColor"/>
            </svg>
          </button>
          <span 
            class="text-[10px] font-medium absolute bottom-0 transition-all duration-300 ease-out"
            :class="activeTab === 'betList' 
              ? 'text-[#0AF0B5] opacity-100 translate-y-[-44px]' 
              : 'text-gray-400 opacity-80 translate-y-[-20px]'"
          >
            Menu
          </span>
        </div>

        <!-- Sports Item -->
        <div class="relative flex flex-col items-center justify-end flex-1 h-full pb-2 z-10">
          <button 
            @click="handleSportsClick"
            class="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ease-out hover:scale-110 active:scale-95"
            :class="activeTab === 'sports' ? 'text-white' : 'text-gray-400 hover:bg-gray-800'"
          >
            <span class="text-2xl">⚽</span>
          </button>
          <span 
            class="text-[10px] font-medium absolute bottom-0 transition-all duration-300 ease-out"
            :class="activeTab === 'sports' 
              ? 'text-[#0AF0B5] opacity-100 translate-y-[-44px]' 
              : 'text-gray-400 opacity-80 translate-y-[-20px]'"
          >
            Sport
          </span>
        </div>

        <!-- Center FAB - Betslip with Counter -->
        <div class="relative flex flex-col items-center justify-end flex-1 h-full pb-2 z-10">
          <button 
            @click="handleBetslipClick"
            class="w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ease-out hover:scale-110 active:scale-95 relative"
            :class="activeTab === 'betslip' 
              ? 'text-white' 
              : 'text-gray-400 bg-gradient-to-br from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600'"
          >
            <div v-if="betslipCount > 0" class="relative">
              <span class="text-white font-bold text-lg">
                {{ betslipCount > 99 ? '99+' : betslipCount }}
              </span>
              <span v-if="betslipCount > 0" class="absolute inset-0 rounded-full animate-ping bg-white/30"></span>
            </div>
            <div v-else>
              <svg class="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="4" y="4" width="16" height="16" stroke="currentColor" fill="none"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
            </div>
          </button>
          <span 
            class="text-[10px] font-medium absolute bottom-0 transition-all duration-300 ease-out"
            :class="activeTab === 'betslip' 
              ? 'text-[#0AF0B5] opacity-100 translate-y-[-48px]' 
              : 'text-gray-400 opacity-80 translate-y-[-24px]'"
          >
            Betslip
          </span>
        </div>

        <!-- Mybets/Join Item -->
        <div class="relative flex flex-col items-center justify-end flex-1 h-full pb-2 z-10">
          <button 
            @click="handleMybetsLoginClick"
            class="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ease-out hover:scale-110 active:scale-95"
            :class="(activeTab === 'mybets' || activeTab === 'login') ? 'text-white' : 'text-gray-400 hover:bg-gray-800'"
          >
            <span v-if="isAuthenticated" class="text-white text-xl">📋</span>
            <span v-else class="text-white text-xl">🔑</span>
          </button>
          <span 
            class="text-[10px] font-medium absolute bottom-0 transition-all duration-300 ease-out"
            :class="(activeTab === 'mybets' || activeTab === 'login')
              ? 'text-[#0AF0B5] opacity-100 translate-y-[-44px]' 
              : 'text-gray-400 opacity-80 translate-y-[-20px]'"
          >
            {{ isAuthenticated ? 'Mybets' : 'Login' }}
          </span>
        </div>

        <!-- Account Item -->
        <div class="relative flex flex-col items-center justify-end flex-1 h-full pb-2 z-10">
          <button 
            @click="handleAccountClick"
            class="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ease-out hover:scale-110 active:scale-95"
            :class="activeTab === 'account' ? 'text-white' : 'text-gray-400 hover:bg-gray-800'"
          >
            <div class="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <UserIcon class="w-4 h-4 text-white" />
            </div>
          </button>
          <span 
            class="text-[10px] font-medium absolute bottom-0 transition-all duration-300 ease-out"
            :class="activeTab === 'account' 
              ? 'text-[#0AF0B5] opacity-100 translate-y-[-44px]' 
              : 'text-gray-400 opacity-80 translate-y-[-20px]'"
          >
            Account
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../store/authStore'
import { UserIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref('sports')
const betslipCount = ref(0)

// Map routes to tabs
const routeToTab = {
  '/': 'sports',
  '/menu': 'betList',
  '/betSlip': 'betslip',
  '/bets': 'mybets',
  '/account': 'account',
  '/join-now': 'mybets',
  '/login': 'login'
}

// Calculate position for floating indicator
const floatingIndicatorStyle = computed(() => {
  const positions = {
    betList: '10%',
    sports: '30%',
    betslip: '50%',
    mybets: '70%',
    login: '70%',
    account: '90%'
  }
  
  const left = positions[activeTab.value] || '30%'
  return {
    left,
    transform: 'translateX(-50%)',
    bottom: '32px' // Adjust to match button position
  }
})

// Update active tab based on route
watch(() => route.path, (newPath) => {
  activeTab.value = routeToTab[newPath] || 'sports'
}, { immediate: true })

// Function to get betslip count from localStorage
const updateBetslipCount = () => {
  try {
    const savedBets = localStorage.getItem('betslip_selections')
    betslipCount.value = savedBets ? JSON.parse(savedBets).length : 0
  } catch (e) {
    console.error('Error reading betslip count:', e)
    betslipCount.value = 0
  }
}

// Listen for betslip updates
const handleBetslipUpdate = (event) => {
  betslipCount.value = (event.detail || []).length
}

// Handle storage changes
const handleStorageChange = (event) => {
  if (event.key === 'betslip_selections') updateBetslipCount()
}

// Navigation handlers
const handleMybetsLoginClick = () => {
  if (isAuthenticated.value) {
    activeTab.value = 'mybets'
    router.push('/bets')
  } else {
    activeTab.value = 'login'
    router.push('/login')
  }
}

const handleMenuClick = () => {
  activeTab.value = 'betList'
  router.push('/menu')
}

const handleSportsClick = () => {
  activeTab.value = 'sports'
  router.push('/')
}

const handleBetslipClick = () => {
  activeTab.value = 'betslip'
  router.push('/betSlip')
}

const handleAccountClick = () => {
  activeTab.value = 'account'
  router.push('/account')
}

const isAuthenticated = computed(() => authStore.isAuthenticated)

// Lifecycle hooks
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
  background: rgba(26, 30, 36, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Fixed height container */
.h-\[80px\] {
  height: 80px;
}

/* Text positions */
.translate-y-\[-20px\] {
  transform: translateY(-20px);
}

.translate-y-\[-24px\] {
  transform: translateY(-24px);
}

.translate-y-\[-44px\] {
  transform: translateY(-44px);
}

.translate-y-\[-48px\] {
  transform: translateY(-48px);
}

/* Smooth transitions */
button, span, .absolute.w-14.h-14 {
  transition-property: all;
  transition-duration: 300ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Pulse animation */
@keyframes ping {
  75%, 100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* Responsive */
@media (max-width: 640px) {
  .bottom-nav {
    border-radius: 30px 30px 0 0;
  }
}
</style>