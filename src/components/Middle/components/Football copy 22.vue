<!-- Football.vue -->
<script setup>
import gamesData from '../data/dummyGameData'
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps(['leagueId', 'limit'])
const router = useRouter()
const games = ref([])
const selectedBets = ref([])
const loading = ref(true)

// ========== LEAGUE MAPPING (Kulingana na muundo wako) ==========
// Hii ni mapping kati ya leagueId na league name kwenye data yako
const getLeagueNameFromId = (id) => {
  const leagueMap = {
    0: 'all', // All Leagues
    1: 'Premier League',
    2: 'La Liga', 
    3: 'Serie A',
    4: 'Bundesliga',
    5: 'Ligue 1',
    6: 'UEFA Champions League',
    7: 'UEFA Europa League',
    8: 'Eredivisie',
    9: 'Primeira Liga',
    10: 'Süper Lig',
    11: 'MLS',
    12: 'Brasileirão',
    13: 'Primera Division', // Kwa Uruguay na Argentina
    14: 'Liga MX'
  }
  return leagueMap[id]
}

// ========== SIMPLE FILTERING ==========
const filteredByLeague = computed(() => {
  if (!games.value.length) return []
  
  console.log('Selected League ID:', props.leagueId)
  console.log('Total games:', games.value.length)
  
  // ALL LEAGUES (ID 0) - Onyesha zote
  if (props.leagueId === 0) {
    console.log('Showing ALL games')
    return games.value
  }
  
  // Filter kwa league name
  const filtered = games.value.filter(game => {
    const gameLeague = game.league || ''
    
    // Check kama league inalingana na ID iliyochaguliwa
    switch(props.leagueId) {
      case 1: // Premier League
        return gameLeague.includes('Premier League') || gameLeague.includes('England')
      case 2: // La Liga
        return gameLeague.includes('La Liga') || gameLeague.includes('Spain')
      case 3: // Serie A
        return gameLeague.includes('Serie A') || gameLeague.includes('Italy')
      case 4: // Bundesliga
        return gameLeague.includes('Bundesliga') || gameLeague.includes('Germany')
      case 5: // Ligue 1
        return gameLeague.includes('Ligue 1') || gameLeague.includes('France')
      case 6: // Champions League
        return gameLeague.includes('Champions League') || gameLeague.includes('UEFA')
      case 7: // Europa League
        return gameLeague.includes('Europa League')
      case 8: // Eredivisie
        return gameLeague.includes('Eredivisie') || gameLeague.includes('Netherlands')
      case 9: // Primeira Liga
        return gameLeague.includes('Primeira Liga') || gameLeague.includes('Portugal')
      case 10: // Süper Lig
        return gameLeague.includes('Süper Lig') || gameLeague.includes('Super Lig') || gameLeague.includes('Turkey')
      case 11: // MLS
        return gameLeague.includes('MLS') || gameLeague.includes('USA')
      case 12: // Brasileirão
        return gameLeague.includes('Brasileirão') || gameLeague.includes('Brazil')
      case 13: // Primera Division (Uruguay/Argentina)
        return gameLeague.includes('Primera Division') || gameLeague.includes('Uruguay') || gameLeague.includes('Argentina')
      case 14: // Liga MX
        return gameLeague.includes('Liga MX') || gameLeague.includes('Mexico')
      default:
        return false
    }
  })
  
  console.log(`Filtered ${filtered.length} games for league ${props.leagueId}`)
  filtered.forEach(game => {
    console.log('  -', game.homeTeam, 'vs', game.awayTeam, '(', game.league, ')')
  })
  
  return filtered
})

// Apply limit (kwa All Leagues onyesha 5 tu)
const displayGames = computed(() => {
  const gamesToShow = filteredByLeague.value
  
  if (props.limit && props.limit > 0) {
    // Kama ni All Leagues au league specific, onyesha limit
    if (props.leagueId === 0 || gamesToShow.length > props.limit) {
      return gamesToShow.slice(0, props.limit)
    }
  }
  
  return gamesToShow
})

// Current league name for display
const currentLeagueName = computed(() => {
  const names = {
    0: 'All Leagues',
    1: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League',
    2: '🇪🇸 La Liga',
    3: '🇮🇹 Serie A',
    4: '🇩🇪 Bundesliga',
    5: '🇫🇷 Ligue 1',
    6: '🏆 Champions League',
    7: '🏆 Europa League',
    8: '🇳🇱 Eredivisie',
    9: '🇵🇹 Primeira Liga',
    10: '🇹🇷 Süper Lig',
    11: '🇺🇸 MLS',
    12: '🇧🇷 Brasileirão',
    13: '🇺🇾 Primera Division',
    14: '🇲🇽 Liga MX'
  }
  return names[props.leagueId] || '⚽ Football'
})

// No matches found
const noMatchesFound = computed(() => {
  return !loading.value && games.value.length > 0 && filteredByLeague.value.length === 0
})

// ========== BETSLIP LOGIC ==========
const emitBetslipUpdate = () => {
  const event = new CustomEvent('betslip-update', { 
    detail: selectedBets.value 
  })
  window.dispatchEvent(event)
}

onMounted(() => {
  loading.value = true
  
  // Load games
  setTimeout(() => {
    games.value = gamesData
    console.log('=== GAMES LOADED ===')
    console.log('Total games:', gamesData.length)
    console.log('Sample game:', gamesData[0])
    loading.value = false
  }, 800)
  
  loadFromLocalStorage()
  window.addEventListener('storage', handleStorageChange)
  window.addEventListener('betslip-update', handleBetslipUpdate)
})

onBeforeUnmount(() => {
  window.removeEventListener('storage', handleStorageChange)
  window.removeEventListener('betslip-update', handleBetslipUpdate)
})

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

const isSelected = (game, selection) => {
  return selectedBets.value.some(
    bet => bet.eventId === game.eventId && bet.selection === selection
  )
}

const getCurrentSelection = (game) => {
  const bet = selectedBets.value.find(bet => bet.eventId === game.eventId)
  return bet ? bet.selection : null
}

const handleOddsClick = (game, selectionType, oddsValue) => {
  const existingBetIndex = selectedBets.value.findIndex(
    bet => bet.eventId === game.eventId
  )
  
  const isSameSelection = existingBetIndex !== -1 && 
    selectedBets.value[existingBetIndex].selection === selectionType
  
  let newBets = []
  
  if (isSameSelection) {
    newBets = selectedBets.value.filter((_, index) => index !== existingBetIndex)
  } else {
    const filteredBets = selectedBets.value.filter(
      bet => bet.eventId !== game.eventId
    )
    
    const selection = {
      id: `${game.eventId}-${selectionType}`,
      eventId: game.eventId,
      match: `${game.homeTeam} vs ${game.awayTeam}`,
      league: game.league,
      time: `${game.time} ${game.date}`,
      selection: selectionType,
      odds: oddsValue,
      homeTeam: game.homeTeam,
      awayTeam: game.awayTeam
    }
    
    newBets = [...filteredBets, selection]
  }
  
  selectedBets.value = newBets
  saveToLocalStorage(newBets)
}

const viewAll = () => {
  router.push('/sports')
}

const goToSportDetails = (game) => {
  router.push({
    path: `/sportDetail`,
    query: {
      eventId: game.eventId,
      homeTeam: game.homeTeam,
      awayTeam: game.awayTeam,
      league: game.league,
      time: game.time,
      date: game.date,
      homeOdds: game.homeOdds,
      drawOdds: game.drawOdds,
      awayOdds: game.awayOdds
    }
  })
}
</script>

<template>
  <div class="relative bg-sky-900">
    <!-- Category Header -->
    <div class="bg-sky-950 p-3 relative cursor-pointer header-glow">
      <div class="flex justify-between items-center">
        <h1 class="text-[22px] font-bold leading-[26px] pr-5 text-amber-100 flex items-center gap-2">
          <span class="football-animate text-xl flex items-center justify-center">⚽</span>
          <span class="italic">{{ currentLeagueName }}</span>
        </h1>
      </div>

      <div class="absolute right-3 top-1/2 -translate-y-1/2">
        <span class="px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-600 rounded-full flex items-center gap-1">
          🔥 <span class="typing-text">Trending</span>
        </span>
      </div>

      <div class="glow-line"></div>
    </div>

    <!-- Debug Info (Remove baada ya kuthibitisha inafanya kazi) -->
    <div v-if="!loading && games.length > 0" class="text-[10px] text-white/40 p-2 bg-black/20 border-b border-sky-800">
      <div class="flex justify-between">
        <span>League ID: {{ leagueId }}</span>
        <span>Total: {{ games.length }}</span>
        <span>Filtered: {{ filteredByLeague.length }}</span>
        <span>Showing: {{ displayGames.length }}</span>
      </div>
    </div>

    <!-- Skeleton Loading -->
    <div v-if="loading" class="divide-y divide-sky-800/30">
      <div v-for="i in (limit || 5)" :key="i" class="border-b border-sky-950 p-3 animate-pulse">
        <div class="flex justify-between items-center mb-3">
          <div class="h-4 bg-sky-800 rounded w-20"></div>
          <div class="h-4 bg-sky-800 rounded w-24"></div>
        </div>
        <div class="space-y-2 mb-3">
          <div class="h-5 bg-sky-800 rounded w-3/4"></div>
          <div class="h-5 bg-sky-800 rounded w-3/4"></div>
        </div>
        <div class="h-3 bg-sky-800 rounded w-32 mb-4"></div>
        <div class="flex gap-2">
          <div class="flex-1 h-10 bg-sky-800 rounded"></div>
          <div class="flex-1 h-10 bg-sky-800 rounded"></div>
          <div class="flex-1 h-10 bg-sky-800 rounded"></div>
          <div class="w-12 h-10 bg-sky-800 rounded"></div>
        </div>
      </div>
    </div>

    <!-- No Matches -->
    <div 
      v-else-if="noMatchesFound"
      class="flex flex-col items-center justify-center p-12 text-center"
    >
      <div class="text-4xl mb-4">⚽</div>
      <h3 class="text-white text-sm font-semibold mb-2">No Matches Found</h3>
      <p class="text-white/50 text-xs">No matches available for {{ currentLeagueName }}</p>
    </div>

    <!-- Games List -->
    <template v-else-if="displayGames.length > 0">
      <div
        v-for="game in displayGames"
        :key="game.id"
        class="border-b border-sky-950 p-3 hover:bg-sky-800/30 transition-colors"
      >
        <!-- Match Info (Clickable) -->
        <div @click="goToSportDetails(game)" class="cursor-pointer">
          <div class="flex justify-between items-center mb-2">
            <span class="text-xs text-white/60">{{ game.time }}</span>
            <span class="text-xs text-white/60">{{ game.date }}</span>
          </div>

          <div class="space-y-1 mb-2">
            <div class="text-sm font-semibold text-white/90">{{ game.homeTeam }}</div>
            <div class="text-sm font-semibold text-white/90">{{ game.awayTeam }}</div>
          </div>

          <div class="text-[10px] text-white/40 mb-3 truncate">
            {{ game.league }}
          </div>
        </div>

        <!-- Odds Buttons -->
        <div class="flex gap-2">
          <!-- Home Win (1) -->
          <button
            @click="handleOddsClick(game, '1', game.homeOdds)"
            class="flex-1 bg-white/10 hover:bg-white/20 rounded-lg p-2 text-center transition-all"
            :class="{'bg-green-500/80 hover:bg-green-500': isSelected(game, '1')}"
          >
            <div class="text-[10px] text-white/50">1</div>
            <div class="text-sm font-bold text-white">{{ game.homeOdds }}</div>
          </button>

          <!-- Draw (X) -->
          <button
            @click="handleOddsClick(game, 'X', game.drawOdds)"
            class="flex-1 bg-white/10 hover:bg-white/20 rounded-lg p-2 text-center transition-all"
            :class="{'bg-green-500/80 hover:bg-green-500': isSelected(game, 'X')}"
          >
            <div class="text-[10px] text-white/50">X</div>
            <div class="text-sm font-bold text-white">{{ game.drawOdds }}</div>
          </button>

          <!-- Away Win (2) -->
          <button
            @click="handleOddsClick(game, '2', game.awayOdds)"
            class="flex-1 bg-white/10 hover:bg-white/20 rounded-lg p-2 text-center transition-all"
            :class="{'bg-green-500/80 hover:bg-green-500': isSelected(game, '2')}"
          >
            <div class="text-[10px] text-white/50">2</div>
            <div class="text-sm font-bold text-white">{{ game.awayOdds }}</div>
          </button>

          <!-- More Markets -->
          <button class="w-12 bg-white/10 hover:bg-white/20 rounded-lg p-2 text-center">
            <div class="text-[10px] text-white/50">+</div>
            <div class="text-xs font-bold text-white">{{ game.market }}</div>
          </button>
        </div>
      </div>

      <!-- View All Button -->
      <div 
        v-if="filteredByLeague.length > (limit || 5)"
        @click="viewAll"
        class="text-center py-4 text-amber-300/70 text-xs font-medium uppercase tracking-wider cursor-pointer hover:text-amber-300 transition-colors border-t border-sky-800"
      >
        View All {{ filteredByLeague.length }} Matches →
      </div>
    </template>
  </div>
</template>

<style>
@keyframes footballPro {
  0%, 100% { transform: rotate(0deg) translateY(0); }
  50% { transform: rotate(180deg) translateY(-4px); }
}

.football-animate {
  animation: footballPro 2s ease-in-out infinite;
  display: inline-block;
}

.typing-text {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid currentColor;
  width: 0;
  animation: typing 2s steps(8) infinite, blink 0.7s infinite;
}

@keyframes typing {
  0%, 100% { width: 0; }
  40%, 60% { width: 8ch; }
}

@keyframes blink {
  50% { border-color: transparent; }
}

.glow-line {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.9), rgba(255,255,255,1), rgba(255,255,255,0.9), transparent);
  animation: glowMove 3s ease-in-out infinite;
}

@keyframes glowMove {
  0%, 100% { opacity: 0.5; transform: translateX(-10%); }
  50% { opacity: 1; transform: translateX(10%); }
}
</style>