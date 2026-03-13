<template>
    <div class="settled-detail-container min-h-screen bg-white">
        <!-- Header with Gradient -->
        <div class=" text-xl  px-4 py-1 ">
            <div class="w-full ">
                <!-- Back Button -->
                <button @click="router.back()" class="mb-4 flex cursor-pointer  items-center ">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Back</span>
                </button>


            </div>
        </div>


        <!-- Header Content -->
        <!-- Parent div yenye relative positioning -->
        <div class="relative bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-6 mt-3 mx-2">
            <!-- BET ID - positioned absolute juu kabisa -->
            <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-400 rounded-full px-3 py-1">
                <span class="text-sm font-semibold">BET ID: #{{ bet?.id?.toString().slice(0, 10) }}</span>
            </div>

            <!-- Header Content -->
            <div class="flex justify-between items-start max-w-3xl mx-auto">
                <div class="flex flex-row items-center justify-center gap-4">
                    <p class="text-sm font-medium opacity-90 mb-1">CONGRATULATIONS!</p>
                            <div>
                                <h2 class="text-xl text-amber-300 font-bold mb-1">WINNING BIG</h2>
                            <p class="text-xl font-black">{{ formatCurrency(bet.potentialReturn) }}</p>
                            </div>
                </div>
                <TrophyIcon class="w-20 h-20 text-white/30" />
            </div>
        </div>

        <!-- Main Content -->
        <div class="w-full ">
            <!-- Loading State -->
            <div v-if="isLoading" class="flex justify-center items-center h-64">
                <div class="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="bg-red-50 rounded-2xl p-8 text-center">
                <div class="text-red-500 text-5xl mb-4">⚠️</div>
                <p class="text-red-700 font-medium mb-2">Failed to load bet details</p>
                <p class="text-sm text-red-500 mb-4">{{ error }}</p>
                <button @click="fetchBetDetails" class="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700">
                    Try Again
                </button>
            </div>

            <!-- Bet Details Content -->
            <div v-else-if="bet" class="space-y-4 bg-gradient-to-r from-emerald-600 to-teal-600 mx-2">
                <!-- Congratulations Banner -->
                <div class="bg-gray-50 rounded-t-xl p-4 ">
                        <div class="flex flex-row justify-between items-center">
                            <p class="text-sm text-gray-500 mb-1">Total Odds</p>
                            <p class="text-l font-bold text-yellow-600">{{ Number(bet.totalOdds).toFixed(2) }}</p>
                        </div>
                        <div class="flex flex-row justify-between items-center">
                            <p class="text-sm text-gray-500 mb-1">Stake</p>
                            <p class="text-l font-bold text-gray-900">{{ formatCurrency(bet.stake) }}</p>
                        </div>
                        <div class="flex flex-row justify-between items-center">
                            <p class="text-sm text-gray-500 mb-1">Potential Win</p>
                            <p class="text-l font-bold text-green-600">{{ formatCurrency(bet.potentialWin ||
                                bet.potentialReturn) }}</p>
                        </div>
                        <div class="flex flex-row justify-between items-center">
                            <p class="text-sm text-gray-500 mb-1">Tax (10%)</p>
                            <p class="text-l font-bold text-gray-500">{{ formatCurrency(calculateTax(bet)) }}</p>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-lg font-semibold text-gray-900"> Payout</span>
                            <span class="text-l font-black text-green-600">{{
                                formatCurrency(calculateFinalPayout(bet)) }}</span>
                        </div>

                </div>
               

              
                <div class="flex items-center justify-between bg-white rounded-2xl shadow-lg px-2 py-1 mx-10">
                    <div class="flex items-center gap-2">
                        <CheckCircleIcon class="w-5 h-5 text-green-500" />
                        <span class="text-gray-600">Bet Placed</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <CheckCircleIcon class="w-5 h-5 text-green-500" />
                        <span class="text-gray-600">Matches Played</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <TrophyIcon class="w-5 h-5 text-yellow-500" />
                        <span class="text-gray-600">🏆</span>
                    </div>
                </div>
              

                <!-- Selections -->
                <div class=" rounded-2xl shadow-lg overflow-hidden">
                  

                    <div class="divide-y divide-gray-200">
                        <div v-for="(selection, index) in parsedSelections" :key="index" class="p-1 m-2 bg-white rounded-[12px]">
                            <div class="flex items-start justify-between mb-2">
                               <div class="flex flex-row justify-evenly items-center">
                                <span class=" text-xl flex items-center justify-center">⚽</span>
                              
                                    <p class="font-bold text-gray-900">{{ selection.match || selection.event ||
                                        selection.homeTeam + ' vs ' + selection.awayTeam }}</p>
                               </div>

                                <div class="flex items-center gap-2">
                                    <span
                                        class=" text-green-700  py-1 rounded-full text-xs font-bold">{{ selection.odds }}</span>
                                    <span class=" text-gray-700 py-1 rounded-full text-[1]">✅</span>
                                </div>
                            </div>
                           
                            <div class="pl-6">
                                <p class="text-sm text-gray-500 mt-1">{{ selection.league }}
                                </p>
                            </div>
                          
                        <div class="divide-y divide-gray-200">
                            <div class="flex flex-row items-center justify-between">
                                    <div>
                                        <span class="text-gray-500">Prediction:</span>
                                    <span class="ml-1 font-medium text-gray-900">Correct Score: {{ selection.selection }}</span>

                                    </div>
                                    <div>
                                    <span class="ml-1 text-teal-700 font-bold">WON</span>
                                    </div>
                            </div>
                            <div>
                                
                            </div>

                        </div>

                        <div class="flex items-center justify-between py-2 text-sm">
                            <div class="flex items-center gap-1">
                                <span class="text-gray-500">Odds:</span>
                                <span class="font-bold text-yellow-600">{{ selection.odds }}</span>
                            </div>
                            
                            <div class="w-px h-4 bg-gray-300"></div>
                            
                            <div class="flex items-center gap-1">
                                <span class="text-gray-500">Result:</span>
                                <span class="font-medium text-gray-900">2-2</span>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>

                <!-- Footer Status -->
                
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { TrophyIcon, CheckCircleIcon } from '@heroicons/vue/24/solid'
import { useBets } from '../composables/useBets'

const route = useRoute()
const router = useRouter()
const { getBetDetails, formatCurrency, allBets } = useBets()

const bet = ref(null)
const isLoading = ref(false)
const error = ref(null)

// Parse selections from JSON string
const parsedSelections = computed(() => {
    if (!bet.value?.selections) return []

    try {
        // If selections is already an array
        if (Array.isArray(bet.value.selections)) {
            return bet.value.selections
        }

        // If it's a string, try to parse it
        if (typeof bet.value.selections === 'string') {
            const parsed = JSON.parse(bet.value.selections)
            return Array.isArray(parsed) ? parsed : []
        }

        // If it's an object with selections property
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

// Calculate 12% tax
const calculateTax = (bet) => {
    const potentialWin = Number(bet.potentialWin || bet.potentialReturn || 0)
    return Math.round(potentialWin * 0.12)
}

// Calculate final payout after tax
const calculateFinalPayout = (bet) => {
    const potentialWin = Number(bet.potentialWin || bet.potentialReturn || 0)
    return potentialWin - calculateTax(bet)
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
            console.log('Using bet from router state')
            bet.value = route.state.currentBet
        } else {
            // Try to find bet in allBets if already loaded
            if (allBets.value && allBets.value.length > 0) {
                console.log('Searching in allBets')
                const foundBet = allBets.value.find(b => b.id.toString() === betId.toString())
                if (foundBet) {
                    bet.value = foundBet
                }
            }

            // If not found, fetch from API
            if (!bet.value) {
                console.log('Fetching from API')
                const betData = await getBetDetails(betId)
                if (betData) {
                    bet.value = betData
                } else {
                    throw new Error('Bet not found')
                }
            }
        }

        console.log('Bet loaded:', bet.value)

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
.settled-detail-container {
    min-height: 100vh;
}

/* Smooth transitions */
.settled-detail-container * {
    transition: all 0.2s ease;
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