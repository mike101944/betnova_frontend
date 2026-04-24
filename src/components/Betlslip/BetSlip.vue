<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '../../store/authStore'
import api from '../../services/api'

// Active tab
const activeTab = ref('sports')
const bookingCode = ref('')
const stakeAmount = ref(100)

// Auth store
const authStore = useAuthStore()

// Loading and error states
const isLoading = ref(false)
const error = ref(null)
const success = ref(null)
const loadingMessage = ref('')

// Simple reactive data - direct, no store for bets yet
const sportsBets = ref([])
const virtualsBets = ref([])

// Check if user is authenticated
const isAuthenticated = computed(() => authStore.isAuthenticated)
const userBalance = computed(() => authStore.userBalance || 0)

// Simple localStorage functions
const saveBets = () => {
  try {
    localStorage.setItem('betslip_sports', JSON.stringify(sportsBets.value))
  } catch(e) { console.error('Save error:', e) }
}

const loadBets = () => {
  try {
    const saved = localStorage.getItem('betslip_sports')
    if (saved) {
      sportsBets.value = JSON.parse(saved)
      console.log('Loaded bets:', sportsBets.value.length)
    }
  } catch(e) { console.error('Load error:', e) }
}

// Validation
const insufficientBalance = computed(() => {
  const stake = parseFloat(stakeAmount.value) || 0
  return stake > userBalance.value
})

const isValidStake = computed(() => {
  const stake = parseFloat(stakeAmount.value) || 0
  return stake >= 100
})

const currentSelectionsCount = computed(() => {
  return activeTab.value === 'sports' ? sportsBets.value.length : virtualsBets.value.length
})

const currentTotalOdds = computed(() => {
  if (activeTab.value === 'sports') {
    if (sportsBets.value.length === 0) return 0
    return sportsBets.value.reduce((p, bet) => p * parseFloat(bet.odds), 1)
  }
  if (virtualsBets.value.length === 0) return 0
  return virtualsBets.value.reduce((p, bet) => p * parseFloat(bet.odds), 1)
})

const currentTotalReturns = computed(() => {
  const stake = parseFloat(stakeAmount.value) || 0
  return stake * currentTotalOdds.value
})

const canPlaceBet = computed(() => {
  const stake = parseFloat(stakeAmount.value) || 0
  return currentSelectionsCount.value > 0 && 
         stake >= 100 && 
         !isLoading.value &&
         isAuthenticated.value &&
         !insufficientBalance.value
})

const formatBalance = (amount) => {
  return new Intl.NumberFormat('sw-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount || 0)
}

const removeSportsBet = (index) => {
  sportsBets.value.splice(index, 1)
  saveBets()
}

const removeVirtualBet = (index) => {
  virtualsBets.value.splice(index, 1)
}

const showSuccessMessage = (message) => {
  success.value = message
  setTimeout(() => { success.value = null }, 3000)
}

// Load booking code
const loadBookingCode = async () => {
  error.value = null
  
  if (!bookingCode.value || !bookingCode.value.trim()) {
    error.value = 'Please enter a booking code'
    setTimeout(() => { error.value = null }, 3000)
    return
  }
  
  const cleanCode = bookingCode.value.trim().toUpperCase()
  bookingCode.value = cleanCode
  
  if (!isAuthenticated.value) {
    error.value = 'Please login to load booking codes'
    setTimeout(() => { error.value = null }, 3000)
    return
  }
  
  isLoading.value = true
  loadingMessage.value = 'Loading bets from booking code...'
  
  try {
    const response = await api.get(`/bets/active/${encodeURIComponent(cleanCode)}`)
    let bet = response.data?.data || response.data
    
    if (bet && bet.selections && Array.isArray(bet.selections) && bet.selections.length > 0) {
      const loadedBets = bet.selections.map((selection, index) => ({
        id: `${bet.id}-${index}-${Date.now()}-${Math.random()}`,
        match: selection.match || selection.matchName || 'Unknown Match',
        league: selection.league || selection.leagueName || 'Unknown League',
        time: selection.matchTime || selection.time || 'Today',
        odds: selection.odds ? parseFloat(selection.odds) : 1.00,
        selection: selection.selection || selection.prediction || 'Unknown',
        betId: bet.id
      }))
      
      sportsBets.value = loadedBets
      saveBets()
      bookingCode.value = ''
      stakeAmount.value = 100
      showSuccessMessage(`✅ Successfully loaded ${loadedBets.length} selection(s)!`)
    } else {
      error.value = '❌ No selections found in this booking code'
      setTimeout(() => { error.value = null }, 3000)
    }
  } catch (err) {
    console.error('Error:', err)
    error.value = '❌ Failed to load booking code'
    setTimeout(() => { error.value = null }, 3000)
  } finally {
    isLoading.value = false
    loadingMessage.value = ''
  }
}

// Place bet
const placeBet = async () => {
  if (!canPlaceBet.value) return
  
  const selections = activeTab.value === 'sports' ? sportsBets.value : virtualsBets.value
  
  isLoading.value = true
  loadingMessage.value = 'Placing your bet...'
  error.value = null
  
  try {
    const formattedSelections = selections.map(s => ({
      match: s.match,
      selection: s.selection,
      odds: parseFloat(s.odds),
      league: s.league,
      time: s.time
    }))
    
    const response = await api.post('/bets', {
      selections: formattedSelections,
      stake: parseFloat(stakeAmount.value)
    })
    
    if (response.data.success) {
      await authStore.fetchUserBalance()
      showSuccessMessage(`✅ Bet placed! Code: ${response.data.data.bookingCode}`)
      sportsBets.value = []
      virtualsBets.value = []
      saveBets()
      stakeAmount.value = 100
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to place bet'
    setTimeout(() => { error.value = null }, 3000)
  } finally {
    isLoading.value = false
    loadingMessage.value = ''
  }
}

// Handle add bet from other components
const handleAddBet = (event) => {
  const bet = event.detail
  if (bet) {
    const exists = sportsBets.value.some(b => b.id === bet.id)
    if (!exists) {
      sportsBets.value.push(bet)
      saveBets()
      showSuccessMessage('Bet added!')
    }
  }
}

onMounted(() => {
  console.log('Component mounted')
  loadBets()
  
  if (isAuthenticated.value) {
    authStore.fetchUserBalance()
  }
  
  window.addEventListener('add-bet-to-slip', handleAddBet)
  
  // Debug: Check if data loads
  setTimeout(() => {
    console.log('Sports bets after mount:', sportsBets.value.length)
  }, 1000)
})

onBeforeUnmount(() => {
  window.removeEventListener('add-bet-to-slip', handleAddBet)
})
</script>

<!-- Template yako EXACTLY kama ilivyo, isipokuwa ondoa debug div baada ya kujaribu -->
<template>
  <div class="flex flex-col flex-[36%] bg-gray-300 h-full">
    <!-- Toast Messages -->
    <Transition name="fade">
      <div v-if="success" class="fixed top-4 right-4 z-50 bg-sky-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
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
    <div v-if="isLoading" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600 mx-auto"></div>
        <p class="text-gray-700 mt-3">{{ loadingMessage }}</p>
      </div>
    </div>

    <!-- Header - Fixed -->
    <div class="shrink-0">
      <div class="max-w-2xl mt-4 mx-auto mb-4 px-3">
        <!-- Authenticated Header -->
        <div v-if="isAuthenticated" class="bg-sky-50 border flex items-center justify-between border-sky-200 rounded-lg px-4 py-2 w-full">
          <div>
            <p class="text-xs text-sky-700">Your Balance</p>
            <p class="text-lg font-bold text-sky-600">{{ formatBalance(userBalance) }}</p>
          </div>
          <div>
            <router-link 
              to="/bets" 
              class="bg-gradient-to-r from-sky-600 to-teal-700 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              My Bets
            </router-link>
          </div>
        </div>

        <!-- Unauthenticated Header -->
        <div v-if="!isAuthenticated" class="bg-sky-50 border flex items-center justify-between border-sky-200 rounded-lg px-4 py-2 w-full">
          <div>
            <p class="text-gray-600 mt-1">Review and place your bets</p>
          </div>
          <div>
            <router-link 
              to="/login" 
              class="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
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
            ? 'text-sky-600 bg-white' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'"
        >
          <div class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5" :class="activeTab === 'sports' ? 'text-sky-600' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v13m0-13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v13m12 0h-6m6 0a2 2 0 002-2V6a2 2 0 00-2-2h-2.5M9 5h3M6 12h6M6 16h6"></path>
            </svg>
            <span>Sports</span>
            <span class="text-xs bg-sky-100 text-sky-700 px-2 py-1 rounded-full">{{ sportsBets.length }}</span>
          </div>
          <span 
            v-if="activeTab === 'sports'"
            class="absolute bottom-0 left-0 w-full h-0.5 text-sm bg-sky-600"
          ></span>
        </button>
        
        <!-- Virtuals Tab -->
        <button
          @click="activeTab = 'virtuals'"
          class="flex-1 py-2 px-6 text-sm md:text-base font-medium transition-all duration-200 relative group"
          :class="activeTab === 'virtuals' 
            ? 'text-sky-600 bg-white' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'"
        >
          <div class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5" :class="activeTab === 'virtuals' ? 'text-sky-600' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <span>Virtuals</span>
            <span class="text-xs bg-sky-100 text-sky-700 px-2 py-1 rounded-full">{{ virtualsBets.length }}</span>
          </div>
          <span 
            v-if="activeTab === 'virtuals'"
            class="absolute bottom-0 left-0 w-full h-0.5 bg-sky-600"
          ></span>
        </button>
      </div>

      <!-- Warning Messages - Fixed -->
      <div class="flex-shrink-0 px-4">
        <!-- INSUFFICIENT BALANCE MESSAGE -->
        <div v-if="isAuthenticated && insufficientBalance && currentSelectionsCount > 0" class="mb-4 bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded relative">
          <strong class="font-bold">💰 Insufficient Balance! </strong>
          <span class="block sm:inline">You need Tsh {{ (parseFloat(stakeAmount) - userBalance).toFixed(0) }} more to place this bet.</span>
          <router-link to="/deposite" class="ml-2 inline-block bg-sky-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-700 mt-2 text-center">
            Deposit Now
          </router-link>
        </div>

        <!-- INVALID STAKE MESSAGE -->
        <div v-if="stakeAmount && !isValidStake && currentSelectionsCount > 0" class="mb-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded relative">
          <strong class="font-bold">Invalid Stake! </strong>
          <span class="block sm:inline">Minimum stake is 100.00 Tsh</span>
        </div>
      </div>

      <!-- Scrollable Content -->
      <div class="flex-1 overflow-y-auto px-4 pb-20 pt-4">
        <!-- Sports Tab Content -->
        <div v-if="activeTab === 'sports'" class="space-y-6">
          <!-- Booking Code Input -->
          <div v-if="sportsBets.length === 0" class="space-y-4">
            <div class="bg-sky-50 border border-sky-200 rounded-lg p-4">
              <p class="text-sm text-sky-800 mb-3">Load your bets using a booking code</p>
              <div class="flex gap-2">
                <input 
                  type="text" 
                  v-model="bookingCode"
                  placeholder="Enter booking code (e.g., BETABC123)"
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                  @keyup.enter="loadBookingCode"
                  :disabled="isLoading"
                >
                <button 
                  @click="loadBookingCode"
                  :disabled="isLoading || !bookingCode"
                  class="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isLoading ? 'Loading...' : 'Load' }}
                </button>
              </div>
              <p class="text-xs text-gray-500 mt-2">Only open and pending bets can be loaded</p>
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
                 class="group relative bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-all duration-200">
              <button @click="removeSportsBet(index)" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>

              <div class="flex justify-between items-start mb-2">
                <div>
                  <h3 class="font-semibold text-sm text-gray-800">{{ bet.match }}</h3>
                  <p class="text-xs text-gray-500 mt-1">{{ bet.league }}</p>
                </div>
                <span class="bg-sky-100 text-sky-700 text-xs font-medium px-2 py-1 rounded-full">1X2</span>
              </div>

              <div class="mt-2 flex items-center gap-2">
                <span class="text-xs text-gray-600">Selected:</span>
                <span class="text-sm font-medium bg-sky-100 text-sky-700 px-2 py-1 rounded">
                  {{ bet.selection }} @ {{ bet.odds }}
                </span>
                <span class="text-xs text-gray-500 ml-auto">{{ bet.time }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Virtuals Tab Content -->
        <div v-else class="space-y-6">
          <div v-if="virtualsBets.length > 0" class="space-y-4">
            <div v-for="(bet, index) in virtualsBets" :key="bet.id" 
                 class="group relative bg-gradient-to-r from-sky-50 to-white rounded-lg border border-purple-200 p-4 hover:shadow-md transition-all duration-200">
              <button @click="removeVirtualBet(index)" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 shadow-lg">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>

              <div class="flex justify-between items-start mb-3">
                <div>
                  <h3 class="font-semibold text-gray-800">{{ bet.match }}</h3>
                  <p class="text-xs text-gray-500 mt-1">{{ bet.league }} • {{ bet.time }}</p>
                </div>
                <span class="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded-full">Virtual</span>
              </div>

              <div class="mt-3 flex items-center gap-2">
                <span class="text-sm text-gray-600">Selected:</span>
                <span class="text-sm font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
                  {{ bet.selection }} @ {{ bet.odds }}
                </span>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-12">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <p class="text-gray-500 font-medium">No virtual bets selected</p>
            <p class="text-sm text-gray-400 mt-1">Add bets from the virtual sports page</p>
          </div>
        </div>

        <!-- Bottom Section -->
        <div v-if="currentSelectionsCount > 0" class="border-t border-gray-200 bg-gray-50 p-4 mt-6 rounded-lg">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Enter Stake Amount (Min: 100.00 Tsh)</label>
            <div class="flex gap-2">
              <input 
                type="number" 
                v-model="stakeAmount"
                placeholder="Enter amount"
                min="100"
                step="100"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                :disabled="isLoading"
              >
              <span class="inline-flex items-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-medium">
                Tsh
              </span>
            </div>
            <p v-if="stakeAmount && stakeAmount < 100" class="text-xs text-red-500 mt-1">
              Minimum stake is 100.00 Tsh
            </p>
          </div>

          <div class="bg-white rounded-lg p-4 mb-4 space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Total Selections:</span>
              <span class="font-bold text-gray-900">{{ currentSelectionsCount }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Total Odds:</span>
              <span class="font-bold text-sky-600">{{ currentTotalOdds.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between items-center pt-2 border-t border-gray-200">
              <span class="text-base font-medium">Potential Returns:</span>
              <span class="text-lg font-bold text-sky-600">Tsh {{ currentTotalReturns.toFixed(2) }}</span>
            </div>
          </div>

          <div v-if="!isAuthenticated" class="mb-2">
            <router-link to="/login" class="block w-full py-3 bg-sky-600 text-white font-bold rounded-lg text-center hover:bg-sky-700 transition-colors">
              Login to Place Bet
            </router-link>
          </div>

          <div v-else-if="insufficientBalance" class="mb-2">
            <router-link to="/deposite" class="block w-full py-3 bg-orange-600 text-white font-bold rounded-lg text-center hover:bg-orange-700 transition-colors">
              Deposit to Continue
            </router-link>
          </div>

          <button 
            v-else
            @click="placeBet"
            :disabled="!canPlaceBet || isLoading"
            class="w-full py-3 cursor-pointer bg-gradient-to-r from-sky-600 to-teal-600 text-white font-bold rounded-lg shadow-lg hover:from-sky-700 hover:to-teal-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading">Placing Bet...</span>
            <span v-else>Place Bet ({{ activeTab }})</span>
          </button>

          <p class="text-xs text-gray-500 text-center mt-4">
            By placing a bet, you agree to our <a href="#" class="text-sky-600 hover:underline">Terms & Conditions</a>
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

/* Animation */
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


/* Ongeza hii kwenye style yako */
.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.flex-1 {
  flex: 1 1 0%;
}

.h-full {
  height: 100%;
}

/* Kwa iPhone - ensure parent has height */
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>