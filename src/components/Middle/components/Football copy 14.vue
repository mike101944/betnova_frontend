<script setup>
import gamesData from '../data/dummyGameData'
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps(['leagueId'])
const router = useRouter()

const allGames = ref([])
const selectedBets = ref([])

// --- SORTING LOGIC ---
const sortOption = ref('default') // default, time, odds_high, odds_low, date_new, date_old

const sortOptions = [
  { value: 'default', label: '🔽 Default' },
  { value: 'time', label: '⏰ Time (Earliest)' },
  { value: 'date_new', label: '📅 Date (Newest)' },
  { value: 'date_old', label: '📅 Date (Oldest)' },
  { value: 'odds_high', label: '📈 Highest Odds' },
  { value: 'odds_low', label: '📉 Lowest Odds' }
]

// Function ya kusort mechi
const sortGames = (games) => {
  const gamesCopy = [...games]
  
  switch (sortOption.value) {
    case 'time':
      return gamesCopy.sort((a, b) => {
        const timeA = a.time.split(':').map(Number)
        const timeB = b.time.split(':').map(Number)
        return timeA[0] - timeB[0] || timeA[1] - timeB[1]
      })
    
    case 'date_new':
      return gamesCopy.sort((a, b) => new Date(b.date) - new Date(a.date))
    
    case 'date_old':
      return gamesCopy.sort((a, b) => new Date(a.date) - new Date(b.date))
    
    case 'odds_high':
      return gamesCopy.sort((a, b) => {
        const maxOddsA = Math.max(a.homeOdds, a.drawOdds, a.awayOdds)
        const maxOddsB = Math.max(b.homeOdds, b.drawOdds, b.awayOdds)
        return maxOddsB - maxOddsA
      })
    
    case 'odds_low':
      return gamesCopy.sort((a, b) => {
        const minOddsA = Math.min(a.homeOdds, a.drawOdds, a.awayOdds)
        const minOddsB = Math.min(b.homeOdds, b.drawOdds, b.awayOdds)
        return minOddsA - minOddsB
      })
    
    default:
      return gamesCopy
  }
}

// 1. Filtering + Sorting logic
const filteredGames = computed(() => {
  if (!allGames.value.length) return []

  let result = []

  // Filter logic
  if (props.leagueId === 11) {
    result = allGames.value.filter(g => g.isLive).slice(0, 10)
  } else {
    const leagueMap = {
      1: 'Football / England / Premier League',
      2: 'Football / Spain / La Liga',
      3: 'Football / Italy / Serie A',
      4: 'Football / Germany / Bundesliga',
      5: 'Football / France / Ligue 1'
    }

    const targetLeagueName = leagueMap[props.leagueId]

    if (!targetLeagueName) {
      result = allGames.value.slice(0, 10)
    } else {
      result = allGames.value.filter(game => game.league && game.league.includes(targetLeagueName)).slice(0, 10)
    }
  }

  // Apply sorting
  return sortGames(result)
})

// 2. Lifecycle
onMounted(() => {
  allGames.value = gamesData
  loadFromLocalStorage()
  window.addEventListener('storage', handleStorageChange)
  window.addEventListener('betslip-update', handleBetslipUpdate)
})

onBeforeUnmount(() => {
  window.removeEventListener('storage', handleStorageChange)
  window.removeEventListener('betslip-update', handleBetslipUpdate)
})

// --- Betslip & Storage Logic ---
const handleStorageChange = (event) => {
  if (event.key === 'betslip_selections') loadFromLocalStorage()
}

const handleBetslipUpdate = (event) => {
  selectedBets.value = event.detail || []
}

const loadFromLocalStorage = () => {
  const savedBets = localStorage.getItem('betslip_selections')
  if (savedBets) {
    try { selectedBets.value = JSON.parse(savedBets) } 
    catch (e) { console.error('Error parsing bets:', e) }
  } else {
    selectedBets.value = []
  }
}

const saveToLocalStorage = (bets) => {
  localStorage.setItem('betslip_selections', JSON.stringify(bets))
  const event = new CustomEvent('betslip-update', { detail: bets })
  window.dispatchEvent(event)
}

const isSelected = (game, selection) => {
  return selectedBets.value.some(bet => bet.eventId === game.eventId && bet.selection === selection)
}

const handleOddsClick = (game, selectionType, oddsValue) => {
  const existingBetIndex = selectedBets.value.findIndex(bet => bet.eventId === game.eventId)
  const isSameSelection = existingBetIndex !== -1 && selectedBets.value[existingBetIndex].selection === selectionType
  
  let newBets = []
  if (isSameSelection) {
    newBets = selectedBets.value.filter((_, index) => index !== existingBetIndex)
  } else {
    const filteredBets = selectedBets.value.filter(bet => bet.eventId !== game.eventId)
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

const goToSportDetails = (game) => {
  router.push({
    path: `/sportDetail`,
    query: { eventId: game.eventId, homeTeam: game.homeTeam, awayTeam: game.awayTeam, league: game.league }
  })
}

const viewAll = () => router.push('/sports')
</script>

<template>
  <div class="relative bg-sky-900">
    <div class="bg-sky-950 p-3 relative header-glow">
      <div class="flex justify-between items-center">
        <h1 class="text-[22px] font-bold text-amber-100 flex items-center gap-2">
          <span class="football-animate">⚽</span>
          <span class="italic">Football</span>
        </h1>
        
        <!-- Sorting Dropdown -->
        <div class="relative">
          <select 
            v-model="sortOption"
            class="bg-cyan-800 text-white text-sm rounded-lg px-3 py-1.5 border border-cyan-700 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
          >
            <option 
              v-for="opt in sortOptions" 
              :key="opt.value" 
              :value="opt.value"
              class="bg-cyan-900"
            >
              {{ opt.label }}
            </option>
          </select>
        </div>
      </div>
      
      <div class="glow-line"></div>
    </div>

    <!-- Show active sorting info -->
    <div v-if="sortOption !== 'default'" class="px-3 pt-2 text-xs text-amber-300">
      📌 Sorted by: {{ sortOptions.find(opt => opt.value === sortOption)?.label }}
    </div>

    <div v-if="filteredGames.length > 0">
      <div v-for="game in filteredGames" :key="game.eventId" class="border-b border-sky-950 p-3">
        <div @click="goToSportDetails(game)" class="cursor-pointer">
          <div class="flex justify-between text-sm text-white/70 mb-1">
            <span>{{ game.time }}</span>
            <span class="font-bold">{{ game.date }}</span>
          </div>
          <div class="text-[14px] text-amber-200/70 font-bold mb-1">
            <div>{{ game.homeTeam }}</div>
            <div>{{ game.awayTeam }}</div>
          </div>
          <p class="text-[#8e9398] text-xs">{{ game.league }}</p>
        </div>

        <div class="flex gap-2 mt-2">
          <button 
            v-for="odd in [{t:'1', v:game.homeOdds}, {t:'X', v:game.drawOdds}, {t:'2', v:game.awayOdds}]"
            :key="odd.t"
            @click="handleOddsClick(game, odd.t, odd.v)"
            class="flex-1 flex justify-between items-center px-3 py-2 bg-[#f4f5f0] border rounded transition-all"
            :class="isSelected(game, odd.t) ? '!bg-[#0AF0B5] !border-[#0AF0B5] opacity-100' : 'opacity-50'"
          >
            <span class="text-sm font-medium">{{ odd.t }}</span>
            <span class="text-sm font-bold">{{ odd.v }}</span>
          </button>
          
          <a :href="`/event/${game.eventId}`" class="min-w-[45px] flex items-center justify-center bg-[#f4f5f0] opacity-50 border rounded text-xs font-bold">
            {{ game.market }}+
          </a>
        </div>
      </div>
    </div>
    
    <div v-else class="p-10 text-center text-white/50 text-sm">
      Hakuna mechi kwa sasa...
    </div>

    <div @click="viewAll" class="p-3 text-center text-[#f4f5f0] text-sm cursor-pointer underline">
      View all Football {{ allGames.length }}
    </div>
  </div>
</template>

<style scoped>
.football-animate {
  display: inline-block;
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.glow-line {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #ff7a00, #ffaa00, #ff7a00, transparent);
  animation: glow 2s linear infinite;
}

@keyframes glow {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1.25rem;
  padding-right: 2.5rem;
}
</style>