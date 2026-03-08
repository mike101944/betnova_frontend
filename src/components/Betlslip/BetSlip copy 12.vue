
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
  <div class="h-full flex flex-col">
    
    <!-- Header -->
    <div class="max-w-2xl mx-auto mb-4 px-3 flex justify-between items-center flex-shrink-0">
      
      <div v-if="isAuthenticated" class="bg-emerald-50 border flex items-center justify-between border-emerald-200 rounded-lg px-4 py-2 w-full">
        <div>
          <p class="text-xs text-emerald-700">Your Balance</p>
          <p class="text-lg font-bold text-emerald-600">{{ formatBalance(userBalance) }}</p>
        </div>

        <router-link 
          to="/bets" 
          class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
        >
          My Bets
        </router-link>
      </div>

      <div v-if="!isAuthenticated" class="bg-emerald-50 border flex items-center justify-between border-emerald-200 rounded-lg px-4 py-2 w-full">
        <div>
          <h1 class="text-xl md:text-3xl text-gray-500">Bet Slip</h1>
          <p class="text-gray-600 mt-1">Review and place your bets</p>
        </div>

        <router-link 
          to="/login" 
          class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
        >
          Login
        </router-link>
      </div>

    </div>


    <!-- Card -->
    <div class="flex-1 flex flex-col bg-transparent overflow-hidden">

      <!-- Tabs -->
      <div class="flex border-b border-gray-200 bg-gray-50 w-full flex-shrink-0">
        
        <button
          @click="activeTab = 'sports'"
          class="flex-1 py-4 px-6 text-sm md:text-base font-medium transition-all duration-200 relative group"
          :class="activeTab === 'sports' 
            ? 'text-emerald-600 bg-white' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'"
        >
          Sports
        </button>

        <button
          @click="activeTab = 'virtuals'"
          class="flex-1 py-4 px-6 text-sm md:text-base font-medium transition-all duration-200 relative group"
          :class="activeTab === 'virtuals' 
            ? 'text-emerald-600 bg-white' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'"
        >
          Virtuals
        </button>

      </div>


      <!-- SCROLLABLE CONTENT -->
      <div class="flex-1 overflow-y-auto p-6">

        <!-- Sports -->
        <div v-if="activeTab === 'sports'" class="space-y-6">

          <div v-if="sportsBets.length === 0" class="space-y-4">

            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p class="text-sm text-blue-800 mb-3">
                Load your bets using a booking code
              </p>

              <div class="flex gap-2">
                <input 
                  type="text" 
                  v-model="bookingCode"
                  placeholder="Enter booking code"
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                >

                <button 
                  @click="loadBookingCode"
                  class="px-6 py-2 bg-emerald-600 text-white rounded-lg"
                >
                  Load
                </button>
              </div>

            </div>

          </div>


          <!-- Bets -->
          <div v-else class="space-y-4">

            <div 
              v-for="(bet, index) in sportsBets"
              :key="bet.id"
              class="group relative bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 p-1"
            >

              <button 
                @click="removeSportsBet(index)"
                class="absolute -top-2 -right-2 bg-gray-500 text-red-400 rounded-full p-1"
              >
                ✕
              </button>

              <div class="flex justify-between items-start mb-1">
                <div>
                  <h3 class="font-semibold text-gray-800">
                    {{ bet.match }}
                  </h3>
                  <p class="text-xs text-gray-500">
                    {{ bet.league }} • {{ bet.time }}
                  </p>
                </div>
              </div>

              <div class="mt-1 flex items-center gap-2">
                <span class="text-sm text-gray-600">Selected:</span>

                <span class="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                  {{ bet.selection }} @ {{ bet.odds }}
                </span>
              </div>

            </div>

          </div>

        </div>


        <!-- Virtuals -->
        <div v-else class="space-y-6">

          <div v-if="virtualsBets.length > 0" class="space-y-4">

            <div 
              v-for="(bet, index) in virtualsBets"
              :key="bet.id"
              class="group relative bg-gradient-to-r from-purple-50 to-white rounded-lg border border-purple-200 p-4"
            >

              <button 
                @click="removeVirtualBet(index)"
                class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                ✕
              </button>

              <h3 class="font-semibold text-gray-800">
                {{ bet.match }}
              </h3>

              <p class="text-xs text-gray-500">
                {{ bet.league }} • {{ bet.time }}
              </p>

            </div>

          </div>

          <div v-else class="text-center py-12">
            <p class="text-gray-500">
              No virtual bets selected
            </p>
          </div>

        </div>

      </div>


      <!-- FOOTER (NOT SCROLLING) -->
      <div v-if="currentSelectionsCount > 0" class="border-t border-gray-200 bg-gray-50 p-2 flex-shrink-0">

        <div class="flex justify-between items-center bg-emerald-50 p-2 rounded-lg mb-2">
          <span class="text-sm font-medium text-emerald-700">
            Your Balance:
          </span>

          <span class="text-lg font-bold text-emerald-600">
            {{ formatBalance(userBalance) }}
          </span>
        </div>

        <button 
          @click="placeBet"
          :disabled="!canPlaceBet"
          class="w-full py-2 bg-[#0AF0B5] text-white font-bold rounded-lg"
        >
          Place Bet
        </button>

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
</style>