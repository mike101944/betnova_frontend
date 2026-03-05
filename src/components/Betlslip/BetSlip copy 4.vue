<template>
    <div class="h-full flex flex-col bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
      <!-- Debug Info - Remove baada ya kufix -->
      <div class="bg-yellow-100 p-2 text-xs text-black border-b">
        <div>Sports Bets: {{ sportsBets.length }} | Virtual Bets: {{ virtualsBets.length }}</div>
        <div v-if="sportsBets.length > 0" class="font-bold text-green-600">✅ Sports bets zipo!</div>
        <div v-else class="text-red-600">❌ Hakuna sports bets</div>
      </div>
  
      <!-- Fixed Header - Tabs -->
      <div class="flex border-b border-gray-200 bg-gray-50 flex-shrink-0">
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
  
      <!-- Scrollable Content Area -->
      <div class="flex-1 overflow-y-auto min-h-0 bg-white">
        <div class="p-6">
          <!-- Sports Tab -->
          <div v-if="activeTab === 'sports'">
            <!-- ALWAYS SHOW THIS DEBUG SECTION -->
            <div v-if="sportsBets.length > 0" class="mb-4 p-4 bg-green-100 border border-green-500 rounded-lg">
              <h3 class="font-bold text-green-800 mb-2">✅ Selected Bets ({{ sportsBets.length }})</h3>
              <div v-for="(bet, idx) in sportsBets" :key="bet.id" class="border-b border-green-300 py-2 last:border-0">
                <div class="font-semibold">{{ bet.match }}</div>
                <div class="text-sm text-gray-600">{{ bet.league }} • {{ bet.time }}</div>
                <div class="text-emerald-600 font-bold">{{ bet.selection }} @ {{ bet.odds }}</div>
                <button @click="removeSportsBet(idx)" class="text-xs text-red-500 mt-1">Remove</button>
              </div>
            </div>
  
            <!-- Original Content -->
            <div class="space-y-6">
              <!-- Booking Code Input - Inaonekana tu kama hakuna bets -->
              <div v-if="sportsBets.length === 0" class="space-y-4">
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p class="text-sm text-blue-800 mb-3">Load your bets using a booking code</p>
                  <div class="flex gap-2">
                    <input 
                      type="text" 
                      v-model="bookingCode"
                      placeholder="Enter booking code (e.g., ABC123)"
                      class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                      @keyup.enter="loadBookingCode"
                    >
                    <button 
                      @click="loadBookingCode"
                      class="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
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
  
              <!-- Sports Bets List - Original styled version -->
              <div v-else class="space-y-4">
                <div v-for="(bet, index) in sportsBets" :key="bet.id" 
                     class="group relative bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200">
                  <!-- Remove button -->
                  <button @click="removeSportsBet(index)" class="absolute -top-2 -right-2 bg-gray-500 text-red-400 rounded-full p-1 duration-200 shadow-lg">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
  
                  <!-- Match info -->
                  <div class="flex justify-between items-start mb-3">
                    <div>
                      <h3 class="font-semibold text-gray-800">{{ bet.match }}</h3>
                      <p class="text-xs text-gray-500 mt-1">{{ bet.league }} • {{ bet.time }}</p>
                    </div>
                    <span class="bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-1 rounded-full">1X2</span>
                  </div>
  
                  <!-- Selected selection indicator -->
                  <div class="mt-3 flex items-center gap-2">
                    <span class="text-sm text-gray-600">Selected:</span>
                    <span class="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                      {{ bet.selection }} @ {{ bet.odds }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Virtuals Tab -->
          <div v-else class="space-y-6">
            <!-- ALWAYS SHOW THIS DEBUG SECTION FOR VIRTUALS -->
            <div v-if="virtualsBets.length > 0" class="mb-4 p-4 bg-purple-100 border border-purple-500 rounded-lg">
              <h3 class="font-bold text-purple-800 mb-2">✅ Selected Virtual Bets ({{ virtualsBets.length }})</h3>
              <div v-for="(bet, idx) in virtualsBets" :key="bet.id" class="border-b border-purple-300 py-2 last:border-0">
                <div class="font-semibold">{{ bet.match }}</div>
                <div class="text-purple-600 font-bold">{{ bet.selection }} @ {{ bet.odds }}</div>
                <button @click="removeVirtualBet(idx)" class="text-xs text-red-500 mt-1">Remove</button>
              </div>
            </div>
  
            <!-- Original Virtuals Content -->
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
      </div>
  
      <!-- Fixed Bottom Section - Sticky chini -->
      <div class="border-t border-gray-200 bg-gray-50 p-6 flex-shrink-0">
        <!-- Single Stake Input -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Enter Stake Amount</label>
          <div class="flex gap-2">
            <input 
              type="number" 
              v-model="stakeAmount"
              placeholder="e.g., 100"
              class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
              min="1"
              step="1"
            >
            <span class="inline-flex items-center px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-medium">
              Tsh
            </span>
          </div>
        </div>
  
        <!-- Quick Stake Buttons -->
        <div class="flex gap-2 mb-6">
          <button v-for="amount in [100, 500, 1000]" :key="amount"
                  @click="stakeAmount = amount"
                  class="flex-1 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200">
            Tsh {{ amount }}
          </button>
        </div>
  
        <!-- Odds and Returns Summary -->
        <div class="bg-white rounded-lg p-4 mb-4 space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Number of Selections:</span>
            <span class="font-semibold">{{ currentSelectionsCount }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Total Odds:</span>
            <span class="font-bold text-emerald-600 text-lg">{{ currentTotalOdds.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between items-center pt-2 border-t border-gray-200">
            <span class="text-base font-medium">Potential Returns:</span>
            <span class="text-xl font-bold text-emerald-600">Tsh {{ currentTotalReturns.toFixed(2) }}</span>
          </div>
        </div>
  
        <!-- Place Bet Button -->
        <button 
          @click="placeBet"
          :disabled="!canPlaceBet"
          class="w-full py-4 bg-[#0AF0B5] text-white font-bold rounded-lg shadow-lg hover:from-emerald-700 hover:to-emerald-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="activeTab === 'sports'">
            Place Bet ({{ sportsSelections.length }} selections)
          </span>
          <span v-else>
            Place Bet ({{ virtualsSelections.length }} selections)
          </span>
        </button>
  
        <!-- Terms -->
        <p class="text-xs text-gray-500 text-center mt-4">
          By placing a bet, you agree to our <a href="#" class="text-emerald-600 hover:underline">Terms & Conditions</a>
        </p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
  
  // Active tab: 'sports' au 'virtuals'
  const activeTab = ref('sports')
  const bookingCode = ref('')
  const stakeAmount = ref(100)
  
  // Sports Bets - Load from localStorage
  const sportsBets = ref([])
  
  // Virtuals Bets
  const virtualsBets = ref([])
  
  // Load from localStorage on mount
  onMounted(async () => {
    console.log('🔥 BetSlip mounted')
    await loadFromLocalStorage()
    
    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange)
    
    // Poll for changes every second
    const interval = setInterval(() => {
      loadFromLocalStorage()
    }, 1000)
    
    // Clean up
    onBeforeUnmount(() => {
      clearInterval(interval)
      window.removeEventListener('storage', handleStorageChange)
    })
  })
  
  // Handle storage changes
  const handleStorageChange = (event) => {
    if (event.key === 'betslip_selections') {
      console.log('📦 Storage changed, reloading bets...')
      loadFromLocalStorage()
    }
  }
  
  // Save to localStorage whenever sportsBets changes
  watch(sportsBets, (newBets) => {
    console.log('💾 Saving to localStorage:', newBets)
    localStorage.setItem('betslip_selections', JSON.stringify(newBets))
  }, { deep: true })
  
  // Load from localStorage
  const loadFromLocalStorage = async () => {
    const savedBets = localStorage.getItem('betslip_selections')
    console.log('📥 Loading from localStorage:', savedBets)
    
    if (savedBets) {
      try {
        const parsed = JSON.parse(savedBets)
        console.log('✅ Parsed bets:', parsed)
        
        if (JSON.stringify(sportsBets.value) !== JSON.stringify(parsed)) {
          sportsBets.value = parsed
          console.log('🔄 Updated sportsBets:', sportsBets.value)
          await nextTick()
        }
      } catch (e) {
        console.error('❌ Error parsing saved bets:', e)
      }
    } else {
      console.log('📭 No saved bets found')
      sportsBets.value = []
    }
  }
  
  // Computed properties for Sports
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
  
  // Computed properties for Virtuals
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
  
  // Current tab totals
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
    return currentSelectionsCount.value > 0 && parseFloat(stakeAmount.value) > 0
  })
  
  // Methods
  const removeSportsBet = (index) => {
    console.log('🗑️ Removing sports bet at index:', index)
    sportsBets.value.splice(index, 1)
  }
  
  const removeVirtualBet = (index) => {
    console.log('🗑️ Removing virtual bet at index:', index)
    virtualsBets.value.splice(index, 1)
  }
  
  const loadBookingCode = () => {
    if (!bookingCode.value) {
      alert('Please enter a booking code')
      return
    }
    
    alert(`Loading bets for code: ${bookingCode.value}`)
    
    sportsBets.value.push({
      id: Date.now(),
      match: 'Bayern Munich vs Dortmund',
      league: 'Bundesliga',
      time: '21:30 Today',
      odds: '1.85',
      selection: '1'
    })
    
    bookingCode.value = ''
  }
  
  const placeBet = () => {
    if (!canPlaceBet.value) return
    
    const selections = activeTab.value === 'sports' 
      ? sportsSelections.value 
      : virtualsSelections.value
    
    alert(`Placing ${selections.length} selection(s) with stake Tsh ${stakeAmount.value} at total odds ${currentTotalOdds.value.toFixed(2)}`)
  }
  </script>
  
  <style scoped>
  /* Custom animations */
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .group {
    animation: slideIn 0.3s ease-out;
  }
  
  /* Smooth transitions */
  .tab-indicator {
    transition: all 0.2s ease-in-out;
  }
  
  /* Custom scrollbar */
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
  
  /* Ensure content doesn't overflow */
  .flex-1 {
    min-height: 0;
  }
  </style>