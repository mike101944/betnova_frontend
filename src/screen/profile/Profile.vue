<template>
  <div class="h-full border-sky-950">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="flex flex-col space-y-6">
        <!-- Profile Summary Card - Premium Design -->
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div class="bg-gradient-to-r from-sky-600 to-teal-600 h-16 flex flex-row items-center justify-center px-6 pt-3">
            <h1 class="text-sm font-bold text-white">My Profile</h1>
          </div>
          <div class="relative px-3 pb-3">
            <!-- Avatar - Overlapping Design -->
            <div class="absolute -top-12 left-6">
              <div class="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center border-4 border-white">
                <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              </div>
            </div>
            
            <!-- Profile Info -->
            <div class="pt-12">
              <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 class="text-sm font-bold text-gray-800">{{ formattedPhone }}</h2>
                  <div class="flex items-center gap-2 mt-1">
                    <router-link 
                      to="/admin"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 hover:bg-emerald-200 hover:text-emerald-900 transition-all cursor-pointer"
                      :class="{ 'pointer-events-none ': !isAdmin }"
                      :disabled="!isAdmin"
                      @click.prevent="!isAdmin ? $event.preventDefault() : null"
                    >
                      Active Account
                    </router-link>
                  </div>
                </div>
                
                <!-- Balance Card -->
                <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 min-w-[200px] border border-gray-200">
                  <p class="text-xs text-gray-500 mb-1">Available Balance</p>
                  <p class="text-sm font-bold text-emerald-600">{{ formatBalance(userBalance) }}</p>
                  <div class="flex gap-2 mt-3">
                    <router-link 
                      to="/deposite" 
                      class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm text-center py-2 px-3 rounded-lg transition-all hover:shadow-md"
                    >
                      Deposit
                    </router-link>
                    <router-link 
                      :to="isAdmin ? '/adminWithDraw' : '/withdraw'"
                      class="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-sm text-center py-2 px-3 rounded-lg transition-all hover:shadow-md"
                    >
                      Withdraw
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Account Activity Summary - Positive Only (No Loss Statistics) -->
        <div class="bg-white rounded-2xl shadow-xl p-6">
          <h3 class="font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <div class="p-2 bg-emerald-100 rounded-lg">
              <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
            Account Activity
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-xl text-center border border-emerald-100">
              <svg class="w-8 h-8 text-emerald-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p class="text-xs text-gray-600 mb-1">Current Balance</p>
              <p class="text-sm font-bold text-emerald-700">{{ formatBalance(userBalance) }}</p>
            </div>
            
            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl text-center border border-blue-100">
              <svg class="w-8 h-8 text-blue-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p class="text-xs text-gray-600 mb-1">Account Status</p>
              <p class="text-sm font-bold text-blue-700">✓ Active</p>
            </div>
            
            <div class="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl text-center border border-purple-100">
              <svg class="w-8 h-8 text-purple-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
              <p class="text-xs text-gray-600 mb-1">Win Rate</p>
              <p class="text-xl font-bold text-purple-700">{{ winRate }}%</p>
            </div>
          </div>
        </div>

        <!-- Quick Actions Card -->
        <div class="bg-white rounded-2xl shadow-xl p-6">
          <h3 class="font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <div class="p-2 bg-emerald-100 rounded-lg">
              <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            Quick Actions
          </h3>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <router-link to="/bets" class="bg-gray-50 hover:bg-gray-100 p-4 rounded-xl text-center transition-all group">
              <svg class="w-6 h-6 text-gray-600 mx-auto mb-2 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              <p class="text-xs font-medium text-gray-700">My Bets</p>
            </router-link>
            
            <router-link to="/deposite" class="bg-gray-50 hover:bg-gray-100 p-4 rounded-xl text-center transition-all group">
              <svg class="w-6 h-6 text-gray-600 mx-auto mb-2 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <p class="text-xs font-medium text-gray-700">Deposit</p>
            </router-link>
            
            <router-link :to="isAdmin ? '/adminWithDraw' : '/withdraw'" class="bg-gray-50 hover:bg-gray-100 p-4 rounded-xl text-center transition-all group">
              <svg class="w-6 h-6 text-gray-600 mx-auto mb-2 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
              </svg>
              <p class="text-xs font-medium text-gray-700">Withdraw</p>
            </router-link>
            
            <router-link to="/profile" class="bg-gray-50 hover:bg-gray-100 p-4 rounded-xl text-center transition-all group">
              <svg class="w-6 h-6 text-gray-600 mx-auto mb-2 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <p class="text-xs font-medium text-gray-700">Settings</p>
            </router-link>
          </div>
        </div>

        <!-- Account Information Card -->
        <div class="bg-white rounded-2xl shadow-xl p-2">
          <div class="flex justify-between items-center mb-3">
            <h3 class="font-semibold text-gray-800 flex items-center gap-2">
              <div class="p-2 bg-emerald-100 rounded-lg">
                <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              Account Information
            </h3>
            <button 
              @click="editMode = !editMode" 
              class="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg transition-all"
            >
              <svg v-if="!editMode" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
              </svg>
              <span class="text-sm">{{ editMode ? 'Cancel' : 'Edit Profile' }}</span>
            </button>
          </div>

          <!-- View Mode -->
          <div v-if="!editMode" class="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div class="space-y-2">
              <div class="bg-gray-50 rounded-xl p-1">
                <label class="block text-xs text-gray-500 mb-1">Phone Number</label>
                <p class="text-gray-800 font-medium text-xs">{{ formattedPhone }}</p>
              </div>
            </div>
            <div class="space-y-4">
              <div class="bg-gray-50 rounded-xl p-1">
                <label class="block text-xs text-gray-500 mb-1">Last Login</label>
                <p class="text-gray-800 font-medium text-xs">{{ lastLogin }}</p>
              </div>
              <div class="bg-gray-50 rounded-xl p-1">
                <label class="block text-xs text-gray-500 mb-1">Account Status</label>
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span class="text-gray-800 font-medium text-sm">Active</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Edit Mode -->
          <div v-else class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-gray-600 mb-1">Phone Number</label>
                <input 
                  type="text" 
                  v-model="editForm.phone"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="Phone number"
                >
              </div>
              <div>
                <label class="block text-sm text-gray-600 mb-1">Email Address</label>
                <input 
                  type="email" 
                  v-model="editForm.email"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="Email address"
                >
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm text-gray-600 mb-1">Full Name</label>
                <input 
                  type="text" 
                  v-model="editForm.fullName"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="Your full name"
                >
              </div>
            </div>
            
            <div class="flex gap-3 mt-6">
              <button 
                @click="saveProfile"
                class="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-medium transition-all hover:shadow-lg flex-1"
              >
                Save Changes
              </button>
              <button 
                @click="editMode = false"
                class="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-xl font-medium transition-all hover:shadow-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        <!-- ============ USER NOTIFICATIONS CARD ============ -->
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div class="bg-gradient-to-r from-sky-500 to-sky-800 px-6 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-white/20 rounded-xl">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-white">Notifications</h3>
                  <p class="text-xs text-white/80">Stay updated with your latest alerts</p>
                </div>
              </div>
              <div v-if="notificationStore.hasUnread" class="bg-white/20 backdrop-blur px-2 py-0.5 rounded-full">
                <span class="text-xs font-medium text-white">{{ notificationStore.unreadCount }} new</span>
              </div>
            </div>
          </div>
          
          <div class="p-4">
            <!-- Loading State -->
            <div v-if="notificationStore.isLoading" class="flex justify-center py-8">
              <svg class="w-8 h-8 animate-spin text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </div>
            
            <!-- No Notifications -->
            <div v-else-if="notificationStore.notifications.length === 0" class="text-center py-8">
              <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
              <p class="text-gray-500 text-sm">No notifications yet</p>
              <p class="text-gray-400 text-xs mt-1">You'll see updates here when available</p>
            </div>
            
            <!-- Notifications List -->
            <div v-else class="space-y-2 max-h-96 overflow-y-auto">
              <div 
                v-for="notification in notificationStore.notifications.slice(0, 10)" 
                :key="notification.id"
                @click="markAsRead(notification.id)"
                :class="[
                  'p-3 rounded-xl cursor-pointer transition-all duration-200',
                  !notification.is_read 
                    ? 'bg-purple-50 border-l-4 border-purple-500 hover:bg-purple-100' 
                    : 'bg-gray-50 hover:bg-gray-100'
                ]"
              >
                <div class="flex items-start gap-3">
                  <!-- Icon based on type -->
                  <div :class="[
                    'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                    notification.type === 'info' ? 'bg-blue-100' :
                    notification.type === 'success' ? 'bg-green-100' :
                    notification.type === 'warning' ? 'bg-yellow-100' :
                    'bg-purple-100'
                  ]">
                    <span class="text-sm">
                      {{ notification.type === 'info' ? 'ℹ️' : 
                         notification.type === 'success' ? '✅' : 
                         notification.type === 'warning' ? '⚠️' : '🎉' }}
                    </span>
                  </div>
                  
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-2 mb-1">
                      <h4 class="text-sm font-semibold text-gray-800 truncate">
                        {{ notification.title }}
                      </h4>
                      <span class="text-xs text-gray-400 flex-shrink-0">
                        {{ formatNotificationTime(notification.created_at) }}
                      </span>
                    </div>
                    <p class="text-xs text-gray-600 line-clamp-2">{{ notification.message }}</p>
                  </div>
                  
                  <!-- Unread indicator -->
                  <div v-if="!notification.is_read" class="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-2"></div>
                </div>
              </div>
            </div>
            
            <!-- View All Link -->
            <div v-if="notificationStore.notifications.length > 0" class="mt-3 pt-2 border-t border-gray-100 text-center">
              <button 
                v-if="notificationStore.hasUnread"
                @click="markAllAsRead"
                class="text-xs text-purple-600 hover:text-purple-700 font-medium mr-3"
              >
                Mark all as read
              </button>
              <!-- <router-link 
                to="/notifications" 
                class="text-xs text-gray-500 hover:text-gray-700 font-medium"
              > -->
              <router-link 
                to="#" 
                class="text-xs text-gray-500 hover:text-gray-700 font-medium"
              >
                View all notifications →
              </router-link>
            </div>
          </div>
        </div>

        <!-- Security Settings Card -->
        <div class="bg-white rounded-2xl shadow-xl p-6">
          <h3 class="font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <div class="p-2 bg-emerald-100 rounded-lg">
              <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            Security Settings
          </h3>
          
          <div class="space-y-3">
            <button class="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all group">
              <span class="text-sm text-gray-700 font-medium">Change Password</span>
              <svg class="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
            <button class="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all">
              <span class="text-sm text-gray-700 font-medium">Two-Factor Authentication</span>
              <span class="text-xs bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-full font-medium">Coming Soon</span>
            </button>
          </div>
        </div>

        <!-- Logout Button -->
        <div class="flex justify-center pt-4">
          <button 
            @click="handleLogout"
            class="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-10 py-4 rounded-xl font-medium transition-all hover:shadow-xl flex items-center gap-3 group"
          >
            <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../store/authStore'
import { useNotificationStore } from '../../store/notifications/notificationStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

// Admin phone numbers (same as backend)
const adminPhoneNumbers = ['683307420','761388019','696684997','672572874','745211365','749003366','690802328']
                          

// State
const editMode = ref(false)
const editForm = ref({
  phone: '',
  email: '',
  fullName: ''
})

// Check if current user is admin
const isAdmin = computed(() => {
  const userPhone = authStore.user?.phone_number || ''
  return adminPhoneNumbers.includes(userPhone)
})

// Computed properties
const userPhone = computed(() => {
  return authStore.user?.phone_number || 'Not available'
})

const userEmail = computed(() => {
  return authStore.user?.email || ''
})

const userBalance = computed(() => {
  return authStore.userBalance || 0
})

const formattedPhone = computed(() => {
  const phone = userPhone.value
  if (phone && phone !== 'Not available') {
    return phone.replace(/(\d{3})(\d{3})(\d{3})/, '+255 $1 $2 $3')
  }
  return phone
})

const memberSince = computed(() => {
  if (!authStore.user?.createdAt) return 'Not available'
  const date = new Date(authStore.user.createdAt)
  return isNaN(date.getTime()) ? 'Not available' : date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const lastLogin = computed(() => {
  return authStore.user?.lastLogin || 'Today, 10:30 AM'
})

const winRate = computed(() => {
  return 0
})

// Methods
const formatBalance = (amount) => {
  return new Intl.NumberFormat('sw-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount || 0)
}

const formatNotificationTime = (date) => {
  if (!date) return ''
  const now = new Date()
  const then = new Date(date)
  const diffMs = now - then
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return then.toLocaleDateString()
}

const saveProfile = () => {
  console.log('Saving profile:', editForm.value)
  editMode.value = false
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}

const markAsRead = async (notificationId) => {
  await notificationStore.markAsRead(notificationId)
}

const markAllAsRead = async () => {
  await notificationStore.markAllAsRead()
}

// Load notifications
const loadNotifications = async () => {
  await notificationStore.fetchMyNotifications(10, 0)
  await notificationStore.fetchUnreadCount()
}

// Lifecycle
onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/')
  } else {
    editForm.value.phone = userPhone.value
    await authStore.fetchUserBalance()
    await loadNotifications()
  }
})
</script>