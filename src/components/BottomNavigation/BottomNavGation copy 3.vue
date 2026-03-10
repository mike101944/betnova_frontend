<template>
  <div class="bottom-nav-container fixed bottom-0 left-0 right-0 z-50">
    <div class="bottom-nav relative bg-[#1a1e24] rounded-t-3xl shadow-2xl">
      
      <!-- Navigation Items -->
      <div class="flex items-center justify-around px-2 py-1 relative">
        <!-- Menu Item -->
        <NavItem
          icon="M4 6h16M4 12h16M4 18h16"
          label="Menu"
          :active="activeTab === 'menu'"
          :index="0"
          :activeIndex="activeIndex"
          @click="setActiveTab('menu', 0)"
        />

        <!-- Sports Item -->
        <NavItem
          icon="M12 4v8l5 3M4 20h16M4 20v-4a4 4 0 014-4h8a4 4 0 014 4v4"
          label="Sports"
          :active="activeTab === 'sports'"
          :index="1"
          :activeIndex="activeIndex"
          @click="setActiveTab('sports', 1)"
        />

        <!-- Center FAB - Betslip -->
        <div class="relative -mt-8">
          <button 
            @click="setActiveTab('betslip', 2)"
            class="w-16 h-16 rounded-full bg-[#0AF0B5] flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
            :class="{ 'ring-4 ring-[#0AF0B5]/20 animate-pulse-glow': activeTab === 'betslip' }"
          >
            <svg class="w-8 h-8 text-[#1a1e24]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="4" y="4" width="16" height="16" stroke="currentColor" fill="none"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
          </button>
          <span class="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap"
                :class="activeTab === 'betslip' ? 'text-[#0AF0B5]' : 'text-gray-400'">
            Betslip
          </span>
        </div>

        <!-- Mybets/Join Item -->
        <NavItem
          :icon="isAuthenticated ? 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 7a4 4 0 100-8 4 4 0 000 8z' : 'M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2 M9 7a4 4 0 100-8 4 4 0 000 8z M17 11l5 5M22 11l-5 5'"
          :label="isAuthenticated ? 'Mybets' : 'Join'"
          :active="activeTab === 'mybets'"
          :index="3"
          :activeIndex="activeIndex"
          @click="setActiveTab('mybets', 3)"
        />

        <!-- Account Item -->
        <NavItem
          icon="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 7a4 4 0 100-8 4 4 0 000 8z"
          label="Account"
          :active="activeTab === 'account'"
          :index="4"
          :activeIndex="activeIndex"
          @click="setActiveTab('account', 4)"
        />
      </div>

      <!-- Animated Background Indicator -->
      <div 
        class="indicator absolute bottom-0 h-1 bg-[#0AF0B5] rounded-full transition-all duration-300 ease-out"
        :style="indicatorStyle"
      ></div>
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

// Item positions for indicator (percentages)
const itemPositions = [10, 30, 50, 70, 90] // Center points as percentages

const indicatorStyle = computed(() => {
  return {
    left: `${itemPositions[activeIndex.value] - 5}%`, // 5% width / 2
    width: '10%'
  }
})

// Map routes to tabs
const routeToTab = {
  '/': { tab: 'sports', index: 1 },
  '/menu': { tab: 'menu', index: 0 },
  '/betSlip': { tab: 'betslip', index: 2 },
  '/bets': { tab: 'mybets', index: 3 },
  '/account': { tab: 'account', index: 4 },
  '/register': { tab: 'mybets', index: 3 }
}

// Watch route changes
watch(() => route.path, (newPath) => {
  const mapping = routeToTab[newPath] || routeToTab['/']
  activeTab.value = mapping.tab
  activeIndex.value = mapping.index
}, { immediate: true })

const setActiveTab = (tab, index) => {
  activeTab.value = tab
  activeIndex.value = index
  
  // Navigate based on tab
  const routes = {
    menu: '/menu',
    sports: '/',
    betslip: '/betSlip',
    mybets: isAuthenticated.value ? '/bets' : '/register',
    account: '/account'
  }
  
  if (routes[tab]) {
    router.push(routes[tab])
  }
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
}

/* Animation for FAB */
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(10, 240, 181, 0.4);
  }
  50% {
    box-shadow: 0 0 20px 5px rgba(10, 240, 181, 0.6);
  }
}

.animate-pulse-glow {
  animation: pulse-glow 2s infinite;
}

/* Ripple effect for clicks */
button:active {
  transform: scale(0.95);
}

/* Smooth transitions for all interactive elements */
button {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Indicator animation */
.indicator {
  transition: left 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .bottom-nav {
    border-radius: 20px 20px 0 0;
  }
  
  .w-16.h-16 {
    width: 56px;
    height: 56px;
    margin-top: -20px;
  }
}
</style>