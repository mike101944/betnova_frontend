<!-- availableGames.vue -->
<template>
    <div>
        <!-- Skeleton Loading -->
        <div v-if="loading" class="space-y-2">
            <!-- Skeleton for Sliding Banner / Card -->
            <div class="relative flex items-center justify-between w-full h-42 bg-gradient-to-r from-sky-800 to-sky-900 rounded-xl overflow-hidden animate-pulse">
                <!-- <div class="absolute inset-0 bg-gradient-to-r from-amber-100/20 to-transparent"></div> -->
                <div class="absolute flex items-center justify-between w-full p-12">
                    <div class="h-10 bg-sky-700/50 rounded-full w-10 "></div>
                    <div class="h-10 rounded-full  bg-sky-700/50  w-10"></div>
                </div>
            </div>

            <!-- Skeleton for League Horizontal List -->
            <div class=" py-1">
                <div class="flex gap-3 overflow-x-auto" style="-webkit-overflow-scrolling: touch;">
                    <div v-for="i in 8" :key="i" class="flex-shrink-0">
                        <div class="px-4 py-2 bg-sky-800/50 rounded-lg h-10 w-24 animate-pulse"></div>
                    </div>
                </div>
            </div>

       

            <!-- Skeleton for Casino Games Horizontal List -->
            <div class=" py-1">
                <div class="flex gap-4 overflow-x-auto" style="-webkit-overflow-scrolling: touch;">
                    <div v-for="i in 6" :key="i" class="flex-shrink-0">
                        <div class="w-24 h-[110px]  bg-gradient-to-br from-sky-800 to-sky-900 rounded-xl animate-pulse"></div>
                        <!-- <div class="h-3 bg-sky-800/50 rounded w-16 mx-auto mt-2"></div> -->
                    </div>
                </div>
            </div>

            <!-- Skeleton for Football Section Header -->
            <div class=" py-2">
                <div class="flex justify-between items-center bg-sky-800/50">
                    <div class="flex items-center gap-2">
                        <div class="w-6 h-6 bg-sky-800/50 rounded-full animate-pulse"></div>
                        <div class="h-6 bg-sky-800/50 rounded w-24"></div>
                    </div>
                    <div class="h-5 bg-sky-800/50 rounded w-20"></div>
                </div>
            </div>

            <!-- Skeleton for Football Matches -->
            <div class="space-y-2 ">
                

                <!-- Skeleton Loading -->
    <div v-if="loading" class="divide-y divide-sky-800/30">
      <!-- Skeleton Item 1 -->
      <div class="border-b border-sky-950 p-3 animate-pulse">
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

      <!-- Skeleton Item 2 -->
      <div class="border-b border-sky-950 p-3 animate-pulse">
        <div class="flex justify-between items-center mb-3">
          <div class="h-4 bg-sky-800 rounded w-20"></div>
          <div class="h-4 bg-sky-800 rounded w-24"></div>
        </div>
        
        <div class="space-y-2 mb-3">
          <div class="h-5 bg-sky-800 rounded w-2/3"></div>
          <div class="h-5 bg-sky-800 rounded w-2/3"></div>
        </div>
        
        <div class="h-3 bg-sky-800 rounded w-28 mb-4"></div>
        
        <div class="flex gap-2">
          <div class="flex-1 h-10 bg-sky-800 rounded"></div>
          <div class="flex-1 h-10 bg-sky-800 rounded"></div>
          <div class="flex-1 h-10 bg-sky-800 rounded"></div>
          <div class="w-12 h-10 bg-sky-800 rounded"></div>
        </div>
      </div>

      <!-- Skeleton Item 3 -->
      <div class="border-b border-sky-950 p-3 animate-pulse">
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
            </div>
        </div>

        <!-- Actual Content -->
        <div v-else>
            <HomeCanvaCard/>
            <LeagueShortcut :activeLeagueId="selectedLeagueId" @league-changed="updateLeague"/>
            <CasionoGames/>
            <Football :leagueId="selectedLeagueId"/>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Football from '../../components/Middle/components/Football.vue';
import LiveMatches from '../../components/Middle/components/LiveMatches.vue'
import CasionoGames from '../../components/Middle/components/CasionoGames.vue'
import Efootball from '../../components/Middle/components/Efootball.vue'
import BasketBall from '../../components/Middle/components/BasketBall.vue'
import Tennis from '../../components/Middle/components/Tennis.vue'
import HomeCanvaCard from '../../components/Middle/components/CanvaCard/HomeCanvaCard.vue'
import LeagueShortcut from '../../components/Middle/components/leagueShortcut/LeagueShortcut.vue';

const selectedLeagueId = ref(11); // Default iwe 'Live' au unayotaka
const loading = ref(true);

const updateLeague = (id) => {
    selectedLeagueId.value = id;
};

// Simulate loading time
onMounted(() => {
    setTimeout(() => {
        loading.value = false;
    }, 1500); // 1.5 seconds loading time
});
</script>

<style lang="scss" scoped>
/* Hide scrollbar for skeleton loading */
.overflow-x-auto {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.overflow-x-auto::-webkit-scrollbar {
    display: none;
}
</style>