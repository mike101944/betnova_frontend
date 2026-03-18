<script setup>
import { onMounted, ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/authStore'
import { useUserData } from '../composables/useUserData'
import CustomAlert from './component/CustomAlert.vue'

const router = useRouter()
const authStore = useAuthStore()
const { refreshUserData } = useUserData()

// INJECT leftSidebar
const leftSidebar = inject('leftSidebar')

// Open sidebar function
const openLeftSidebar = () => {
  if (leftSidebar) {
    leftSidebar.open()
  }
}

// Alert state
const showAlert = ref(false)
const alertMessage = ref('')
const alertType = ref('info')

onMounted(() => {
  refreshUserData()
})

const formatBalance = (amount) => {
  return new Intl.NumberFormat('sw-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount || 0)
}

const handleRestrictedTab = (tabName) => {
  alertMessage.value = ` ${tabName} is currently unavailable in your location.`
  alertType.value = 'warning'
  showAlert.value = true
}

const handleAlertClose = () => {
  console.log('Alert closed')
}
</script>

<template>
  <div class="header">
    <CustomAlert 
      v-model:show="showAlert"
      :type="alertType"
      :message="alertMessage"
      :duration="5000"
      @close="handleAlertClose"
    />

    <!-- Main Header -->
    <div class="bg-sky-950 text-left relative">
      <div class="flex flex-wrap justify-between items-center p-2">
        <!-- Logo Section -->
        <div class="overflow-hidden">
          <div class="flex items-center">
            <!-- Hamburger menu -->
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
              <div class="flex md:hidden items-center justify-center">
                <h1 class="text-2xl text-white font-bold">b</h1>
                <h1 class="text-2xl text-[#0AF0B5] font-bold italic">N</h1>
              </div>

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
          <span v-if="!authStore.isAuthenticated" class="inline-flex items-center gap-2">
            <router-link to="/login" class="text-white font-bold px-2 py-1.5 text-sm hover:bg-[#353b40] transition-colors">
              Login
            </router-link>
            <router-link to="/register" class="text-[#252a2d] font-bold px-2 py-1.5 text-sm bg-[#0AF0B5] hover:bg-[#09d6a0] transition-colors">
              Register
            </router-link>
          </span>

          <span v-else class="inline-flex items-center gap-1">
            <router-link to="/deposite" class="text-white font-bold px-1 py-1 bg-gray-500/75 rounded-full transition-colors">
              <div class="flex flex-row items-center gap-2">
                <div class="text-white font-bold h-4 flex w-4 items-center justify-center bg-sky-600 rounded-full">
                  <span class="text-white">+</span>
                </div>
                <span class="text-white text-xs mr-1">{{ formatBalance(authStore.userBalance) }}</span>
              </div>
            </router-link>
            <router-link to="/account" class="group flex items-center justify-center p-1 rounded-full bg-sky-600 transition-colors">
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
      <div class="bg-[#353b40] overflow-hidden">
        <ul class="flex overflow-x-auto scrollbar-hide">
          <!-- ... tabs ziko sawa ... -->
        </ul>
      </div>
    </div>
  </div>
</template>