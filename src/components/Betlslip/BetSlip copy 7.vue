<template>
  <div class="h-full">
    <!-- Header with Balance Display -->
    <div class="max-w-2xl mx-auto mb-4 px-3 flex justify-between items-center">
      <div>
        <h1 class="text-xl md:text-3xl text-gray-500">Bet Slip</h1>
        <p class="text-gray-600 mt-1">Review and place your bets</p>
      </div>
      
      <!-- Balance Display (only when authenticated) -->
      <div v-if="isAuthenticated" class="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2">
        <p class="text-xs text-emerald-700">Your Balance</p>
        <p class="text-lg font-bold text-emerald-600">{{ formatBalance(userBalance) }}</p>
      </div>
    </div>

    <!-- Main Bet Slip Card -->
    <div class="w-full bg-transparent overflow-hidden">
      <!-- Loading Overlay -->
      <div v-if="isLoading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-4 rounded-lg shadow-xl">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
          <p class="text-gray-700 mt-2">{{ loadingMessage }}</p>
        </div>
      </div>

      <!-- NOT AUTHENTICATED MESSAGE - INAONEKANA WAZI -->
      <div v-if="!isAuthenticated && currentSelectionsCount > 0" class="mx-4 mb-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded relative">
        <strong class="font-bold">🔐 Login Required! </strong>
        <span class="block sm:inline">Please login to place bets.</span>
        <router-link to="/login" class="ml-2 inline-block bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-700 mt-2 text-center">
          Login Now
        </router-link>
      </div>

      <!-- INSUFFICIENT BALANCE MESSAGE - INAONEKANA WAZI -->
      <div v-if="isAuthenticated && insufficientBalance && currentSelectionsCount > 0" class="mx-4 mb-4 bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded relative">
        <strong class="font-bold">💰 Insufficient Balance! </strong>
        <span class="block sm:inline">You need Tsh {{ (stakeAmount - userBalance).toFixed(0) }} more to place this bet.</span>
        <router-link to="/deposite" class="ml-2 inline-block bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-700 mt-2 text-center">
          Deposit Now
        </router-link>
      </div>

      <!-- Error Alert -->
      <div v-if="error" class="mx-4 mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong class="font-bold">Error! </strong>
        <span class="block sm:inline">{{ error }}</span>
        <button @click="error = null" class="absolute top-0 bottom-0 right-0 px-4 py-3">
          <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <title>Close</title>
            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
          </svg>
        </button>
      </div>

      <!-- Tabs Header - Sports na Virtuals -->
      <div class="flex border-b border-gray-200 bg-gray-50 w-full">
        <!-- Sports Tab -->
        <button
          @click="activeTab = 'sports'"
          class="flex-1 py-4 px-6 text-sm md:text-base font-medium transition-all duration-200 relative group"
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
          class="flex-1 py-4 px-6 text-sm md:text-base font-medium transition-all duration-200 relative group"
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

      <!-- Tab Content -->
      <div class="p-6 overflow-y-auto">
        <!-- Sports Tab -->
        <div v-if="activeTab === 'sports'" class="space-y-6">
          <!-- Booking Code Input - Inaonekana tu kama hakuna bets -->
          <div v-if="sportsBets.length === 0" class="space-y-4">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p class="text-sm text-blue-800 mb-3">Load your bets using a booking code</p>
              <div class="flex gap-2">
                <input 
                  type="text" 
                  v-model="bookingCode"
                  placeholder="Enter booking code (e.g., BETABC123)"
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  @keyup.enter="loadBookingCode"
                  :disabled="isLoading"
                >
                <button 
                  @click="loadBookingCode"
                  :disabled="isLoading || !bookingCode"
                  class="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Load
                </button>
              </div>
              <p class="text-xs text-gray-500 mt-2">Or select games from the events page</p>
            </div>

            <!-- Empty State Icon -->
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

              <!-- Selected selection indicator -->
              <div class="mt-1 flex items-center gap-2">
                <span class="text-sm text-gray-600">Selected:</span>
                <span class="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                  {{ bet.selection }} @ {{ bet.odds }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Virtuals Tab -->
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

              <!-- Selected selection indicator -->
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
      </div>

      <!-- Bottom Section - Common for both tabs -->
      <div v-if="currentSelectionsCount > 0" class="border-t border-gray-200 bg-gray-50 p-2">
        <!-- Balance Info -->
        <div class="mb-2 flex justify-between items-center bg-emerald-50 p-2 rounded-lg">
          <span class="text-sm font-medium text-emerald-700">Your Balance:</span>
          <span class="text-lg font-bold text-emerald-600">{{ formatBalance(userBalance) }}</span>
        </div>

        <!-- Single Stake Input -->
        <div class="mb-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">Enter Stake Amount (Min: 100 Tsh)</label>
          <div class="flex gap-2">
            <input 
              type="number" 
              v-model="stakeAmount"
              placeholder="e.g., 100"
              min="100"
              step="100"
              class="flex-1 px-1 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
              :disabled="isLoading"
              @input="validateStake"
            >
            <span class="inline-flex items-center px-2 py-1 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-medium">
              Tsh
            </span>
          </div>
          <p v-if="stakeAmount < 100 && stakeAmount > 0" class="text-xs text-red-500 mt-1">Minimum stake is 100 Tsh</p>
        </div>

        <!-- Odds and Returns Summary -->
        <div class="bg-white rounded-lg p-2 mb-1 space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Total Selections:</span>
            <span class="font-bold text-emerald-600">{{ currentSelectionsCount }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Total Odds:</span>
            <span class="font-bold text-emerald-600 text-lg">{{ currentTotalOdds.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between items-center pt-1 border-t border-gray-200">
            <span class="text-base font-medium">Potential Returns:</span>
            <span class="text-xl font-bold text-emerald-600">Tsh {{ currentTotalReturns.toFixed(2) }}</span>
          </div>
        </div>

        <!-- LOGIN REQUIRED MESSAGE KWENYE BUTTON -->
        <div v-if="!isAuthenticated" class="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
          <p class="text-sm text-yellow-800 mb-2">Please login to place bets</p>
          <router-link to="/login" class="block w-full py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700">
            Login Now
          </router-link>
        </div>

        <!-- INSUFFICIENT BALANCE MESSAGE KWENYE BUTTON -->
        <div v-else-if="insufficientBalance" class="mb-2 p-2 bg-orange-50 border border-orange-200 rounded-lg text-center">
          <p class="text-sm text-orange-800 mb-2">Insufficient balance. You need Tsh {{ (stakeAmount - userBalance).toFixed(0) }} more.</p>
          <router-link to="/deposite" class="block w-full py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700">
            Deposit Now
          </router-link>
        </div>

        <!-- PLACE BET BUTTON - Inaonekana tu kama amelogin na ana balance ya kutosha -->
        <button 
          v-else
          @click="placeBet"
          :disabled="!canPlaceBet || isLoading"
          class="w-full py-2 cursor-pointer bg-[#0AF0B5] text-white font-bold rounded-lg shadow-lg hover:bg-emerald-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isLoading">Placing Bet...</span>
          <span v-else>Place Bet ({{ activeTab }})</span>
        </button>

        <!-- Terms -->
        <p class="text-xs text-gray-500 text-center mt-2">
          By placing a bet, you agree to our <a href="#" class="text-emerald-600 hover:underline">Terms & Conditions</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useAuthStore } from '../../store/authStore'
import betService from '../../services/bet.service'
import api from '../../services/api'

// Active tab: 'sports' au 'virtuals'
const activeTab = ref('sports')
const bookingCode = ref('')
const stakeAmount = ref(100)

// Auth store
const authStore = useAuthStore()

// Loading and error states
const isLoading = ref(false)
const error = ref(null)
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
  return parseFloat(stakeAmount.value) > userBalance.value
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

// Validate stake against balance
const validateStake = () => {
  // Just for console, no action needed
}

// Load from localStorage on mount
onMounted(() => {
  loadFromLocalStorage()
  
  // Fetch latest balance if authenticated
  if (isAuthenticated.value) {
    authStore.fetchUserBalance()
  }
  
  // Listen for storage changes
  window.addEventListener('storage', handleStorageChange)
  
  // Poll for changes
  const interval = setInterval(() => {
    loadFromLocalStorage()
  }, 1000)
  
  onBeforeUnmount(() => {
    clearInterval(interval)
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('storage', handleStorageChange)
})

// Handle storage changes
const handleStorageChange = (event) => {
  if (event.key === 'betslip_selections') {
    loadFromLocalStorage()
  }
}

// Save to localStorage
watch(sportsBets, (newBets) => {
  localStorage.setItem('betslip_selections', JSON.stringify(newBets))
}, { deep: true })

// Load from localStorage
const loadFromLocalStorage = () => {
  const savedBets = localStorage.getItem('betslip_selections')
  if (savedBets) {
    try {
      const parsed = JSON.parse(savedBets)
      if (JSON.stringify(sportsBets.value) !== JSON.stringify(parsed)) {
        sportsBets.value = parsed
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
  return (parseFloat(stakeAmount.value) || 0) * totalSportsOdds.value
})

const virtualsSelections = computed(() => virtualsBets.value)

const totalVirtualsOdds = computed(() => {
  if (virtualsSelections.value.length === 0) return 0
  return virtualsSelections.value.reduce((product, bet) => {
    return product * parseFloat(bet.odds)
  }, 1)
})

const totalVirtualsReturns = computed(() => {
  return (parseFloat(stakeAmount.value) || 0) * totalVirtualsOdds.value
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
  return currentSelectionsCount.value > 0 && 
         parseFloat(stakeAmount.value) >= 100 && 
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

// Load booking code
const loadBookingCode = async () => {
  if (!bookingCode.value) {
    error.value = 'Please enter a booking code'
    return
  }
  
  if (!isAuthenticated.value) {
    error.value = 'Please login to load booking codes'
    return
  }
  
  isLoading.value = true
  loadingMessage.value = 'Loading bets from booking code...'
  error.value = null
  
  try {
    const response = await betService.loadBetByBookingCode(bookingCode.value)
    
    if (response.success && response.data) {
      const bet = response.data
      
      if (bet.selections && Array.isArray(bet.selections)) {
        const loadedBets = bet.selections.map((selection, index) => ({
          id: `${bet.id}-${index}`,
          match: selection.match,
          league: selection.league || 'Unknown League',
          time: selection.time || 'Today',
          odds: selection.odds.toString(),
          selection: selection.selection,
          betId: bet.id
        }))
        
        sportsBets.value = loadedBets
        bookingCode.value = ''
        alert(`Successfully loaded ${loadedBets.length} selection(s)`)
      }
    }
  } catch (err) {
    console.error('Error loading booking code:', err)
    error.value = err.message || 'Failed to load booking code'
  } finally {
    isLoading.value = false
    loadingMessage.value = ''
  }
}

// Place bet
const placeBet = async () => {
  if (!canPlaceBet.value) return
  
  const selections = activeTab.value === 'sports' 
    ? sportsSelections.value 
    : virtualsSelections.value
  
  if (selections.length === 0) {
    error.value = 'No selections to place'
    return
  }
  
  const stake = parseFloat(stakeAmount.value)
  if (stake < 100) {
    error.value = 'Minimum stake is 100 Tsh'
    return
  }
  
  isLoading.value = true
  loadingMessage.value = 'Placing your bet...'
  error.value = null
  
  try {
    const formattedSelections = selections.map(selection => ({
      match: selection.match,
      selection: selection.selection,
      odds: parseFloat(selection.odds),
      league: selection.league,
      time: selection.time
    }))
    
    const response = await betService.placeBet({
      selections: formattedSelections,
      stake: stake
    })
    
    if (response.success) {
      await authStore.fetchUserBalance()
      
      alert(`✅ Bet placed successfully!\n\nBooking Code: ${response.data.bookingCode}\nPotential Return: Tsh ${response.data.potentialReturn.toFixed(2)}`)
      
      if (activeTab.value === 'sports') {
        sportsBets.value = []
      } else {
        virtualsBets.value = []
      }
      
      stakeAmount.value = 100
    }
  } catch (err) {
    console.error('Error placing bet:', err)
    
    let errorMsg = 'Failed to place bet. Please try again.'
    
    if (err.message) {
      errorMsg = err.message
    } else if (err.data?.message) {
      errorMsg = err.data.message
    } else if (err.response?.data?.message) {
      errorMsg = err.response.data.message
    }
    
    error.value = errorMsg
  } finally {
    isLoading.value = false
    loadingMessage.value = ''
  }
}
</script>

<style scoped>
/* Your existing styles */
</style>