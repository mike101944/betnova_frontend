<template>
    <div class="h-full bg-gray-50">
        <!-- Header with proper typography -->
        <div class="sticky top-0 bg-white border-b border-gray-200 z-10">
            <div class="max-w-3xl mx-auto px-4">
                <!-- Back Button -->
                <button @click="router.back()" 
                        class="inline-flex items-center py-3 text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">
                    <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span class="font-inter">Back to Bets</span>
                </button>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-20">
            <div class="relative">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <img :src="Loader" alt="Loading..." class="h-8 w-8 absolute top-2 left-2 opacity-0" />
      </div>
            <!-- <div class="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div> -->
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="max-w-3xl mx-auto px-4 py-12">
            <div class="bg-red-50 rounded-2xl p-8 text-center">
                <div class="text-red-500 text-5xl mb-4">⚠️</div>
                <p class="text-lg font-semibold text-red-700 mb-2 font-inter">Failed to load bet details</p>
                <p class="text-sm text-red-500 mb-4 font-inter">{{ error }}</p>
                <button @click="fetchBetDetails" 
                        class="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium text-sm font-inter transition-colors">
                    Try Again
                </button>
            </div>
        </div>

        <!-- Main Content -->
        <div v-else-if="bet" class="w-full mx-auto px-4 py-2">
            <!-- Success Banner - Professional Card Design -->
            <div class="relative bg-gradient-to-br from-sky-500 via-sky-600 to-teal-600 rounded-2xl shadow-xl overflow-hidden mb-3">
                <!-- Decorative Pattern -->
                <div class="absolute inset-0 opacity-10">
                    <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5"/>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)"/>
                    </svg>
                </div>

                <!-- Bet ID Badge -->
                <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3">
                    <div class="bg-white backdrop-blur-sm px-5 py-2 rounded-full shadow-lg border border-emerald-100">
                        <span class="text-xs font-medium text-gray-600 font-mono">BET ID</span>
                        <span class="ml-2 text-sm font-bold text-emerald-700 font-mono">#{{ bet?.id?.toString().slice(0, 10) }}</span>
                    </div>
                </div>

                <!-- Banner Content -->
                <div class="relative px-2 py-2">
                    <div class="flex items-center justify-between">
                        <div class="space-y-3">
                            <!-- Success Badge -->
                            <div class="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                                <TrophyIcon class="w-4 h-4 text-yellow-300 mr-1.5" />
                                <span class="text-xs font-semibold text-white uppercase tracking-wider font-inter">Winner!</span>
                            </div>
                            
                            <!-- Main Message -->
                            <div>
                                <h1 class="text-sm font-bold text-white mb-1 font-poppins">Congratulations!</h1>
                            </div>
                            
                            <!-- Prize Amount -->
                            <div class=" flex items-center justify-center gap-2">
                                <p class="text-xs font-medium text-emerald-200  tracking-wider font-inter">Total Payout</p>
                                <p class="text-sm font-black text-white font-poppins">{{ formatCurrency(calculateFinalPayout(bet)) }}</p>
                            </div>
                        </div>
                        
                        <!-- Decorative Trophy -->
                        <div class="">
                            <TrophyIcon class="w-20 h-20 text-white/20" />
                            <!-- <TrophyIcon class="w-4 h-4 text-yellow-300 mr-1.5" /> -->
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bet Summary Card -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-1 px-3 mb-1">
             
                <div class="flex items-center justify-between">
                        <span class="text-sm font-semibold text-gray-500 font-inter">Total Odds</span>
                        <span class="text-sm font-black text-gray-900 font-inter">{{ Number(bet.totalOdds).toFixed(2) }}</span>
                    </div>

                <div class="flex items-center justify-between">
                        <span class="text-sm font-semibold text-gray-500 font-inter">Stake</span>
                        <span class="text-xs font-black text-gray-900 font-inter">{{ formatCurrency(bet.stake) }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-semibold text-gray-700 font-inter">Gross Winnings</span>
                        <span class="text-xs font-black text-gray-900 font-inter">{{ formatCurrency(bet.potentialWin || bet.potentialReturn) }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-semibold text-gray-700 font-inter">Tax (10%)</span>
                        <span class="text-xs font-black text-gray-900 font-inter">- {{ formatCurrency(calculateTax(bet)) }}</span>
                    </div>

                <!-- Net Payout -->
                <div class="mt-4 pt-2 border-t border-gray-200">
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-semibold text-gray-700 font-inter">Net Payout</span>
                        <span class="text-sm font-black text-green-600 font-inter">{{ formatCurrency(calculateFinalPayout(bet)) }}</span>
                    </div>
                </div>
            </div>

            

            <!-- Selections Section -->
            <div class="space-y-2">
                
                <div v-for="(selection, index) in parsedSelections" :key="index" 
                     class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    
                    <!-- Selection Header -->
                    <div class="bg-gradient-to-r from-gray-50 to-white px-2 py-1 border-b border-gray-200">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                
                                <span class="text-sm font-semibold text-gray-900 font-inter line-clamp-1">
                                    {{ selection.match || selection.event || selection.homeTeam + ' vs ' + selection.awayTeam }}
                                </span>
                            </div>
                            <div class="flex items-center space-x-2">
                               
                                <span class="px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold font-inter">
                                    WON
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Selection Details -->
                    <div class="p-2">
                        <!-- League & Competition -->
                        <p class="text-xs text-gray-500 mb-3 font-inter">
                            {{ selection.league || selection.tournament || 'Football' }}
                        </p>

                        <!-- Prediction & Result -->
                        <div class="bg-gray-50 rounded-lg p-0 mb-2">
                            <div class="flex items-center justify-between text-sm">
                                <div class="flex gap-2 items-center">
                                    <span class="text-xs text-gray-500 block mb-0.5 font-inter">Correct Score</span>
                                    <span class="font-medium text-gray-900 font-inter">({{ selection.selection }})</span>
                                </div>
                                <div class="text-right flex items-center justify-center gap-2">
                                    <span class="text-xs text-gray-500 block mb-0.5 font-inter">Odds</span>
                                    <span class="font-medium text-gray-900 font-inter">{{ selection.odds }}</span>
                                </div>
                                <div class="text-right flex items-center justify-center gap-2">
                                    <span class="text-xs text-gray-500 block mb-0.5 font-inter">Final Score</span>
                                    <span class="font-medium text-gray-900 font-inter">{{ selection.score || selection.result || '2-2' }}</span>
                                </div>
                            </div>
                        </div>

                    
                    </div>
                </div>
            </div>

       


            <!-- Progress Timeline -->
            <div class="bg-transparent rounded-xl  px-5 mt-2 flex items-center justify-center gap-2">
                <span class="text-xs font-medium text-gray-700 font-inter">Bet Placed</span>
                <span class="text-[10px] text-gray-500 font-inter mt-1">{{ formatDate(bet.createdAt) }}</span>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { TrophyIcon, CheckCircleIcon } from '@heroicons/vue/24/solid'
import { useBets } from '../composables/useBets'
import Loader from '../../assets/loader/default-spinner-BIEd0VkD.gif'

const route = useRoute()
const router = useRouter()
const { getBetDetails, formatCurrency, allBets } = useBets()

const bet = ref(null)
const isLoading = ref(false)
const error = ref(null)

// Font configurations - Add these to your main CSS file
/*
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&family=Space+Mono:wght@400;700&display=swap');

Then use:
- Inter: for body text, UI elements (font-inter)
- Poppins: for headings, large text (font-poppins)  
- Space Mono: for numbers, odds, currency (font-mono)
*/

// Parse selections from JSON string
const parsedSelections = computed(() => {
    if (!bet.value?.selections) return []

    try {
        if (Array.isArray(bet.value.selections)) {
            return bet.value.selections
        }
        if (typeof bet.value.selections === 'string') {
            const parsed = JSON.parse(bet.value.selections)
            return Array.isArray(parsed) ? parsed : []
        }
        if (bet.value.selections.selections) {
            return Array.isArray(bet.value.selections.selections)
                ? bet.value.selections.selections
                : []
        }
        return []
    } catch (e) {
        console.error('Error parsing selections:', e)
        return []
    }
})

// Calculate 10% tax
const calculateTax = (bet) => {
    const potentialWin = Number(bet.potentialWin || bet.potentialReturn || 0)
    return Math.round(potentialWin * 0.1)
}

// Calculate final payout after tax
const calculateFinalPayout = (bet) => {
    const potentialWin = Number(bet.potentialWin || bet.potentialReturn || 0)
    return potentialWin - calculateTax(bet)
}

// Format date
const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

// Fetch bet details
const fetchBetDetails = async () => {
    isLoading.value = true
    error.value = null

    try {
        const betId = route.params.id

        if (!betId) {
            throw new Error('No bet ID provided')
        }

        // Try to get bet from router state first
        if (route.state?.currentBet) {
            bet.value = route.state.currentBet
        } else {
            // Try to find bet in allBets if already loaded
            if (allBets.value && allBets.value.length > 0) {
                const foundBet = allBets.value.find(b => b.id.toString() === betId.toString())
                if (foundBet) {
                    bet.value = foundBet
                }
            }

            // If not found, fetch from API
            if (!bet.value) {
                const betData = await getBetDetails(betId)
                if (betData) {
                    bet.value = betData
                } else {
                    throw new Error('Bet not found')
                }
            }
        }
    } catch (err) {
        console.error('Error fetching bet:', err)
        error.value = err.message || 'Failed to load bet details'
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchBetDetails()
})
</script>

<style scoped>
/* Professional Font System */
.font-inter {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.font-poppins {
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
}

.font-mono {
    font-family: 'Space Mono', 'Courier New', monospace;
}

/* Smooth Transitions */
* {
    transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

/* Line clamp utility */
.line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Custom scrollbar */
.settled-detail-container::-webkit-scrollbar {
    width: 6px;
}

.settled-detail-container::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.settled-detail-container::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 10px;
}

.settled-detail-container::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}
</style>