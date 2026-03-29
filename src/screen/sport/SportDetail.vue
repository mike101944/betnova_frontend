<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Get match data from router state or use default
const matchData = ref({
  homeTeam: 'Manchester United',
  awayTeam: 'Liverpool',
  league: 'Premier League',
  eventId: 'match-123',
  time: 'Full Time'
})

// Load match data if passed via router state
onMounted(() => {
  if (route.query.eventId) {
    matchData.value.eventId = route.query.eventId
  }
  if (route.query.homeTeam) {
    matchData.value.homeTeam = route.query.homeTeam
  }
  if (route.query.awayTeam) {
    matchData.value.awayTeam = route.query.awayTeam
  }
  if (route.query.league) {
    matchData.value.league = route.query.league
  }
  
  loadFromLocalStorage()
  window.addEventListener('storage', handleStorageChange)
  window.addEventListener('betslip-update', handleBetslipUpdate)
})

onBeforeUnmount(() => {
  window.removeEventListener('storage', handleStorageChange)
  window.removeEventListener('betslip-update', handleBetslipUpdate)
})

const selectedBets = ref([])

// Custom event for betslip updates
const emitBetslipUpdate = () => {
  const event = new CustomEvent('betslip-update', { 
    detail: selectedBets.value 
  })
  window.dispatchEvent(event)
}

const handleStorageChange = (event) => {
  if (event.key === 'betslip_selections') {
    loadFromLocalStorage()
  }
}

const handleBetslipUpdate = (event) => {
  selectedBets.value = event.detail || []
}

const loadFromLocalStorage = () => {
  const savedBets = localStorage.getItem('betslip_selections')
  if (savedBets) {
    try {
      selectedBets.value = JSON.parse(savedBets)
    } catch (e) {
      console.error('Error parsing saved bets:', e)
    }
  } else {
    selectedBets.value = []
  }
}

const saveToLocalStorage = (bets) => {
  localStorage.setItem('betslip_selections', JSON.stringify(bets))
  emitBetslipUpdate()
}

// Check if a specific selection is selected (using full ID)
const isSelected = (selectionId) => {
  return selectedBets.value.some(bet => bet.id === selectionId)
}

const handleOddsClick = (selectionType, oddsValue, label) => {
  // Create unique ID for this specific selection
  const selectionId = `${matchData.value.eventId}-${selectionType}`
  const existingBetIndex = selectedBets.value.findIndex(
    bet => bet.id === selectionId
  )
  
  let newBets = []
  
  if (existingBetIndex !== -1) {
    // Remove if already selected (toggle off)
    newBets = selectedBets.value.filter((_, index) => index !== existingBetIndex)
  } else {
    // Add new selection (keep all other selections, including other markets for same match)
    const selection = {
      id: selectionId,
      eventId: matchData.value.eventId,
      match: `${matchData.value.homeTeam} vs ${matchData.value.awayTeam}`,
      league: matchData.value.league,
      time: matchData.value.time,
      selection: label || selectionType,
      odds: oddsValue,
      homeTeam: matchData.value.homeTeam,
      awayTeam: matchData.value.awayTeam,
      market: getMarketType(selectionType)
    }
    
    // Don't filter by eventId - allow multiple selections per match
    newBets = [...selectedBets.value, selection]
  }
  
  selectedBets.value = newBets
  saveToLocalStorage(newBets)
}

const getMarketType = (selectionType) => {
  if (selectionType === '1' || selectionType === 'X' || selectionType === '2') return '1X2'
  if (selectionType === '1X' || selectionType === 'X2' || selectionType === '12') return 'Double Chance'
  if (selectionType === 'BTTS_Yes' || selectionType === 'BTTS_No') return 'Both Teams to Score'
  if (selectionType.startsWith('CS_')) return 'Correct Score'
  return 'Other'
}

// Go back to previous page
const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="h-full bg-sky-900 text-white p-4 ">
    <!-- Back Button -->
    <button @click="goBack" class="mb-3 text-amber-100 flex p-2 bg-sky-900 opacity-70 shadow-lg shadow-amber-100 items-center gap-1 text-xs">
      ← Back to Football
    </button>

    <!-- Header / Match Info -->
    <div class="mb-4  text-xs mt-2 text-center">
      <h2 class="text-xs text-amber-100 font-bold">{{ matchData.homeTeam }} vs {{ matchData.awayTeam }}</h2>
      <p class="text-gray-400 text-xs">{{ matchData.league }} • {{ matchData.time }}</p>
    </div>

    <!-- 1. 1X2 / Full Time -->
    <div class="rounded-lg mb-4">
      <div class="flex justify-between items-center mb-2">
        <span class="text-gray-300 font-medium text-xs">1X2 | Full Time</span>
      </div>
      <div class="grid grid-cols-3 gap-3 text-center">
        <div 
          @click="handleOddsClick('1', '1.31', '1')"
          class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex flex-row justify-between items-center"
          :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-1`) }"
        >
          <div class="text-xs text-gray-800">1</div>
          <div class="text-xs font-bold text-gray-800">1.31</div>
        </div>
        <div 
          @click="handleOddsClick('X', '1.2', 'X')"
          class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex flex-row justify-between items-center"
          :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-X`) }"
        >
          <div class="text-xs text-gray-800">X</div>
          <div class="text-xs font-bold text-gray-800">1.20</div>
        </div>
        <div 
          @click="handleOddsClick('2', '3.31', '2')"
          class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex flex-row justify-between items-center"
          :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-2`) }"
        >
          <div class="text-xs text-gray-800">2</div>
          <div class="text-xs font-bold text-gray-800">3.31</div>
        </div>
      </div>
    </div>

    <!-- 2. Double Chance -->
    <div class="rounded-lg mb-4">
      <div class="text-gray-300 font-medium mb-2 text-xs">Double Chance | Full Time</div>
      <div class="grid grid-cols-3 gap-3 text-center">
        <div 
          @click="handleOddsClick('1X', '1.07', '1X')"
          class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex flex-row justify-between items-center"
          :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-1X`) }"
        >
          <div class="text-xs text-gray-800">1X</div>
          <div class="text-xs font-bold text-gray-800">1.07</div>
        </div>
        <div
          @click="handleOddsClick('X2', '3.40', 'X2')"
          class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex flex-row justify-between items-center"
          :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-X2`) }"
        >
          <div class="text-xs text-gray-800">X2</div>
          <div class="text-xs font-bold text-gray-800">3.40</div>
        </div>
        <div 
          @click="handleOddsClick('12', '1.15', '12')"
          class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex flex-row justify-between items-center"
          :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-12`) }"
        >
          <div class="text-xs text-gray-800">12</div>
          <div class="text-xs font-bold text-gray-800">1.15</div>
        </div>
      </div>
    </div>

    <!-- 3. Both Teams To Score -->
    <div class="rounded-lg mb-4">
      <div class="text-gray-300 font-medium mb-2 text-xs">Both Teams To Score | Full Time</div>
      <div class="grid grid-cols-2 gap-3 text-center">
        <div 
          @click="handleOddsClick('BTTS_Yes', '2.48', 'Yes')"
          class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex flex-row justify-between items-center"
          :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-BTTS_Yes`) }"
        >
          <div class="text-xs text-gray-800">Yes</div>
          <div class="text-xs font-bold text-gray-800">2.48</div>
        </div>
        <div 
          @click="handleOddsClick('BTTS_No', '1.54', 'No')"
          class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex flex-row justify-between items-center"
          :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-BTTS_No`) }"
        >
          <div class="text-xs text-gray-800">No</div>
          <div class="text-xs font-bold text-gray-800">1.54</div>
        </div>
      </div>
    </div>

    <!-- 4. Correct Score -->
    <div class="rounded-lg mb-4">
      <div class="text-gray-300 font-medium mb-3 text-xs">Correct Score | Full Time</div>
      <div class="grid grid-cols-3 sm:grid-cols-4 gap-2 text-center">
        <div 
          v-for="score in [
            { label: 'Other', odds: '31.02' }, { label: '0-0', odds: '11.44' },
            { label: '0-1', odds: '20.29' }, { label: '0-2', odds: '72.25' },
            { label: '0-3', odds: '83.33' }, { label: '0-4', odds: '83.33' },
            { label: '0-5', odds: '83.33' }, { label: '0-6', odds: '83.33' },
            { label: '1-0', odds: '5.23' }, { label: '1-1', odds: '9.72' },
            { label: '1-2', odds: '32.82' }, { label: '1-3', odds: '83.33' },
            { label: '1-4', odds: '83.33' }, { label: '1-5', odds: '83.33' },
            { label: '2-0', odds: '4.76' }, { label: '2-1', odds: '8.42' },
            { label: '2-2', odds: '31.25' }, { label: '2-3', odds: '83.33' }
          ]"
          :key="score.label"
          @click="handleOddsClick(`CS_${score.label}`, score.odds, score.label)"
          class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex justify-between items-center"
          :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-CS_${score.label}`) }"
        >
          <div class="text-xs text-gray-950">{{ score.label }}</div>
          <div class="text-xs text-gray-950 font-bold">{{ score.odds }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional custom styles */
</style>