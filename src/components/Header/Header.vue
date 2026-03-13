<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/authStore'
import { useUserData } from '../composables/useUserData'

const router = useRouter()
const authStore = useAuthStore()
const { refreshUserData } = useUserData()

// Refresh data when component mounts
onMounted(() => {
  refreshUserData()
})

// Format balance
const formatBalance = (amount) => {
  return new Intl.NumberFormat('sw-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount || 0)
}

// Handle restricted tabs
const handleRestrictedTab = (tabName) => {
  const confirmUpgrade = confirm(`You don't have access to ${tabName}.\n\nUpgrade your account to access this feature.`)
  
  if (confirmUpgrade) {
    router.push('/')
  }
}
</script>

<template>
  <div class="header">
    <!-- Main Header -->
    <div class="bg-sky-950 text-left relative">
      <div class="flex flex-wrap justify-between items-center p-2">
        <!-- Logo Section -->
        <div class="overflow-hidden">
          <div class="flex items-center">
            <!-- Hamburger menu -->
            <a 
              class="inline-block align-middle mr-0 p-1 cursor-pointer hover:[&_svg]:fill-[#0AF0B5] group"
              data-test-id="headerMenuOpener"
            >
              <svg 
                class="w-6 h-6 fill-[#aaaeb0] text-[#8e9398] group-hover:fill-[#0AF0B5] transition-colors"
                viewBox="0 0 24 24"
              >
                <rect x="4" y="6" width="16" height="2" fill="currentColor"/>
                <rect x="4" y="11" width="16" height="2" fill="currentColor"/>
                <rect x="4" y="16" width="16" height="2" fill="currentColor"/>
              </svg>
            </a>
            
            <!-- Logo -->
            <router-link 
              to="/" 
              class="mr-3 flex overflow-hidden"
              data-test-id="nav-homepage-link"
            >
              <!-- Small Screen Logo -->
              <div class="flex md:hidden items-center justify-center">
                <h1 class="text-2xl text-white font-bold">b</h1>
                <h1 class="text-2xl text-[#0AF0B5] font-bold italic">N</h1>
              </div>

              <!-- Large Screen Logo -->
              <div class="hidden md:block">
                <svg class="w-[92px] h-4" viewBox="0 0 92 16">
                  <text x="0" y="12" fill="#0AF0B5" font-weight="bold">Bet</text>
                  <text x="24" y="12" fill="white" font-weight="bold">Nova</text>
                </svg>
              </div>
            </router-link>
          </div>
        </div>

        <!-- Balance Section -->
        <div class="inline-flex items-center">
          <!-- Unauthenticated -->
          <span v-if="!authStore.isAuthenticated" class="inline-flex items-center gap-2">
            <router-link 
              to="/login" 
              class="text-white font-bold px-2 py-1.5 text-sm hover:bg-[#353b40] transition-colors"
              data-test-id="track-top-nav-link"
            >
              Login
            </router-link>
            <router-link 
              to="/register" 
              class="text-[#252a2d] font-bold px-2 py-1.5 text-sm bg-[#0AF0B5] hover:bg-[#09d6a0] transition-colors"
              data-test-id="track-top-nav-link"
            >
              Register
            </router-link>
          </span>

          <!-- Authenticated -->
          <span v-else class="inline-flex items-center gap-2">
            <router-link 
              to="/deposite" 
              class="border border-sky-300 text-white font-bold px-1 py-1 rounded-l-xl rounded-r-md hover:bg-white/10 transition-colors"
              data-test-id="track-top-nav-link"
            >
              <span class="text-white">{{ formatBalance(authStore.userBalance) }}</span>
            </router-link>
            <router-link 
              to="/account" 
              class="group flex items-center p-2 rounded-lg hover:bg-white/10 transition-colors"
              data-test-id="track-top-nav-link"
            >
              <i class="fas fa-user-circle text-[30px] border border-amber-100 rounded-full text-emerald-500"></i>
            </router-link>
          </span>
        </div>
      </div>
    </div>

    <!-- Bottom Tabs Navigation -->
    <div class="relative">
      <div class="bg-[#353b40] overflow-hidden">
        <ul class="flex overflow-x-auto scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none]">
          <!-- Home -->
          <li class="flex-1 min-w-fit px-3 py-2.5 text-[#aaaeb0] border-b-2 border-transparent hover:text-[#0AF0B5] hover:border-[#0AF0B5] transition-colors cursor-pointer"
              :class="{ '!text-[#0AF0B5] !border-[#0AF0B5]': $route.path === '/' }"
              data-test-id="tabs-Homepage"
          >
            <router-link to="/" class="flex items-center justify-center gap-2">
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 14 14">
                <path d="M7 0L0 7h2v7h4v-4h2v4h4V7h2L7 0z"/>
              </svg>
            </router-link>
          </li>

          <!-- Sports - Always accessible -->
          <li class="flex-1 min-w-fit px-3 py-2.5 text-[#aaaeb0] border-b-2 border-transparent hover:text-[#0AF0B5] hover:border-[#0AF0B5] transition-colors cursor-pointer"
              :class="{ '!text-[#0AF0B5] !border-[#0AF0B5]': $route.path === '/sports' }"
              data-test-id="tabs-Upcoming"
          >
            <router-link to="/sports" class="flex items-center justify-center gap-2">
              <span>⚽</span>
              <span class="text-xs font-bold uppercase">Sports</span>
            </router-link>
          </li>

          <!-- Live - Restricted -->
          <li 
            class="flex-1 min-w-fit px-3 py-2.5 text-[#aaaeb0] border-b-2 border-transparent hover:text-[#0AF0B5] hover:border-[#0AF0B5] transition-colors cursor-pointer"
            @click="handleRestrictedTab('Live betting')"
            data-test-id="tabs-Live"
          >
            <div class="flex items-center justify-center gap-2">
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 14 14">
                <circle cx="7" cy="7" r="2" fill="currentColor"/>
                <circle cx="7" cy="7" r="5" stroke="currentColor" fill="none"/>
              </svg>
              <span class="text-xs font-bold uppercase">Live</span>
            </div>
          </li>

          <!-- Casino - Restricted -->
          <li 
            class="flex-1 min-w-fit px-3 py-2.5 text-[#aaaeb0] border-b-2 border-transparent hover:text-[#0AF0B5] hover:border-[#0AF0B5] transition-colors cursor-pointer"
            @click="handleRestrictedTab('Casino games')"
            data-test-id="tabs-Casino"
          >
            <div class="flex items-center justify-center gap-2">
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 14 14">
                <rect x="2" y="2" width="10" height="10" stroke="currentColor" fill="none"/>
                <circle cx="7" cy="7" r="1" fill="currentColor"/>
              </svg>
              <span class="text-xs font-bold uppercase">Casino</span>
            </div>
          </li>

          <!-- Virtuals - Restricted -->
          <li 
            class="flex-1 min-w-fit px-3 py-2.5 text-[#aaaeb0] border-b-2 border-transparent hover:text-[#0AF0B5] hover:border-[#0AF0B5] transition-colors cursor-pointer"
            @click="handleRestrictedTab('Virtual sports')"
            data-test-id="tabs-Virtual Sports"
          >
            <div class="flex items-center justify-center gap-2">
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 14 14">
                <path d="M3 3L7 1L11 3L11 11L7 13L3 11L3 3Z" stroke="currentColor" fill="none"/>
              </svg>
              <span class="text-xs font-bold uppercase">Virtuals</span>
            </div>
          </li>

          <!-- Aviator - Restricted -->
          <li 
            class="flex-1 min-w-fit px-3 py-2.5 text-[#aaaeb0] border-b-2 border-transparent hover:text-[#0AF0B5] hover:border-[#0AF0B5] transition-colors cursor-pointer"
            @click="handleRestrictedTab('Aviator game')"
            data-test-id="tabs-Aviator"
          >
            <div class="flex items-center justify-center gap-2">
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 14 14">
                <path d="M2 12L7 2L12 12L7 9L2 12Z" stroke="currentColor" fill="none"/>
              </svg>
              <span class="text-xs font-bold uppercase">Aviator</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>