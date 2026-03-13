<script setup>
import { ref, onMounted, computed } from 'vue'
import { useBets } from '../composables/useBets'
import Loader from '../../assets/loader/default-spinner-BIEd0VkD.gif'

const { openBets, isLoading, error, fetchUserBets, formatCurrency } = useBets()

onMounted(async () => {
  await fetchUserBets()
})

const hasData = computed(() => {
  return openBets.value && openBets.value.length > 0
})

const formatBetDate = (dateString) => {
  if (!dateString) return { time: 'N/A', date: 'N/A' }
  const date = new Date(dateString)
  return {
    time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date: date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
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
</script>

<template>
  <div class="bets-list-container px-3 py-5">
    <!-- LOADER -->
    <div v-if="isLoading" class="flex justify-center items-center h-96">
      <img :src="Loader" alt="Loading..." class="h-8 w-8" />
    </div>

    <!-- ERROR -->
    <div v-else-if="error" class="flex justify-center items-center h-96">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <div v-else>
      <!-- HAS DATA -->
      <section v-if="hasData" class="block">
        <div 
          v-for="bet in openBets" 
          :key="bet.id"
          class="bet border border-gray-200 mb-3 text-gray-700"
        >
          <!-- Header -->
          <div class="bet-header bg-gray-50 border-b border-gray-200 px-3 py-2.5">
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <span class="text-sm font-normal">{{ formatBetDate(bet.createdAt).time }},&nbsp;</span>
                <span class="text-sm font-medium">{{ formatBetDate(bet.createdAt).date }}</span>
              </div>
              <div class="text-sm font-medium text-gray-500 text-right">
                ID: #{{ bet.id.toString().slice(0,8) }}
              </div>
            </div>
          </div>

          <!-- Status Line -->
          <div class="bet-status flex justify-between items-center px-3 py-2.5 font-bold text-yellow-500">
            <div class="text-sm font-bold">
              {{ getSelectionsCount(bet) }}/{{ getSelectionsCount(bet) }}
            </div>
            <div class="cashout-container bg-gray-50 rounded flex items-center gap-1 px-1 py-0.5">
              <span class="text-xs font-normal text-gray-700">Cashout</span>
              <span class="cashout-icon w-3.5 h-3.5 flex items-center">
                <svg class="w-full h-full" style="vertical-align: middle;">
                  <use xlink:href="#icon-cashoutable"></use>
                </svg>
              </span>
            </div>
          </div>

          <!-- Divider -->
          <div class="border-b border-gray-200 mx-3"></div>

          <!-- Body -->
          <div class="bet-body flex flex-wrap gap-4 p-3">
            <!-- Stake -->
            <div class="bet-detail flex-1 flex flex-col items-start gap-0.5 pr-1 font-bold">
              <span class="label text-xs font-medium text-gray-500">STAKE</span>
              <div class="currency-container flex items-center">
                <span class="amount text-sm">{{ bet.stake }}</span>
              </div>
            </div>

            <!-- Odds -->
            <div class="bet-detail flex-1 flex flex-col items-start gap-0.5 pr-1 font-bold">
              <span class="label text-xs font-medium text-gray-500">ODDS</span>
              <span class="value text-sm font-normal">{{ bet.totalOdds }}</span>
            </div>

            <!-- Payout -->
            <div class="bet-detail flex-1 flex flex-col items-end gap-0.5 font-bold">
              <span class="label text-xs font-medium text-gray-500">PAYOUT</span>
              <div class="currency-container flex items-center">
                <span class="symbol text-xs text-gray-400 mr-0.5">TSh</span>
                <span class="amount text-sm">{{ bet.potentialReturn }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- NO DATA -->
      <section v-else class="block">
        <div class="no-data-text text-center my-3.5 text-base font-normal">
          <div class="empty-betslip-open flex flex-col justify-center items-center gap-3 mt-10">
            <svg class="empty-betslip-icon w-24 h-20 mb-1" style="vertical-align: middle;">
              <use xlink:href="#icon-betslip-illustration"></use>
            </svg>
            <span class="caption">There are currently no open betslips.</span>
            <div class="empty-betslip-button flex justify-center items-center w-full">
              <a 
                href="/events" 
                class="empty-betslip-button-link uppercase cursor-pointer text-gray-700 bg-teal-300 flex justify-center items-center gap-2 w-full px-3 py-1.5 text-sm font-bold"
              >
                Browse Matches
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* Minimal custom styles - Tailwind handles almost everything */


/* SVG styles */
svg {
  width: 32px;
  height: 32px;
}

.empty-betslip-icon {
  width: 100px;
  height: 80px;
}

/* Remove all data-v attributes and duplicate styles */
</style>