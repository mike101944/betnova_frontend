<template>
  <div class="bottom-nav-container fixed bottom-0 left-0 right-0">
    <div class="bottom-nav relative bg-[#1a1e24] rounded-t-3xl shadow-2xl">
      
      <!-- Navigation Items -->
      <div class="flex items-end justify-around px-2 relative" style="height: 70px;">
        <!-- Menu Item -->
       

        <div class="relative flex flex-col items-center" style="width: 70px;">
          <button 
             @click="handleMenuClick"
            class="w-12 h-12 rounded-full bg-sky-700 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
            :class="{
              'translate-y-[-20px]': activeTab === 'betList',
              'translate-y-0': activeTab !== 'betList'
            }"
          >
          <svg 
                class="w-6 h-6 fill-[#aaaeb0] text-[#8e9398] group-hover:fill-[#0AF0B5] transition-colors"
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

        <!-- Sports Item - sasa itaonyesha emoji ⚽ -->
       

        <div class="relative flex flex-col items-center" style="width: 70px;">
          <button 
            @click="handleSportsClick"
            class="w-12 h-12 rounded-full bg-sky-700 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
            :class="{
              'translate-y-[-20px]': activeTab === 'sports',
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

        

        <!-- Center FAB - Betslip -->
        <div class="relative flex flex-col items-center" style="width: 70px;">
          <button 
            @click="handleBetslipClick"
            class="w-12 h-12 rounded-full bg-sky-700 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
            :class="{
              'translate-y-[-20px]': activeTab === 'betslip',
              'translate-y-0': activeTab !== 'betslip'
            }"
          >
            <svg class="w-7 h-7 text-[#1a1e24]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="4" y="4" width="16" height="16" stroke="currentColor" fill="none"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
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
    class="w-12 h-12 rounded-full bg-sky-700 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
    :class="{
      'translate-y-[-20px]': activeTab === 'mybets' || activeTab === 'login',
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
            class="w-12 h-12 rounded-full bg-sky-700 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
            :class="{
              'translate-y-[-20px]': activeTab === 'account',
              'translate-y-0': activeTab !== 'account'
            }"
          >
          <i class="fas fa-user-circle text-[50px] text-white rounded-full "></i>
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
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../store/authStore'
import NavItem from './NavItem.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const activeIndex = ref(1) // Default to Sports (index 1)
const activeTab = ref('sports')

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