<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Match data - itajazwa kutoka route query
const matchData = ref({
  eventId: '',
  homeTeam: '',
  awayTeam: '',
  league: '',
  time: '',
  date: '',
  homeOdds: '0',
  drawOdds: '0',
  awayOdds: '0'
})

// Double chance odds
const doubleChanceOdds = ref({
  oneX: '0',
  xTwo: '0',
  oneTwo: '0'
})

// BTTS odds
const bttsOdds = ref({
  yes: '0',
  no: '0'
})

// Debug: Angalia query parameters zilizopokelewa
console.log('Route query parameters:', route.query)

// Function to calculate Double Chance odds
const calculateDoubleChanceOdds = (homeOdds, drawOdds, awayOdds) => {
  const h = parseFloat(homeOdds)
  const d = parseFloat(drawOdds)
  const a = parseFloat(awayOdds)
  
  if (isNaN(h) || isNaN(d) || isNaN(a) || h === 0 || d === 0 || a === 0) {
    return { oneX: '0', xTwo: '0', oneTwo: '0' }
  }
  
  // Calculate implied probabilities
  const probHome = 1 / h
  const probDraw = 1 / d
  const probAway = 1 / a
  
  // Double Chance probabilities
  const probOneX = probHome + probDraw  // Home or Draw
  const probXTwo = probDraw + probAway  // Draw or Away
  const probOneTwo = probHome + probAway // Home or Away
  
  // Convert back to odds with margin adjustment
  // Add small margin (1.05) to make odds realistic
  const margin = 1.05
  
  let oddsOneX = (1 / probOneX) * margin
  let oddsXTwo = (1 / probXTwo) * margin
  let oddsOneTwo = (1 / probOneTwo) * margin
  
  // Round to 2 decimal places
  oddsOneX = Math.round(oddsOneX * 100) / 100
  oddsXTwo = Math.round(oddsXTwo * 100) / 100
  oddsOneTwo = Math.round(oddsOneTwo * 100) / 100
  
  return {
    oneX: oddsOneX.toString(),
    xTwo: oddsXTwo.toString(),
    oneTwo: oddsOneTwo.toString()
  }
}

// Function to calculate BTTS odds
const calculateBTTSOdds = (homeOdds, drawOdds, awayOdds) => {
  const h = parseFloat(homeOdds)
  const d = parseFloat(drawOdds)
  const a = parseFloat(awayOdds)
  
  if (isNaN(h) || isNaN(d) || isNaN(a) || h === 0 || d === 0 || a === 0) {
    return { yes: '0', no: '0' }
  }
  
  // Estimate goal expectations based on odds
  // Lower odds = higher chance of winning = more likely to score
  const homeStrength = 1 / h
  const awayStrength = 1 / a
  
  // Probability both teams score (simplified model)
  // If both teams have reasonable chance to win, higher chance of BTTS
  let probBTTSYes = (homeStrength + awayStrength) * 0.6
  
  // Adjust based on draw odds - high draw odds suggest defensive game
  const drawProb = 1 / d
  if (drawProb > 0.35) {
    // High draw probability suggests defensive game, lower BTTS
    probBTTSYes = probBTTSYes * 0.7
  } else if (drawProb < 0.25) {
    // Low draw probability suggests attacking game, higher BTTS
    probBTTSYes = probBTTSYes * 1.2
  }
  
  // Cap probabilities between 0.25 and 0.75
  probBTTSYes = Math.max(0.25, Math.min(0.75, probBTTSYes))
  
  const probBTTSNo = 1 - probBTTSYes
  
  // Convert to odds with margin
  const margin = 1.08
  let oddsYes = (1 / probBTTSYes) * margin
  let oddsNo = (1 / probBTTSNo) * margin
  
  // Round to 2 decimal places
  oddsYes = Math.round(oddsYes * 100) / 100
  oddsNo = Math.round(oddsNo * 100) / 100
  
  return {
    yes: oddsYes.toString(),
    no: oddsNo.toString()
  }
}

// Generate all derived odds
const generateDerivedOdds = () => {
  const homeOdds = matchData.value.homeOdds
  const drawOdds = matchData.value.drawOdds
  const awayOdds = matchData.value.awayOdds
  
  // Calculate Double Chance odds
  doubleChanceOdds.value = calculateDoubleChanceOdds(homeOdds, drawOdds, awayOdds)
  
  // Calculate BTTS odds
  bttsOdds.value = calculateBTTSOdds(homeOdds, drawOdds, awayOdds)
  
  console.log('Generated Double Chance Odds:', doubleChanceOdds.value)
  console.log('Generated BTTS Odds:', bttsOdds.value)
}

// Watch for changes in main odds
const updateOdds = () => {
  if (matchData.value.homeOdds !== '0' && 
      matchData.value.drawOdds !== '0' && 
      matchData.value.awayOdds !== '0') {
    generateDerivedOdds()
  }
}

onMounted(() => {
  // Chukua data zote kutoka query parameters
  if (route.query.eventId) matchData.value.eventId = route.query.eventId
  if (route.query.homeTeam) matchData.value.homeTeam = route.query.homeTeam
  if (route.query.awayTeam) matchData.value.awayTeam = route.query.awayTeam
  if (route.query.league) matchData.value.league = route.query.league
  if (route.query.time) matchData.value.time = route.query.time
  if (route.query.date) matchData.value.date = route.query.date
  
  // HIZI NDIO ZILIKUWA ZINAKOSA - ODDS
  if (route.query.homeOdds) matchData.value.homeOdds = route.query.homeOdds
  if (route.query.drawOdds) matchData.value.drawOdds = route.query.drawOdds
  if (route.query.awayOdds) matchData.value.awayOdds = route.query.awayOdds
  
  // Log kwa ajili ya debugging - Angalia kama odds zimepokeleka
  console.log('Match Data loaded:', matchData.value)
  console.log('Home Odds:', matchData.value.homeOdds)
  console.log('Draw Odds:', matchData.value.drawOdds)
  console.log('Away Odds:', matchData.value.awayOdds)
  
  // Generate derived odds
  updateOdds()
  
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

// NEW LOGIC: Replace selection for this match instead of adding multiple
const handleOddsClick = (selectionType, oddsValue, label) => {
  // Create unique ID for this specific selection
  const selectionId = `${matchData.value.eventId}-${selectionType}`
  
  // Check if this exact selection is already selected
  const existingIndex = selectedBets.value.findIndex(
    bet => bet.id === selectionId
  )
  
  let newBets = []
  
  if (existingIndex !== -1) {
    // If already selected, remove it (toggle off)
    newBets = selectedBets.value.filter((_, index) => index !== existingIndex)
  } else {
    // Remove ANY existing selection for this SAME match (eventId)
    // This ensures only ONE selection per match
    const betsWithoutThisMatch = selectedBets.value.filter(
      bet => bet.eventId !== matchData.value.eventId
    )
    
    // Add the new selection
    const selection = {
      id: selectionId,
      eventId: matchData.value.eventId,
      match: `${matchData.value.homeTeam} vs ${matchData.value.awayTeam}`,
      league: matchData.value.league,
      time: `${matchData.value.time} ${matchData.value.date || ''}`,
      selection: label || selectionType,
      odds: oddsValue,
      homeTeam: matchData.value.homeTeam,
      awayTeam: matchData.value.awayTeam,
      market: getMarketType(selectionType)
    }
    
    newBets = [...betsWithoutThisMatch, selection]
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
  <div class="h-full bg-sky-900 text-white p-4">
    <!-- Back Button -->
    <button @click="goBack" class="mb-3 text-amber-100 flex p-2 bg-sky-900 opacity-70 shadow-lg shadow-amber-100 items-center gap-1 text-xs rounded">
      ← Back to Football
    </button>

    <!-- Header / Match Info -->
    <div class="mb-4 text-xs mt-2 text-center">
      <h2 class="text-sm text-amber-100 font-bold">{{ matchData.homeTeam }} vs {{ matchData.awayTeam }}</h2>
      <p class="text-gray-400 text-xs">{{ matchData.league }}</p>
      <p class="text-gray-400 text-xs">{{ matchData.time }} {{ matchData.date }}</p>
    </div>

  

    <!-- 1. 1X2 / Full Time -->
    <div class="rounded-lg mb-4">
      <div class="flex justify-between items-center mb-2">
        <span class="text-gray-300 font-medium text-xs">1X2 | Full Time</span>
      </div>
      <div class="grid grid-cols-3 gap-3 text-center">
        <!-- Home Odds (1) -->
        <div 
          @click="handleOddsClick('1', matchData.homeOdds, '1')"
          class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex flex-row justify-between items-center"
          :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-1`) }"
        >
          <div class="text-xs text-gray-800 font-medium">1</div>
          <div class="text-xs font-bold text-gray-800">{{ matchData.homeOdds || '0' }}</div>
        </div>
        
        <!-- Draw Odds (X) -->
        <div 
          @click="handleOddsClick('X', matchData.drawOdds, 'X')"
          class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex flex-row justify-between items-center"
          :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-X`) }"
        >
          <div class="text-xs text-gray-800 font-medium">X</div>
          <div class="text-xs font-bold text-gray-800">{{ matchData.drawOdds || '0' }}</div>
        </div>
        
        <!-- Away Odds (2) -->
        <div 
          @click="handleOddsClick('2', matchData.awayOdds, '2')"
          class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex flex-row justify-between items-center"
          :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-2`) }"
        >
          <div class="text-xs text-gray-800 font-medium">2</div>
          <div class="text-xs font-bold text-gray-800">{{ matchData.awayOdds || '0' }}</div>
        </div>
      </div>
    </div>

    <!-- 2. Double Chance - Generated dynamically -->
    <div class="rounded-lg mb-4">
      <div class="text-gray-300 font-medium mb-2 text-xs">Double Chance | Full Time</div>
      <div class="grid grid-cols-3 gap-3 text-center">
        <div 
          @click="handleOddsClick('1X', doubleChanceOdds.oneX, '1X')"
          class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex flex-row justify-between items-center"
          :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-1X`) }"
        >
          <div class="text-xs text-gray-800">1X</div>
          <div class="text-xs font-bold text-gray-800">{{ doubleChanceOdds.oneX }}</div>
        </div>
        <div
          @click="handleOddsClick('X2', doubleChanceOdds.xTwo, 'X2')"
          class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex flex-row justify-between items-center"
          :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-X2`) }"
        >
          <div class="text-xs text-gray-800">X2</div>
          <div class="text-xs font-bold text-gray-800">{{ doubleChanceOdds.xTwo }}</div>
        </div>
        <div 
          @click="handleOddsClick('12', doubleChanceOdds.oneTwo, '12')"
          class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex flex-row justify-between items-center"
          :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-12`) }"
        >
          <div class="text-xs text-gray-800">12</div>
          <div class="text-xs font-bold text-gray-800">{{ doubleChanceOdds.oneTwo }}</div>
        </div>
      </div>
    </div>

    <!-- 3. Both Teams To Score - Generated dynamically -->
    <div class="rounded-lg mb-4">
      <div class="text-gray-300 font-medium mb-2 text-xs">Both Teams To Score | Full Time</div>
      <div class="grid grid-cols-2 gap-3 text-center">
        <div 
          @click="handleOddsClick('BTTS_Yes', bttsOdds.yes, 'Yes')"
          class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex flex-row justify-between items-center"
          :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-BTTS_Yes`) }"
        >
          <div class="text-xs text-gray-800">Yes</div>
          <div class="text-xs font-bold text-gray-800">{{ bttsOdds.yes }}</div>
        </div>
        <div 
          @click="handleOddsClick('BTTS_No', bttsOdds.no, 'No')"
          class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex flex-row justify-between items-center"
          :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-BTTS_No`) }"
        >
          <div class="text-xs text-gray-800">No</div>
          <div class="text-xs font-bold text-gray-800">{{ bttsOdds.no }}</div>
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
</style>