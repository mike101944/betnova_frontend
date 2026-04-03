<template>
  <div class="h-full bg-sky-900">
    
    <!-- Header Section -->
    <div class=" shadow-xl bg-sky-950  sticky top-0 z-50">
      <div class="  px-3 border-b backdrop-blur-3xl border-amber-50 shadow-lg shadow-amber-100  py-4">
        <div class="flex flex-col md:flex-row justify-between  gap-4">
          <!-- Logo & Title -->
          <div class="flex items-center justify-between gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-yellow-200 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg">
              <span class="text-2xl">🎰</span>
            </div>
            <div>
              <h1 class="text-sm md:text-sm text-amber-100 font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text ">
                Premium Casino
              </h1>
              <p class="text-gray-400 text-sm">Play the best casino games online</p>
            </div>
          </div>

          <!-- Stats -->
          <div class="flex gap-6 justify-between">
            <div class="text-center">
              <div class="text-yellow-400 text-xs font-bold">{{ games.length }}+</div>
              <div class="text-amber-400 text-xs">Games</div>
            </div>
            <div class="text-center">
              <div class="text-green-400 text-xs font-bold">24/7</div>
              <div class="text-gray-400 text-xs">Support</div>
            </div>
            <button 
              @click="goBack"
              class="px-6 py-2 bg-transparent text-amber-100 font-bold rounded-lg border border-amber-200 hover:from-yellow-400 hover:to-yellow-500 transition-all shadow-lg"
            >
              ⬅ Back
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Games Grid -->
    <div class="container mx-auto px-2 py-8">
      <!-- Filter & Search Bar -->
      <div class="mb-8 flex flex-col gap-4 justify-between items-center">
        <div class="relative w-full"> 
  <!-- Left Gradient (optional - visual indicator) -->
  <div class="absolute left-0 top-0 bottom-0 w-8  z-10 pointer-events-none"></div>
  
  <!-- Scrollable Buttons Container -->
  <div class="flex gap-3 overflow-x-auto scroll-smooth hide-scrollbar" 
         style="-webkit-overflow-scrolling: touch;">
    <button 
      v-for="category in categories" 
      :key="category"
      @click="activeCategory = category"
      class="px-5 py-2 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap flex-shrink-0"
      :class="activeCategory === category 
        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 shadow-lg' 
        : 'bg-sky-950 text-gray-300 hover:bg-gray-700'"
    >
      {{ category }}
    </button>
  </div>

  <!-- Right Gradient (optional - visual indicator) -->
  <div class="absolute right-0 top-0 bottom-0 w-8 bg-transparent z-10 pointer-events-none"></div>
</div>


        
        <div class="relative">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search games..." 
            class="px-4 py-2 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 w-64"
          >
          <span class="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      <!-- Games Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">
        <!-- <div 
          v-for="game in filteredGames" 
          :key="game.id"
          @click="playGame(game)"
          class="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl hover:shadow-yellow-500/20 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
        > -->
        <div 
          v-for="game in filteredGames" 
          :key="game.id"
          class="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl hover:shadow-yellow-500/20 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
        >
          <!-- Premium Badge -->
          <div v-if="game.isPopular" class="absolute top-3 right-3 z-10">
            <span class="bg-gradient-to-r from-yellow-500 to-orange-500 text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
              🔥 POPULAR
            </span>
          </div>

          <div v-if="game.isNew" class="absolute top-3 left-3 z-10">
            <span class="bg-gradient-to-r from-green-500 to-emerald-500 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              ✨ NEW
            </span>
          </div>

          <!-- Game Image/Icon -->
          <div class="relative h-48 overflow-hidden bg-gradient-to-br from-sky-700 to-sky-800">
            <div class="absolute inset-0 bg-gradient-to-t from-sky-900 via-transparent to-transparent"></div>
            <div class="w-full h-full flex items-center justify-center text-8xl group-hover:scale-110 transition-transform duration-500">
              {{ game.icon }}
            </div>
            
            <!-- Overlay on hover -->
            <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button class="px-6 py-3 bg-yellow-500 text-gray-900 font-bold rounded-full transform scale-90 group-hover:scale-100 transition-all duration-300 shadow-xl">
                Play Now →
              </button>
            </div>
          </div>

          <!-- Game Info -->
          <div class="p-5">
            <div class="flex justify-between items-start mb-3">
              <h3 class="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                {{ game.name }}
              </h3>
              <div class="flex items-center gap-1 bg-gray-700 px-2 py-1 rounded-lg">
                <span class="text-yellow-400 text-sm">★</span>
                <span class="text-white text-sm font-bold">{{ game.rating }}</span>
              </div>
            </div>

            <p class="text-gray-400 text-sm mb-4 line-clamp-2">
              {{ game.description }}
            </p>

            <div class="flex justify-between items-center">
              <div class="flex gap-2">
                <span class="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">
                  {{ game.provider }}
                </span>
                <span v-if="game.minBet" class="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">
                  Min: ${{ game.minBet }}
                </span>
              </div>
              <div class="text-yellow-500 font-bold">
                {{ game.gameType }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div v-if="filteredGames.length === 0" class="text-center py-20">
        <div class="text-6xl mb-4">🎲</div>
        <h3 class="text-2xl font-bold text-white mb-2">No games found</h3>
        <p class="text-gray-400">Try adjusting your search or filter</p>
      </div>
    </div>

    <!-- Footer -->
    <div class="bg-gradient-to-r from-sky-900 to-sky-800 mt-12 py-6 border-t border-gray-700">
      <div class="container mx-auto px-4 text-center">
        <p class="text-gray-400 text-sm">© 2024 Premium Casino. All rights reserved. 18+ Only. Play Responsibly.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const gameId = route.params.id

const searchQuery = ref('')
const activeCategory = ref('All')

const categories = ['All', 'Slots', 'Table Games', 'Live Casino', 'Jackpots', 'Video Poker']

const games = ref([
  { id: 1, name: 'Starburst', description: 'Classic space-themed slot with expanding wilds and re-spins. High volatility with massive win potential.', icon: '💎', rating: 4.8, provider: 'NetEnt', minBet: 0.10, gameType: 'Slot', isPopular: true, isNew: false, category: 'Slots' },
  { id: 2, name: 'Mega Moolah', description: 'Progressive jackpot slot that has paid millions. African safari theme with 4 jackpots.', icon: '🦁', rating: 4.9, provider: 'Microgaming', minBet: 0.25, gameType: 'Jackpot', isPopular: true, isNew: false, category: 'Jackpots' },
  { id: 3, name: 'Blackjack', description: 'Classic 21 card game. Play against dealer with real-time strategy and side bets.', icon: '♠️', rating: 4.7, provider: 'Evolution', minBet: 5, gameType: 'Table', isPopular: true, isNew: false, category: 'Table Games' },
  { id: 4, name: 'Roulette', description: 'European roulette with multiple betting options. HD streaming and professional dealers.', icon: '🎡', rating: 4.6, provider: 'Playtech', minBet: 1, gameType: 'Table', isPopular: false, isNew: false, category: 'Table Games' },
  { id: 5, name: 'Gonzo\'s Quest', description: 'Avalanche mechanic with increasing multipliers. Search for Eldorado in this adventure slot.', icon: '🗿', rating: 4.8, provider: 'NetEnt', minBet: 0.20, gameType: 'Slot', isPopular: true, isNew: false, category: 'Slots' },
  { id: 6, name: 'Book of Dead', description: 'Egyptian-themed slot with free spins and expanding symbols. High volatility adventure.', icon: '📖', rating: 4.7, provider: 'Play\'n GO', minBet: 0.10, gameType: 'Slot', isPopular: true, isNew: false, category: 'Slots' },
  { id: 7, name: 'Live Baccarat', description: 'Real dealers, real-time action. Squeeze feature and multiple camera angles.', icon: '🎴', rating: 4.9, provider: 'Evolution', minBet: 10, gameType: 'Live', isPopular: false, isNew: true, category: 'Live Casino' },
  { id: 8, name: 'Video Poker', description: 'Jacks or Better with optimal strategy trainer. 99.5% RTP when played perfectly.', icon: '🃏', rating: 4.5, provider: 'IGT', minBet: 0.25, gameType: 'Poker', isPopular: false, isNew: false, category: 'Video Poker' },
  { id: 9, name: 'Dead or Alive 2', description: 'Wild West themed slot with 3 different free spin features. High volatility.', icon: '🤠', rating: 4.8, provider: 'NetEnt', minBet: 0.09, gameType: 'Slot', isPopular: true, isNew: false, category: 'Slots' },
  { id: 10, name: 'Lightning Roulette', description: 'RNG roulette with lucky numbers and multiplied payouts up to 500x.', icon: '⚡', rating: 4.7, provider: 'Evolution', minBet: 1, gameType: 'Live', isPopular: true, isNew: false, category: 'Live Casino' },
  { id: 11, name: 'Crazy Time', description: 'Money wheel with 4 bonus games. Multipliers and interactive gameplay.', icon: '🎯', rating: 4.9, provider: 'Evolution', minBet: 0.10, gameType: 'Live', isPopular: true, isNew: false, category: 'Live Casino' },
  { id: 12, name: 'Immortal Romance', description: 'Vampire-themed slot with Chamber of Spins feature. 4 different free spin modes.', icon: '🧛', rating: 4.6, provider: 'Microgaming', minBet: 0.30, gameType: 'Slot', isPopular: false, isNew: false, category: 'Slots' },
  { id: 13, name: 'Texas Hold\'em', description: 'Play against AI opponents. Tournament and cash game modes.', icon: '🃟', rating: 4.5, provider: 'Pragmatic', minBet: 5, gameType: 'Poker', isPopular: false, isNew: false, category: 'Table Games' },
  { id: 14, name: 'Sweet Bonanza', description: 'Candy-themed slot with tumbling reels and free spins. Buy bonus feature available.', icon: '🍬', rating: 4.8, provider: 'Pragmatic', minBet: 0.20, gameType: 'Slot', isPopular: true, isNew: true, category: 'Slots' },
  { id: 15, name: 'Monopoly Live', description: 'Augmented reality Monopoly with Chance and Community Chest. 2D/3D hybrid.', icon: '🎲', rating: 4.7, provider: 'Evolution', minBet: 0.50, gameType: 'Live', isPopular: true, isNew: false, category: 'Live Casino' },
  { id: 16, name: 'Wolf Gold', description: 'Native American themed slot with 3 jackpots. Money respin feature.', icon: '🐺', rating: 4.6, provider: 'Pragmatic', minBet: 0.25, gameType: 'Jackpot', isPopular: false, isNew: false, category: 'Jackpots' },
  { id: 17, name: 'Craps', description: 'Dice game with multiple betting options. Practice mode available.', icon: '🎲', rating: 4.4, provider: 'Playtech', minBet: 5, gameType: 'Table', isPopular: false, isNew: false, category: 'Table Games' },
  { id: 18, name: 'Mega Fortune', description: 'Luxury-themed progressive jackpot slot. 3 different jackpot levels.', icon: '💎', rating: 4.8, provider: 'NetEnt', minBet: 0.25, gameType: 'Jackpot', isPopular: true, isNew: false, category: 'Jackpots' },
  { id: 19, name: 'Dream Catcher', description: 'Money wheel with multipliers. Simple and fast-paced gameplay.', icon: '🎯', rating: 4.5, provider: 'Evolution', minBet: 0.10, gameType: 'Live', isPopular: false, isNew: false, category: 'Live Casino' },
  { id: 20, name: 'Jammin Jars', description: 'Fruit-themed slot with jar multipliers and dancing feature. Cluster pays mechanic.', icon: '🍎', rating: 4.7, provider: 'Push Gaming', minBet: 0.20, gameType: 'Slot', isPopular: true, isNew: false, category: 'Slots' },
  { id: 21, name: 'Andar Bahar', description: 'Traditional Indian card game. Fast-paced with side bets.', icon: '🃟', rating: 4.6, provider: 'Ezugi', minBet: 1, gameType: 'Live', isPopular: false, isNew: true, category: 'Live Casino' },
  { id: 22, name: 'Mystic Chief', description: 'Aztec-themed slot with free spins and multipliers. High win potential.', icon: '🗿', rating: 4.7, provider: 'Pragmatic', minBet: 0.20, gameType: 'Slot', isPopular: false, isNew: true, category: 'Slots' },
  { id: 23, name: 'Sic Bo', description: 'Ancient Chinese dice game. Multiple betting combinations.', icon: '🎲', rating: 4.4, provider: 'Evolution', minBet: 1, gameType: 'Live', isPopular: false, isNew: false, category: 'Live Casino' },
  { id: 24, name: 'Big Bass Bonanza', description: 'Fishing-themed slot with money collect feature. Free spins with multipliers.', icon: '🐟', rating: 4.8, provider: 'Pragmatic', minBet: 0.10, gameType: 'Slot', isPopular: true, isNew: false, category: 'Slots' }
])

const filteredGames = computed(() => {
  let filtered = games.value
  
  if (activeCategory.value !== 'All') {
    filtered = filtered.filter(game => game.category === activeCategory.value)
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(game => 
      game.name.toLowerCase().includes(query) || 
      game.description.toLowerCase().includes(query) ||
      game.provider.toLowerCase().includes(query)
    )
  }
  
  return filtered
})

const goBack = () => {
  router.back()
}

const playGame = (game) => {
  router.push(`/casino-game/${game.id}`)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1f2937;
}

::-webkit-scrollbar-thumb {
  background: #f59e0b;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #d97706;
}
</style>