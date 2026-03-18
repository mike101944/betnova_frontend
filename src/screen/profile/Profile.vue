<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Header with Gradient Background -->
    <!-- <div class="bg-gradient-to-r from-sky-400 to-sky-600 text-white">
      <div class="w-full px-4 py-2">
        <div class="flex items-center gap-3 mb-2">
          <router-link to="/" class="hover:bg-white/20 p-2 rounded-lg transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </router-link>
          <h1 class="text-sm font-bold">My Profile</h1>
        </div>
        <p class="text-emerald-50 text-sm self-center ">Manage your account information and preferences</p>
      </div>
    </div> -->

    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- Profile Content - Single Column -->
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
                <!-- <span class="text-4xl font-bold text-emerald-600">
                  {{ userInitials }}
                </span> -->
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
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      Active Account
                    </span>
                    <span class="text-sm text-gray-500">Member since {{ memberSince }}</span>
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
                      to="/withdraw" 
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

        <!-- Account Information Card -->
        <div class="bg-white rounded-2xl shadow-xl p-6">
          <div class="flex justify-between items-center mb-6">
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
              <span>{{ editMode ? 'Cancel' : 'Edit Profile' }}</span>
            </button>
          </div>

          <!-- View Mode -->
          <div v-if="!editMode" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div class="bg-gray-50 rounded-xl p-4">
                <label class="block text-xs text-gray-500 mb-1">Phone Number</label>
                <p class="text-gray-800 font-medium text-lg">{{ formattedPhone }}</p>
              </div>
              <div class="bg-gray-50 rounded-xl p-4">
                <label class="block text-xs text-gray-500 mb-1">Email Address</label>
                <p class="text-gray-800 font-medium">{{ userEmail || 'Not provided' }}</p>
              </div>
            </div>
            <div class="space-y-4">
              <div class="bg-gray-50 rounded-xl p-4">
                <label class="block text-xs text-gray-500 mb-1">Last Login</label>
                <p class="text-gray-800 font-medium">{{ lastLogin }}</p>
              </div>
              <div class="bg-gray-50 rounded-xl p-4">
                <label class="block text-xs text-gray-500 mb-1">Account Status</label>
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span class="text-gray-800 font-medium">Active</span>
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

        <!-- Betting Statistics Card -->
        <div class="bg-white rounded-2xl shadow-xl p-6">
          <h3 class="font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <div class="p-2 bg-emerald-100 rounded-lg">
              <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            Betting Statistics
          </h3>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl text-center">
              <p class="text-xs text-gray-500 mb-1">Total Bets</p>
              <p class="text-xl font-bold text-gray-800">{{ stats.totalBets || 0 }}</p>
            </div>
            <div class="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl text-center">
              <p class="text-xs text-gray-500 mb-1">Total Stake</p>
              <p class="text-sm font-bold text-gray-800">{{ formatBalance(stats.totalStake) }}</p>
            </div>
            <div class="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl text-center">
              <p class="text-xs text-gray-500 mb-1">Total Won</p>
              <p class="text-sm font-bold text-green-600">{{ formatBalance(stats.totalWon) }}</p>
            </div>
            <div class="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl text-center">
              <p class="text-xs text-gray-500 mb-1">Win Rate</p>
              <p class="text-sm font-bold text-gray-800">{{ stats.winRate || 0 }}%</p>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="mt-6">
            <div class="flex justify-between text-sm text-gray-500 mb-2">
              <span>Won: {{ stats.wonBets || 0 }}</span>
              <span>Lost: {{ stats.lostBets || 0 }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div 
                class="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-500" 
                :style="{ width: winRateProgress + '%' }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Recent Activity Card -->
        <div class="bg-white rounded-2xl shadow-xl p-6">
          <h3 class="font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <div class="p-2 bg-emerald-100 rounded-lg">
              <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            Recent Activity
          </h3>
          
          <div v-if="recentActivity.length > 0" class="space-y-3">
            <div v-for="(activity, index) in recentActivity" :key="index" 
                 class="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all">
              <div class="flex items-center gap-4">
                <!-- Icon based on activity type -->
                <div :class="getActivityIconClass(activity.type)" class="p-3 rounded-xl">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="activity.type === 'bet'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    <path v-if="activity.type === 'deposit'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    <path v-if="activity.type === 'withdraw'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-800">{{ activity.description }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ activity.time }}</p>
                </div>
              </div>
              <span :class="getAmountClass(activity.type)" class="font-semibold text-lg">
                {{ activity.type === 'bet' ? '- ' : '+' }}{{ formatBalance(activity.amount) }}
              </span>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-12">
            <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <p class="text-gray-500 font-medium">No recent activity</p>
            <p class="text-sm text-gray-400 mt-1">Your activity will appear here</p>
          </div>

          <!-- View All Link -->
          <div v-if="recentActivity.length > 0" class="mt-6 text-center">
            <router-link to="/bets" class="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 text-sm font-medium bg-emerald-50 hover:bg-emerald-100 px-6 py-3 rounded-xl transition-all">
              View All Activity
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </router-link>
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
    description: 'Deposit via M-Pesa',
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

const userInitials = computed(() => {
  const phone = userPhone.value
  return phone !== 'Not available' ? phone.slice(-4) : '??'
})

const formattedPhone = computed(() => {
  const phone = userPhone.value
  if (phone && phone !== 'Not available') {
    return phone.replace(/(\d{3})(\d{3})(\d{3})/, '+255 $1 $2 $3')
  }
  return phone
})

const memberSince = computed(() => {
  return authStore.user?.createdAt 
    ? new Date(authStore.user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) 
    : 'January 2024'
})

const lastLogin = computed(() => {
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
  console.log('Saving profile:', editForm.value)
  editMode.value = false
  // Show success message
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}

// Initialize
onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/')
  } else {
    editForm.value.phone = userPhone.value
    authStore.fetchUserBalance()
  }
})
</script>