<template>
    <div class="space-y-6">
      <!-- Header with Search -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="relative flex-1 max-w-md">
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            v-model="searchPhone"
            type="text"
            placeholder="Search by phone number..."
            class="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @keyup.enter="searchUser"
          />
        </div>
        <div class="flex gap-2">
          <button 
            @click="fetchAllUsers"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>
  
      <!-- Search Result / Selected User -->
      <div v-if="selectedUser" class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-13 h-13 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <span class="text-sm font-bold text-white">{{ selectedUser.phone_number?.slice(-3) }}</span>
            </div>
            <div>
              <h3 class="text-sm font-bold text-gray-800">{{ selectedUser.phone_number }}</h3>
              <div class="flex items-center gap-2 mt-1">
                <span :class="[
                  'px-2 py-0.5 rounded-full text-xs font-medium',
                  selectedUser.balance > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                ]">
                  Balance: TZS {{ formatNumber(selectedUser.balance) }}
                </span>
                <span class="text-xs text-gray-500">Joined: {{ formatDate(selectedUser.created_at) }}</span>
              </div>
            </div>
          </div>
          <div class="flex gap-2">
            <button 
              @click="clearSelected"
              class="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
  
      <!-- Balance Actions (when user is selected) -->
      <div v-if="selectedUser" class="bg-white border border-gray-200 rounded-xl p-6">
        
      </div>
  
      <!-- Sub-tabs for User Management -->
      <div v-if="selectedUser" class="border-b border-gray-200">
        <nav class="flex space-x-8">
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
            User Notifications
          </button>
        </nav>
      </div>
  
      <!-- Sub-tab Content: Notifications -->
      <div v-if="userSubTab === 'notifications' && selectedUser" class="space-y-6">
        <!-- Send Notification Card -->
        <div class="bg-white border border-gray-200 rounded-xl p-6">
          <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Send Notification to {{ selectedUser.phone_number }}
          </h4>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input 
                v-model="notificationForm.title"
                type="text"
                placeholder="e.g., Bonus Added, Welcome Offer, etc."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea 
                v-model="notificationForm.message"
                rows="3"
                placeholder="Enter notification message here..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              ></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <div class="flex gap-3">
                <label class="flex items-center gap-2">
                  <input type="radio" v-model="notificationForm.type" value="info" class="text-blue-500" />
                  <span class="text-sm">ℹ️ Info</span>
                </label>
                <label class="flex items-center gap-2">
                  <input type="radio" v-model="notificationForm.type" value="success" class="text-green-500" />
                  <span class="text-sm">✅ Success</span>
                </label>
                <label class="flex items-center gap-2">
                  <input type="radio" v-model="notificationForm.type" value="warning" class="text-yellow-500" />
                  <span class="text-sm">⚠️ Warning</span>
                </label>
                <label class="flex items-center gap-2">
                  <input type="radio" v-model="notificationForm.type" value="promotion" class="text-purple-500" />
                  <span class="text-sm">🎉 Promotion</span>
                </label>
              </div>
            </div>
            
            <button 
              @click="sendNotification"
              :disabled="notificationStore.sendingNotification"
              class="w-full md:w-auto px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <svg v-if="notificationStore.sendingNotification" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{{ notificationStore.sendingNotification ? 'Sending...' : 'Send Notification' }}</span>
            </button>
          </div>
        </div>
  
        <!-- User Notifications List -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h4 class="font-semibold text-gray-800">Notification History</h4>
              <p class="text-sm text-gray-500">Notifications sent to {{ selectedUser.phone_number }}</p>
            </div>
            <button 
              @click="fetchUserNotifications"
              class="text-sm text-purple-600 hover:text-purple-700"
            >
              Refresh
            </button>
          </div>
          
          <div v-if="notificationStore.isLoading" class="p-8 text-center">
            <svg class="w-8 h-8 animate-spin text-purple-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <p class="text-gray-500 mt-2">Loading notifications...</p>
          </div>
          
          <div v-else-if="notificationStore.selectedUserNotifications.length === 0" class="p-8 text-center">
            <svg class="w-12 h-12 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p class="text-gray-500 mt-2">No notifications sent to this user yet</p>
          </div>
          
          <div v-else class="divide-y divide-gray-200">
            <div v-for="notification in notificationStore.selectedUserNotifications" :key="notification.id" class="p-4 hover:bg-gray-50 transition-all">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span :class="[
                      'px-2 py-0.5 rounded-full text-xs font-medium',
                      notification.type === 'info' ? 'bg-blue-100 text-blue-700' :
                      notification.type === 'success' ? 'bg-green-100 text-green-700' :
                      notification.type === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-purple-100 text-purple-700'
                    ]">
                      {{ notification.type }}
                    </span>
                    <span class="text-xs text-gray-400">{{ formatDateTime(notification.created_at) }}</span>
                    <span v-if="notification.is_read" class="text-xs text-green-500">✓ Read</span>
                    <span v-else class="text-xs text-gray-400">○ Unread</span>
                  </div>
                  <h5 class="font-semibold text-gray-800">{{ notification.title }}</h5>
                  <p class="text-gray-600 text-sm mt-1">{{ notification.message }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Broadcast Section -->
      <div class="bg-white border border-gray-200 rounded-xl p-6">
        <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-2.564-.317z" />
          </svg>
          Broadcast to All Users
        </h4>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input 
              v-model="broadcastForm.title"
              type="text"
              placeholder="e.g., System Update, Maintenance, Special Announcement"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea 
              v-model="broadcastForm.message"
              rows="3"
              placeholder="Enter broadcast message for all users..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Notification Type</label>
            <div class="flex flex-wrap gap-3">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" v-model="broadcastForm.type" value="info" class="text-blue-500" />
                <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">ℹ️ Info</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" v-model="broadcastForm.type" value="success" class="text-green-500" />
                <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">✅ Success</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" v-model="broadcastForm.type" value="warning" class="text-yellow-500" />
                <span class="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">⚠️ Warning</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" v-model="broadcastForm.type" value="promotion" class="text-purple-500" />
                <span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">🎉 Promotion</span>
              </label>
            </div>
          </div>
          
          <button 
            @click="sendBroadcast"
            :disabled="notificationStore.sendingBroadcast"
            class="w-full md:w-auto px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <svg v-if="notificationStore.sendingBroadcast" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{{ notificationStore.sendingBroadcast ? 'Sending...' : 'Send to All Users' }}</span>
          </button>
        </div>
      </div>
  
      <!-- Users List Table (when no user selected) -->
      <div v-if="!selectedUser" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h4 class="font-semibold text-gray-800">All Users</h4>
          <p class="text-sm text-gray-500">Total: {{ usersTotal }} users | Click on a user to manage</p>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(user, index) in users" :key="user.id" class="hover:bg-gray-50 transition-all">
                <td class="px-6 py-4 text-sm text-gray-500">{{ index + 1 }}</td>
                <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ user.phone_number }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">TZS {{ formatNumber(user.balance) }}</td>
                <td class="px-6 py-4 text-sm text-gray-500">{{ formatDate(user.created_at) }}</td>
                <td class="px-6 py-4 text-sm">
                  <button 
                    @click="selectUser(user)"
                    class="text-blue-600 hover:text-blue-800  cursor-pointer font-medium"
                  >
                    Manage
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div v-if="usersTotal > usersPerPage" class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <button 
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Previous
          </button>
          <span class="text-sm text-gray-600">Page {{ currentPage }} of {{ totalPages }}</span>
          <button 
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useAuthStore } from '../../../store/authStore'
  import { useNotificationStore } from '../../../store/notifications/notificationStore'
  
  // Stores
  const authStore = useAuthStore()
  const notificationStore = useNotificationStore()
  
  // State
  const searchPhone = ref('')
  const selectedUser = ref(null)
  const users = ref([])
  const usersTotal = ref(0)
  const currentPage = ref(1)
  const usersPerPage = ref(20)
  const loading = ref(false)
  const userSubTab = ref('notifications')
  
  // Form data
  const addAmount = ref('')
  const deductAmount = ref('')
  const notificationForm = ref({
    title: '',
    message: '',
    type: 'info'
  })
  
  const broadcastForm = ref({
    title: '',
    message: '',
    type: 'promotion'
  })
  
  // Computed
  const totalPages = computed(() => Math.ceil(usersTotal.value / usersPerPage.value))
  
  // Helper functions
  const formatNumber = (num) => {
    if (!num) return '0'
    return parseFloat(num).toLocaleString('en-US')
  }
  
  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString()
  }
  
  const formatDateTime = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleString()
  }
  
  // API calls using stores
  const fetchAllUsers = async () => {
    try {
      loading.value = true
      const result = await authStore.adminGetAllUsers(usersPerPage.value, (currentPage.value - 1) * usersPerPage.value)
      
      if (result.success) {
        users.value = result.users || []
        usersTotal.value = result.total || 0
      } else {
        alert(result.message || 'Failed to fetch users')
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      alert(error.message || 'Failed to fetch users')
    } finally {
      loading.value = false
    }
  }
  
  const searchUser = async () => {
    if (!searchPhone.value) {
      alert('Please enter a phone number')
      return
    }
    
    try {
      loading.value = true
      const result = await authStore.adminGetUserByPhone(searchPhone.value)
      
      if (result.success) {
        selectedUser.value = result.user
        searchPhone.value = ''
        await fetchUserNotifications()
      } else {
        alert(result.message || 'User not found')
      }
    } catch (error) {
      console.error('Error searching user:', error)
      alert(error.message || 'User not found')
    } finally {
      loading.value = false
    }
  }
  
  const selectUser = async (user) => {
    selectedUser.value = user
    await fetchUserNotifications()
  }
  
  const clearSelected = () => {
    selectedUser.value = null
    notificationStore.selectedUserNotifications = []
    addAmount.value = ''
    deductAmount.value = ''
    notificationForm.value = {
      title: '',
      message: '',
      type: 'info'
    }
  }
  
  const addBalance = async () => {
    if (!addAmount.value || addAmount.value <= 0) {
      alert('Please enter a valid amount')
      return
    }
    
    try {
      loading.value = true
      const result = await authStore.adminAddBalance(selectedUser.value.phone_number, addAmount.value)
      
      if (result.success) {
        selectedUser.value.balance = result.data.new_balance
        alert(`Added TZS ${formatNumber(addAmount.value)} successfully!`)
        addAmount.value = ''
        await fetchAllUsers()
      } else {
        alert(result.message || 'Failed to add balance')
      }
    } catch (error) {
      console.error('Error adding balance:', error)
      alert(error.message || 'Failed to add balance')
    } finally {
      loading.value = false
    }
  }
  
  const deductBalance = async () => {
    if (!deductAmount.value || deductAmount.value <= 0) {
      alert('Please enter a valid amount')
      return
    }
    
    try {
      loading.value = true
      const result = await authStore.adminDeductBalance(selectedUser.value.phone_number, deductAmount.value)
      
      if (result.success) {
        selectedUser.value.balance = result.data.new_balance
        alert(`Deducted TZS ${formatNumber(deductAmount.value)} successfully!`)
        deductAmount.value = ''
        await fetchAllUsers()
      } else {
        alert(result.message || 'Failed to deduct balance')
      }
    } catch (error) {
      console.error('Error deducting balance:', error)
      alert(error.message || 'Failed to deduct balance')
    } finally {
      loading.value = false
    }
  }
  
  const fetchUserNotifications = async () => {
    if (!selectedUser.value) return
    
    const result = await notificationStore.adminGetUserNotifications(selectedUser.value.phone_number)
    
    if (!result.success) {
      console.error('Error fetching user notifications:', result.message)
    }
  }
  
  const sendNotification = async () => {
    if (!notificationForm.value.title || !notificationForm.value.message) {
      alert('Please enter both title and message')
      return
    }
    
    const result = await notificationStore.adminSendToUser(
      selectedUser.value.phone_number,
      notificationForm.value.title,
      notificationForm.value.message,
      notificationForm.value.type
    )
    
    if (result.success) {
      alert('Notification sent successfully!')
      notificationForm.value = {
        title: '',
        message: '',
        type: 'info'
      }
      await fetchUserNotifications()
    } else {
      alert(result.message || 'Failed to send notification')
    }
  }
  
  const sendBroadcast = async () => {
    if (!broadcastForm.value.title || !broadcastForm.value.message) {
      alert('Please enter both title and message for broadcast')
      return
    }
    
    if (!confirm('Are you sure you want to send this notification to ALL users?')) {
      return
    }
    
    const result = await notificationStore.adminSendBroadcast(
      broadcastForm.value.title,
      broadcastForm.value.message,
      broadcastForm.value.type
    )
    
    if (result.success) {
      alert(`Broadcast sent to ${result.data?.sent_count || 0} users successfully!`)
      broadcastForm.value = {
        title: '',
        message: '',
        type: 'promotion'
      }
    } else {
      alert(result.message || 'Failed to send broadcast')
    }
  }
  
  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
      fetchAllUsers()
    }
  }
  
  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
      fetchAllUsers()
    }
  }
  
  // Lifecycle
  onMounted(() => {
    fetchAllUsers()
  })
  </script>