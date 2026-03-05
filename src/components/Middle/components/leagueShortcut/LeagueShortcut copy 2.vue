<script setup>
import { computed } from 'vue'

const leagues = [
  { 
    id: 1, 
    name: 'Premier League', 
    icon: 'premier-league', 
    count: 12, 
    link: '/football/england/premier-league',
    country: 'England',
    live: true
  },
  { 
    id: 2, 
    name: 'La Liga', 
    icon: 'laliga', 
    count: 8, 
    link: '/football/spain/la-liga',
    country: 'Spain',
    live: false
  },
  { 
    id: 3, 
    name: 'Serie A', 
    icon: 'serie-a', 
    count: 6, 
    link: '/football/italy/serie-a',
    country: 'Italy',
    live: true
  },
  { 
    id: 4, 
    name: 'Bundesliga', 
    icon: 'bundesliga', 
    count: 9, 
    link: '/football/germany/bundesliga',
    country: 'Germany',
    live: false
  },
  { 
    id: 5, 
    name: 'Ligue 1', 
    icon: 'ligue-1', 
    count: 5, 
    link: '/football/france/ligue-1',
    country: 'France',
    live: false
  },
  { 
    id: 6, 
    name: 'UEFA Champions League', 
    icon: 'champions-league', 
    count: 4, 
    link: '/football/europe/champions-league',
    country: 'Europe',
    live: true
  },
  { 
    id: 7, 
    name: 'Eredivisie', 
    icon: 'eredivisie', 
    count: 3, 
    link: '/football/netherlands/eredivisie',
    country: 'Netherlands',
    live: false
  },
  { 
    id: 8, 
    name: 'Primeira Liga', 
    icon: 'primeira-liga', 
    count: 4, 
    link: '/football/portugal/primeira-liga',
    country: 'Portugal',
    live: false
  },
  { 
    id: 9, 
    name: 'Turkish Super Lig', 
    icon: 'super-lig', 
    count: 7, 
    link: '/football/turkey/super-lig',
    country: 'Turkey',
    live: true
  },
  { 
    id: 10, 
    name: 'MLS', 
    icon: 'mls', 
    count: 10, 
    link: '/football/usa/mls',
    country: 'USA',
    live: true
  }
]

const liveLeagues = computed(() => leagues.filter(l => l.live))
</script>

<template>
  <div class="p-4 space-y-4">
    <!-- Live Leagues Section -->
    <div v-if="liveLeagues.length" class="space-y-2">
      <h3 class="text-sm font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-2">
        <span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        Live Now
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
        <a 
          v-for="league in liveLeagues" 
          :key="league.id"
          :href="league.link"
          class="flex flex-row gap-3 rounded-lg border border-amber-50 p-2 text-white items-center bg-gradient-to-r from-emerald-900 to-emerald-800 hover:from-emerald-800 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <div class="w-6 h-6 flex items-center justify-center">
            <svg class="svg-icon w-5 h-5 text-white" style="vertical-align: middle;">
              <use :xlink:href="`#icon-${league.icon}`"></use>
            </svg>
          </div>
          <div class="flex-1 font-medium">{{ league.name }}</div>
          <div class="flex items-center gap-2">
            <span class="text-xs bg-emerald-700 px-2 py-1 rounded-full">
              {{ league.count }}
            </span>
            <span class="text-xs bg-red-500 px-2 py-1 rounded-full animate-pulse">
              LIVE
            </span>
          </div>
        </a>
      </div>
    </div>

    <!-- All Leagues -->
    <div class="space-y-2">
      <h3 class="text-sm font-semibold text-gray-600 uppercase tracking-wider">
        Popular Leagues
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
        <a 
          v-for="league in leagues" 
          :key="league.id"
          :href="league.link"
          class="flex flex-row gap-3 rounded-lg border border-amber-50 p-2 text-white items-center bg-emerald-900 hover:bg-emerald-800 transition-colors duration-200 shadow-sm hover:shadow-md"
          :class="{ 'opacity-75': !league.live }"
        >
          <div class="w-6 h-6 flex items-center justify-center">
            <svg class="svg-icon w-5 h-5 text-white" style="vertical-align: middle;">
              <use :xlink:href="`#icon-${league.icon}`"></use>
            </svg>
          </div>
          <div class="flex-1 font-medium">{{ league.name }}</div>
          <div class="flex items-center gap-2">
            <span class="text-xs bg-emerald-700 px-2 py-1 rounded-full">
              {{ league.count }}
            </span>
            <span v-if="league.live" class="text-xs bg-red-500 px-2 py-1 rounded-full">
              LIVE
            </span>
          </div>
        </a>
      </div>
    </div>

    <!-- View All Link -->
    <div class="pt-2 text-center">
      <a href="/football/leagues" class="text-sm text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1">
        View All Leagues
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  </div>
</template>

<style scoped>
/* Optional: Add any custom animations or styles */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Smooth hover effects */
a {
  transition: all 0.2s ease-in-out;
}

/* Custom pulse animation for live indicator */
@keyframes soft-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse {
  animation: soft-pulse 2s infinite;
}
</style>