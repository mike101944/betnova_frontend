<template>
    <div class="settled-detail-container min-h-screen bg-gray-50">
      <!-- Header with Gradient -->
      <div class="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-6">
        <div class="max-w-3xl mx-auto">
          <!-- Back Button -->
          <button @click="router.back()" class="mb-4 flex items-center text-white/90 hover:text-white">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>
  
          <!-- Header Content -->
          <div class="flex justify-between items-start">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/20 rounded-full px-3 py-1">
    <span class="text-sm font-semibold">BET ID: #{{ bet?.id?.toString().slice(0,10) }}</span>
  </div>
               
              </div>
            </div>
            <TrophyIcon class="w-12 h-12 text-white/30" />
          </div>
        </div>
      </div>
  
      <!-- Main Content -->
      <div class="max-w-3xl mx-auto px-4 py-6">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
        </div>
  
        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 rounded-2xl p-8 text-center">
          <div class="text-red-500 text-5xl mb-4">⚠️</div>
          <p class="text-red-700 font-medium mb-2">Failed to load bet details</p>
          <p class="text-sm text-red-500 mb-4">{{ error }}</p>
          <button @click="fetchBetDetails" class="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700">
            Try Again
          </button>
        </div>
  
        <!-- Bet Details Content -->
        <div v-else-if="bet" class="space-y-4">
          <!-- Congratulations Banner -->
          <div class="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium opacity-90 mb-1">CONGRATULATIONS!</p>
                <h2 class="text-3xl font-bold mb-2">WINNING BIG</h2>
                <p class="text-4xl font-black">{{ formatCurrency(bet.potentialReturn) }}</p>
              </div>
              <TrophyIcon class="w-20 h-20 text-white/30" />
            </div>
          </div>
  
          <!-- Stats Card -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Bet Summary</h3>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gray-50 rounded-xl p-4">
                <p class="text-sm text-gray-500 mb-1">Total Odds</p>
                <p class="text-2xl font-bold text-yellow-600">{{ Number(bet.totalOdds).toFixed(2) }}</p>
              </div>
              
              <div class="bg-gray-50 rounded-xl p-4">
                <p class="text-sm text-gray-500 mb-1">Stake</p>
                <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(bet.stake) }}</p>
              </div>
              
              <div class="bg-gray-50 rounded-xl p-4">
                <p class="text-sm text-gray-500 mb-1">Potential Win</p>
                <p class="text-2xl font-bold text-green-600">{{ formatCurrency(bet.potentialWin || bet.potentialReturn) }}</p>
              </div>
              
              <div class="bg-gray-50 rounded-xl p-4">
                <p class="text-sm text-gray-500 mb-1">Tax (12%)</p>
                <p class="text-2xl font-bold text-red-500">{{ formatCurrency(calculateTax(bet)) }}</p>
              </div>
            </div>
            
            <div class="mt-4 pt-4 border-t border-gray-200">
              <div class="flex justify-between items-center">
                <span class="text-lg font-semibold text-gray-900">Final Payout</span>
                <span class="text-2xl font-black text-green-600">{{ formatCurrency(calculateFinalPayout(bet)) }}</span>
              </div>
            </div>
          </div>
  
          <!-- Share Button -->
          <button class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all">
            SHARE YOUR WIN 🎉
          </button>
  
          <!-- Selections -->
          <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 class="font-bold text-gray-900">Selections</h3>
            </div>
            
            <div class="divide-y divide-gray-200">
              <div v-for="(selection, index) in parsedSelections" :key="index" class="p-6">
                <div class="flex items-start justify-between mb-2">
                  <div>
                    <p class="font-bold text-gray-900">{{ selection.match || selection.event || selection.homeTeam + ' vs ' + selection.awayTeam }}</p>
                    <p class="text-sm text-gray-500 mt-1">{{ selection.league || selection.tournament }}</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">WON</span>
                    <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">✅</span>
                  </div>
                </div>
                
                <div class="flex flex-wrap items-center gap-4 text-sm">
                  <div>
                    <span class="text-gray-500">Prediction:</span>
                    <span class="ml-1 font-medium text-gray-900">{{ selection.prediction }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500">Odds:</span>
                    <span class="ml-1 font-bold text-yellow-600">{{ selection.odds }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500">Result:</span>
                    <span class="ml-1 font-medium text-gray-900">{{ selection.result }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Footer Status -->
          <div class="flex items-center justify-between bg-white rounded-2xl shadow-lg px-6 py-4">
            <div class="flex items-center gap-2">
              <CheckCircleIcon class="w-5 h-5 text-green-500" />
              <span class="text-gray-600">Bet Placed</span>
            </div>
            <div class="flex items-center gap-2">
              <CheckCircleIcon class="w-5 h-5 text-green-500" />
              <span class="text-gray-600">Matches Played</span>
            </div>
            <div class="flex items-center gap-2">
              <TrophyIcon class="w-5 h-5 text-yellow-500" />
              <span class="text-gray-600">🏆</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { TrophyIcon, CheckCircleIcon } from '@heroicons/vue/24/solid'
  import { useBets } from '../composables/useBets'
  
  const route = useRoute()
  const router = useRouter()
  const { getBetDetails, formatCurrency, allBets } = useBets()
  
  const bet = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  
  // Parse selections from JSON string
  const parsedSelections = computed(() => {
    if (!bet.value?.selections) return []
    
    try {
      // If selections is already an array
      if (Array.isArray(bet.value.selections)) {
        return bet.value.selections
      }
      
      // If it's a string, try to parse it
      if (typeof bet.value.selections === 'string') {
        const parsed = JSON.parse(bet.value.selections)
        return Array.isArray(parsed) ? parsed : []
      }
      
      // If it's an object with selections property
      if (bet.value.selections.selections) {
        return Array.isArray(bet.value.selections.selections) 
          ? bet.value.selections.selections 
          : []
      }
      
      return []
    } catch (e) {
      console.error('Error parsing selections:', e)
      return []
    }
  })
  
  // Calculate 12% tax
  const calculateTax = (bet) => {
    const potentialWin = Number(bet.potentialWin || bet.potentialReturn || 0)
    return Math.round(potentialWin * 0.12)
  }
  
  // Calculate final payout after tax
  const calculateFinalPayout = (bet) => {
    const potentialWin = Number(bet.potentialWin || bet.potentialReturn || 0)
    return potentialWin - calculateTax(bet)
  }
  
  // Fetch bet details
  const fetchBetDetails = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const betId = route.params.id
      
      if (!betId) {
        throw new Error('No bet ID provided')
      }
      
      // Try to get bet from router state first
      if (route.state?.currentBet) {
        console.log('Using bet from router state')
        bet.value = route.state.currentBet
      } else {
        // Try to find bet in allBets if already loaded
        if (allBets.value && allBets.value.length > 0) {
          console.log('Searching in allBets')
          const foundBet = allBets.value.find(b => b.id.toString() === betId.toString())
          if (foundBet) {
            bet.value = foundBet
          }
        }
        
        // If not found, fetch from API
        if (!bet.value) {
          console.log('Fetching from API')
          const betData = await getBetDetails(betId)
          if (betData) {
            bet.value = betData
          } else {
            throw new Error('Bet not found')
          }
        }
      }
      
      console.log('Bet loaded:', bet.value)
      
    } catch (err) {
      console.error('Error fetching bet:', err)
      error.value = err.message || 'Failed to load bet details'
    } finally {
      isLoading.value = false
    }
  }
  
  onMounted(() => {
    fetchBetDetails()
  })
  </script>
  
  <style scoped>
  .settled-detail-container {
    min-height: 100vh;
  }
  
  /* Smooth transitions */
  .settled-detail-container * {
    transition: all 0.2s ease;
  }
  
  /* Custom scrollbar */
  .settled-detail-container::-webkit-scrollbar {
    width: 6px;
  }
  
  .settled-detail-container::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  .settled-detail-container::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 10px;
  }
  
  .settled-detail-container::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
  </style>