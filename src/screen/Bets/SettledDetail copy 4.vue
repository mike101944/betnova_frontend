<!-- pages/BetDetail.vue -->
<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import { useBets } from '../composables/useBets'
import { 
  ClockIcon, 
  HashtagIcon, 
  CurrencyDollarIcon, 
  ArrowTrendingUpIcon,
  BanknotesIcon,  
  TrophyIcon,     
  CheckIcon,
  DocumentTextIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const { settledBets, isLoading, fetchUserBets } = useBets()

const betId = route.params.id
const error = ref(null)
const showRawJson = ref(false)

// Tafuta bet moja kwa moja kutoka settledBets
const bet = computed(() => {
  if (!settledBets.value) return null
  return settledBets.value.find(b => b.id.toString() === betId.toString())
})

// Parse selections
const parsedSelections = computed(() => {
  if (!bet.value?.selections) return []
  try {
    return typeof bet.value.selections === 'string' 
      ? JSON.parse(bet.value.selections) 
      : bet.value.selections
  } catch (e) {
    console.error('Error parsing selections:', e)
    return []
  }
})

// Get all bet keys except selections
const betKeys = computed(() => {
  if (!bet.value) return []
  return Object.keys(bet.value).filter(key => key !== 'selections')
})

// Format value for display
const formatValue = (value) => {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

// Get selection count
const getSelectionsCount = (bet) => {
  if (!bet?.selections) return 0
  try {
    if (Array.isArray(bet.selections)) {
      return bet.selections.length
    }
    const parsed = JSON.parse(bet.selections)
    return Array.isArray(parsed) ? parsed.length : 0
  } catch (e) {
    return 0
  }
}

onMounted(async () => {
  // Hakikisha data imeload
  if (!settledBets.value || settledBets.value.length === 0) {
    await fetchUserBets()
  }
  
  // Check kama bet ipo
  if (!bet.value) {
    error.value = 'Bet not found'
  }
})

const goBack = () => {
  router.back()
}

// Copy getStatusColor kutoka kwenye settled component
const getStatusColor = (status) => {
  const colors = {
    open: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    won: 'bg-green-100 text-green-700 border-green-200',
    lost: 'bg-red-100 text-red-700 border-red-200',
    pending: 'bg-blue-100 text-blue-700 border-blue-200'
  }
  return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200'
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-6">
    <!-- Back button -->
    <button 
      @click="goBack"
      class="flex items-center text-gray-900 mb-4 group"
    >
      <svg class="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Back to Settled Bets
    </button>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
      <InformationCircleIcon class="w-16 h-16 text-red-500 mx-auto mb-4" />
      <p class="text-red-700 font-medium mb-2">Error Loading Bet</p>
      <p class="text-sm text-red-500">{{ error }}</p>
    </div>

    <!-- Bet Details -->
    <div v-else-if="bet" class="space-y-6">
      <!-- Header Card -->
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-2xl font-bold flex items-center gap-2">
              <DocumentTextIcon class="w-8 h-8" />
              Bet Details
            </h1>
            <p class="text-blue-100 mt-1">ID: #{{ bet.id }}</p>
          </div>
          <div class="text-right">
            <div :class="`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(bet.status)}`">
              {{ bet.status?.toUpperCase() || 'UNKNOWN' }}
            </div>
          </div>
        </div>
      </div>



      <!-- custom card  -->
       <div class="flex flex-col bg-gradient-to-r from-sky-400 via-sky-600 to-sky-300 rounded-t-md">
        <div class="flex h-30 p-1 bg-gradient-tr from-sky-400 via-sky-700 to-sky-300">
            1
        </div>
        <div class="flex flex-col rounded-t-xl bg-white px-2 py-3 gap-2">
            <div class="flex flex-row items-center justify-between">
                <span>Odds:</span>
                <span class="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                  5
                </span>
            </div>
            <div class="flex flex-row items-center justify-between">
                <span>Stake:</span>
                <span>Tsh 4{{  }}</span>
            </div>
            <div class="flex flex-row items-center justify-between">
                <span>Potential Win:</span>
                <span>4{{  }}</span>
            </div>
            
        </div>

        hh
       </div>
      <!-- ============== SECTION 1: MAIN BET DATA ============== -->
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div class="bg-gray-800 px-6 py-4">
          <h2 class="text-lg font-semibold text-white flex items-center gap-2">
            <span class="w-2 h-2 bg-green-400 rounded-full"></span>
            Main Bet Information ({{ betKeys.length }} fields)
          </h2>
        </div>
        
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Loop through all bet keys -->
            <div v-for="key in betKeys" :key="key" 
                 class="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
              <div class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                {{ key }}
              </div>
              <div class="text-sm font-semibold text-gray-900 break-words">
                <!-- Special formatting for different types -->
                <template v-if="key.includes('date') || key.includes('Date') || key.includes('time') || key.includes('Time')">
                  {{ new Date(bet[key]).toLocaleString() }}
                </template>
                <template v-else-if="key.includes('amount') || key.includes('stake') || key.includes('return')">
                  TSh {{ Number(bet[key]).toLocaleString() }}
                </template>
                <template v-else>
                  {{ formatValue(bet[key]) }}
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ============== SECTION 2: SELECTIONS DATA ============== -->
      <div v-if="parsedSelections.length" class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div class="bg-gray-800 px-6 py-4 flex justify-between items-center">
          <h2 class="text-lg font-semibold text-white flex items-center gap-2">
            <span class="w-2 h-2 bg-yellow-400 rounded-full"></span>
            Selections ({{ parsedSelections.length }} items)
          </h2>
          <span class="text-xs bg-yellow-500 text-gray-900 px-3 py-1 rounded-full font-medium">
            Total Selections: {{ parsedSelections.length }}
          </span>
        </div>
        
        <div class="p-6 space-y-6">
          <!-- Loop through each selection -->
          <div v-for="(selection, idx) in parsedSelections" :key="idx" 
               class="border border-gray-200 rounded-xl overflow-hidden">
            
            <!-- Selection Header -->
            <div class="bg-gradient-to-r from-gray-100 to-white px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  {{ idx + 1 }}
                </div>
                <span class="font-semibold text-gray-700">Selection #{{ idx + 1 }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                  Odds: {{ selection.odds || selection.price || selection.Odds || 'N/A' }}
                </span>
              </div>
            </div>
            
            <!-- Selection Body - ALL fields -->
            <div class="p-5">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <!-- Loop through ALL keys in this selection -->
                <div v-for="(value, key) in selection" :key="key"
                     class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div class="text-xs text-gray-500 mb-1 font-medium">{{ key }}</div>
                  <div class="text-sm text-gray-800 break-words font-medium">
                    <!-- Special formatting for odds -->
                    <template v-if="key.toLowerCase().includes('odd')">
                      <span class="text-yellow-600 font-bold">{{ value }}</span>
                    </template>
                    <template v-else-if="key.toLowerCase().includes('game') || key.toLowerCase().includes('match')">
                      <span class="font-bold text-blue-600">{{ value }}</span>
                    </template>
                    <template v-else>
                      {{ formatValue(value) }}
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

     

      

      <!-- ============== SECTION 5: ALL DATA TABLE VIEW ============== -->
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div class="bg-gray-800 px-6 py-4">
          <h2 class="text-lg font-semibold text-white flex items-center gap-2">
            <span class="w-2 h-2 bg-red-400 rounded-full"></span>
            Complete Data Table View
          </h2>
        </div>
        
        <div class="p-6">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Field</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <!-- Main bet fields -->
              <tr v-for="key in betKeys" :key="key" class="hover:bg-gray-50">
                <td class="px-4 py-2 text-sm font-medium text-gray-700">{{ key }}</td>
                <td class="px-4 py-2 text-sm text-gray-900 break-words">
                  <template v-if="key.includes('date')">
                    {{ new Date(bet[key]).toLocaleString() }}
                  </template>
                  <template v-else>
                    {{ formatValue(bet[key]) }}
                  </template>
                </td>
              </tr>
              
              <!-- Selections as nested rows -->
              <tr v-if="parsedSelections.length">
                <td colspan="2" class="px-4 py-3 bg-gray-100 font-medium text-gray-700">
                  Selections Array ({{ parsedSelections.length }} items)
                </td>
              </tr>
              
              <tr v-for="(selection, idx) in parsedSelections" :key="'selection-'+idx">
                <td colspan="2" class="px-4 py-2">
                  <div class="ml-4 border-l-2 border-blue-200 pl-4">
                    <p class="font-medium text-blue-600 mb-2">Selection #{{ idx + 1 }}</p>
                    <table class="min-w-full">
                      <tr v-for="(value, key) in selection" :key="key" class="border-b border-gray-100">
                        <td class="py-1 text-xs text-gray-500 w-1/3">{{ key }}</td>
                        <td class="py-1 text-xs text-gray-800">{{ formatValue(value) }}</td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- No Data -->
    <div v-else class="text-center py-12 bg-white rounded-2xl shadow-xl">
      <DocumentTextIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <p class="text-gray-500">Bet not found</p>
    </div>
  </div>
</template>

<style scoped>
/* Smooth transitions */
.group:hover svg {
  transition: transform 0.2s ease;
}

/* Custom scrollbar for pre tags */
pre::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

pre::-webkit-scrollbar-track {
  background: #1f2937;
  border-radius: 4px;
}

pre::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}

pre::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>