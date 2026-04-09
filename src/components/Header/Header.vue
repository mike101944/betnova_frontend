<script setup>
import { onMounted, ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/authStore'
import { useUserData } from '../composables/useUserData'
import { 
  ClockIcon, 
  PlusIcon
} from '@heroicons/vue/24/outline'
import CustomAlert from './component/CustomAlert.vue'

const router = useRouter()
const authStore = useAuthStore()
const { refreshUserData } = useUserData()
const loading = ref(true)

const leftSidebar = inject('leftSidebar')

const openLeftSidebar = () => {
  if (leftSidebar) {
    leftSidebar.open()
  }
}
// Alert state
const showAlert = ref(false)
const alertMessage = ref('')
const alertType = ref('info')

// Sidebar state
const sidebarOpen = ref(false)

// Emit event for sidebar
const emit = defineEmits(['toggle-sidebar'])

// Toggle sidebar function
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
  emit('toggle-sidebar', sidebarOpen.value)
}

// Refresh data when component mounts
onMounted(() => {
  // Simulate loading
  setTimeout(() => {
    refreshUserData()
    loading.value = false
  }, 1000)
})

// Format balance
const formatBalance = (amount) => {
  return new Intl.NumberFormat('sw-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount || 0)
}

// Handle restricted tabs
const handleRestrictedTab = (tabName) => {
  alertMessage.value = ` ${tabName}  is currently unavailable in your location. This feature is only accessible in supported regions.`
  alertType.value = 'warning'
  showAlert.value = true
}

// Handle alert close
const handleAlertClose = () => {
  console.log('Alert closed')
}
</script>

<template>
  <keep-alive>
  <div class="header">
    <!-- Custom Alert Component -->
    <CustomAlert 
      v-model:show="showAlert"
      :type="alertType"
      :message="alertMessage"
      :duration="5000"
      @close="handleAlertClose"
    />

    <!-- Skeleton Loading -->
    <div v-if="loading">
      <!-- Main Header Skeleton -->
      <div class="bg-sky-950 text-left relative">
        <div class="flex flex-wrap justify-between items-center p-2">
          <!-- Logo Section Skeleton -->
          <div class="overflow-hidden">
            <div class="flex items-center">
              <!-- Hamburger menu skeleton -->
              <div class="w-6 h-6 bg-sky-800 rounded animate-pulse mr-1"></div>
              <!-- Logo skeleton -->
              <div class="w-20 h-4 bg-sky-800 rounded animate-pulse ml-2"></div>
            </div>
          </div>

          <!-- Balance Section Skeleton -->
          <div class="inline-flex items-center gap-2">
            <div class="w-16 h-8 bg-sky-800 rounded animate-pulse"></div>
            <div class="w-8 h-8 bg-sky-800 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      <!-- Bottom Tabs Navigation Skeleton -->
      <div class="relative">
        <div class="bg-sky-800 overflow-hidden">
          <ul class="flex overflow-x-auto scrollbar-hide">
            <li v-for="i in 6" :key="i" class="flex-1 min-w-fit px-3 py-2.5">
              <div class="flex items-center justify-center gap-2">
                <div class="w-3.5 h-3.5 bg-sky-900 rounded animate-pulse"></div>
                <div class="w-12 h-3 bg-sky-900 rounded animate-pulse"></div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Actual Content -->
    <div v-else>
      <!-- Main Header -->
      <div class="bg-sky-950 text-left relative">
        <div class="flex flex-wrap justify-between items-center p-2">
          <!-- Logo Section -->
          <div class="overflow-hidden">
            <div class="flex items-center">
              <!-- Hamburger menu - NOW TOGGLES SIDEBAR -->
              <a 
                @click="openLeftSidebar"
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
                    <text x="24" y="12" fill="white" font-weight="bold">Nover</text>
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
            <span v-else class="inline-flex items-center gap-1">
              <router-link 
                to="/deposite" 
                class="text-white font-bold px-1 py-1 bg-gray-500/75 rounded-full transition-colors"
                data-test-id="track-top-nav-link"
              >
                <div class="flex flex-row items-center gap-2">
                  <div class="text-white font-bold h-4 flex w-4 items-center justify-center bg-sky-600 rounded-full">
                    <span class="text-white">+</span>
                  </div>
                  <span class="text-white text-xs mr-1">{{ formatBalance(authStore.userBalance) }}</span>
                </div>
              </router-link>
              <router-link 
                to="/account" 
                class="group flex items-center justify-center p-1 rounded-full bg-sky-600 transition-colors"
                data-test-id="track-top-nav-link"
              >
                <svg class="w-[16px] h-[16px] text-white fill-current" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </router-link>
            </span>
          </div>
        </div>
      </div>

      <!-- Bottom Tabs Navigation -->
      <div class="relative">
        <div class="bg-white overflow-hidden">
          <ul class="flex overflow-x-auto scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none]">
            <!-- Home -->
            <li class="flex-1 min-w-fit px-3 py-2.5 text-gray-600 border-b-2 border-transparent hover:text-[#0AF0B5] hover:border-[#0AF0B5] transition-colors cursor-pointer"
                :class="{ '!text-[#0AF0B5] !border-[#0AF0B5]': $route.path === '/' }"
                data-test-id="tabs-Homepage"
            >
              <router-link to="/" class="flex items-center justify-center gap-2">
                <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 14 14">
                  <path d="M7 0L0 7h2v7h4v-4h2v4h4V7h2L7 0z"/>
                </svg>
              </router-link>
            </li>

            <!-- Sports -->
            <li class="flex-1 min-w-fit px-3 py-2.5 text-gray-600 border-b-2 border-transparent hover:text-[#0AF0B5] hover:border-[#0AF0B5] transition-colors cursor-pointer"
                :class="{ '!text-[#0AF0B5] !border-[#0AF0B5]': $route.path === '/sports' }"
                data-test-id="tabs-Upcoming"
            >
              <router-link to="/sports" class="flex items-center justify-center gap-2">
                <span class="text-[10px]">⚽</span>
                <span class="text-xs font-bold uppercase">Sports</span>
              </router-link>
            </li>

            <!-- Live - Restricted -->
            <li 
              class="flex-1 min-w-fit px-3 py-2.5 text-gray-600 border-b-2 border-transparent hover:text-[#0AF0B5] hover:border-[#0AF0B5] transition-colors cursor-pointer"
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
              class="flex-1 min-w-fit px-3 py-2.5 text-gray-600 border-b-2 border-transparent hover:text-[#0AF0B5] hover:border-[#0AF0B5] transition-colors cursor-pointer"
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
              class="flex-1 min-w-fit px-3 py-2.5 text-gray-600 border-b-2 border-transparent hover:text-[#0AF0B5] hover:border-[#0AF0B5] transition-colors cursor-pointer"
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
              class="flex-1 min-w-fit px-3 py-2.5 text-gray-600 border-b-2 border-transparent hover:text-[#0AF0B5] hover:border-[#0AF0B5] transition-colors cursor-pointer"
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
  </div>
  </keep-alive>
</template>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>