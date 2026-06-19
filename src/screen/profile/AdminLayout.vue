<template>
  <div class="bg-white shadow-sm p-6">
    <!-- Admin Header -->
    <div class="flex items-center justify-between">
      <div class="mb-6 pb-4 border-b border-gray-200">
        <h1 class="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p class="text-sm text-gray-500 mt-1">Manage bets, users, and system settings</p>
      </div>
      <router-link 
        to="/admin/forgot-password"
        class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
      >
        Forgot Password
      </router-link>
    </div>

    <!-- Main Tabs Navigation -->
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
      <AdminBetsManagement />
    </div>

    <!-- Tab Content: User Management -->
    <div v-if="activeTab === 'users'">
      <!-- User Management Sub-tabs -->
      <div class="border-b border-gray-200 mb-6">
        <nav class="flex space-x-8">
          <button
            @click="userSubTab = 'details'"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm transition-all',
              userSubTab === 'details'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            <svg class="inline-block w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            User Details
          </button>
          
          <button
            @click="userSubTab = 'notifications'"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm transition-all',
              userSubTab === 'notifications'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            <svg class="inline-block w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Manage Notifications
          </button>
        </nav>
      </div>

      <!-- User Details Sub-tab -->
      <div v-if="userSubTab === 'details'">
        <AdminUserManagement />
      </div>

      <!-- Notifications Sub-tab -->
      <div v-if="userSubTab === 'notifications'">
        <ManageUserNotification />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AdminBetsManagement from './AdminBetsManagement.vue'
import AdminUserManagement from './AdminUserManagement.vue'
import ManageUserNotification from './UserNotification/ManageUserNotification.vue'

const activeTab = ref('bets')
const userSubTab = ref('details')
</script>