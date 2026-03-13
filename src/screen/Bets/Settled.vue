<script setup>
import { ref, onMounted, computed } from 'vue'
import { useBets } from '../composables/useBets'
import { useRouter } from 'vue-router'
import Loader from '../../assets/loader/default-spinner-BIEd0VkD.gif'
import { 
  ClockIcon, 
  HashtagIcon, 
  CurrencyDollarIcon, 
  ArrowTrendingUpIcon,
  BanknotesIcon,  
  TrophyIcon ,     
  CheckIcon
} from '@heroicons/vue/24/outline'



const { settledBets, isLoading, error, fetchUserBets, formatCurrency } = useBets()
const router = useRouter();


onMounted(async () => {
  await fetchUserBets()
})

const hasData = computed(() => {
  return settledBets.value && settledBets.value.length > 0
})

const formatBetDate = (dateString) => {
  if (!dateString) return { time: 'N/A', date: 'N/A' }
  const date = new Date(dateString)
  return {
    time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }
}

const getSelectionsCount = (bet) => {
  if (!bet.selections) return 0
  try {
    if (Array.isArray(bet.selections)) {
      return bet.selections.length
    }
    const parsed = JSON.parse(bet.selections)
    return Array.isArray(parsed) ? parsed.length : 0
  } catch (e) {
    console.error('Error parsing selections:', e)
    return 0
  }
}

const getStatusColor = (status) => {
  const colors = {
    open: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    won: 'bg-green-100 text-green-700 border-green-200',
    lost: 'bg-red-100 text-red-700 border-red-200',
    pending: 'bg-blue-100 text-blue-700 border-blue-200'
  }
  return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200'
}

// Calculate total stake
const totalStake = computed(() => {
  return settledBets.value.reduce((sum, bet) => sum + Number(bet.stake || 0), 0)
})

// Calculate total potential return
const totalPotentialReturn = computed(() => {
  return settledBets.value.reduce((sum, bet) => sum + Number(bet.potentialReturn || 0), 0)
})


const goToBetDetails = (bet) => {
    router.push({
        path: `/bets/regular/${bet.id}`,
        state: {
            allBets: settledBets.value,
            currentBet: bet
        }
    });
}
</script>

<template>
  <div class="bets-list-container px-4 py-4 max-w-3xl mx-auto">
    <!-- LOADER -->
    <div v-if="isLoading" class="flex justify-center items-center h-96">
      <div class="relative">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <img :src="Loader" alt="Loading..." class="h-8 w-8 absolute top-2 left-2 opacity-0" />
      </div>
    </div>

    <!-- ERROR -->
    <div v-else-if="error" class="flex justify-center items-center h-96">
      <div class="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-md">
        <div class="text-red-500 text-5xl mb-4">⚠️</div>
        <p class="text-red-700 font-medium mb-2">Oops! Something went wrong</p>
        <p class="text-sm text-red-500">{{ error }}</p>
        <button 
          @click="fetchUserBets" 
          class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
        >
          Try Again
        </button>
      </div>
    </div>

    <div v-else>
      <!-- HAS DATA -->
      <section v-if="hasData" class="space-y-4 ">
       

        <!-- Bet Cards -->
        <div 
          v-for="bet in settledBets" 
          :key="bet.id"
          @click="goToBetDetails(bet)"
          class="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden"
        >
          <!-- Header with Gradient -->
          <div class="bg-gradient-to-r from-gray-50 to-white px-2  py-2 border-b border-gray-100">

            <div class="flex justify-between items-center bg-transparent mb-1"> 

                <div class="flex gap-2 flex-row items-center justify-center rounded-[14px] bg-emerald-700 px-2 py-1">
                    <div class=" p-1 rounded-full bg-white flex items-center justify-center  ">
                      <CheckIcon class="w-3 h-3  text-emerald-600  font-bold" />
                    </div>
                    <span  class="text-xs font-bold text-amber-100">{{ (bet.result).toUpperCase() }}</span>
                    <span class="text-xs font-bold text-amber-100">(2/2)</span>
                </div>
                <div class="flex flex-row items-center justify-center">
                        <span class="text-sm text-gray-400 font-extrabold">ID:</span>
                        <span class="text-sm font-bold text-gray-400 px-2">  #{{ bet.id.toString().slice(0,8) }}</span>

                </div>
            </div>


            <div class="flex items-center space-x-2 py-1">
                    <span class="text-sm font-medium text-gray-900">{{ formatBetDate(bet.createdAt).time }}</span>
                    <span class="text-xs text-gray-400">•</span>
                    <span class="text-sm text-gray-600">{{ formatBetDate(bet.createdAt).date }}</span>
            </div>
          </div>

         

          <!-- Main Content -->
          <div class="px-2 py-2">
            <!-- Stats Grid -->
            <div class="flex flex-row items-center justify-between">
              <!-- Stake -->
              <div class="flex flex-col">
                <div class="flex items-center ">
                  <CurrencyDollarIcon class="w-4 h-4 text-gray-400 mr-1" />
                  <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Stake</span>
                </div>
                <div class="gap-1 flex items-center rounded-lg  ">
                  <span class="text-xs font-bold text-gray-900">TSh:</span>
                  <span class="text-xs font-bold text-gray-900 ">{{ Number(bet.stake).toLocaleString() }}</span>
                </div>

              </div>

              <!-- Odds -->
              <div class="flex flex-col">
                <div class="flex items-center ">
                  <ArrowTrendingUpIcon class="w-4 h-4 text-gray-400 mr-1" />
                  <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Odds</span>
                </div>
                <div class="rounded-lg ">
                  <span class="text-xs font-bold text-yellow-700">{{ Number(bet.totalOdds).toFixed(2) }}</span>
                </div>
              </div>

              <!-- Potential Win -->
              <div class="flex flex-col">
                <div class="flex items-center ">
                  <BanknotesIcon class="w-4 h-4 text-gray-400 mr-1" />  
                  <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Cashout</span>
                </div>
                <div class=" rounded-lg gap-1 flex items-center">
                  <span class="text-sm font-medium text-green-600">TSh:</span>
                  <span class="text-sm font-bold text-green-700 ">{{ Number(bet.potentialReturn).toLocaleString() }}</span>
                </div>
              </div>


            </div>

           

          </div>

          <!-- Footer with Match Info -->
          <div v-if="bet.match" class="bg-gray-50 px-5 py-3 border-t border-gray-100">
            <div class="flex items-center text-xs text-gray-600">
              <span class="font-medium">⚽ {{ bet.match }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- NO DATA - Enhanced Empty State -->
      <section v-else class="flex flex-col items-center justify-center min-h-[60vh]">
        <div class="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md">
          <div class="relative mb-6">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl opacity-20"></div>
            <svg class="relative w-32 h-32 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">No Open Bets</h3>
          <p class="text-gray-500 mb-8">You don't have any active bets at the moment. Start betting now!</p>
          <a 
            href="/events" 
            class="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span>Browse Matches</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* Smooth transitions */
.bet-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.bet-card:hover {
  transform: translateY(-2px);
}

/* Custom scrollbar */
.bets-list-container::-webkit-scrollbar {
  width: 6px;
}

.bets-list-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.bets-list-container::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 10px;
}

.bets-list-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Loading animation */
@keyframes pulse-ring {
  0% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}

/* Ensure SVGs are hidden initially if sprites not loaded */
svg use {
  display: none;
}
</style>