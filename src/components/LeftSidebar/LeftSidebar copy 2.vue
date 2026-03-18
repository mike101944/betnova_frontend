<template>
    <div 
      class="fixed left-0 top-0 h-full w-[280px] bg-[#1a1e24] text-white shadow-[10px_0_30px_rgba(0,0,0,0.5)] z-[1001] flex flex-col"
      @click.stop
    >
      <div class="p-5 border-b border-gray-800 flex items-center justify-between">
        <router-link to="/" @click="$emit('close')" class="flex items-center gap-2">
          <div class="text-2xl font-bold italic">
            <span class="text-[#0AF0B5]">BET</span><span class="text-white">NOVA</span>
          </div>
        </router-link>
        <button @click="$emit('close')" class="p-2 text-gray-400 hover:text-white lg:hidden">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
  
      <div v-if="isAuthenticated" class="p-4 bg-[#252a2d] border-b border-gray-800">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-gradient-to-tr from-[#0AF0B5] to-blue-500 flex items-center justify-center shadow-lg">
            <UserIcon class="w-6 h-6 text-white" />
          </div>
          <div class="overflow-hidden">
            <p class="text-sm font-bold truncate">{{ userName }}</p>
            <p class="text-xs text-[#0AF0B5] font-mono">{{ formatBalance(userBalance) }}</p>
          </div>
        </div>
      </div>
  
      <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scroll">
        <SidebarLink icon="HomeIcon" label="Home" to="/" @click="$emit('close')" />
        <SidebarLink icon="TrophyIcon" label="Sports" to="/sports" :badge="124" @click="$emit('close')" />
        <SidebarLink icon="CasinoIcon" label="Casino" to="/casino" @click="$emit('close')" />
        <SidebarLink icon="LiveIcon" label="Live" to="/live" :badge="8" @click="$emit('close')" />
        
        <div class="my-4 border-t border-gray-800/50 mx-2"></div>
        
        <SidebarLink icon="SettingsIcon" label="Settings" to="/settings" @click="$emit('close')" />
        <SidebarLink icon="SupportIcon" label="Support" to="/support" @click="$emit('close')" />
      </nav>
  
      <div class="p-4 border-t border-gray-800 bg-[#161a1e]">
        <button v-if="isAuthenticated" class="w-full flex items-center gap-3 p-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
          <ArrowRightOnRectangleIcon class="w-5 h-5" />
          <span class="text-sm font-bold">Logout</span>
        </button>
        <p class="text-[10px] text-gray-600 text-center mt-2 uppercase tracking-widest">© 2026 BetNova Global</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useAuthStore } from '../../store/authStore'
  import { 
    HomeIcon, TrophyIcon, SparklesIcon as CasinoIcon, FireIcon as LiveIcon, 
    Cog6ToothIcon as SettingsIcon, QuestionMarkCircleIcon as SupportIcon, 
    UserIcon, ArrowRightOnRectangleIcon 
  } from '@heroicons/vue/24/outline'
  
  defineEmits(['close'])
  const authStore = useAuthStore()
  
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const userName = computed(() => authStore.user?.name || 'Mchezaji')
  const userBalance = computed(() => authStore.userBalance || 0)
  
  const formatBalance = (amount) => {
    return new Intl.NumberFormat('sw-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(amount)
  }
  </script>