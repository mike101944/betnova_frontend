<template>
    <div class="max-w-4xl mx-auto px-4 py-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800">My Profile</h1>
        <p class="text-gray-600 mt-1">Manage your account information and preferences</p>
      </div>
  
      <!-- Profile Content - Single Column -->
      <div class="flex flex-col space-y-6">
        <!-- Profile Summary Card -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
            <!-- Avatar Section -->
            <div class="flex flex-col items-center">
              <div class="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                <span class="text-3xl font-bold text-emerald-600">
                  <i class="fas fa-user-circle text-[30px] border border-amber-100 rounded-full text-emerald-500"></i>
                </span>
              </div>
              <h2 class="text-xl font-semibold text-gray-800">{{ userPhone }}</h2>
              <p class="text-sm text-gray-500">Member since {{ memberSince }}</p>
            </div>
  
            <!-- Balance and Quick Actions -->
            <div class="flex-1 w-full">
              <!-- Balance -->
              <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center mb-4">
                <p class="text-xs text-emerald-700">Account Balance</p>
                <p class="text-2xl font-bold text-emerald-600">{{ formatBalance(userBalance) }}</p>
              </div>
  
              <!-- Quick Actions -->
              <div class="grid grid-cols-2 gap-3">
                <router-link 
                  to="/deposite" 
                  class="bg-emerald-600 hover:bg-emerald-700 text-white text-center py-2 px-4 rounded-lg transition-colors duration-200 font-medium"
                >
                  Deposit
                </router-link>
                <router-link 
                  to="/withdraw" 
                  class="bg-gray-600 hover:bg-gray-700 text-white text-center py-2 px-4 rounded-lg transition-colors duration-200 font-medium"
                >
                  Withdraw
                </router-link>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Account Information Card -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-semibold text-gray-700 flex items-center gap-2">
              <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Account Information
            </h3>
            <button 
              @click="editMode = !editMode" 
              class="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1"
            >
              <svg v-if="!editMode" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
              </svg>
              <span>{{ editMode ? 'Cancel' : 'Edit Profile' }}</span>
            </button>
          </div>
  
          <!-- View Mode -->
          <div v-if="!editMode" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs text-gray-500 mb-1">Phone Number</label>
                <p class="text-gray-800 font-medium">{{ userPhone }}</p>
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1">Member Since</label>
                <p class="text-gray-800 font-medium">{{ memberSince }}</p>
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1">Last Login</label>
                <p class="text-gray-800 font-medium">{{ lastLogin }}</p>
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1">Account Status</label>
                <span class="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  Active
                </span>
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
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Phone number"
                >
              </div>
              <div>
                <label class="block text-sm text-gray-600 mb-1">Email (Optional)</label>
                <input 
                  type="email" 
                  v-model="editForm.email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Email address"
                >
              </div>
              <div>
                <label class="block text-sm text-gray-600 mb-1">Full Name (Optional)</label>
                <input 
                  type="text" 
                  v-model="editForm.fullName"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Your name"
                >
              </div>
            </div>
            
            <div class="flex gap-3 mt-4">
              <button 
                @click="saveProfile"
                class="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Save Changes
              </button>
              <button 
                @click="editMode = false"
                class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
  
        <!-- Betting Statistics Card -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            Betting Statistics
          </h3>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-gray-50 p-3 rounded-lg text-center">
              <p class="text-xs text-gray-500">Total Bets</p>
              <p class="text-xl font-bold text-gray-800">{{ stats.totalBets || 0 }}</p>
            </div>
            <div class="bg-gray-50 p-3 rounded-lg text-center">
              <p class="text-xs text-gray-500">Total Stake</p>
              <p class="text-xl font-bold text-gray-800">{{ formatBalance(stats.totalStake) }}</p>
            </div>
            <div class="bg-gray-50 p-3 rounded-lg text-center">
              <p class="text-xs text-gray-500">Total Won</p>
              <p class="text-xl font-bold text-green-600">{{ formatBalance(stats.totalWon) }}</p>
            </div>
            <div class="bg-gray-50 p-3 rounded-lg text-center">
              <p class="text-xs text-gray-500">Win Rate</p>
              <p class="text-xl font-bold text-gray-800">{{ stats.winRate || 0 }}%</p>
            </div>
          </div>
  
          <!-- Progress Bar -->
          <div class="mt-4">
            <div class="flex justify-between text-xs text-gray-500 mb-1">
              <span>Won: {{ stats.wonBets || 0 }}</span>
              <span>Lost: {{ stats.lostBets || 0 }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="bg-emerald-600 h-2 rounded-full" 
                :style="{ width: winRateProgress + '%' }"
              ></div>
            </div>
          </div>
        </div>
  
        <!-- Recent Activity Card -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Recent Activity
          </h3>
          
          <div v-if="recentActivity.length > 0" class="space-y-3">
            <div v-for="(activity, index) in recentActivity" :key="index" 
                 class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center gap-3">
                <!-- Icon based on activity type -->
                <div :class="getActivityIconClass(activity.type)" class="p-2 rounded-full">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="activity.type === 'bet'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    <path v-if="activity.type === 'deposit'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    <path v-if="activity.type === 'withdraw'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-800">{{ activity.description }}</p>
                  <p class="text-xs text-gray-500">{{ activity.time }}</p>
                </div>
              </div>
              <span :class="getAmountClass(activity.type)" class="font-semibold">
                {{ activity.type === 'bet' ? '- ' : '+' }}{{ formatBalance(activity.amount) }}
              </span>
            </div>
          </div>
  
          <!-- Empty State -->
          <div v-else class="text-center py-8">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-gray-500">No recent activity</p>
            <p class="text-sm text-gray-400 mt-1">Your activity will appear here</p>
          </div>
  
          <!-- View All Link -->
          <div v-if="recentActivity.length > 0" class="mt-4 text-center">
            <router-link to="/bets" class="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
              View All Activity →
            </router-link>
          </div>
        </div>
  
        <!-- Security Settings Card -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            Security Settings
          </h3>
          
          <div class="space-y-3">
            <button class="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <span class="text-sm text-gray-700">Change Password</span>
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
            <button class="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <span class="text-sm text-gray-700">Two-Factor Authentication</span>
              <span class="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Coming Soon</span>
            </button>
          </div>
        </div>
  
        <!-- Logout Button -->
        <div class="flex justify-center">
          <button 
            @click="handleLogout"
            class="bg-red-600/80 hover:bg-pink-600 text-white px-8 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useAuthStore } from '../../store/authStore'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const authStore = useAuthStore()
  
  // State
  const editMode = ref(false)
  const editForm = ref({
    phone: '',
    email: '',
    fullName: ''
  })
  
  // Mock data - replace with actual API calls
  const stats = ref({
    totalBets: 45,
    totalStake: 250000,
    totalWon: 125000,
    wonBets: 18,
    lostBets: 27,
    winRate: 40
  })
  
  const recentActivity = ref([
    {
      type: 'bet',
      description: 'Placed bet on Arsenal vs Chelsea',
      amount: 5000,
      time: '2 hours ago'
    },
    {
      type: 'deposit',
      description: 'Deposit via HarakaPay',
      amount: 50000,
      time: '1 day ago'
    },
    {
      type: 'bet',
      description: 'Won bet on Manchester United',
      amount: 15000,
      time: '3 days ago'
    }
  ])
  
  // Computed properties from auth store
  const userPhone = computed(() => {
    return authStore.user?.phone_number || 'Not available'
  })
  
  const userBalance = computed(() => {
    return authStore.userBalance || 0
  })
  
  const userInitials = computed(() => {
    const phone = userPhone.value
    return phone !== 'Not available' ? phone.slice(-4) : '??'
  })
  
  const memberSince = computed(() => {
    // You can get this from user data or from authStore
    // For now, use a fixed date or extract from user metadata
    return authStore.user?.createdAt ? new Date(authStore.user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'January 2024'
  })
  
  const lastLogin = computed(() => {
    // You can get this from user data or from authStore
    return authStore.user?.lastLogin || 'Today, 10:30 AM'
  })
  
  const winRateProgress = computed(() => {
    return stats.value.winRate || 0
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
  
  const getActivityIconClass = (type) => {
    switch(type) {
      case 'bet':
        return 'bg-blue-100 text-blue-600'
      case 'deposit':
        return 'bg-green-100 text-green-600'
      case 'withdraw':
        return 'bg-orange-100 text-orange-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }
  
  const getAmountClass = (type) => {
    switch(type) {
      case 'bet':
        return 'text-red-600'
      case 'deposit':
        return 'text-green-600'
      case 'withdraw':
        return 'text-orange-600'
      default:
        return 'text-gray-600'
    }
  }
  
  const saveProfile = () => {
    // Implement save logic
    console.log('Saving profile:', editForm.value)
    editMode.value = false
    // Show success message
  }
  
  const handleLogout = async () => {
    await authStore.logout()
    router.push('/')
  }
  
  // Check authentication
  onMounted(() => {
    if (!authStore.isAuthenticated) {
      router.push('/')
    } else {
      // Initialize edit form with user data
      editForm.value.phone = userPhone.value
      // Fetch user balance if not already fetched
      authStore.fetchUserBalance()
    }
  })
  </script>
  
  <style lang="scss" scoped>
  /* Custom animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .router-view {
    animation: fadeIn 0.3s ease-out;
  }
  
  /* Custom scrollbar for the page */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
  
  /* Loading animation for buttons */
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  .animate-spin {
    animation: spin 1s linear infinite;
  }
  
  /* Hover effects for cards */
  .bg-white {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .bg-white:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.02);
  }
  </style>