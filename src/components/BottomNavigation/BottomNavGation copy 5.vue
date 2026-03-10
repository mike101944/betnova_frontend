<template>
  <div class="bottom-nav-container fixed bottom-0 left-0 right-0">
    <div class="bottom-nav relative bg-[#1a1e24] rounded-t-3xl shadow-2xl">
      
      <!-- Navigation Items -->
      <div class="flex items-end justify-around px-2 relative" style="height: 70px;">
        <!-- Menu Item -->
        <div class="relative flex flex-col items-center" style="width: 70px;">
          <button 
            @click="setActiveTab('menu', 0)"
            class="w-12 h-12 rounded-full bg-sky-700 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
            :class="{
              'translate-y-[-20px]': activeTab === 'menu',
              'translate-y-0': activeTab !== 'menu'
            }"
          >
            <svg 
              class="w-6 h-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round"/>
            </svg>
          </button>
          <span class="text-[10px] font-medium mt-1 transition-all duration-300"
                :class="activeTab === 'menu' ? 'text-[#0AF0B5] translate-y-[-20px]' : 'text-gray-400'">
            Menu
          </span>
        </div>

        <!-- Sports Item -->
        <div class="relative flex flex-col items-center" style="width: 70px;">
          <button 
            @click="setActiveTab('sports', 1)"
            class="w-12 h-12 rounded-full bg-sky-700 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
            :class="{
              'translate-y-[-20px]': activeTab === 'sports',
              'translate-y-0': activeTab !== 'sports'
            }"
          >
            <span class="text-white text-xl">⚽</span>
          </button>
          <span class="text-[10px] font-medium mt-1 transition-all duration-300"
                :class="activeTab === 'sports' ? 'text-[#0AF0B5] translate-y-[-20px]' : 'text-gray-400'">
            Sport
          </span>
        </div>

        <!-- Center FAB - Betslip -->
        <div class="relative flex flex-col items-center" style="width: 70px;">
          <button 
            @click="setActiveTab('betslip', 2)"
            class="w-12 h-12 rounded-full bg-[#0AF0B5] flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
            :class="{
              'translate-y-[-20px]': activeTab === 'betslip',
              'translate-y-0': activeTab !== 'betslip'
            }"
          >
            <svg class="w-6 h-6 text-[#1a1e24]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="4" y="4" width="16" height="16" stroke="currentColor" fill="none"/>
              <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor"/>
              <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor"/>
            </svg>
          </button>
          <span class="text-[10px] font-medium mt-1 transition-all duration-300"
                :class="activeTab === 'betslip' ? 'text-[#0AF0B5] translate-y-[-20px]' : 'text-gray-400'">
            Betslip
          </span>
        </div>

        <!-- Mybets/Login Item - LOGIC IMEKAA HAPA -->
        <div class="relative flex flex-col items-center" style="width: 70px;">
          <button 
            @click="handleMybetsLoginClick"
            class="w-12 h-12 rounded-full bg-sky-700 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
            :class="{
              'translate-y-[-20px]': activeTab === 'mybets' || activeTab === 'login',
              'translate-y-0': activeTab !== 'mybets' && activeTab !== 'login'
            }"
          >
            <!-- Icon inabadilika kulingana na authentication -->
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
            @click="setActiveTab('account', 4)"
            class="w-12 h-12 rounded-full bg-sky-700 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
            :class="{
              'translate-y-[-20px]': activeTab === 'account',
              'translate-y-0': activeTab !== 'account'
            }"
          >
            <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke-linecap="round"/>
              <circle cx="12" cy="8" r="4" stroke-linecap="round"/>
            </svg>
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

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const activeIndex = ref(1) // Default to Sports (index 1)
const activeTab = ref('sports')

// Map routes to tabs
const routeToTab = {
  '/': { tab: 'sports', index: 1 },
  '/menu': { tab: 'menu', index: 0 },
  '/betSlip': { tab: 'betslip', index: 2 },
  '/bets': { tab: 'mybets', index: 3 },
  '/account': { tab: 'account', index: 4 },
  '/register': { tab: 'mybets', index: 3 },
  '/login': { tab: 'login', index: 3 }   // <--- ONGEZA HII
}

// Watch route changes
watch(() => route.path, (newPath) => {
  const mapping = routeToTab[newPath] || routeToTab['/']
  if (mapping) {
    activeTab.value = mapping.tab
    activeIndex.value = mapping.index
  }
}, { immediate: true })

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