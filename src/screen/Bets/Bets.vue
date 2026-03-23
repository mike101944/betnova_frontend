<script setup>
import { useRoute } from 'vue-router'
import { ref, computed } from 'vue'

const route = useRoute()

// Helper to check active route
const isActive = (path) => {
  return route.path.startsWith(path)
}

const items = ref([
  {
    id: 'BET001',
    match: 'Manchester United vs Arsenal',
    betType: '1X2',
    selection: '1',
    odds: 2.45,
    amount: 5000,
    potentialWin: 12250,
    status: 'open',
    placedAt: '2024-01-15 14:30',
    matchDate: '2024-01-20 20:00'
  },
  {
    id: 'BET002',
    match: 'Liverpool vs Chelsea',
    betType: 'Over/Under',
    selection: 'Over 2.5',
    odds: 1.85,
    amount: 3000,
    potentialWin: 5550,
    status: 'won',
    placedAt: '2024-01-14 10:15',
    matchDate: '2024-01-18 19:45'
  }
])

// Count open bets
const openBetsCount = computed(() => {
  return items.value.filter(item => item.status === 'open').length
})
</script>

<template>
  <div class="my-bets-page w-full h-full mx-auto pb-2.5 bg-sky-900/90 text-gray-700 relative">
    <div class="my-bets">
      <div class="tabs relative w-full">
        <!-- Tabs Menu -->
        <ul class="tabs-menu flex list-none select-none border-t border-gray-200">
          <!-- Open tab -->
          <router-link 
            to="/bets" 
            :class="{ 
              'active': isActive('/bets') && !isActive('/bets/settled') && !isActive('/bets/jackpots') && !isActive('/bets/virtuals'),
              'border-l': true,
              'tabs-selector': true
            }" 
            class="flex-1 overflow-hidden cursor-pointer  py-4 bg-sky-950 first:border-l-0 not-last:border-r-0"
            data-test-id="tabs-pending"
          >
            <div class="tab-item h-full ">
              <div class="tab-item-border flex items-center justify-center h-full">
                <span class="tab-text text-sm whitespace-nowrap overflow-hidden text-ellipsis">Open</span>
                <!-- <span 
                  class="tab-counter flex items-center justify-center w-4 h-4 ml-1 text-[10px] rounded-full"
                  :class="openBetsCount > 0 ? 'bg-green-200' : 'bg-gray-200'"
                >
                  {{ openBetsCount }}
                </span> -->
              </div>
            </div>
          </router-link>
          
          <!-- Settled tab -->
          <router-link 
            to="/bets/settled" 
            :class="{ 
              active: isActive('/bets/settled'),
              'tabs-selector': true
            }" 
            class="flex-1 overflow-hidden cursor-pointer  bg-white not-last:border-r-0"
            data-test-id="tabs-settled"
          >
            <div class="tab-item h-full">
              <div class="tab-item-border flex items-center justify-center h-full">
                <span class="tab-text text-sm whitespace-nowrap overflow-hidden text-ellipsis">Settled</span>
              </div>
            </div>
          </router-link>
          
          <!-- Jackpots tab -->
          <router-link 
            to="/bets/jackpots" 
            :class="{ 
              active: isActive('/bets/jackpots'),
              'tabs-selector': true
            }" 
            class="flex-1 overflow-hidden cursor-pointer  bg-white not-last:border-r-0"
            data-test-id="tabs-jackpot"
          >
            <div class="tab-item h-full">
              <div class="tab-item-border flex items-center justify-center h-full">
                <span class="tab-text text-sm whitespace-nowrap overflow-hidden text-ellipsis">Jackpots</span>
              </div>
            </div>
          </router-link>
          
          <!-- Virtuals tab -->
          <router-link 
            to="/bets/virtuals" 
            :class="{ 
              active: isActive('/bets/virtuals'),
              'border-r-0': true,
              'tabs-selector': true
            }" 
            class="flex-1 overflow-hidden cursor-pointer bg-transparent"
            data-test-id="tabs-virtual"
          >
            <div class="tab-item h-full">
              <div class="tab-item-border flex items-center justify-center h-full">
                <span class="tab-text text-sm whitespace-nowrap overflow-hidden text-ellipsis">Virtuals</span>
              </div>
            </div>
          </router-link>
        </ul>
        
        <!-- Router View for tab content -->
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Minimal custom styles since Tailwind handles most */

</style>