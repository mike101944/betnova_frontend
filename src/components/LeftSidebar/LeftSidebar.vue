<template>
  <div class="left-sidebar fixed left-0 top-0 h-full w-[280px] bg-sky-950 text-white shadow-2xl flex z-[1001] flex-col">
    <div class="p-3 flex flex-row items-center justify-between border-b border-gray-800">
      <router-link to="/" @click="emit('close')" class="flex items-center gap-2">
        <div class="text-2xl font-bold italic">
          <span class="text-sky-500">BET</span><span class="text-white">NOVA</span>
        </div>
      </router-link>
      <button @click="emit('close')" class="p-2 text-gray-400 hover:text-white cursor-pointer">
        <XMarkIcon class="w-6 h-6" />
      </button>
    </div>

    <div v-if="isAuthenticated" class="p-4 border-b border-gray-800 bg-sky-900/75">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-teal-600 flex items-center justify-center">
          <UserIcon class="w-5 h-5 text-white" />
        </div>
        <div class="flex-1">
          <div class="text-sm font-medium">{{ userName || 'Mchezaji' }}</div>
          <div class="text-xs text-[#0AF0B5] font-bold">{{ formatBalance(userBalance) }}</div>
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto py-4 no-scrollbar">
      <div class="space-y-1 px-3">
        
        <button @click="navigateTo('/')" class="nav-btn" :class="activeItem === 'home' ? 'active-gradient' : 'inactive-style'">
          <HomeIcon class="w-5 h-5" /> <span class="text-sm font-medium">Home</span>
        </button>
        <button @click="navigateTo('/')" class="nav-btn" :class="activeItem === 'sport' ? 'active-gradient' : 'inactive-style'">
          <HomeIcon class="w-5 h-5" /> <span class="text-sm font-medium">Sport</span>
        </button>
        <button @click="navigateTo('/')" class="nav-btn" :class="activeItem === 'live' ? 'active-gradient' : 'inactive-style'">
          <HomeIcon class="w-5 h-5" /> <span class="text-sm font-medium">Live betting</span>
        </button>
       
      

        <div>
          <button 
            @click="isSportsOpen = !isSportsOpen" 
            class="nav-btn w-full flex items-center"
            :class="activeItem === 'sports' ? 'active-gradient' : 'inactive-style'"
          >
            <TrophyIcon class="w-5 h-5" /> 
            <span class="text-sm font-medium ml-3">Casino</span>
            <ChevronDownIcon 
              class="w-4 h-4 ml-auto transition-transform duration-300" 
              :class="{ 'rotate-180': isSportsOpen }"
            />
          </button>

          <transition name="expand">
            <div v-if="isSportsOpen" class="mt-1 ml-4 space-y-1 border-l border-gray-700 pl-4 overflow-hidden">
              <!-- <button @click="navigateTo('/casino')" class="sub-nav-btn">
                <SparklesIcon class="w-4 h-4 text-yellow-500" />
                <span>Casino</span>
              </button> -->
              <button @click="navigateTo('/aviator')" class="sub-nav-btn">
                <PaperAirplaneIcon class="w-4 h-4 text-red-500 -rotate-45" />
                <span>Aviator</span>
              </button>
              <button @click="navigateTo('/virtual')" class="sub-nav-btn">
                <CpuChipIcon class="w-4 h-4 text-purple-500" />
                <span>Virtual Sports</span>
              </button>
            </div>
          </transition>
        </div>
        <button @click="navigateTo('/')" class="nav-btn" :class="activeItem === 'mybet' ? 'active-gradient' : 'inactive-style'">
          <HomeIcon class="w-5 h-5" /> <span class="text-sm font-medium">Mybet</span>
        </button>

        <div class="my-4 border-t border-gray-800/50"></div>
        <p class="px-3 text-[10px] uppercase text-gray-500 font-bold mb-2">Finance</p>

        <button @click="navigateTo('/deposite')" class="nav-btn text-emerald-400 hover:bg-emerald-500/10">
          <ArrowDownCircleIcon class="w-5 h-5" /> <span class="text-sm font-medium">Deposit</span>
        </button>

        <button @click="navigateTo('/withdraw')" class="nav-btn hover:bg-gray-700/50">
          <ArrowUpCircleIcon class="w-5 h-5" /> <span class="text-sm font-medium">Withdraw</span>
        </button>

        <div class="my-4 border-t border-gray-800/50"></div>
        <button @click="navigateTo('/promotions')" class="nav-btn inactive-style">
          <GiftIcon class="w-5 h-5" /> <span class="text-sm font-medium">Promotions</span>
        </button>

        <button @click="navigateTo('/notifications')" class="nav-btn inactive-style">
          <BellIcon class="w-5 h-5" /> <span class="text-sm font-medium">Notifications</span>
        </button>
      </div>
    </div>

    <div class="p-4 border-t border-gray-800 bg-gradient-to-b from-sky-600/40 via-teal-900/40 to-sky-900/40 cursor-pointer">
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

// State ya kufungua Sports dropdown
const isSportsOpen = ref(false)

const activeItem = computed(() => {
  const path = route.path
  if (path === '/') return 'home'
  if (path.includes('/sports')) return 'sports'
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


/* Animation kwa ajili ya kufunguka kwa sub-menu */
.expand-enter-active, .expand-leave-active {
  transition: all 0.3s ease-in-out;
  max-height: 200px;
}
.expand-enter-from, .expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.no-scrollbar::-webkit-scrollbar { display: none; }
</style>