<template>
  <div class="bottom-nav-container fixed bottom-0 left-0 right-0 z-[100] px-2 pb-2">
    <div class="bottom-nav relative bg-[#1a1e24]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10">
      
      <div 
        class="absolute top-0 h-1 bg-sky-500 transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] rounded-full shadow-[0_0_8px_#0ea5e9]"
        :style="indicatorStyle"
      ></div>

      <div class="flex items-center justify-between px-2 h-16 relative">
        
        <button @click="handleMenuClick" class="nav-item group">
          <div :class="['icon-wrapper', activeTab === 'betList' ? 'active-icon' : '']">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </div>
          <span :class="['nav-label', activeTab === 'betList' ? 'active-label' : '']">Menu</span>
        </button>

        <button @click="handleSportsClick" class="nav-item group">
          <div :class="['icon-wrapper', activeTab === 'sports' ? 'active-icon' : '']">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />
            </svg>
          </div>
          <span :class="['nav-label', activeTab === 'sports' ? 'active-label' : '']">Sports</span>
        </button>

        <div class="nav-item relative">
           <div class="absolute -top-8 flex flex-col items-center">
            <button 
              @click="handleBetslipClick"
              class="w-10 h-10 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 active:scale-90 border-4 border-[#1a1e24] relative overflow-hidden"
              :class="[activeTab === 'betslip' ? 'bg-amber-500 text-black scale-110' : 'bg-gradient-to-br from-sky-500 to-blue-700 text-white']"
            >
              <div v-if="betslipCount > 0" class="flex flex-col items-center">
                <span class="font-bold text-lg leading-none">{{ betslipCount > 99 ? '99' : betslipCount }}</span>
              </div>
              <svg v-else class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <rect x="8" y="2" width="8" height="4" rx="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              </svg>
            </button>
            <span :class="['nav-label', activeTab === 'betslip' ? 'text-amber-400 font-bold' : '']">Betslip</span>
           </div>
        </div>

        <button @click="handleMybetsLoginClick" class="nav-item group">
          <div :class="['icon-wrapper', (activeTab === 'mybets' || activeTab === 'login') ? 'active-icon' : '']">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" />
            </svg>
          </div>
          <span :class="['nav-label', (activeTab === 'mybets' || activeTab === 'login') ? 'active-label' : '']">
            {{ isAuthenticated ? 'My Bets' : 'Login' }}
          </span>
        </button>

        <button @click="handleAccountClick" class="nav-item group">
          <div :class="['icon-wrapper', activeTab === 'account' ? 'active-icon' : '']">
            <div class="w-6 h-6 rounded-full overflow-hidden border border-white/20 flex items-center justify-center bg-gray-700">
              <UserIcon class="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <span :class="['nav-label', activeTab === 'account' ? 'active-label' : '']">Profile</span>
        </button>

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

const betslipCount = ref(0)
const isAuthenticated = computed(() => authStore.isAuthenticated)

const routeToTab = {
  '/betList': { tab: 'betList', index: 0 },
  '/menu': { tab: 'betList', index: 0 },
  '/': { tab: 'sports', index: 1 },
  '/betSlip': { tab: 'betslip', index: 2 },
  '/bets': { tab: 'mybets', index: 3 },
  '/login': { tab: 'login', index: 3 },
  '/account': { tab: 'account', index: 4 }
}

const activeTab = computed(() => routeToTab[route.path]?.tab || 'sports')

const indicatorStyle = computed(() => {
  const current = routeToTab[route.path] || { index: 1 }
  const index = current.index
  
  // Hesabu ya katikati ya kila slot (kuna slots 5, kila moja ni 20%)
  const leftPos = (index * 20) + 10 
  
  return {
    left: `${leftPos}%`,
    width: '45px', 
    height: '3px',  
    transform: 'translateX(-50%)', 
    transition: 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  }
})

// Navigation Handlers
const handleMenuClick = () => router.push('/betList')
const handleSportsClick = () => router.push('/')
const handleBetslipClick = () => router.push('/betSlip')
const handleMybetsLoginClick = () => router.push(isAuthenticated.value ? '/bets' : '/login')
const handleAccountClick = () => router.push('/account')

// Storage/Count Logic
const updateBetslipCount = () => {
  try {
    const saved = localStorage.getItem('betslip_selections')
    betslipCount.value = saved ? JSON.parse(saved).length : 0
  } catch { betslipCount.value = 0 }
}

onMounted(() => {
  updateBetslipCount()
  window.addEventListener('storage', updateBetslipCount)
})
</script>

<style scoped>
.bottom-nav-container {
  padding-bottom: calc(env(safe-area-inset-bottom) + 0.5rem);
}



.bottom-nav::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
}
</style>