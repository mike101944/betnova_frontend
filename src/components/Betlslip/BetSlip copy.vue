<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <!-- Header -->
      <div class="max-w-2xl mx-auto mb-6">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800">Bet Slip</h1>
        <p class="text-gray-600 mt-1">Review and place your bets</p>
      </div>
  
      <!-- Main Bet Slip Card -->
      <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
        <!-- Tabs Header - Sports na Virtuals -->
        <div class="flex border-b border-gray-200 bg-gray-50">
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
        <div class="p-6">
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
  
            <!-- Sports Bets List -->
            <div v-else class="space-y-4">
              <div v-for="(bet, index) in sportsBets" :key="index" 
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
  
              
  
                <!-- Selected selection indicator (without stake input) -->
                <div v-if="bet.selected" class="mt-3 flex items-center gap-2">
                  <span class="text-sm text-gray-600">Selected:</span>
                  <span class="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                    {{ bet.selected }} @ {{ getSelectedOdds(bet) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Virtuals Tab -->
          <div v-else class="space-y-6">
            <!-- Virtuals Bets List -->
            <div v-if="virtualsBets.length > 0" class="space-y-4">
              <div v-for="(bet, index) in virtualsBets" :key="index" 
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
  
                <!-- Virtual Selections -->
                <div class="grid grid-cols-3 gap-2">
                  <button 
                    @click="selectVirtualOption(bet, '1')"
                    class="py-2 px-3 border rounded-lg text-sm font-medium transition-all duration-200"
                    :class="bet.selected === '1' 
                      ? 'bg-purple-600 text-white border-purple-600' 
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'"
                  >
                    <div class="flex flex-col items-center">
                      <span class="text-xs">1</span>
                      <span class="text-xs font-bold">{{ bet.odds.home }}</span>
                    </div>
                  </button>
                  <button 
                    @click="selectVirtualOption(bet, 'X')"
                    class="py-2 px-3 border rounded-lg text-sm font-medium transition-all duration-200"
                    :class="bet.selected === 'X' 
                      ? 'bg-purple-600 text-white border-purple-600' 
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'"
                  >
                    <div class="flex flex-col items-center">
                      <span class="text-xs">X</span>
                      <span class="text-xs font-bold">{{ bet.odds.draw }}</span>
                    </div>
                  </button>
                  <button 
                    @click="selectVirtualOption(bet, '2')"
                    class="py-2 px-3 border rounded-lg text-sm font-medium transition-all duration-200"
                    :class="bet.selected === '2' 
                      ? 'bg-purple-600 text-white border-purple-600' 
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'"
                  >
                    <div class="flex flex-col items-center">
                      <span class="text-xs">2</span>
                      <span class="text-xs font-bold">{{ bet.odds.away }}</span>
                    </div>
                  </button>
                </div>
  
                <!-- Selected selection indicator -->
                <div v-if="bet.selected" class="mt-3 flex items-center gap-2">
                  <span class="text-sm text-gray-600">Selected:</span>
                  <span class="text-sm font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
                    {{ bet.selected }} @ {{ getSelectedOdds(bet) }}
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
        <div class="border-t border-gray-200 bg-gray-50 p-6">
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
            class="w-full py-4  bg-[#0AF0B5] text-white font-bold rounded-lg shadow-lg hover:from-emerald-700 hover:to-emerald-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="activeTab === 'sports'">
              Place  Bet ({{ sportsBets.filter(b => b.selected).length }} selections)
            </span>
            <span v-else>
              Place Bet ({{ virtualsBets.filter(b => b.selected).length }} selections)
            </span>
          </button>
  
          <!-- Terms -->
          <p class="text-xs text-gray-500 text-center mt-4">
            By placing a bet, you agree to our <a href="#" class="text-emerald-600 hover:underline">Terms & Conditions</a>
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  
  // Active tab: 'sports' au 'virtuals'
  const activeTab = ref('sports')
  const bookingCode = ref('')
  const stakeAmount = ref(100) // Single stake for all selections
  
  // Sports Bets
  const sportsBets = ref([
    {
      id: 1,
      match: 'Manchester United vs Liverpool',
      league: 'Premier League',
      time: '20:45 Today',
      odds: { home: '2.10', draw: '3.40', away: '3.20' },
      selected: '1'
    },
    {
      id: 2,
      match: 'Arsenal vs Chelsea',
      league: 'Premier League',
      time: '18:30 Today',
      odds: { home: '2.05', draw: '3.30', away: '3.50' },
      selected: 'X'
    },
    {
      id: 3,
      match: 'Real Madrid vs Barcelona',
      league: 'La Liga',
      time: '21:00 Today',
      odds: { home: '1.95', draw: '3.60', away: '3.80' },
      selected: null
    }
  ])
  
  // Virtuals Bets
  const virtualsBets = ref([
    {
      id: 101,
      match: 'Virtual Madrid vs Virtual Barcelona',
      league: 'Virtual La Liga',
      time: 'Match 45 • 90 mins',
      odds: { home: '1.95', draw: '3.60', away: '3.80' },
      selected: '1'
    },
    {
      id: 102,
      match: 'Virtual United vs Virtual City',
      league: 'Virtual Premier League',
      time: 'Match 32 • 90 mins',
      odds: { home: '2.10', draw: '3.40', away: '3.20' },
      selected: null
    }
  ])
  
  // Helper function to get selected odds
  const getSelectedOdds = (bet) => {
    if (!bet.selected) return '0'
    return bet.selected === '1' ? bet.odds.home :
           bet.selected === 'X' ? bet.odds.draw :
           bet.odds.away
  }
  
  // Computed properties for Sports
  const sportsSelections = computed(() => {
    return sportsBets.value.filter(bet => bet.selected)
  })
  
  const totalSportsOdds = computed(() => {
    const selected = sportsSelections.value
    if (selected.length === 0) return 0
    
    return selected.reduce((product, bet) => {
      const odds = parseFloat(getSelectedOdds(bet))
      return product * odds
    }, 1)
  })
  
  const totalSportsReturns = computed(() => {
    return (parseFloat(stakeAmount.value) || 0) * totalSportsOdds.value
  })
  
  // Computed properties for Virtuals
  const virtualsSelections = computed(() => {
    return virtualsBets.value.filter(bet => bet.selected)
  })
  
  const totalVirtualsOdds = computed(() => {
    const selected = virtualsSelections.value
    if (selected.length === 0) return 0
    
    return selected.reduce((product, bet) => {
      const odds = parseFloat(getSelectedOdds(bet))
      return product * odds
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
  const selectBetOption = (bet, option) => {
    if (bet.selected === option) {
      bet.selected = null
    } else {
      bet.selected = option
    }
  }
  
  const selectVirtualOption = (bet, option) => {
    selectBetOption(bet, option)
  }
  
  const removeSportsBet = (index) => {
    sportsBets.value.splice(index, 1)
  }
  
  const removeVirtualBet = (index) => {
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
      odds: { home: '1.85', draw: '3.60', away: '4.20' },
      selected: null
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
  </style>