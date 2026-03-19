<template>
  <div class="left-sidebar fixed left-0 top-0 h-full w-[280px] bg-[#1a1e24] text-white shadow-2xl flex z-[1001] flex-col">
    <div class="p-3 flex flex-row items-center justify-between border-b border-gray-800">
      <router-link to="/" @click="emit('close')" class="flex items-center gap-2">
        <div class="text-2xl font-bold">
          <span class="text-sky-500">Bet</span>
          <span class="text-white">Nova</span>
        </div>
      </router-link>
      <button @click="emit('close')" class="p-2 text-gray-100 hover:text-white cursor-pointer">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div v-if="isAuthenticated" class="p-4 border-b border-gray-800 bg-[#252a2d]">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-teal-600 flex items-center justify-center">
          <UserIcon class="w-5 h-5 text-white" />
        </div>
        <div class="flex-1">
          <div class="text-sm font-medium">{{ userName || 'User' }}</div>
          <div class="text-xs text-[#0AF0B5] font-bold">{{ formatBalance(userBalance) }}</div>
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto py-4 no-scrollbar">
      <div class="space-y-1 px-3">
        
        <button @click="navigateTo('/')" class="nav-btn" :class="activeItem === 'home' ? 'active-gradient' : 'inactive-style'">
          <HomeIcon class="w-5 h-5" /> <span class="text-sm font-medium">Home</span>
        </button>

        <button @click="navigateTo('/sports')" class="nav-btn" :class="activeItem === 'sports' ? 'active-gradient' : 'inactive-style'">
          <TrophyIcon class="w-5 h-5" /> <span class="text-sm font-medium">Sports</span>
          <span class="ml-auto text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">124</span>
        </button>

        <button @click="navigateTo('/casino')" class="nav-btn" :class="activeItem === 'casino' ? 'active-gradient' : 'inactive-style'">
          <CasinoIcon class="w-5 h-5" /> <span class="text-sm font-medium">Casino</span>
        </button>

        <div class="my-4 border-t border-gray-800/50"></div>
        <p class="px-3 text-[10px] uppercase text-gray-500 font-bold mb-2 tracking-widest">Finance</p>

        <button @click="navigateTo('/deposit')" class="nav-btn text-emerald-400" :class="activeItem === 'deposit' ? 'active-gradient text-white' : 'inactive-style'">
          <ArrowDownCircleIcon class="w-5 h-5" /> <span class="text-sm font-medium">Deposit</span>
        </button>

        <button @click="navigateTo('/withdraw')" class="nav-btn" :class="activeItem === 'withdraw' ? 'active-gradient' : 'inactive-style'">
          <ArrowUpCircleIcon class="w-5 h-5" /> <span class="text-sm font-medium">Withdraw</span>
        </button>

        <div class="my-4 border-t border-gray-800/50"></div>
        <p class="px-3 text-[10px] uppercase text-gray-500 font-bold mb-2 tracking-widest">Offers & Alerts</p>

        <button @click="navigateTo('/promotions')" class="nav-btn" :class="activeItem === 'promotions' ? 'active-gradient' : 'inactive-style'">
          <GiftIcon class="w-5 h-5" /> <span class="text-sm font-medium">Promotions</span>
        </button>

        <button @click="navigateTo('/notifications')" class="nav-btn" :class="activeItem === 'notifications' ? 'active-gradient' : 'inactive-style'">
          <BellIcon class="w-5 h-5" /> <span class="text-sm font-medium">Notifications</span>
          <span class="ml-auto text-xs bg-sky-500 text-white px-2 py-0.5 rounded-full">3</span>
        </button>

        <div class="my-4 border-t border-gray-800/50"></div>
        <button @click="navigateTo('/settings')" class="nav-btn" :class="activeItem === 'settings' ? 'active-gradient' : 'inactive-style'">
          <SettingsIcon class="w-5 h-5" /> <span class="text-sm font-medium">Settings</span>
        </button>

        <button @click="navigateTo('/support')" class="nav-btn" :class="activeItem === 'support' ? 'active-gradient' : 'inactive-style'">
          <SupportIcon class="w-5 h-5" /> <span class="text-sm font-medium">Support</span>
        </button>
      </div>
    </div>

    <div class="p-4 border-t border-gray-800 bg-[#161a1e]">
      <button v-if="isAuthenticated" @click="handleLogout" class="w-full flex items-center gap-3 p-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer">
        <PowerIcon class="w-5 h-5" />
        <span class="text-sm font-bold">Logout</span>
      </button>
      <div v-else class="text-[10px] text-gray-600 text-center uppercase tracking-widest">
        © 2026 BetNova
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../store/authStore'
import {
  HomeIcon, TrophyIcon, SparklesIcon as CasinoIcon, FireIcon as LiveIcon,
  Cog6ToothIcon as SettingsIcon, QuestionMarkCircleIcon as SupportIcon,
  UserIcon, ArrowDownCircleIcon, ArrowUpCircleIcon, GiftIcon, BellIcon,
  PowerIcon
} from '@heroicons/vue/24/outline'

const emit = defineEmits(['close'])
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const activeItem = computed(() => {
  const path = route.path
  if (path === '/') return 'home'
  if (path.includes('/sports')) return 'sports'
  if (path.includes('/casino')) return 'casino'
  if (path.includes('/deposit')) return 'deposit'
  if (path.includes('/withdraw')) return 'withdraw'
  if (path.includes('/promotions')) return 'promotions'
  if (path.includes('/notifications')) return 'notifications'
  if (path.includes('/settings')) return 'settings'
  if (path.includes('/support')) return 'support'
  return ''
})

const navigateTo = (path) => {
  router.push(path)
  emit('close')
}

const handleLogout = () => {
  console.log("User logged out")
  emit('close')
}

const isAuthenticated = computed(() => authStore.isAuthenticated)
const userName = computed(() => authStore.user?.name || 'User')
const userBalance = computed(() => authStore.userBalance || 0)

const formatBalance = (amount) => {
  return new Intl.NumberFormat('sw-TZ', {
    style: 'currency', currency: 'TZS',
    minimumFractionDigits: 0, maximumFractionDigits: 0
  }).format(amount || 0)
}
</script>

<style scoped>
/* Common base styles for buttons */


.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>