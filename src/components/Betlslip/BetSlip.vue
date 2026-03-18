<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useAuthStore } from '../../store/authStore'
import api from '../../services/api'

// Active tab
const activeTab = ref('sports')
const bookingCode = ref('')
const stakeAmount = ref('') // Changed from 100 to empty string

// Auth store
const authStore = useAuthStore()

// Loading and error states
const isLoading = ref(false)
const error = ref(null)
const success = ref(null)
const loadingMessage = ref('')

// Sports Bets - Load from localStorage
const sportsBets = ref([])

// Virtuals Bets
const virtualsBets = ref([])

// Check if user is authenticated
const isAuthenticated = computed(() => {
  return authStore.isAuthenticated
})

// Get user balance from auth store
const userBalance = computed(() => {
  return authStore.userBalance || 0
})

// Check if user has sufficient balance
const insufficientBalance = computed(() => {
  const stake = parseFloat(stakeAmount.value) || 0
  return stake > userBalance.value
})

// Check if stake is valid (minimum 100)
const isValidStake = computed(() => {
  const stake = parseFloat(stakeAmount.value) || 0
  return stake >= 100
})

// Format balance
const formatBalance = (amount) => {
  return new Intl.NumberFormat('sw-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount || 0)
}

// Load from localStorage on mount
onMounted(() => {
  loadFromLocalStorage()
  
  if (isAuthenticated.value) {
    authStore.fetchUserBalance()
  }
  
  // Listen for storage changes
  window.addEventListener('storage', handleStorageChange)
  
  // Listen for betslip updates from games component
  window.addEventListener('betslip-update', handleBetslipUpdate)
})

onBeforeUnmount(() => {
  window.removeEventListener('storage', handleStorageChange)
  window.removeEventListener('betslip-update', handleBetslipUpdate)
})

// Handle betslip updates from games component
const handleBetslipUpdate = (event) => {
  const bets = event.detail || []
  // Update sportsBets with the new data
  // You might need to filter based on your data structure
  sportsBets.value = bets
  console.log('Betslip updated from event:', bets)
}

// Handle storage changes from other tabs
const handleStorageChange = (event) => {
  if (event.key === 'betslip_selections') {
    loadFromLocalStorage()
  }
}

// Save to localStorage and notify other components
const saveToLocalStorage = (bets) => {
  localStorage.setItem('betslip_selections', JSON.stringify(bets))
  // Dispatch event for same-tab components
  window.dispatchEvent(new CustomEvent('betslip-update', { detail: bets }))
}

// Watch sportsBets and save changes
watch(sportsBets, (newBets) => {
  saveToLocalStorage(newBets)
}, { deep: true })

// Load from localStorage
const loadFromLocalStorage = () => {
  const savedBets = localStorage.getItem('betslip_selections')
  if (savedBets) {
    try {
      const parsed = JSON.parse(savedBets)
      if (JSON.stringify(sportsBets.value) !== JSON.stringify(parsed)) {
        sportsBets.value = parsed
        console.log('Bets loaded from localStorage:', sportsBets.value)
      }
    } catch (e) {
      console.error('Error parsing saved bets:', e)
    }
  } else {
    sportsBets.value = []
  }
}

// Computed properties
const sportsSelections = computed(() => sportsBets.value)

const totalSportsOdds = computed(() => {
  if (sportsSelections.value.length === 0) return 0
  return sportsSelections.value.reduce((product, bet) => {
    return product * parseFloat(bet.odds)
  }, 1)
})

const totalSportsReturns = computed(() => {
  const stake = parseFloat(stakeAmount.value) || 0
  return stake * totalSportsOdds.value
})

const virtualsSelections = computed(() => virtualsBets.value)

const totalVirtualsOdds = computed(() => {
  if (virtualsSelections.value.length === 0) return 0
  return virtualsSelections.value.reduce((product, bet) => {
    return product * parseFloat(bet.odds)
  }, 1)
})

const totalVirtualsReturns = computed(() => {
  const stake = parseFloat(stakeAmount.value) || 0
  return stake * totalVirtualsOdds.value
})

const currentSelectionsCount = computed(() => {
  return activeTab.value === 'sports' 
    ? sportsSelections.value.length 
    : virtualsSelections.value.length
})

const currentTotalOdds = computed(() => {
  return activeTab.value === 'sports' ? totalSportsOdds.value : totalVirtualsOdds.value
})

const currentTotalReturns = computed(() => {
  return activeTab.value === 'sports' ? totalSportsReturns.value : totalVirtualsReturns.value
})

const canPlaceBet = computed(() => {
  const stake = parseFloat(stakeAmount.value) || 0
  return currentSelectionsCount.value > 0 && 
         stake >= 100 && 
         !isLoading.value &&
         isAuthenticated.value &&
         !insufficientBalance.value
})

// Methods
const removeSportsBet = (index) => {
  sportsBets.value.splice(index, 1)
}

const removeVirtualBet = (index) => {
  virtualsBets.value.splice(index, 1)
}

// Auto-hide success message after 3 seconds
const showSuccessMessage = (message) => {
  success.value = message
  setTimeout(() => {
    success.value = null
  }, 3000)
}

// Load booking code using API
const loadBookingCode = async () => {
  if (!bookingCode.value) {
    error.value = 'Please enter a booking code'
    setTimeout(() => { error.value = null }, 3000)
    return
  }
  
  if (!isAuthenticated.value) {
    error.value = 'Please login to load booking codes'
    setTimeout(() => { error.value = null }, 3000)
    return
  }
  
  isLoading.value = true
  loadingMessage.value = 'Loading bets from booking code...'
  error.value = null
  
  try {
    const response = await api.get(`/bets/booking/${bookingCode.value}`)
    
    if (response.data.success && response.data.data) {
      const bet = response.data.data
      
      if (bet.selections && Array.isArray(bet.selections)) {
        const loadedBets = bet.selections.map((selection, index) => ({
          id: `${bet.id}-${index}`,
          match: selection.match,
          league: selection.league || 'Unknown League',
          time: selection.matchTime || 'Today',
          odds: selection.odds.toString(),
          selection: selection.selection,
          betId: bet.id
        }))
        
        sportsBets.value = loadedBets
        bookingCode.value = ''
        showSuccessMessage(`✅ Successfully loaded ${loadedBets.length} selection(s)`)
      }
    }
  } catch (err) {
    console.error('Error loading booking code:', err)
    error.value = err.response?.data?.message || 'Failed to load booking code'
    setTimeout(() => { error.value = null }, 3000)
  } finally {
    isLoading.value = false
    loadingMessage.value = ''
  }
}

// Place bet using API
const placeBet = async () => {
  if (!canPlaceBet.value) return
  
  const selections = activeTab.value === 'sports' 
    ? sportsSelections.value 
    : virtualsSelections.value
  
  if (selections.length === 0) {
    error.value = 'No selections to place'
    setTimeout(() => { error.value = null }, 3000)
    return
  }
  
  const stake = parseFloat(stakeAmount.value)
  if (stake < 100) {
    error.value = 'Minimum stake is 100 Tsh'
    setTimeout(() => { error.value = null }, 3000)
    return
  }
  
  isLoading.value = true
  loadingMessage.value = 'Placing your bet...'
  error.value = null
  
  try {
    // Format selections for API
    const formattedSelections = selections.map(selection => ({
      match: selection.match,
      selection: selection.selection,
      odds: parseFloat(selection.odds),
      league: selection.league,
      time: selection.time
    }))
    
    const response = await api.post('/bets', {
      selections: formattedSelections,
      stake: stake
    })
    
    if (response.data.success) {
      // Refresh balance
      await authStore.fetchUserBalance()
      
      // Show toast message
      showSuccessMessage(`✅ Bet placed successfully! Code: ${response.data.data.bookingCode}`)
      
      // Clear betslip
      if (activeTab.value === 'sports') {
        sportsBets.value = []
      } else {
        virtualsBets.value = []
      }
      
      // Clear stake amount
      stakeAmount.value = ''
      
      // Dispatch event to clear selections in games component
      window.dispatchEvent(new CustomEvent('bets-cleared'))
    }
  } catch (err) {
    console.error('Error placing bet:', err)
    
    // Handle error messages
    if (err.response?.data?.message) {
      error.value = err.response.data.message
    } else if (err.message) {
      error.value = err.message
    } else {
      error.value = 'Failed to place bet. Please try again.'
    }
    setTimeout(() => { error.value = null }, 3000)
  } finally {
    isLoading.value = false
    loadingMessage.value = ''
  }
}
</script>

<template>
  <div class=" flex flex-col flex-[36%] bg-gray-300  h-[calc(100vh-91px)] ">
    <!-- Toast Messages -->
    <Transition name="fade">
      <div v-if="success" class="fixed top-4 right-4 z-50 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        {{ success }}
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="error" class="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
        {{ error }}
      </div>
    </Transition>

    <!-- Loading Overlay -->
    <div v-if="isLoading" class="fixed inset-0 bg-transparent flex items-center justify-center z-40">
      <div class="bg-white p-4 rounded-lg shadow-xl">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
        <p class="text-gray-700 mt-2">{{ loadingMessage }}</p>
      </div>
    </div>

    <!-- Header - Fixed -->
    <div class="flex-shrink-0">
      <div class="w-full mt-3 mb-4 px-3">
        <!-- Authenticated Header -->
        <div v-if="isAuthenticated" class="bg-emerald-50 border flex items-center justify-between border-emerald-200 rounded-lg px-4 py-2 w-full">
          <div>
            <p class="text-xs text-emerald-700">Your Balance</p>
            <p class="text-lg font-bold text-emerald-600">{{ formatBalance(userBalance) }}</p>
          </div>
          <div>
            <router-link 
              to="/bets" 
              class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              My Bets
            </router-link>
          </div>
        </div>

        <!-- Unauthenticated Header -->
        <div v-if="!isAuthenticated" class="bg-emerald-50 border flex items-center justify-between border-emerald-200 rounded-lg px-4 py-2 w-full">
          <div>
            <p class="text-gray-600 mt-1">Review and place your bets</p>
          </div>
          <div>
            <router-link 
              to="/login" 
              class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Login
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Scrollable Area -->
    <div class="flex-1 overflow-hidden flex flex-col">
      <!-- Tabs Header - Fixed -->
      <div class="flex border-b border-gray-200 bg-gray-50 w-full flex-shrink-0">
        <!-- Sports Tab -->
        <button
          @click="activeTab = 'sports'"
          class="flex-1 py-2 px-6 text-sm md:text-base font-medium transition-all duration-200 relative group"
          :class="activeTab === 'sports' 
            ? 'text-emerald-600 bg-white' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'"
        >
          <div class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5" :class="activeTab === 'sports' ? 'text-emerald-600' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v13m0-13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v13m12 0h-6m6 0a2 2 0 002-2V6a2 2 0 00-2-2h-2.5M9 5h3M6 12h6M6 16h6"></path>
            </svg>
            <span>Sports</span>
            <span class="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">{{ sportsBets.length }}</span>
          </div>
          <span 
            v-if="activeTab === 'sports'"
            class="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600"
          ></span>
        </button>
        
        <!-- Virtuals Tab -->
        <button
          @click="activeTab = 'virtuals'"
          class="flex-1 py-2 px-6 text-sm md:text-base font-medium transition-all duration-200 relative group"
          :class="activeTab === 'virtuals' 
            ? 'text-emerald-600 bg-white' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'"
        >
          <div class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5" :class="activeTab === 'virtuals' ? 'text-emerald-600' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <span>Virtuals</span>
            <span class="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">{{ virtualsBets.length }}</span>
          </div>
          <span 
            v-if="activeTab === 'virtuals'"
            class="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600"
          ></span>
        </button>
      </div>

      <!-- Warning Messages - Fixed -->
      <div class="flex-shrink-0 px-4">
        <!-- INSUFFICIENT BALANCE MESSAGE -->
        <div v-if="isAuthenticated && insufficientBalance && currentSelectionsCount > 0" class="mb-4 bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded relative">
          <strong class="font-bold">💰 Insufficient Balance! </strong>
          <span class="block sm:inline">You need Tsh {{ (parseFloat(stakeAmount) - userBalance).toFixed(0) }} more to place this bet.</span>
          <router-link to="/deposite" class="ml-2 inline-block bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-700 mt-2 text-center">
            Deposit Now
          </router-link>
        </div>

        <!-- INVALID STAKE MESSAGE -->
        <div v-if="stakeAmount && !isValidStake && currentSelectionsCount > 0" class="mb-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded relative">
          <strong class="font-bold">Invalid Stake! </strong>
          <span class="block sm:inline">Minimum stake is 100 Tsh</span>
        </div>
      </div>

      <!-- Scrollable Content (with bottom section inside) -->
      <div class="flex-1 overflow-y-auto px-4 pb-20 pt-4">
        <!-- Sports Tab Content -->
        <div v-if="activeTab === 'sports'" class="space-y-6">
          <!-- Booking Code Input -->
          <div v-if="sportsBets.length === 0" class="space-y-4">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p class="text-sm text-blue-800 mb-3">Load your bets using a booking code</p>
              <div class="flex gap-2">
                <input 
                  type="text" 
                  v-model="bookingCode"
                  placeholder="Enter booking code"
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  @keyup.enter="loadBookingCode"
                  :disabled="isLoading"
                >
                <button 
                  @click="loadBookingCode"
                  :disabled="isLoading || !bookingCode"
                  class="px-6 py-2 bg-[#0AF0B5] hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Load
                </button>
              </div>
              <p class="text-xs text-gray-500 mt-2">Or select games from the events page</p>
            </div>

            <!-- Empty State -->
            <div class="text-center py-8">
              <svg class="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              <p class="text-gray-500 font-medium">Your bet slip is empty</p>
              <p class="text-sm text-gray-400 mt-1">Add bets from the sports events page</p>
            </div>
          </div>

          <!-- Sports Bets List -->
          <div v-else class="space-y-4">
            <div v-for="(bet, index) in sportsBets" :key="bet.id" 
                 class="group relative bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 p-1 hover:shadow-md transition-all duration-200">
              <!-- Remove button -->
              <button @click="removeSportsBet(index)" class="absolute -top-2 -right-2 bg-gray-500 text-red-400 rounded-full p-1 duration-200 shadow-lg hover:bg-red-600 hover:text-white">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>

              <!-- Match info -->
              <div class="flex justify-between items-start mb-1">
                <div>
                  <h3 class="font-semibold text-gray-800">{{ bet.match }}</h3>
                  <p class="text-xs text-gray-500 mt-1">{{ bet.league }} • {{ bet.time }}</p>
                </div>
                <span class="bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-1 rounded-full">1X2</span>
              </div>

              <!-- Selected selection -->
              <div class="mt-1 flex items-center gap-2">
                <span class="text-sm text-gray-600">Selected:</span>
                <span class="text-sm font-medium text-[#0AF0B5] bg-emerald-50 px-2 py-1 rounded">
                  {{ bet.selection }} @ {{ bet.odds }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Virtuals Tab Content -->
        <div v-else class="space-y-6">
          <!-- Virtuals Bets List -->
          <div v-if="virtualsBets.length > 0" class="space-y-4">
            <div v-for="(bet, index) in virtualsBets" :key="bet.id" 
                 class="group relative bg-gradient-to-r from-purple-50 to-white rounded-lg border border-purple-200 p-4 hover:shadow-md transition-all duration-200">
              <!-- Remove button -->
              <button @click="removeVirtualBet(index)" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 shadow-lg">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>

              <!-- Virtual match info -->
              <div class="flex justify-between items-start mb-3">
                <div>
                  <h3 class="font-semibold text-gray-800">{{ bet.match }}</h3>
                  <p class="text-xs text-gray-500 mt-1">{{ bet.league }} • {{ bet.time }}</p>
                </div>
                <span class="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded-full">Virtual</span>
              </div>

              <!-- Selected selection -->
              <div class="mt-3 flex items-center gap-2">
                <span class="text-sm text-gray-600">Selected:</span>
                <span class="text-sm font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
                  {{ bet.selection }} @ {{ bet.odds }}
                </span>
              </div>
            </div>
          </div>

          <!-- Empty state for virtuals -->
          <div v-else class="text-center py-12">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <p class="text-gray-500 font-medium">No virtual bets selected</p>
            <p class="text-sm text-gray-400 mt-1">Add bets from the virtual sports page</p>
          </div>
        </div>

        <!-- Bottom Section - Now inside scrollable area -->
        <div v-if="currentSelectionsCount > 0" class="border-t border-gray-200 bg-gray-50 p-2 mt-6 rounded-lg">
          <!-- Stake Input -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Enter Stake Amount (Min: 100 Tsh)</label>
            <div class="flex gap-2">
              <input 
                type="number" 
                v-model="stakeAmount"
                placeholder="Enter amount"
                min="100"
                step="100"
                class="flex-1 px-1 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0AF0B5] text-[13px]"
                :disabled="isLoading"
              >
              <span class="inline-flex items-center px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-medium">
                Tsh
              </span>
            </div>
            <p v-if="stakeAmount && stakeAmount < 100" class="text-xs text-red-500 mt-1">
              Minimum stake is 100 Tsh
            </p>
          </div>

          <!-- Odds and Returns -->
          <div class="bg-white rounded-lg p-2 mb-3 space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Total Selections:</span>
              <span class="font-bold text-[#0AF0B5]">{{ currentSelectionsCount }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Total Odds:</span>
              <span class="font-bold text-[#0AF0B5] text-[13px]">{{ currentTotalOdds.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between items-center pt-2 border-t border-gray-200">
              <span class="text-base font-medium">Potential Returns:</span>
              <span class="text-[14px] font-bold text-[#0AF0B5]">Tsh {{ currentTotalReturns.toFixed(2) }}</span>
            </div>
          </div>

          <!-- LOGIN REQUIRED BUTTON -->
          <div v-if="!isAuthenticated" class="mb-2">
            <router-link to="/login" class="block w-full py-1 bg-[#04c796] text-white font-bold rounded-lg text-center hover:bg-emerald-700">
              Login to Place Bet
            </router-link>
          </div>

          <!-- INSUFFICIENT BALANCE BUTTON -->
          <div v-else-if="insufficientBalance" class="mb-2">
            <router-link to="/deposite" class="block w-full py-1 bg-[#04c796] text-white font-bold rounded-lg text-center hover:bg-emerald-700">
              Deposit to Continue
            </router-link>
          </div>

          <!-- PLACE BET BUTTON -->
          <button 
            v-else
            @click="placeBet"
            :disabled="!canPlaceBet || isLoading"
            class="w-full py-3 cursor-pointer bg-[#0AF0B5] text-white font-bold rounded-lg shadow-lg hover:bg-emerald-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading">Placing Bet...</span>
            <span v-else>Place Bet ({{ activeTab }})</span>
          </button>

          <!-- Terms -->
          <p class="text-xs text-gray-500 text-center mt-3">
            By placing a bet, you agree to our <a href="#" class="text-emerald-600 hover:underline">Terms & Conditions</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Fade animation for toasts */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Scrollbar styling */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #0AF0B5;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #09d6a0;
}

/* Your existing styles */
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

.h-full {
  height: 100vh;
}
</style>