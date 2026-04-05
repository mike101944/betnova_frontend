<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
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
  oneX: '1.14',
  xTwo: '1.11',
  oneTwo: '1.17'
})

// BTTS odds
const bttsOdds = ref({
  yes: '1.00',
  no: '1.00'
})

// Correct Score odds
const correctScoreOdds = ref([])

// Debug: Angalia query parameters zilizopokelewa
console.log('Route query parameters:', route.query)

// Function to ensure odds are never 0 or less than 1
const ensureValidOdds = (odds) => {
  if (isNaN(odds) || odds < 1.00) {
    return 1.00
  }
  return Math.round(odds * 100) / 100
}

// Factorial helper function - moved outside
const factorial = (n) => {
  if (n === 0 || n === 1) return 1
  let result = 1
  for (let i = 2; i <= n; i++) {
    result *= i
  }
  return result
}

// Function to calculate Double Chance odds
const calculateDoubleChanceOdds = (homeOdds, drawOdds, awayOdds) => {
  const h = parseFloat(homeOdds)
  const d = parseFloat(drawOdds)
  const a = parseFloat(awayOdds)
  
  // Default values if odds are invalid
  if (isNaN(h) || isNaN(d) || isNaN(a) || h < 1 || d < 1 || a < 1) {
    // Generate random but realistic double chance odds
    const randomFactor = () => 0.9 + Math.random() * 0.6
    return {
      oneX: (1.2 * randomFactor()).toFixed(2),
      xTwo: (1.8 * randomFactor()).toFixed(2),
      oneTwo: (1.1 * randomFactor()).toFixed(2)
    }
  }
  
  // Calculate implied probabilities
  const probHome = 1 / h
  const probDraw = 1 / d
  const probAway = 1 / a
  
  // Double Chance probabilities
  const probOneX = probHome + probDraw
  const probXTwo = probDraw + probAway
  const probOneTwo = probHome + probAway
  
  // Add small random factor for realism (between 0.95 and 1.05)
  const randomFactor = 0.95 + (Math.random() * 0.1)
  
  // Convert back to odds
  let oddsOneX = (1 / probOneX) * randomFactor
  let oddsXTwo = (1 / probXTwo) * randomFactor
  let oddsOneTwo = (1 / probOneTwo) * randomFactor
  
  // Ensure minimum odds of 1.00
  oddsOneX = Math.max(1.00, oddsOneX)
  oddsXTwo = Math.max(1.00, oddsXTwo)
  oddsOneTwo = Math.max(1.00, oddsOneTwo)
  
  // Round to 2 decimal places
  oddsOneX = Math.round(oddsOneX * 100) / 100
  oddsXTwo = Math.round(oddsXTwo * 100) / 100
  oddsOneTwo = Math.round(oddsOneTwo * 100) / 100
  
  return {
    oneX: oddsOneX.toFixed(2),
    xTwo: oddsXTwo.toFixed(2),
    oneTwo: oddsOneTwo.toFixed(2)
  }
}

// Function to calculate BTTS odds
const calculateBTTSOdds = (homeOdds, drawOdds, awayOdds) => {
  const h = parseFloat(homeOdds)
  const d = parseFloat(drawOdds)
  const a = parseFloat(awayOdds)
  
  if (isNaN(h) || isNaN(d) || isNaN(a) || h < 1 || d < 1 || a < 1) {
    // Generate random but realistic BTTS odds
    const randomYes = 1.5 + Math.random() * 1.5
    const randomNo = 1.3 + Math.random() * 1.2
    return {
      yes: randomYes.toFixed(2),
      no: randomNo.toFixed(2)
    }
  }
  
  // Calculate team strengths
  const homeStrength = 1 / h
  const awayStrength = 1 / a
  const drawProb = 1 / d
  
  // Base probability for BTTS
  let probBTTSYes = (homeStrength + awayStrength) * 0.55
  
  // Adjust based on draw probability
  if (drawProb > 0.35) {
    probBTTSYes = probBTTSYes * 0.75
  } else if (drawProb < 0.25) {
    probBTTSYes = probBTTSYes * 1.15
  }
  
  // Add random variation
  probBTTSYes = probBTTSYes * (0.9 + Math.random() * 0.2)
  
  // Keep probability between 0.30 and 0.70
  probBTTSYes = Math.max(0.30, Math.min(0.70, probBTTSYes))
  
  const probBTTSNo = 1 - probBTTSYes
  
  // Add small margin
  const margin = 1.05 + (Math.random() * 0.05)
  
  let oddsYes = (1 / probBTTSYes) * margin
  let oddsNo = (1 / probBTTSNo) * margin
  
  // Ensure minimum odds of 1.00
  oddsYes = Math.max(1.00, oddsYes)
  oddsNo = Math.max(1.00, oddsNo)
  
  // Round to 2 decimal places
  oddsYes = Math.round(oddsYes * 100) / 100
  oddsNo = Math.round(oddsNo * 100) / 100
  
  return {
    yes: oddsYes.toFixed(2),
    no: oddsNo.toFixed(2)
  }
}

// Function to calculate Correct Score odds
const calculateCorrectScoreOdds = (homeOdds, drawOdds, awayOdds) => {
  const h = parseFloat(homeOdds)
  const d = parseFloat(drawOdds)
  const a = parseFloat(awayOdds)
  
  // Base scores list
  const scores = [
    '0-0', '1-0', '0-1', '1-1', '2-0', '0-2', '2-1', '1-2', 
    '2-2', '3-0', '0-3', '3-1', '1-3', '3-2', '2-3', '3-3',
    '4-0', '0-4', '4-1', '1-4', '4-2', '2-4', '4-3', '3-4', '4-4',
    '5-0', '0-5', '5-1', '1-5', '5-2', '2-5', 'Other'
  ]
  
  // If main odds are invalid, generate random odds
  if (isNaN(h) || isNaN(d) || isNaN(a) || h < 1 || d < 1 || a < 1) {
    return scores.map(score => ({
      label: score,
      odds: (5 + Math.random() * 80).toFixed(2)
    }))
  }
  
  // Calculate expected goals based on odds
  const homeWinProb = 1 / h
  const drawProb = 1 / d
  const awayWinProb = 1 / a
  
  // Expected goals (simplified model)
  let expectedHomeGoals = homeWinProb * 2.5 + drawProb * 1.2 + Math.random() * 0.5
  let expectedAwayGoals = awayWinProb * 2.5 + drawProb * 1.2 + Math.random() * 0.5
  
  expectedHomeGoals = Math.max(0.5, Math.min(3.5, expectedHomeGoals))
  expectedAwayGoals = Math.max(0.5, Math.min(3.5, expectedAwayGoals))
  
  // Generate odds for each score
  const scoreOdds = scores.map(score => {
    if (score === 'Other') {
      const otherOdds = 15 + Math.random() * 50
      return {
        label: score,
        odds: Math.max(10, Math.min(100, Math.round(otherOdds * 100) / 100)).toFixed(2)
      }
    }
    
    const [homeScore, awayScore] = score.split('-').map(Number)
    
    // Calculate probability using Poisson distribution
    let homeProb = Math.exp(-expectedHomeGoals) * Math.pow(expectedHomeGoals, homeScore) / factorial(homeScore)
    let awayProb = Math.exp(-expectedAwayGoals) * Math.pow(expectedAwayGoals, awayScore) / factorial(awayScore)
    
    let probability = homeProb * awayProb
    
    // Add some randomness
    probability = probability * (0.7 + Math.random() * 0.6)
    
    // Convert to odds
    let odds = 1 / probability
    
    // Adjust odds based on realism
    if (homeScore === awayScore && homeScore > 1) {
      odds = odds * 1.3
    }
    if (Math.abs(homeScore - awayScore) > 2) {
      odds = odds * 1.2
    }
    
    // Ensure odds are within realistic range
    odds = Math.max(4, Math.min(150, odds))
    odds = Math.round(odds * 100) / 100
    
    return {
      label: score,
      odds: odds.toFixed(2)
    }
  })
  
  // Sort by odds (lowest to highest) and return
  return scoreOdds.sort((a, b) => parseFloat(a.odds) - parseFloat(b.odds))
}

// Generate all derived odds
const generateDerivedOdds = () => {
  const homeOdds = matchData.value.homeOdds
  const drawOdds = matchData.value.drawOdds
  const awayOdds = matchData.value.awayOdds
  
  console.log('Generating odds with:', { homeOdds, drawOdds, awayOdds })
  
  // Calculate Double Chance odds
  doubleChanceOdds.value = calculateDoubleChanceOdds(homeOdds, drawOdds, awayOdds)
  
  // Calculate BTTS odds
  bttsOdds.value = calculateBTTSOdds(homeOdds, drawOdds, awayOdds)
  
  // Calculate Correct Score odds
  correctScoreOdds.value = calculateCorrectScoreOdds(homeOdds, drawOdds, awayOdds)
  
  console.log('Generated Double Chance Odds:', doubleChanceOdds.value)
  console.log('Generated BTTS Odds:', bttsOdds.value)
  console.log('Generated Correct Score Odds count:', correctScoreOdds.value.length)
  console.log('First 3 Correct Score Odds:', correctScoreOdds.value.slice(0, 3))
}

// Watch for changes in main odds
const updateOdds = () => {
  generateDerivedOdds()
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
  
  // Log kwa ajili ya debugging
  console.log('Match Data loaded:', matchData.value)
  
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

// Check if a specific selection is selected
const isSelected = (selectionId) => {
  return selectedBets.value.some(bet => bet.id === selectionId)
}

// Replace selection for this match
const handleOddsClick = (selectionType, oddsValue, label) => {
  const selectionId = `${matchData.value.eventId}-${selectionType}`
  const existingIndex = selectedBets.value.findIndex(bet => bet.id === selectionId)
  
  let newBets = []
  
  if (existingIndex !== -1) {
    newBets = selectedBets.value.filter((_, index) => index !== existingIndex)
  } else {
    const betsWithoutThisMatch = selectedBets.value.filter(
      bet => bet.eventId !== matchData.value.eventId
    )
    
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
      <p class="text-gray-400 text-xs">{{ matchData.league }} </p>
        <p class="text-gray-400 text-xs">{{ matchData.time }} {{ matchData.date }}</p>
    </div>

  

    <!-- 1. 1X2 / Full Time -->
    <div class="rounded-lg mb-4">
      <div class="flex justify-between items-center mb-2">
        <span class="text-gray-300 font-medium text-xs">1X2 | Full Time</span>
      </div>
      <div class="grid grid-cols-3 gap-3 text-center">
        <div 
          @click="handleOddsClick('1', matchData.homeOdds, '1')"
          class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex flex-row justify-between items-center"
          :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-1`) }"
        >
          <div class="text-xs text-gray-800 font-medium">1</div>
          <div class="text-xs font-bold text-gray-800">{{ matchData.homeOdds || '1.00' }}</div>
        </div>
        
        <div 
          @click="handleOddsClick('X', matchData.drawOdds, 'X')"
          class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex flex-row justify-between items-center"
          :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-X`) }"
        >
          <div class="text-xs text-gray-800 font-medium">X</div>
          <div class="text-xs font-bold text-gray-800">{{ matchData.drawOdds || '1.00' }}</div>
        </div>
        
        <div 
          @click="handleOddsClick('2', matchData.awayOdds, '2')"
          class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex flex-row justify-between items-center"
          :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-2`) }"
        >
          <div class="text-xs text-gray-800 font-medium">2</div>
          <div class="text-xs font-bold text-gray-800">{{ matchData.awayOdds || '1.00' }}</div>
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

    <!-- 4. Correct Score - Generated dynamically -->
    <div class="rounded-lg mb-4">
      <div class="text-gray-300 font-medium mb-3 text-xs">Correct Score | Full Time</div>
      <div v-if="correctScoreOdds.length === 0" class="text-center text-gray-400 py-4">
        Loading odds...
      </div>
      <div v-else class="grid grid-cols-3 sm:grid-cols-4 gap-2 text-center">
        <div
          v-for="score in correctScoreOdds"
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