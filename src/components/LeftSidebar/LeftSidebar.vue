<template>
  <div  class="left-sidebar fixed left-0 top-0 h-full w-[280px] bg-sky-950 text-white shadow-2xl flex z-[1001] flex-col">
    
    <div class="p-3 flex flex-row items-center justify-between border-b border-gray-800/50">
      <router-link to="/" @click="emit('close')" class="flex items-center gap-2 group">
        <div class="text-2xl font-black italic tracking-tighter transition-transform group-hover:scale-105">
          <span class="text-sky-500">BET</span><span class="text-white">NOVA</span>
        </div>
      </router-link>
      <button @click="emit('close')" class="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all">
        <XMarkIcon class="w-6 h-6" />
      </button>
    </div>

    <div v-if="isAuthenticated" class="p-3 bg-gradient-to-b from-sky-900/20 to-transparent border-b border-gray-800/50">
      <div class="flex items-center gap-3 bg-white/5  rounded-2xl border border-white/5">
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
          <UserIcon class="w-5 h-5 text-white" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-bold truncate">{{ userName || 'Mchezaji' }}</div>
          <div class="text-xs text-[#0AF0B5] font-mono tracking-tight">{{ formatBalance(userBalance) }}</div>
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto py-1 no-scrollbar">
      <div class="space-y-1 px-3">
        
        <button @click="navigateTo('/')" class="nav-btn" :class="activeItem === 'home' ? 'active-gradient' : 'inactive-style'">
          <HomeIcon class="w-5 h-5" />
          <span class="text-sm font-medium">Home</span>
        </button>

        <button @click="navigateTo('/sports')" class="nav-btn" :class="activeItem === 'sports' ? 'active-gradient' : 'inactive-style'">
          <span class="text-base w-5 flex justify-center">⚽</span>
          <span class="text-sm font-medium">Sports Betting</span>
        </button>

        <button @click="navigateTo('/live')" class="nav-btn" :class="activeItem === 'live' ? 'active-gradient' : 'inactive-style'">
          <div class="relative w-5 h-5 flex items-center justify-center">
             <span class="absolute inline-flex h-3 w-3 rounded-full bg-red-500 opacity-75 animate-ping"></span>
             <span class="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
          </div>
          <span class="text-sm font-medium">Live Betting</span>
          <span class="ml-auto text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500/20 font-bold">LIVE</span>
        </button>

        <div>
          <button 
            @click="isSportsOpen = !isSportsOpen" 
            class="nav-btn w-full"
            :class="isSportsOpen ? 'bg-white/5' : 'inactive-style'"
          >
            <TrophyIcon class="w-5 h-5 text-yellow-500" /> 
            <span class="text-sm font-medium ml-0">Casino Games</span>
            <ChevronDownIcon 
              class="w-4 h-4 ml-auto transition-transform duration-300" 
              :class="{ 'rotate-180': isSportsOpen }"
            />
          </button>

          <transition name="expand">
            <div v-if="isSportsOpen" class="mt-1 ml-4 space-y-1 border-l-2 border-sky-500/30 pl-3">
              <button @click="navigateTo('/aviator')" class="sub-nav-btn group">
                <PaperAirplaneIcon class="w-4 h-4 text-red-500 -rotate-45 group-hover:translate-x-1 transition-transform" />
                <span>Aviator</span>
              </button>
              <button @click="navigateTo('/virtual')" class="sub-nav-btn group">
                <CpuChipIcon class="w-4 h-4 text-purple-400" />
                <span>Virtual Sports</span>
              </button>
            </div>
          </transition>
        </div>

        <button @click="navigateTo('/bets')" class="nav-btn" :class="activeItem === 'mybet' ? 'active-gradient' : 'inactive-style'">
          <span class="text-base w-5 flex justify-center">📋</span>
          <span class="text-sm font-medium">My Bets</span>
        </button>

        <div class="py-3 px-3">
          <div class="border-t border-gray-800/50 w-full"></div>
        </div>

        <p class="px-3 text-[10px] uppercase text-gray-500 font-black mb-2 tracking-widest">Wallet & Finance</p>

        <button @click="navigateTo('/deposite')" class="nav-btn group hover:bg-emerald-500/10">
          <ArrowDownCircleIcon class="w-5 h-5 text-emerald-500" />
          <span class="text-sm font-medium text-emerald-400">Deposit Money</span>
        </button>

        <button @click="navigateTo('/withdraw')" class="nav-btn hover:bg-white/5">
          <ArrowUpCircleIcon class="w-5 h-5 text-gray-400" />
          <span class="text-sm font-medium">Withdraw</span>
        </button>

        <div class="py-3 px-3">
           <div class="border-t border-gray-800/50 w-full"></div>
        </div>

        <button @click="navigateTo('/promotions')" class="nav-btn inactive-style">
          <GiftIcon class="w-5 h-5" />
          <span class="text-sm font-medium">Promotions</span>
        </button>

        <button @click="navigateTo('/notifications')" class="nav-btn inactive-style">
          <BellIcon class="w-5 h-5" />
          <span class="text-sm font-medium">Notifications</span>
        </button>
      </div>
    </div>

    <div class="p-3 border-t border-gray-800 bg-gradient-to-b from-sky-600/40 via-teal-900/40 to-sky-900/40 cursor-pointer">
      <button v-if="isAuthenticated" @click="handleLogout" class="w-full flex items-center gap-3 p-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer font-bold text-sm">
        <PowerIcon class="w-5 h-5" /> Logout
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../store/authStore'
import {
  HomeIcon, TrophyIcon, SparklesIcon, FireIcon as LiveIcon,
  Cog6ToothIcon as SettingsIcon, QuestionMarkCircleIcon as SupportIcon,
  UserIcon, ArrowDownCircleIcon, ArrowUpCircleIcon, GiftIcon, BellIcon,
  PowerIcon, ChevronDownIcon, XMarkIcon, PaperAirplaneIcon, CpuChipIcon
} from '@heroicons/vue/24/outline'

const emit = defineEmits(['close'])
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isSportsOpen = ref(false)

const activeItem = computed(() => {
  const path = route.path
  if (path === '/') return 'home'
  if (path.includes('/sports')) return 'sports'
  if (path.includes('/live')) return 'live'
  if (path.includes('/bets')) return 'mybet'
  if (path.includes('/deposite')) return 'deposit'
  return ''
})

const navigateTo = (path) => {
  router.push(path)
  emit('close')
}

const handleLogout = () => {
  emit('close')
  // authStore.logout()
}

const isAuthenticated = computed(() => authStore.isAuthenticated)
const userName = computed(() => authStore.user?.name)
const userBalance = computed(() => authStore.userBalance || 0)

const formatBalance = (amount) => {
  return new Intl.NumberFormat('sw-TZ', {
    style: 'currency', currency: 'TZS',
    minimumFractionDigits: 0
  }).format(amount)
}
</script>

<style scoped>

/* Smooth Accordion Animation */
.expand-enter-active, .expand-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 200px;
}
.expand-enter-from, .expand-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-5px);
}

.no-scrollbar::-webkit-scrollbar { display: none; }
</style>