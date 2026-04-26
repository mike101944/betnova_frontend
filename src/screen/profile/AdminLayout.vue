<template>
    <div class="bg-white shadow-sm p-6">
      <!-- Admin Header -->
      <div class="mb-6 pb-4 border-b border-gray-200">
        <h1 class="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p class="text-sm text-gray-500 mt-1">Manage bets, users, and system settings</p>
      </div>
  
      <!-- Tabs Navigation -->
      <div class="border-b border-gray-200 mb-6">
        <nav class="flex space-x-8">
          <button
            @click="activeTab = 'bets'"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm transition-all',
              activeTab === 'bets'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            <svg class="inline-block w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Bets Management
          </button>
          
          <button
            @click="activeTab = 'users'"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm transition-all',
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            <svg class="inline-block w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            User Management
          </button>
        </nav>
      </div>
  
      <!-- Tab Content: Bets Management -->
      <div v-if="activeTab === 'bets'">
        <!-- Bets Management Component -->
        <AdminBetsManagement />
      </div>
  
      <!-- Tab Content: User Management -->
      <div v-if="activeTab === 'users'">
        <AdminUserManagement />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import AdminBetsManagement from './AdminBetsManagement.vue'
  import AdminUserManagement from './AdminUserManagement.vue'
  
  const activeTab = ref('bets')
  </script>