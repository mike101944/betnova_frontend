<!-- LivePage.vue -->
<template>
    <div class="relative min-h-screen bg-gradient-to-br from-sky-900 via-sky-800 to-indigo-900">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 to-transparent"></div>
        <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </div>
  
      <div class="container mx-auto px-3 sm:px-4 py-4 sm:py-6 relative z-10">
  
        <!-- VERTICAL LAYOUT: Simulation Area ON TOP, Matches List BELOW -->
        <div class="flex flex-col gap-6">
          
          <!-- TOP: Simulation Arena -->
          <div class="w-full">
            <!-- No Match State -->
            <div v-if="!selectedMatch" class="bg-sky-900/40 backdrop-blur-md rounded-2xl border border-sky-700/50 p-12 text-center">
              <div class="text-7xl mb-4 opacity-50">🎮</div>
              <h3 class="text-white text-xl font-semibold mb-2">Select a Live Match</h3>
              <p class="text-sky-300">Choose any live match from the list below to start simulation</p>
            </div>
  
            <!-- Simulation Arena -->
            <div v-else class="bg-gradient-to-br from-sky-900/60 via-indigo-900/40 to-sky-900/60 backdrop-blur-md rounded-2xl border border-sky-700/50 overflow-hidden shadow-2xl">
              <!-- Match Header -->
              <div class="bg-gradient-to-r from-sky-950/80 to-indigo-950/80 px-4 py-2 border-b border-sky-700/50">
                <div class="flex flex-col sm:flex-row justify-between items-center gap-3">
                  <div class="flex items-center gap-4 sm:gap-8">
                    <div class="text-center">
                      <p class="text-white text-sm">{{ selectedMatch.homeTeam }}</p>
                    </div>
                    <div class="text-center">
                      <div class="text-white text-sm font-black">{{ homeScore }} - {{ awayScore }}</div>
                      <div class="text-white/50 text-xs">{{ matchMinute }}' minute</div>
                      <div v-if="halfTimeStatus === 'HALF TIME'" class="text-yellow-400 text-xs font-bold">⚡ HALF TIME ⚡</div>
                    </div>
                    <div class="text-center">
                      <p class="text-white font-bold text-sm">{{ selectedMatch.awayTeam }}</p>
                    </div>
                  </div>
                </div>

                <div class="flex gap-2 mt-2">
                  <span class="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium animate-pulse shadow-lg">LIVE SIM</span>
                  <span class="bg-white/10 text-white/80 px-3 py-1 rounded-full text-xs">{{ selectedMatch.league }}</span>
                </div>
              </div>
  
              <!-- Pitch Visualization -->
              <div class="px-3 py-3">
                <div class="relative bg-gradient-to-b from-emerald-800 to-emerald-950 rounded-xl overflow-hidden min-h-[150px] border border-white/15 shadow-inner">
                  <!-- Field Markings -->
                  <div class="absolute inset-0 opacity-15">
                    <div class="absolute top-1/2 left-0 right-0 h-px bg-white transform -translate-y-1/2"></div>
                    <div class="absolute top-1/2 left-1/2 w-20 h-20 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                    <div class="absolute left-0 top-0 bottom-0 w-28 border-r-2 border-white"></div>
                    <div class="absolute right-0 top-0 bottom-0 w-28 border-l-2 border-white"></div>
                  </div>
  
                  <!-- Ball -->
                  <div class="absolute transition-all duration-500 ease-out"
                       :style="{ left: `${ballPosition}%`, bottom: '48%' }">
                    <div class="relative">
                      <div class="w-5 h-5 bg-white rounded-full shadow-lg animate-pulse"></div>
                      <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap">
                        {{ actionText }}
                      </div>
                    </div>
                  </div>
  
                  <!-- Possession Bar -->
                  <div class="absolute bottom-3 left-3 right-3">
                    <div class="flex gap-0.5 h-1.5 bg-white/15 rounded-full overflow-hidden">
                      <div class="bg-cyan-400 rounded-full transition-all duration-500" :style="{ width: `${possessionHome}%` }"></div>
                      <div class="bg-amber-400 rounded-full transition-all duration-500" :style="{ width: `${possessionAway}%` }"></div>
                    </div>
                    <div class="flex justify-between text-white/50 text-xs mt-1">
                      <span>🏠 {{ possessionHome }}%</span>
                      <span>✈️ {{ possessionAway }}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- BOTTOM: Live Matches List -->
          <div class="w-full">
            <div class="bg-sky-900/50 backdrop-blur-md rounded-2xl border border-sky-700/50 overflow-hidden shadow-2xl">
  
              <!-- Live Matches List -->
              <div class="px-2 py-2 custom-scroll">
                <div class="flex gap-1 flex-col w-full">
                  
                  <!-- Live games from LiveGamesData.js -->
                  <div
                    v-for="game in liveGamesList"
                    :key="game.id"
                    @click="selectMatch(game)"
                    :class="[
                      'w-full flex-shrink-0 flex-col px-2 cursor-pointer transition-all duration-300 rounded-xl',
                      selectedMatch?.id === game.id 
                        ? 'border-2 border-gray-400' 
                        : 'bg-sky-800/30 border border-sky-700/50'
                    ]"
                  >
                    <!-- Live Status Bar -->
                    <div class="flex justify-between items-center mb-2">
                      <div class="flex items-center gap-1.5">
                        <span class="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                        <span class="text-xs font-bold text-red-400 uppercase">LIVE</span>
                        <span class="text-xs text-white/60">{{ game.minute }}'</span>
                      </div>
                    </div>

                    <!-- Teams with Live Scores -->
                    <div class="flex flex-col gap-2 w-full mb-3">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <span class="text-sm font-bold text-white">{{ game.homeTeam }}</span>
                        </div>
                        <span class="text-sm font-black text-white">{{ game.homeScore }}</span>
                      </div>
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <span class="text-sm font-bold text-white">{{ game.awayTeam }}</span>
                        </div>
                        <span class="text-sm font-black text-white">{{ game.awayScore }}</span>
                      </div>
                    </div>

                    <!-- Match League -->
                    <div class="flex gap-2 text-[10px] text-white/40">
                      <span class="text-xs text-white/60">{{ game.league }}</span>
                    </div>

                    <!-- Odds Buttons -->
                    <div class="flex flex-col w-full mt-3">
                      <div class="flex w-full gap-2">
                        <span class="flex-1 overflow-hidden">
                          <span
                            class="flex w-full cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-80 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9]"
                            :class="{
                              '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(game, '1'),
                              'opacity-50': getCurrentSelection(game) && getCurrentSelection(game) !== '1'
                            }"
                            @click.stop="handleOddsClick(game, '1', game.homeOdds)"
                          >
                            <span class="flex justify-between w-full">
                              <span class="flex items-center justify-center px-2.5 py-2 text-sm">1</span>
                              <span class="flex items-center justify-center px-2.5 py-2 text-sm font-bold">
                                {{ game.homeOdds }}
                              </span>
                            </span>
                          </span>
                        </span>

                        <span class="flex-1 overflow-hidden">
                          <span
                            class="flex w-full cursor-pointer whitespace-nowrap bg-[#f5f0f0] opacity-80 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9]"
                            :class="{
                              '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(game, 'X'),
                              'opacity-50': getCurrentSelection(game) && getCurrentSelection(game) !== 'X'
                            }"
                            @click.stop="handleOddsClick(game, 'X', game.drawOdds)"
                          >
                            <span class="flex justify-between w-full">
                              <span class="flex items-center justify-center px-2.5 py-2 text-sm">X</span>
                              <span class="flex items-center justify-center px-2.5 py-2 text-sm font-bold">
                                {{ game.drawOdds }}
                              </span>
                            </span>
                          </span>
                        </span>

                        <span class="flex-1 overflow-hidden">
                          <span
                            class="flex w-full cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-80 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9]"
                            :class="{
                              '!bg-[#0AF0B5] !border-[#0AF0B5]': isSelected(game, '2'),
                              'opacity-50': getCurrentSelection(game) && getCurrentSelection(game) !== '2'
                            }"
                            @click.stop="handleOddsClick(game, '2', game.awayOdds)"
                          >
                            <span class="flex justify-between w-full">
                              <span class="flex items-center justify-center px-2.5 py-2 text-sm">2</span>
                              <span class="flex items-center justify-center px-2.5 py-2 text-sm font-bold">
                                {{ game.awayOdds }}
                              </span>
                            </span>
                          </span>
                        </span>
                      </div>
                    </div>

                    <!-- Active Indicator -->
                    <div v-if="selectedMatch?.id === game.id" class="mt-2 flex items-center gap-1">
                      <span class="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse"></span>
                      <span class="text-[10px] text-sky-400 font-medium">CURRENTLY PLAYING</span>
                    </div>
                  </div>
  
                  <!-- Empty State -->
                  <div v-if="liveGamesList.length === 0" class="w-full p-8 text-center">
                    <div class="text-5xl mb-3 opacity-50">⚽</div>
                    <p class="text-white/50 text-sm">No live matches at the moment</p>
                    <p class="text-white/30 text-xs mt-1">Check back during match hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch, computed } from 'vue'
  import { liveGames, loadGames, cleanupLiveGames } from './LiveGamesData.js'
  
  // State - using liveGames from the manager
  const liveGamesList = liveGames // This is reactive from LiveGamesData
  const selectedMatch = ref(null)
  const selectedBets = ref([])
  
  // Simulation state
  const homeScore = ref(0)
  const awayScore = ref(0)
  const matchMinute = ref(0)
  const halfTimeStatus = ref('FIRST HALF')
  const ballPosition = ref(50)
  const possessionHome = ref(50)
  const possessionAway = ref(50)
  const simulating = ref(false)
  const actionText = ref('⚽')
  const events = ref([])
  const stats = ref({
    homeShots: 0,
    awayShots: 0,
    homeShotsOnTarget: 0,
    awayShotsOnTarget: 0,
    homeYellowCards: 0,
    awayYellowCards: 0
  })
  
  onMounted(async () => {
    // Load games from CSV
    await loadGames()
    
    // Auto-select first match if available
    if (liveGamesList.value.length > 0) {
      selectedMatch.value = liveGamesList.value[0]
      updateSelectedMatchData(selectedMatch.value)
    }
    
    // Load saved bets from localStorage
    loadFromLocalStorage()
  })
  
  // Bet slip functions
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
  
  const saveToLocalStorage = (bets) => {
    localStorage.setItem('betslip_selections', JSON.stringify(bets))
    window.dispatchEvent(new CustomEvent('betslip-update', { detail: bets }))
  }
  
  const loadFromLocalStorage = () => {
    const savedBets = localStorage.getItem('betslip_selections')
    if (savedBets) {
      try {
        selectedBets.value = JSON.parse(savedBets)
      } catch (e) {
        console.error('Error parsing saved bets:', e)
      }
    }
  }
  
  const updateSelectedMatchData = (match) => {
    if (!match) return
    
    homeScore.value = match.homeScore || 0
    awayScore.value = match.awayScore || 0
    matchMinute.value = match.minute || 0
    halfTimeStatus.value = match.halfTimeStatus || 'FIRST HALF'
    
    if (match.stats) {
      stats.value = {
        homeShots: match.stats.homeShots || 0,
        awayShots: match.stats.awayShots || 0,
        homeShotsOnTarget: match.stats.homeShotsOnTarget || 0,
        awayShotsOnTarget: match.stats.awayShotsOnTarget || 0,
        homeYellowCards: match.stats.homeYellowCards || 0,
        awayYellowCards: match.stats.awayYellowCards || 0
      }
    }
    
    if (match.possession) {
      possessionHome.value = match.possession.home || 50
      possessionAway.value = match.possession.away || 50
    }
    
    ballPosition.value = 20 + (possessionHome.value * 0.6)
  }
  
  const selectMatch = (match) => {
    if (selectedMatch.value?.id === match.id) return
    
    selectedMatch.value = match
    resetSimulation()
    updateSelectedMatchData(match)
  }
  
  const resetSimulation = () => {
    ballPosition.value = 50
    actionText.value = '⚽'
    events.value = []
  }
  
  const simulateAction = (type) => {
    if (simulating.value) return
    if (matchMinute.value >= 90) {
      events.value.unshift(`⏱️ Match ended! Final score: ${homeScore.value} - ${awayScore.value}`)
      return
    }
    if (halfTimeStatus.value === 'HALF TIME') {
      events.value.unshift(`⏸️ Half time break. Second half will start soon.`)
      return
    }
    
    simulating.value = true
    
    const attackingSide = Math.random() > 0.5 ? 'home' : 'away'
    
    if (attackingSide === 'home') {
      possessionHome.value = Math.min(75, possessionHome.value + Math.random() * 5)
      possessionAway.value = Math.max(25, possessionAway.value - Math.random() * 5)
      ballPosition.value = Math.min(88, ballPosition.value + Math.random() * 15)
    } else {
      possessionHome.value = Math.max(25, possessionHome.value - Math.random() * 5)
      possessionAway.value = Math.min(75, possessionAway.value + Math.random() * 5)
      ballPosition.value = Math.max(12, ballPosition.value - Math.random() * 15)
    }
    
    const total = possessionHome.value + possessionAway.value
    possessionHome.value = Math.round((possessionHome.value / total) * 100)
    possessionAway.value = 100 - possessionHome.value
    
    if (type === 'attack') {
      const randomEvent = Math.random()
      
      if (randomEvent < 0.35) {
        const isOnTarget = Math.random() > 0.55
        const isGoal = isOnTarget && Math.random() > 0.75
        
        if (attackingSide === 'home') {
          stats.value.homeShots++
          if (isOnTarget) stats.value.homeShotsOnTarget++
          
          if (isGoal && matchMinute.value <= 90) {
            homeScore.value++
            events.value.unshift(`⚽ GOAL! ${selectedMatch.value.homeTeam} scores! (${matchMinute.value}')`)
            actionText.value = '🎉 GOAL! 🎉'
            ballPosition.value = 90
          } else if (isOnTarget) {
            events.value.unshift(`🧤 Save! ${selectedMatch.value.awayTeam} keeper denies (${matchMinute.value}')`)
            actionText.value = '🧤 SAVE!'
          } else {
            events.value.unshift(`💨 ${selectedMatch.value.homeTeam} shot wide (${matchMinute.value}')`)
            actionText.value = '💨 WIDE!'
          }
        } else {
          stats.value.awayShots++
          if (isOnTarget) stats.value.awayShotsOnTarget++
          
          if (isGoal && matchMinute.value <= 90) {
            awayScore.value++
            events.value.unshift(`⚽ GOAL! ${selectedMatch.value.awayTeam} scores! (${matchMinute.value}')`)
            actionText.value = '🎉 GOAL! 🎉'
            ballPosition.value = 10
          } else if (isOnTarget) {
            events.value.unshift(`🧤 Save! ${selectedMatch.value.homeTeam} keeper denies (${matchMinute.value}')`)
            actionText.value = '🧤 SAVE!'
          } else {
            events.value.unshift(`💨 ${selectedMatch.value.awayTeam} shot wide (${matchMinute.value}')`)
            actionText.value = '💨 WIDE!'
          }
        }
      } else if (randomEvent < 0.5) {
        const foulTeam = attackingSide === 'home' ? selectedMatch.value.homeTeam : selectedMatch.value.awayTeam
        events.value.unshift(`🟨 Foul by ${foulTeam} (${matchMinute.value}')`)
        actionText.value = '🟨 FOUL!'
        
        if (attackingSide === 'home') {
          stats.value.homeYellowCards++
        } else {
          stats.value.awayYellowCards++
        }
      } else {
        events.value.unshift(`🔄 ${attackingSide === 'home' ? selectedMatch.value.homeTeam : selectedMatch.value.awayTeam} attacking (${matchMinute.value}')`)
        actionText.value = '⚡ ATTACK'
      }
    } else if (type === 'goal') {
      if (attackingSide === 'home') {
        homeScore.value++
        events.value.unshift(`⚽ GOAL! ${selectedMatch.value.homeTeam} scores! (${matchMinute.value}')`)
        actionText.value = '🎉 GOAL! 🎉'
        ballPosition.value = 90
        stats.value.homeShots++
        stats.value.homeShotsOnTarget++
      } else {
        awayScore.value++
        events.value.unshift(`⚽ GOAL! ${selectedMatch.value.awayTeam} scores! (${matchMinute.value}')`)
        actionText.value = '🎉 GOAL! 🎉'
        ballPosition.value = 10
        stats.value.awayShots++
        stats.value.awayShotsOnTarget++
      }
    }
    
    if (events.value.length > 8) events.value.pop()
    
    setTimeout(() => {
      actionText.value = '⚽'
      simulating.value = false
    }, 1200)
  }
  
  watch(selectedMatch, (newMatch) => {
    if (newMatch) {
      resetSimulation()
      updateSelectedMatchData(newMatch)
    }
  })
  </script>
  
  <style scoped>
  .custom-scroll::-webkit-scrollbar {
    height: 4px;
    width: 4px;
  }
  
  .custom-scroll::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.05);
    border-radius: 10px;
  }
  
  .custom-scroll::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.2);
    border-radius: 10px;
  }
  </style>