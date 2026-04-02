<script setup>
// import { dummyGamesData } from '../data/dummyGameData'
import gamesData  from '../data/dummyGameData'
import { ref, onMounted, onBeforeUnmount, watch,computed } from 'vue'
import { useRouter } from 'vue-router'



const props = defineProps(['leagueId'])
const router = useRouter()
const games = ref([])
const selectedBets = ref([])

// Custom event for betslip updates
const emitBetslipUpdate = () => {
  const event = new CustomEvent('betslip-update', { 
    detail: selectedBets.value 
  })
  window.dispatchEvent(event)
}

// Load selected bets from localStorage on mount
onMounted(() => {
  setTimeout(() => {
    // Only show first 5 games
    games.value = gamesData.slice(0, 5)
  }, 1200)
  
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

watch(selectedBets, (newBets) => {
  console.log('Selected bets updated:', newBets)
}, { deep: true })








const goToSportDetails = (game) => {
  router.push({
    path: `/sportDetail`,
    query: {
      eventId: game.eventId,
      homeTeam: game.homeTeam,
      awayTeam: game.awayTeam,
      league: game.league
    }
  })
}
</script>

<template>

  <div class="relative bg-sky-900">
    <!-- Category Header -->
    <div class="bg-sky-950 p-3 relative cursor-pointer header-glow">
  <h1 class="text-[22px] font-bold leading-[26px] pr-5 text-amber-100 flex items-center gap-2">
    <span class="football-animate text-xl flex items-center justify-center">⚽</span>
    <span class="italic">Football</span>
  </h1>

  <div class="absolute right-3 top-1/2 -translate-y-1/2">
    <span class="px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-600 rounded-full flex items-center gap-1">
      🔥 <span class="typing-text">Trending</span>
    </span>
  </div>

  <!-- glowing border -->
  <div class="glow-line"></div>
</div>

    <!-- Games List - Only 5 games -->
    <div
      v-for="game in games"
      :key="game.id"
      class="border-b border-sky-950 p-3 "
    >
      <a  @click="goToSportDetails(game)" class="block w-full cursor-pointer">
        <!-- Header -->
        <div class="flex justify-between items-center mb-1">
          <span class="text-sm text-white/70 font-normal">{{ game.time }}</span>
          <span class="text-sm text-white/70 font-bold">{{ game.date }}</span>
        </div>

        <!-- Teams -->
        <div class="flex flex-col gap-1 w-full ">
          <div class="flex items-center gap-1.5">
            <span class="text-[14px] text-amber-200/70 font-bold">{{ game.homeTeam }}</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="text-[14px] text-amber-200/70 font-bold">{{ game.awayTeam }}</span>
          </div>
        </div>

        <!-- League -->
        <p class="text-[#8e9398] mb-2 text-xs leading-4 font-normal">
          {{ game.league }}
        </p>
      </a>

      <!-- Odds Section -->
      <div class="flex flex-col w-full">
        <div class="flex flex-col w-full">
          <div class="mb-4 last:mb-0">
            <div class="flex w-full">
              <div class="flex flex-wrap gap-2 w-full">
                <div class="w-full flex">

                  <!-- Home Odds -->
                  <span class="flex-1 mr-2 overflow-hidden">
                    <span
                      class="flex w-full cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-50 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9]"
                      :class="{
                        '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(game, '1'),
                        'opacity-50': getCurrentSelection(game) && getCurrentSelection(game) !== '1'
                      }"
                      @click="handleOddsClick(game, '1', game.homeOdds)"
                    >
                      <span class="flex justify-between w-full">
                        <span class="flex items-center justify-center px-2.5 py-2 text-sm">1</span>
                        <span class="flex items-center justify-center px-2.5 py-2 text-sm font-bold">
                          {{ game.homeOdds }}
                        </span>
                      </span>
                    </span>
                  </span>

                  <!-- Draw Odds -->
                  <span class="flex-1 mr-2 overflow-hidden">
                    <span
                      class="flex w-full cursor-pointer whitespace-nowrap opacity-50 bg-[#f4f5f0] border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9]"
                      :class="{
                        '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(game, 'X'),
                        'opacity-50': getCurrentSelection(game) && getCurrentSelection(game) !== 'X'
                      }"
                      @click="handleOddsClick(game, 'X', game.drawOdds)"
                    >
                      <span class="flex justify-between w-full">
                        <span class="flex items-center justify-center px-2.5 py-2 text-sm">X</span>
                        <span class="flex items-center justify-center px-2.5 py-2 text-sm font-bold">
                          {{ game.drawOdds }}
                        </span>
                      </span>
                    </span>
                  </span>

                  <!-- Away Odds -->
                  <span class="flex-1 mr-2 overflow-hidden">
                    <span
                      class="flex w-full cursor-pointer whitespace-nowrap opacity-50 bg-[#f4f5f0] border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9]"
                      :class="{
                        '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(game, '2'),
                        'opacity-50': getCurrentSelection(game) && getCurrentSelection(game) !== '2'
                      }"
                      @click="handleOddsClick(game, '2', game.awayOdds)"
                    >
                      <span class="flex justify-between w-full">
                        <span class="flex items-center justify-center px-2.5 py-2 text-sm">2</span>
                        <span class="flex items-center justify-center px-2.5 py-2 text-sm font-bold">
                          {{ game.awayOdds }}
                        </span>
                      </span>
                    </span>
                  </span>

                  <!-- Bet Count -->
                  <a
                    :href="`/event/${game.eventId}`"
                    class="min-w-[48px] flex items-center justify-center gap-1 px-1.5 py-2 bg-[#f4f5f0] opacity-50 border border-[#e6e7e2] rounded text-sm font-bold"
                  >
                    <span class="text-gray-950">{{ game.market }}</span>
                    +
                  </a>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- View All -->
    <div 
      @click="viewAll"
      class="flex items-center justify-center bg-transparent text-[#f4f5f0] p-3 text-sm font-medium cursor-pointer hover:opacity-80 transition-opacity"
    >
      <span class="underline">
        View all Football <span class="ml-1">{{ games.length > 0 ? gamesData.length : 0 }}</span>
      </span>
      <svg class="w-2.5 h-2.5 ml-2 text-[#f4f5f0]">
        <use xlink:href="#arrow_right"></use>
      </svg>
    </div>
  </div>
</template>

<style>
@keyframes footballPro {
  0% {
    transform: rotate(0deg) translateY(0);
  }
  50% {
    transform: rotate(180deg) translateY(-6px);
  }
  100% {
    transform: rotate(360deg) translateY(0);
  }
}

.football-animate {
  animation: footballPro 2s ease-in-out infinite;
}


.typing-text {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid currentColor;
  width: 0;
  animation: typing 2s steps(8) infinite, blink 0.7s infinite;
}

/* typing effect */
@keyframes typing {
  0% { width: 0 }
  40% { width: 8ch }
  60% { width: 8ch }
  100% { width: 0 }
}

/* cursor blink */
@keyframes blink {
  50% { border-color: transparent }
}

.glow-line{
  position:absolute;
  bottom:0;
  left:0;
  width:100%;
  height:2px;
  background:linear-gradient(
    90deg,
    transparent,
    rgba(255,255,255,0.9),
    rgba(255,255,255,1),
    rgba(255,255,255,0.9),
    transparent
  );

  box-shadow:
    0 0 6px rgba(255,255,255,0.9),
    0 0 10px rgba(255,255,255,0.7),
    0 0 18px rgba(255,255,255,0.5);

  animation:glowMove 4s linear infinite;
}

/* @keyframes glowMove{
  0%{
    opacity:.6;
    transform:translateX(-40%);
  }
  50%{
    opacity:1;
    transform:translateX(0);
  }
  100%{
    opacity:.6;
    transform:translateX(40%);
  }
} */
</style>