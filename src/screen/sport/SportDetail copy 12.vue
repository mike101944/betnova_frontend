<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Match data
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
  oneX: '1.1',
  xTwo: '0',
  oneTwo: '0'
})

// BTTS odds
const bttsOdds = ref({
  yes: '0',
  no: '0'
})

// Over/Under odds
const overUnderOdds = ref({
  over05: '0',
  under05: '0',
  over15: '0',
  under15: '0',
  over25: '0',
  under25: '0',
  over35: '0',
  under35: '0',
  over45: '0',
  under45: '0'
})

// Correct Score odds
const correctScoreOdds = ref([])

console.log('Route query parameters:', route.query)

// Calculate Double Chance odds using proper betting formula
const calculateDoubleChanceOdds = (homeOdds, drawOdds, awayOdds) => {
  const h = parseFloat(homeOdds)
  const d = parseFloat(drawOdds)
  const a = parseFloat(awayOdds)
  
  if (isNaN(h) || isNaN(d) || isNaN(a) || h <= 1 || d <= 1 || a <= 1) {
    return { oneX: '1.30', xTwo: '1.60', oneTwo: '1.33' }
  }
  
  // Formula ya Double Chance: (1/odds1 + 1/odds2) then convert back to odds
  // 1X = Home or Draw
  let oneXProb = (1 / h) + (1 / d)
  let oneXOdds = (1 / oneXProb)
  
  // X2 = Draw or Away
  let xTwoProb = (1 / d) + (1 / a)
  let xTwoOdds = (1 / xTwoProb)
  
  // 12 = Home or Away
  let oneTwoProb = (1 / h) + (1 / a)
  let oneTwoOdds = (1 / oneTwoProb)
  
  // Round to 2 decimal places
  oneXOdds = Math.round(oneXOdds * 100) / 100
  xTwoOdds = Math.round(xTwoOdds * 100) / 100
  oneTwoOdds = Math.round(oneTwoOdds * 100) / 100
  
  return {
    oneX: oneXOdds.toFixed(2),
    xTwo: xTwoOdds.toFixed(2),
    oneTwo: oneTwoOdds.toFixed(2)
  }
}

// Calculate BTTS odds based on main odds
const calculateBTTSOdds = (homeOdds, drawOdds, awayOdds) => {
  const h = parseFloat(homeOdds)
  const d = parseFloat(drawOdds)
  const a = parseFloat(awayOdds)
  
  if (isNaN(h) || isNaN(d) || isNaN(a) || h <= 1 || d <= 1 || a <= 1) {
    return { yes: '1.90', no: '1.90' }
  }
  
  // Calculate implied probabilities
  const probHome = 1 / h
  const probDraw = 1 / d
  const probAway = 1 / a
  
  // Estimate expected goals
  const expectedHomeGoals = probHome * 2.5 + probDraw * 1.2
  const expectedAwayGoals = probAway * 2.5 + probDraw * 1.2
  
  // Probability of BTTS Yes using Poisson approximation
  // P(BTTS) = P(Home scores at least 1) * P(Away scores at least 1)
  const probHomeScores = 1 - Math.exp(-expectedHomeGoals)
  const probAwayScores = 1 - Math.exp(-expectedAwayGoals)
  
  let probYes = probHomeScores * probAwayScores
  
  // Adjust based on league/game characteristics
  if (probDraw > 0.35) {
    probYes = probYes * 0.85
  } else if (probDraw < 0.25) {
    probYes = probYes * 1.1
  }
  
  // Keep probability within realistic range
  probYes = Math.max(0.35, Math.min(0.65, probYes))
  const probNo = 1 - probYes
  
  // Convert to odds
  let oddsYes = 1 / probYes
  let oddsNo = 1 / probNo
  
  // Add small margin
  oddsYes = oddsYes * 1.05
  oddsNo = oddsNo * 1.05
  
  oddsYes = Math.round(oddsYes * 100) / 100
  oddsNo = Math.round(oddsNo * 100) / 100
  
  return {
    yes: oddsYes.toFixed(2),
    no: oddsNo.toFixed(2)
  }
}

// Calculate Over/Under odds
const calculateOverUnderOdds = (homeOdds, drawOdds, awayOdds) => {
  const h = parseFloat(homeOdds)
  const d = parseFloat(drawOdds)
  const a = parseFloat(awayOdds)
  
  if (isNaN(h) || isNaN(d) || isNaN(a) || h <= 1 || d <= 1 || a <= 1) {
    return {
      over05: '1.10', under05: '5.89',
      over15: '1.53', under15: '2.34',
      over25: '2.65', under25: '1.42',
      over35: '5.11', under35: '1.13',
      over45: '9.83', under45: '1.02'
    }
  }
  
  // Calculate expected goals based on odds
  const probHome = 1 / h
  const probDraw = 1 / d
  const probAway = 1 / a
  
  // Expected goals
  let expectedGoals = (probHome * 2.2) + (probDraw * 1.3) + (probAway * 2.0)
  expectedGoals = Math.max(1.5, Math.min(3.5, expectedGoals))
  
  // Poisson probabilities for different goal lines
  const poisson = (lambda, k) => {
    return Math.exp(-lambda) * Math.pow(lambda, k) / (k === 0 ? 1 : (k === 1 ? 1 : (k === 2 ? 2 : (k === 3 ? 6 : (k === 4 ? 24 : 120)))))
  }
  
  // Calculate probabilities for different totals
  let probOver05 = 1 - poisson(expectedGoals, 0)
  let probOver15 = 1 - (poisson(expectedGoals, 0) + poisson(expectedGoals, 1))
  let probOver25 = 1 - (poisson(expectedGoals, 0) + poisson(expectedGoals, 1) + poisson(expectedGoals, 2))
  let probOver35 = 1 - (poisson(expectedGoals, 0) + poisson(expectedGoals, 1) + poisson(expectedGoals, 2) + poisson(expectedGoals, 3))
  let probOver45 = 1 - (poisson(expectedGoals, 0) + poisson(expectedGoals, 1) + poisson(expectedGoals, 2) + poisson(expectedGoals, 3) + poisson(expectedGoals, 4))
  
  // Add market bias (odds slightly favor under in many markets)
  const margin = 1.06
  
  let oddsOver05 = (1 / probOver05) * margin
  let oddsUnder05 = (1 / (1 - probOver05)) * margin
  
  let oddsOver15 = (1 / probOver15) * margin
  let oddsUnder15 = (1 / (1 - probOver15)) * margin
  
  let oddsOver25 = (1 / probOver25) * margin
  let oddsUnder25 = (1 / (1 - probOver25)) * margin
  
  let oddsOver35 = (1 / probOver35) * margin
  let oddsUnder35 = (1 / (1 - probOver35)) * margin
  
  let oddsOver45 = (1 / probOver45) * margin
  let oddsUnder45 = (1 / (1 - probOver45)) * margin
  
  // Round to 2 decimals
  return {
    over05: Math.round(oddsOver05 * 100) / 100,
    under05: Math.round(oddsUnder05 * 100) / 100,
    over15: Math.round(oddsOver15 * 100) / 100,
    under15: Math.round(oddsUnder15 * 100) / 100,
    over25: Math.round(oddsOver25 * 100) / 100,
    under25: Math.round(oddsUnder25 * 100) / 100,
    over35: Math.round(oddsOver35 * 100) / 100,
    under35: Math.round(oddsUnder35 * 100) / 100,
    over45: Math.round(oddsOver45 * 100) / 100,
    under45: Math.round(oddsUnder45 * 100) / 100
  }
}

// Calculate Correct Score odds
const calculateCorrectScoreOdds = (homeOdds, drawOdds, awayOdds) => {
  const h = parseFloat(homeOdds)
  const d = parseFloat(drawOdds)
  const a = parseFloat(awayOdds)
  
  const scores = [
    '0-0', '1-0', '0-1', '1-1', '2-0', '0-2', '2-1', '1-2',
    '2-2', '3-0', '0-3', '3-1', '1-3', '3-2', '2-3', 'Other'
  ]
  
  if (isNaN(h) || isNaN(d) || isNaN(a) || h <= 1 || d <= 1 || a <= 1) {
    return scores.map(score => ({
      label: score,
      odds: (Math.random() * 50 + 5).toFixed(2)
    }))
  }
  
  const probHome = 1 / h
  const probDraw = 1 / d
  const probAway = 1 / a
  
  // Expected goals
  let expectedHomeGoals = probHome * 2.0 + probDraw * 1.0
  let expectedAwayGoals = probAway * 2.0 + probDraw * 1.0
  
  expectedHomeGoals = Math.max(0.3, Math.min(2.5, expectedHomeGoals))
  expectedAwayGoals = Math.max(0.3, Math.min(2.5, expectedAwayGoals))
  
  const poissonProb = (lambda, k) => {
    if (k === 0) return Math.exp(-lambda)
    if (k === 1) return Math.exp(-lambda) * lambda
    if (k === 2) return Math.exp(-lambda) * lambda * lambda / 2
    if (k === 3) return Math.exp(-lambda) * lambda * lambda * lambda / 6
    return Math.exp(-lambda) * Math.pow(lambda, k) / 120
  }
  
  const scoreOdds = scores.map(score => {
    if (score === 'Other') {
      return { label: score, odds: (20 + Math.random() * 30).toFixed(2) }
    }
    
    const [homeScore, awayScore] = score.split('-').map(Number)
    let probability = poissonProb(expectedHomeGoals, homeScore) * poissonProb(expectedAwayGoals, awayScore)
    
    if (probability < 0.001) probability = 0.001
    
    let odds = 1 / probability
    odds = Math.min(150, Math.max(4, odds))
    odds = Math.round(odds * 100) / 100
    
    return { label: score, odds: odds.toFixed(2) }
  })
  
  return scoreOdds.sort((a, b) => parseFloat(a.odds) - parseFloat(b.odds))
}

// Generate all odds
const generateAllOdds = () => {
  const homeOdds = matchData.value.homeOdds
  const drawOdds = matchData.value.drawOdds
  const awayOdds = matchData.value.awayOdds
  
  console.log('Generating odds with:', { homeOdds, drawOdds, awayOdds })
  
  doubleChanceOdds.value = calculateDoubleChanceOdds(homeOdds, drawOdds, awayOdds)
  bttsOdds.value = calculateBTTSOdds(homeOdds, drawOdds, awayOdds)
  overUnderOdds.value = calculateOverUnderOdds(homeOdds, drawOdds, awayOdds)
  correctScoreOdds.value = calculateCorrectScoreOdds(homeOdds, drawOdds, awayOdds)
  
  console.log('Double Chance:', doubleChanceOdds.value)
  console.log('BTTS:', bttsOdds.value)
  console.log('Over/Under:', overUnderOdds.value)
}

onMounted(() => {
  if (route.query.eventId) matchData.value.eventId = route.query.eventId
  if (route.query.homeTeam) matchData.value.homeTeam = route.query.homeTeam
  if (route.query.awayTeam) matchData.value.awayTeam = route.query.awayTeam
  if (route.query.league) matchData.value.league = route.query.league
  if (route.query.time) matchData.value.time = route.query.time
  if (route.query.date) matchData.value.date = route.query.date
  if (route.query.homeOdds) matchData.value.homeOdds = route.query.homeOdds
  if (route.query.drawOdds) matchData.value.drawOdds = route.query.drawOdds
  if (route.query.awayOdds) matchData.value.awayOdds = route.query.awayOdds
  
  generateAllOdds()
  
  loadFromLocalStorage()
  window.addEventListener('storage', handleStorageChange)
  window.addEventListener('betslip-update', handleBetslipUpdate)
})

onBeforeUnmount(() => {
  window.removeEventListener('storage', handleStorageChange)
  window.removeEventListener('betslip-update', handleBetslipUpdate)
})

const selectedBets = ref([])

const emitBetslipUpdate = () => {
  const event = new CustomEvent('betslip-update', { detail: selectedBets.value })
  window.dispatchEvent(event)
}

const handleStorageChange = (event) => {
  if (event.key === 'betslip_selections') loadFromLocalStorage()
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

const isSelected = (selectionId) => {
  return selectedBets.value.some(bet => bet.id === selectionId)
}

const handleOddsClick = (selectionType, oddsValue, label) => {
  const selectionId = `${matchData.value.eventId}-${selectionType}`
  const existingIndex = selectedBets.value.findIndex(bet => bet.id === selectionId)
  
  let newBets = []
  
  if (existingIndex !== -1) {
    newBets = selectedBets.value.filter((_, index) => index !== existingIndex)
  } else {
    const betsWithoutThisMatch = selectedBets.value.filter(bet => bet.eventId !== matchData.value.eventId)
    
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
  if (selectionType.startsWith('OU_')) return 'Over/Under'
  if (selectionType.startsWith('CS_')) return 'Correct Score'
  return 'Other'
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="h-full bg-sky-900 text-white p-4 overflow-y-auto">
    <!-- Back Button -->
    <button @click="goBack" class="mb-3 text-amber-100 flex p-2 bg-sky-900 opacity-70 shadow-lg shadow-amber-100 items-center gap-1 text-xs rounded">
      ← Back to Football
    </button>

    <!-- Header -->
    <div class="mb-4 text-xs mt-2 text-center">
      <h2 class="text-sm text-amber-100 font-bold">{{ matchData.homeTeam }} vs {{ matchData.awayTeam }}</h2>
      <p class="text-gray-400 text-xs">{{ matchData.league }} • {{ matchData.time }} {{ matchData.date }}</p>
    </div>

    <!-- Warning -->
    <div v-if="selectedBets.some(bet => bet.eventId === matchData.eventId)" 
         class="mb-3 p-2 bg-yellow-500/20 border border-yellow-500 rounded text-xs text-center text-yellow-200">
      ⚠️ You have selected a pick for this match. Select another to replace it.
    </div>

    <!-- 1. 1X2 -->
    <div class="rounded-lg mb-4">
      <div class="flex justify-between items-center mb-2">
        <span class="text-gray-300 font-medium text-xs">1X2 | Full Time</span>
      </div>
      <div class="grid grid-cols-3 gap-3 text-center">
        <div @click="handleOddsClick('1', matchData.homeOdds, '1')"
          class="cursor-pointer bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded p-2 flex justify-between items-center"
          :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-1`) }">
          <div class="text-xs text-gray-800 font-medium">1</div>
          <div class="text-xs font-bold text-gray-800">{{ matchData.homeOdds || '0' }}</div>
        </div>
        <div @click="handleOddsClick('X', matchData.drawOdds, 'X')"
          class="cursor-pointer bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded p-2 flex justify-between items-center"
          :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-X`) }">
          <div class="text-xs text-gray-800 font-medium">X</div>
          <div class="text-xs font-bold text-gray-800">{{ matchData.drawOdds || '0' }}</div>
        </div>
        <div @click="handleOddsClick('2', matchData.awayOdds, '2')"
          class="cursor-pointer bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded p-2 flex justify-between items-center"
          :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-2`) }">
          <div class="text-xs text-gray-800 font-medium">2</div>
          <div class="text-xs font-bold text-gray-800">{{ matchData.awayOdds || '0' }}</div>
        </div>
      </div>
    </div>

    <!-- 2. Double Chance -->
    <div class="rounded-lg mb-4">
      <div class="text-gray-300 font-medium mb-2 text-xs">Double Chance | Full Time</div>
      <div class="grid grid-cols-3 gap-3 text-center">
        <div @click="handleOddsClick('1X', doubleChanceOdds.oneX, '1X')"
          class="cursor-pointer bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded p-2 flex justify-between items-center"
          :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-1X`) }">
          <div class="text-xs text-gray-800">1X</div>
          <div class="text-xs font-bold text-gray-800">{{ doubleChanceOdds.oneX }}</div>
        </div>
        <div @click="handleOddsClick('X2', doubleChanceOdds.xTwo, 'X2')"
          class="cursor-pointer bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded p-2 flex justify-between items-center"
          :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-X2`) }">
          <div class="text-xs text-gray-800">X2</div>
          <div class="text-xs font-bold text-gray-800">{{ doubleChanceOdds.xTwo }}</div>
        </div>
        <div @click="handleOddsClick('12', doubleChanceOdds.oneTwo, '12')"
          class="cursor-pointer bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded p-2 flex justify-between items-center"
          :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-12`) }">
          <div class="text-xs text-gray-800">12</div>
          <div class="text-xs font-bold text-gray-800">{{ doubleChanceOdds.oneTwo }}</div>
        </div>
      </div>
    </div>

    <!-- 3. BTTS -->
    <div class="rounded-lg mb-4">
      <div class="text-gray-300 font-medium mb-2 text-xs">Both Teams To Score | Full Time</div>
      <div class="grid grid-cols-2 gap-3 text-center">
        <div @click="handleOddsClick('BTTS_Yes', bttsOdds.yes, 'Yes')"
          class="cursor-pointer bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded p-2 flex justify-between items-center"
          :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-BTTS_Yes`) }">
          <div class="text-xs text-gray-800">Yes</div>
          <div class="text-xs font-bold text-gray-800">{{ bttsOdds.yes }}</div>
        </div>
        <div @click="handleOddsClick('BTTS_No', bttsOdds.no, 'No')"
          class="cursor-pointer bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded p-2 flex justify-between items-center"
          :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-BTTS_No`) }">
          <div class="text-xs text-gray-800">No</div>
          <div class="text-xs font-bold text-gray-800">{{ bttsOdds.no }}</div>
        </div>
      </div>
    </div>

    <!-- 4. Over/Under -->
    <div class="rounded-lg mb-4">
      <div class="text-gray-300 font-medium mb-2 text-xs">Over/Under | Full Time</div>
      <div class="space-y-2">
        <div class="grid grid-cols-2 gap-3">
          <div @click="handleOddsClick('OU_Over05', overUnderOdds.over05, 'Over 0.5')"
            class="cursor-pointer bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded p-2 flex justify-between items-center"
            :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-OU_Over05`) }">
            <div class="text-xs text-gray-800">Over 0.5</div>
            <div class="text-xs font-bold text-gray-800">{{ overUnderOdds.over05 }}</div>
          </div>
          <div @click="handleOddsClick('OU_Under05', overUnderOdds.under05, 'Under 0.5')"
            class="cursor-pointer bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded p-2 flex justify-between items-center"
            :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-OU_Under05`) }">
            <div class="text-xs text-gray-800">Under 0.5</div>
            <div class="text-xs font-bold text-gray-800">{{ overUnderOdds.under05 }}</div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div @click="handleOddsClick('OU_Over15', overUnderOdds.over15, 'Over 1.5')"
            class="cursor-pointer bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded p-2 flex justify-between items-center"
            :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-OU_Over15`) }">
            <div class="text-xs text-gray-800">Over 1.5</div>
            <div class="text-xs font-bold text-gray-800">{{ overUnderOdds.over15 }}</div>
          </div>
          <div @click="handleOddsClick('OU_Under15', overUnderOdds.under15, 'Under 1.5')"
            class="cursor-pointer bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded p-2 flex justify-between items-center"
            :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-OU_Under15`) }">
            <div class="text-xs text-gray-800">Under 1.5</div>
            <div class="text-xs font-bold text-gray-800">{{ overUnderOdds.under15 }}</div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div @click="handleOddsClick('OU_Over25', overUnderOdds.over25, 'Over 2.5')"
            class="cursor-pointer bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded p-2 flex justify-between items-center"
            :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-OU_Over25`) }">
            <div class="text-xs text-gray-800">Over 2.5</div>
            <div class="text-xs font-bold text-gray-800">{{ overUnderOdds.over25 }}</div>
          </div>
          <div @click="handleOddsClick('OU_Under25', overUnderOdds.under25, 'Under 2.5')"
            class="cursor-pointer bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded p-2 flex justify-between items-center"
            :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-OU_Under25`) }">
            <div class="text-xs text-gray-800">Under 2.5</div>
            <div class="text-xs font-bold text-gray-800">{{ overUnderOdds.under25 }}</div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div @click="handleOddsClick('OU_Over35', overUnderOdds.over35, 'Over 3.5')"
            class="cursor-pointer bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded p-2 flex justify-between items-center"
            :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-OU_Over35`) }">
            <div class="text-xs text-gray-800">Over 3.5</div>
            <div class="text-xs font-bold text-gray-800">{{ overUnderOdds.over35 }}</div>
          </div>
          <div @click="handleOddsClick('OU_Under35', overUnderOdds.under35, 'Under 3.5')"
            class="cursor-pointer bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded p-2 flex justify-between items-center"
            :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-OU_Under35`) }">
            <div class="text-xs text-gray-800">Under 3.5</div>
            <div class="text-xs font-bold text-gray-800">{{ overUnderOdds.under35 }}</div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div @click="handleOddsClick('OU_Over45', overUnderOdds.over45, 'Over 4.5')"
            class="cursor-pointer bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded p-2 flex justify-between items-center"
            :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-OU_Over45`) }">
            <div class="text-xs text-gray-800">Over 4.5</div>
            <div class="text-xs font-bold text-gray-800">{{ overUnderOdds.over45 }}</div>
          </div>
          <div @click="handleOddsClick('OU_Under45', overUnderOdds.under45, 'Under 4.5')"
            class="cursor-pointer bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded p-2 flex justify-between items-center"
            :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-OU_Under45`) }">
            <div class="text-xs text-gray-800">Under 4.5</div>
            <div class="text-xs font-bold text-gray-800">{{ overUnderOdds.under45 }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 5. Correct Score -->
    <div class="rounded-lg mb-4">
      <div class="text-gray-300 font-medium mb-3 text-xs">Correct Score | Full Time</div>
      <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
        <div v-for="score in correctScoreOdds" :key="score.label"
          @click="handleOddsClick(`CS_${score.label}`, score.odds, score.label)"
          class="cursor-pointer bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded p-2 flex justify-between items-center"
          :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-CS_${score.label}`) }">
          <div class="text-xs text-gray-950">{{ score.label }}</div>
          <div class="text-xs text-gray-950 font-bold">{{ score.odds }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>