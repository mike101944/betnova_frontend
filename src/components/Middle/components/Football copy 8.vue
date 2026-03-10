<script setup>
import { dummyGamesData } from '../data/dummyGameData'
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'

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
    games.value = dummyGamesData
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

watch(selectedBets, (newBets) => {
  console.log('Selected bets updated:', newBets)
}, { deep: true })
</script>

<template>
  <div class="relative bg-sky-700">
    <!-- Category Header -->
    <div class="bg-sky-800 border-b border-[#e6e7e2] p-3 relative cursor-pointer">
      <h1 class="text-[22px] font-bold leading-[26px] pl-9 pr-5 relative text-[#252a2d]">
  <span class="absolute left-0 top-1/2 -translate-y-1/2 text-xl">⚽</span>
  Football
</h1>
      <span class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <span class="bg-[#d9edb2] rounded px-1 min-w-4 flex items-center justify-center text-xs leading-4 text-[#252a2d] font-normal">
          662
        </span>
        <svg class="w-3 h-3" style="vertical-align: middle;">
          <use xlink:href="#arrow_right"></use>
        </svg>
      </span>
    </div>

    <!-- Games List -->
    <div v-for="game in games" :key="game.id" 
         class="border-b border-[#e6e7e2] p-3 bg-white">
      
      <a :href="`/event/${game.eventId}`" class="block w-full cursor-pointer">
        <!-- Header -->
        <div class="flex justify-between items-center mb-1">
          <span class="text-sm leading-[18px] font-normal">{{ game.time }}</span>
          <span class="text-sm leading-[18px] font-bold">{{ game.date }}</span>
        </div>

        <!-- Teams -->
        <div class="flex flex-col gap-1 w-full mb-1">
          <div class="flex items-center gap-1.5">
            <span class="text-lg leading-6 font-bold">{{ game.homeTeam }}</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="text-lg leading-6 font-bold">{{ game.awayTeam }}</span>
          </div>
        </div>

        <!-- League -->
        <p class="text-[#8e9398] mb-2 text-xs leading-4 font-normal">{{ game.league }}</p>
      </a>

      <!-- Odds Section -->
      <div class="flex flex-col w-full">
        <div class="flex flex-col w-full">
          <div class="mb-4 last:mb-0">
            <div class="flex w-full">
              <div class="flex flex-wrap gap-2 w-full">
                <div class="w-full flex">
                  <!-- Home Odds (1) -->
                  <span class="flex-1 mr-2 overflow-hidden">
                    <span class="flex w-full cursor-pointer whitespace-nowrap bg-[#f4f5f0] border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9]"
                          :class="{ 
                            '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(game, '1'),
                            'opacity-50': getCurrentSelection(game) && getCurrentSelection(game) !== '1'
                          }"
                          @click="handleOddsClick(game, '1', game.homeOdds.value)">
                      <span class="flex justify-between w-full">
                        <span class="flex items-center justify-center px-2.5 py-2 text-sm leading-[18px] font-normal">1</span>
                        <span class="flex items-center justify-center px-2.5 py-2 text-sm leading-[18px] font-bold whitespace-nowrap">
                          <svg v-if="game.homeOdds.hasFireIcon" 
                               class="w-3.5 h-3.5 mr-1 fill-[#ff7a00] -mt-1"
                               :class="{ '!fill-white': isSelected(game, '1') }"
                               style="vertical-align: middle;">
                            <use xlink:href="#icon-hot"></use>
                          </svg>
                          <span :class="{ 'text-white': isSelected(game, '1') }">{{ game.homeOdds.value }}</span>
                        </span>
                      </span>
                    </span>
                  </span>

                  <!-- Draw Odds (X) -->
                  <span class="flex-1 mr-2 overflow-hidden">
                    <span class="flex w-full cursor-pointer whitespace-nowrap bg-[#f4f5f0] border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9]"
                          :class="{ 
                            '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(game, 'X'),
                            'opacity-50': getCurrentSelection(game) && getCurrentSelection(game) !== 'X'
                          }"
                          @click="handleOddsClick(game, 'X', game.drawOdds.value)">
                      <span class="flex justify-between w-full">
                        <span class="flex items-center justify-center px-2.5 py-2 text-sm leading-[18px] font-normal">X</span>
                        <span class="flex items-center justify-center px-2.5 py-2 text-sm leading-[18px] font-bold whitespace-nowrap">
                          <svg v-if="game.drawOdds.hasFireIcon" 
                               class="w-3.5 h-3.5 mr-1 fill-[#ff7a00] -mt-1"
                               :class="{ '!fill-white': isSelected(game, 'X') }"
                               style="vertical-align: middle;">
                            <use xlink:href="#icon-hot"></use>
                          </svg>
                          <span :class="{ 'text-white': isSelected(game, 'X') }">{{ game.drawOdds.value }}</span>
                        </span>
                      </span>
                    </span>
                  </span>

                  <!-- Away Odds (2) -->
                  <span class="flex-1 mr-2 overflow-hidden">
                    <span class="flex w-full cursor-pointer whitespace-nowrap bg-[#f4f5f0] border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9]"
                          :class="{ 
                            '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(game, '2'),
                            'opacity-50': getCurrentSelection(game) && getCurrentSelection(game) !== '2'
                          }"
                          @click="handleOddsClick(game, '2', game.awayOdds.value)">
                      <span class="flex justify-between w-full">
                        <span class="flex items-center justify-center px-2.5 py-2 text-sm leading-[18px] font-normal">2</span>
                        <span class="flex items-center justify-center px-2.5 py-2 text-sm leading-[18px] font-bold whitespace-nowrap">
                          <svg v-if="game.awayOdds.hasFireIcon" 
                               class="w-3.5 h-3.5 mr-1 fill-[#ff7a00] -mt-1"
                               :class="{ '!fill-white': isSelected(game, '2') }"
                               style="vertical-align: middle;">
                            <use xlink:href="#icon-hot"></use>
                          </svg>
                          <span :class="{ 'text-white': isSelected(game, '2') }">{{ game.awayOdds.value }}</span>
                        </span>
                      </span>
                    </span>
                  </span>

                  <!-- Bet Count Button -->
                  <a :href="`/event/${game.eventId}`" 
                     class="min-w-[48px] flex items-center justify-center gap-1 px-1.5 py-2 bg-transparent border border-[#e6e7e2] rounded text-sm font-bold leading-[18px] text-[#252a2d] whitespace-nowrap">
                    <span>{{ game.betCount }}</span>
                    <svg class="w-2.5 h-2.5" style="vertical-align: middle;">
                      <use xlink:href="#arrow_right"></use>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- View All Link -->
    <div class="flex items-center justify-center bg-white text-[#252a2d] text-center p-3 text-sm font-medium leading-[18px]">
      <span class="underline cursor-pointer">
        View all Football
        <span class="ml-1">662</span>
      </span>
      <svg class="w-2.5 h-2.5 ml-2" style="vertical-align: baseline;">
        <use xlink:href="#arrow_right"></use>
      </svg>
    </div>
  </div>
</template>