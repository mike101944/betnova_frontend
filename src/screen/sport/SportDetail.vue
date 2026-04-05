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
  oneX: '0',
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
  over05: '0', under05: '0',
  over15: '0', under15: '0',
  over25: '0', under25: '0',
  over35: '0', under35: '0',
  over45: '0', under45: '0'
})

// Correct Score odds
const correctScoreOdds = ref([])

// Correct Score First Half odds
const correctScoreFirstHalfOdds = ref([])

// Correct Score Second Half odds
const correctScoreSecondHalfOdds = ref([])

console.log('Route query parameters:', route.query)

// Helper function to ensure odds are never below 1.00
const ensureMinimumOdds = (odds, minimum = 1.05) => {
  let result = parseFloat(odds)
  if (isNaN(result) || result < minimum) {
    return minimum
  }
  return Math.round(result * 100) / 100
}

// Calculate Double Chance odds
const calculateDoubleChanceOdds = (homeOdds, drawOdds, awayOdds) => {
  const h = parseFloat(homeOdds)
  const d = parseFloat(drawOdds)
  const a = parseFloat(awayOdds)
  
  if (isNaN(h) || isNaN(d) || isNaN(a) || h < 1.01 || d < 1.01 || a < 1.01) {
    return {
      oneX: '1.25',
      xTwo: '1.55',
      oneTwo: '1.30'
    }
  }
  
  let oneXProb = (1 / h) + (1 / d)
  let oneXOdds = 1 / oneXProb
  
  let xTwoProb = (1 / d) + (1 / a)
  let xTwoOdds = 1 / xTwoProb
  
  let oneTwoProb = (1 / h) + (1 / a)
  let oneTwoOdds = 1 / oneTwoProb
  
  oneXOdds = Math.max(1.11, oneXOdds)
  xTwoOdds = Math.max(1.10, xTwoOdds)
  oneTwoOdds = Math.max(1.10, oneTwoOdds)
  
  oneXOdds = Math.round(oneXOdds * 100) / 100
  xTwoOdds = Math.round(xTwoOdds * 100) / 100
  oneTwoOdds = Math.round(oneTwoOdds * 100) / 100
  
  return {
    oneX: oneXOdds.toFixed(2),
    xTwo: xTwoOdds.toFixed(2),
    oneTwo: oneTwoOdds.toFixed(2)
  }
}

// Calculate BTTS odds
const calculateBTTSOdds = (homeOdds, drawOdds, awayOdds) => {
  const h = parseFloat(homeOdds)
  const d = parseFloat(drawOdds)
  const a = parseFloat(awayOdds)
  
  if (isNaN(h) || isNaN(d) || isNaN(a) || h < 1.01 || d < 1.01 || a < 1.01) {
    return { yes: '1.85', no: '1.85' }
  }
  
  const probHome = 1 / h
  const probDraw = 1 / d
  const probAway = 1 / a
  
  const expectedHomeGoals = probHome * 2.2 + probDraw * 1.1
  const expectedAwayGoals = probAway * 2.2 + probDraw * 1.1
  
  const probHomeScores = 1 - Math.exp(-expectedHomeGoals)
  const probAwayScores = 1 - Math.exp(-expectedAwayGoals)
  
  let probYes = probHomeScores * probAwayScores
  
  if (probDraw > 0.35) {
    probYes = probYes * 0.85
  } else if (probDraw < 0.25) {
    probYes = probYes * 1.10
  }
  
  probYes = Math.max(0.35, Math.min(0.65, probYes))
  const probNo = 1 - probYes
  
  let oddsYes = 1 / probYes
  let oddsNo = 1 / probNo
  
  oddsYes = oddsYes * 1.05
  oddsNo = oddsNo * 1.05
  
  oddsYes = Math.max(1.20, oddsYes)
  oddsNo = Math.max(1.20, oddsNo)
  
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
  
  if (isNaN(h) || isNaN(d) || isNaN(a) || h < 1.01 || d < 1.01 || a < 1.01) {
    return {
      over05: '1.10', under05: '5.89',
      over15: '1.53', under15: '2.34',
      over25: '2.65', under25: '1.42',
      over35: '5.11', under35: '1.13',
      over45: '9.83', under45: '1.02'
    }
  }
  
  const probHome = 1 / h
  const probDraw = 1 / d
  const probAway = 1 / a
  
  let expectedGoals = (probHome * 2.0) + (probDraw * 1.2) + (probAway * 1.8)
  expectedGoals = Math.max(1.2, Math.min(3.8, expectedGoals))
  
  const poisson = (lambda, k) => {
    let result = Math.exp(-lambda)
    for (let i = 1; i <= k; i++) {
      result *= lambda / i
    }
    return result
  }
  
  let probUnder05 = poisson(expectedGoals, 0)
  let probUnder15 = probUnder05 + poisson(expectedGoals, 1)
  let probUnder25 = probUnder15 + poisson(expectedGoals, 2)
  let probUnder35 = probUnder25 + poisson(expectedGoals, 3)
  let probUnder45 = probUnder35 + poisson(expectedGoals, 4)
  
  const margin = 1.06
  
  let oddsOver05 = (1 / (1 - probUnder05)) * margin
  let oddsUnder05 = (1 / probUnder05) * margin
  let oddsOver15 = (1 / (1 - probUnder15)) * margin
  let oddsUnder15 = (1 / probUnder15) * margin
  let oddsOver25 = (1 / (1 - probUnder25)) * margin
  let oddsUnder25 = (1 / probUnder25) * margin
  let oddsOver35 = (1 / (1 - probUnder35)) * margin
  let oddsUnder35 = (1 / probUnder35) * margin
  let oddsOver45 = (1 / (1 - probUnder45)) * margin
  let oddsUnder45 = (1 / probUnder45) * margin
  
  oddsOver05 = Math.max(1.01, oddsOver05)
  oddsUnder05 = Math.max(1.01, oddsUnder05)
  oddsOver15 = Math.max(1.01, oddsOver15)
  oddsUnder15 = Math.max(1.01, oddsUnder15)
  oddsOver25 = Math.max(1.01, oddsOver25)
  oddsUnder25 = Math.max(1.01, oddsUnder25)
  oddsOver35 = Math.max(1.01, oddsOver35)
  oddsUnder35 = Math.max(1.01, oddsUnder35)
  oddsOver45 = Math.max(1.01, oddsOver45)
  oddsUnder45 = Math.max(1.01, oddsUnder45)
  
  return {
    over05: oddsOver05.toFixed(2),
    under05: oddsUnder05.toFixed(2),
    over15: oddsOver15.toFixed(2),
    under15: oddsUnder15.toFixed(2),
    over25: oddsOver25.toFixed(2),
    under25: oddsUnder25.toFixed(2),
    over35: oddsOver35.toFixed(2),
    under35: oddsUnder35.toFixed(2),
    over45: oddsOver45.toFixed(2),
    under45: oddsUnder45.toFixed(2)
  }
}

// Calculate Correct Score Full Time odds
const calculateCorrectScoreOdds = (homeOdds, drawOdds, awayOdds) => {
  const h = parseFloat(homeOdds)
  const d = parseFloat(drawOdds)
  const a = parseFloat(awayOdds)
  
  const scores = [
    '0-0', '1-0', '0-1', '1-1', '2-0', '0-2', '2-1', '1-2',
    '2-2', '3-0', '0-3', '3-1', '1-3', '3-2', '2-3', 'Other'
  ]
  
  if (isNaN(h) || isNaN(d) || isNaN(a) || h < 1.01 || d < 1.01 || a < 1.01) {
    return scores.map(score => ({
      label: score,
      odds: (Math.random() * 40 + 6).toFixed(2)
    }))
  }
  
  const probHome = 1 / h
  const probDraw = 1 / d
  const probAway = 1 / a
  
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
      return { label: score, odds: (15 + Math.random() * 25).toFixed(2) }
    }
    
    const [homeScore, awayScore] = score.split('-').map(Number)
    let probability = poissonProb(expectedHomeGoals, homeScore) * poissonProb(expectedAwayGoals, awayScore)
    
    if (probability < 0.001) probability = 0.001
    
    let odds = 1 / probability
    odds = Math.min(100, Math.max(5, odds))
    odds = Math.round(odds * 100) / 100
    
    return { label: score, odds: odds.toFixed(2) }
  })
  
  return scoreOdds.sort((a, b) => parseFloat(a.odds) - parseFloat(b.odds))
}

// Calculate Correct Score First Half odds (randomly generated)
const calculateCorrectScoreFirstHalfOdds = () => {
  const scores = ['Other', '0-0', '0-1', '0-2', '1-0', '1-1', '1-2', '2-0', '2-1', '2-2']
  
  // Base odds pattern similar to real betting
  const baseOdds = {
    'Other': 18.40,
    '0-0': 1.70,
    '0-1': 5.76,
    '0-2': 40.00,
    '1-0': 2.48,
    '1-1': 8.80,
    '1-2': 64.00,
    '2-0': 7.04,
    '2-1': 24.00,
    '2-2': 80.80
  }
  
  // Add random variation between 0.85 and 1.15
  const randomVariation = () => 0.85 + (Math.random() * 0.3)
  
  return scores.map(score => {
    let odds = baseOdds[score] * randomVariation()
    odds = Math.round(odds * 100) / 100
    return { label: score, odds: odds.toFixed(2) }
  })
}

// Calculate Correct Score Second Half odds (randomly generated)
const calculateCorrectScoreSecondHalfOdds = () => {
  const scores = ['Other', '0-0', '0-1', '0-2', '1-0', '1-1', '1-2', '2-0', '2-1', '2-2']
  
  // Base odds pattern similar to real betting
  const baseOdds = {
    'Other': 10.40,
    '0-0': 1.88,
    '0-1': 4.64,
    '0-2': 24.00,
    '1-0': 2.36,
    '1-1': 6.40,
    '1-2': 36.00,
    '2-0': 5.44,
    '2-1': 16.80,
    '2-2': 80.80
  }
  
  // Add random variation between 0.85 and 1.15
  const randomVariation = () => 0.85 + (Math.random() * 0.3)
  
  return scores.map(score => {
    let odds = baseOdds[score] * randomVariation()
    odds = Math.round(odds * 100) / 100
    return { label: score, odds: odds.toFixed(2) }
  })
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
  
  // Generate random odds for First Half and Second Half
  correctScoreFirstHalfOdds.value = calculateCorrectScoreFirstHalfOdds()
  correctScoreSecondHalfOdds.value = calculateCorrectScoreSecondHalfOdds()
  
  console.log('Double Chance:', doubleChanceOdds.value)
  console.log('BTTS:', bttsOdds.value)
  console.log('First Half Correct Score:', correctScoreFirstHalfOdds.value)
  console.log('Second Half Correct Score:', correctScoreSecondHalfOdds.value)
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
  if (selectionType.startsWith('CS_FT_')) return 'Correct Score'
  if (selectionType.startsWith('CS_FH_')) return 'Correct Score First Half'
  if (selectionType.startsWith('CS_SH_')) return 'Correct Score Second Half'
  return 'Other'
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="h-full bg-sky-900 text-white p-4 overflow-y-auto">
    <!-- Back Button -->
    <button @click="goBack" class="mb-3 text-amber-100 flex p-2 bg-sky-900 opacity-70 shadow-lg shadow-amber-100 items-center gap-1 text-xs rounded sticky top-0 z-10">
      ← Back to Football
    </button>

    <!-- Header -->
    <div class="mb-4 text-xs mt-2 text-center">
      <h2 class="text-sm text-amber-100 font-bold">{{ matchData.homeTeam }} vs {{ matchData.awayTeam }}</h2>
      <p class="text-gray-400 text-xs">{{ matchData.league }}</p>
      <p class="text-gray-400 text-xs">{{ matchData.time }} {{ matchData.date }}</p>
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

    <!-- 5. Correct Score Full Time -->
    <div class="rounded-lg mb-4">
      <div class="text-gray-300 font-medium mb-3 text-xs">Correct Score | Full Time</div>
      <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
        <div v-for="score in correctScoreOdds" :key="score.label"
          @click="handleOddsClick(`CS_FT_${score.label}`, score.odds, score.label)"
          class="cursor-pointer bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded p-2 flex justify-between items-center"
          :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-CS_FT_${score.label}`) }">
          <div class="text-xs text-gray-950">{{ score.label }}</div>
          <div class="text-xs text-gray-950 font-bold">{{ score.odds }}</div>
        </div>
      </div>
    </div>

    <!-- 6. Correct Score First Half -->
    <div class="rounded-lg mb-4">
      <div class="text-gray-300 font-medium mb-3 text-xs">Correct Score | First Half</div>
      <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
        <div v-for="score in correctScoreFirstHalfOdds" :key="score.label"
          @click="handleOddsClick(`CS_FH_${score.label}`, score.odds, score.label)"
          class="cursor-pointer bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded p-2 flex justify-between items-center"
          :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-CS_FH_${score.label}`) }">
          <div class="text-xs text-gray-950">{{ score.label }}</div>
          <div class="text-xs text-gray-950 font-bold">{{ score.odds }}</div>
        </div>
      </div>
    </div>

    <!-- 7. Correct Score Second Half -->
    <div class="rounded-lg mb-4">
      <div class="text-gray-300 font-medium mb-3 text-xs">Correct Score | Second Half</div>
      <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
        <div v-for="score in correctScoreSecondHalfOdds" :key="score.label"
          @click="handleOddsClick(`CS_SH_${score.label}`, score.odds, score.label)"
          class="cursor-pointer bg-[#f4f5f0] opacity-75 border border-[#e6e7e2] rounded p-2 flex justify-between items-center"
          :class="{ '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(`${matchData.eventId}-CS_SH_${score.label}`) }">
          <div class="text-xs text-gray-950">{{ score.label }}</div>
          <div class="text-xs text-gray-950 font-bold">{{ score.odds }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>