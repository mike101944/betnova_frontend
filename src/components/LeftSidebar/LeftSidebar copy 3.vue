<template>
    <div class="left-sidebar fixed left-0 top-0 h-full w-[280px] bg-[#1a1e24] text-white shadow-2xl z-50 flex z-[1001] flex-col">
      <!-- Logo Section -->
      <div class="p-3 flex flex-row items-center justify-between border-b border-gray-800">
        <div>
            <router-link to="/" class="flex items-center gap-2">
          <div class="text-2xl font-bold">
            <span class="text-sky-500">Bet</span>
            <span class="text-white">Nova</span>
          </div>
        </router-link>
        </div>
        <button @click="$emit('close')" class="p-2 text-gray-100 hover:text-white cursor-pointer">
          <svg class="w-6 h-6" fill="#fff" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
  
      <!-- User Info (if authenticated) -->
      <div v-if="isAuthenticated" class="p-4 border-b border-gray-800 bg-[#252a2d]">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-teal-600 flex items-center justify-center">
            <UserIcon class="w-5 h-5 text-white" />
          </div>
          <div class="flex-1">
            <div class="text-sm font-medium">{{ userName || 'User' }}</div>
            <div class="text-xs text-gray-400">{{ formatBalance(userBalance) }}</div>
          </div>
        </div>
      </div>
  
      <!-- Navigation Items -->
      <div class="flex-1 overflow-y-auto py-4">
        <div class="space-y-1 px-3">
          <!-- Home -->
          <button 
            @click="navigateTo('/')"
            class="w-full flex items-center gap-3 p-3 text-white cursor-pointer rounded-lg transition-all duration-200"
            :class="activeItem === 'home' ? 'bg-gradient-to-br from-sky-700 via-teal-500 to-sky-500 text-[#1a1e24]' : 'text-gray-400 cursor-pointer hover:bg-[#252a2d] hover:text-white'"
          >
            <HomeIcon class="w-5 h-5" />
            <span class="text-sm font-medium">Home</span>
          </button>
  
          <!-- Sports -->
          <button 
            @click="navigateTo('/sports')"
            class="w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200"
            :class="activeItem === 'sports' ?  'bg-gradient-to-br from-sky-700 via-teal-500 to-sky-500 text-[#1a1e24]' : 'text-gray-400 cursor-pointer hover:bg-[#252a2d] hover:text-white'"
          >
            <TrophyIcon class="w-5 h-5" />
            <span class="text-sm font-medium">Sports</span>
            <span class="ml-auto text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">124</span>
          </button>
  
          <!-- Casino -->
          <button 
            @click="navigateTo('/casino')"
            class="w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200"
            :class="activeItem === 'casino' ?  'bg-gradient-to-br from-sky-700 via-teal-500 to-sky-500 text-[#1a1e24]' : 'text-gray-400 cursor-pointer hover:bg-[#252a2d] hover:text-white'"
          >
            <CasinoIcon class="w-5 h-5" />
            <span class="text-sm font-medium">Casino</span>
          </button>
  
          <!-- Live -->
          <button 
            @click="navigateTo('/live')"
            class="w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200"
            :class="activeItem === 'live' ? 'bg-gradient-to-br from-sky-700 via-teal-500 to-sky-500 text-[#1a1e24]' : 'text-gray-400 cursor-pointer hover:bg-[#252a2d] hover:text-white'"
          >
            <LiveIcon class="w-5 h-5" />
            <span class="text-sm font-medium">Live</span>
            <span class="ml-auto text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">8</span>
          </button>
  
          <!-- Divider -->
          <div class="my-4 border-t border-gray-800"></div>
  
          <!-- Settings -->
          <button 
            @click="navigateTo('/settings')"
            class="w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200"
            :class="activeItem === 'settings' ? 'bg-gradient-to-br from-sky-700 via-teal-500 to-sky-500 text-[#1a1e24]' : 'text-gray-400 cursor-pointer hover:bg-[#252a2d] hover:text-white'"
          >
            <SettingsIcon class="w-5 h-5" />
            <span class="text-sm font-medium">Settings</span>
          </button>
  
          <!-- Support -->
          <button 
            @click="navigateTo('/support')"
            class="w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200"
            :class="activeItem === 'support' ? 'bg-gradient-to-br from-sky-700 via-teal-500 to-sky-500 text-[#1a1e24]' : 'text-gray-400 cursor-pointer hover:bg-[#252a2d] hover:text-white'"
          >
            <SupportIcon class="w-5 h-5" />
            <span class="text-sm font-medium">Support</span>
          </button>
        </div>
      </div>
  
      <!-- Footer -->
      <div class="p-4 border-t border-gray-800">
        <div class="text-xs text-gray-500 text-center">
          © 2024 BetNova
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useAuthStore } from '../../store/authStore'
  import {
    HomeIcon,
    TrophyIcon,
    SparklesIcon as CasinoIcon,
    FireIcon as LiveIcon,
    Cog6ToothIcon as SettingsIcon,
    QuestionMarkCircleIcon as SupportIcon,
    UserIcon
  } from '@heroicons/vue/24/outline'
 

  const emit = defineEmits(['close'])
  
  const router = useRouter()
  const route = useRoute()
  const authStore = useAuthStore()
  
  // Determine active item based on route
  const activeItem = computed(() => {
    const path = route.path
    if (path === '/') return 'home'
    if (path.includes('/sports')) return 'sports'
    if (path.includes('/casino')) return 'casino'
    if (path.includes('/live')) return 'live'
    if (path.includes('/settings')) return 'settings'
    if (path.includes('/support')) return 'support'
    return ''
  })
  
  // Navigation function
  const navigateTo = (path) => {
    router.push(path)
    emit('close')
  }
  
  // User data
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const userName = computed(() => authStore.user?.name || 'User')
  const userBalance = computed(() => authStore.userBalance || 0)
  
  // Format balance
  const formatBalance = (amount) => {
    return new Intl.NumberFormat('sw-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0)
  }
  </script>
  
  <style scoped>
  .left-sidebar {
    box-shadow: 4px 0 10px rgba(0, 0, 0, 0.3);
  }
  
  /* Smooth hover transitions */
  button {
    transition: all 0.2s ease;
  }
  
  /* Active item glow effect */
  .bg-\[\#0AF0B5\] {
    box-shadow: 0 4px 10px rgba(10, 240, 181, 0.3);
  }
  
  /* Scrollbar styling */
  .left-sidebar::-webkit-scrollbar {
    width: 4px;
  }
  
  .left-sidebar::-webkit-scrollbar-track {
    background: #252a2d;
  }
  
  .left-sidebar::-webkit-scrollbar-thumb {
    background: #0AF0B5;
    border-radius: 4px;
  }
  
  .left-sidebar::-webkit-scrollbar-thumb:hover {
    background: #09d6a0;
  }
  </style>