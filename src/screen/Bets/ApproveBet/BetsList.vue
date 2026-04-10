<template>
    <div class="bg-white rounded-xl shadow-sm p-6">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-2 text-gray-600">Loading bets...</p>
      </div>
  
      <!-- Error State -->
      <div v-else-if="error" class="text-center py-8 text-red-600">
        <p>{{ error }}</p>
        <button 
          @click="fetchUserBets"
          class="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
  
      <!-- Bets List -->
      <template v-else>
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">All Bets</h2>
          
          <!-- Filter Buttons -->
          <div class="flex space-x-2">
            <button
              @click="setFilter('all')"
              :class="[
                'px-3 py-1 rounded-lg text-sm',
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              All
            </button>
            <button
              @click="setFilter('waiting')"
              :class="[
                'px-3 py-1 rounded-lg text-sm',
                filter === 'waiting' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              Active
            </button>
            <button
              @click="setFilter('settled')"
              :class="[
                'px-3 py-1 rounded-lg text-sm',
                filter === 'settled' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              Settled
            </button>
          </div>
        </div>
  
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date/Time</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stake</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Odds</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payout</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Result</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="bet in filteredBets" :key="bet.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ bet.id }}</td>
                <td class="px-4 py-3 text-sm text-gray-500">
                  {{ bet.date }} {{ bet.time }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-900">
                  {{ formatCurrency(bet.stake) }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ bet.total_odds }}</td>
                <td class="px-4 py-3 text-sm text-gray-900">
                  {{ bet.payout ? formatCurrency(bet.payout) : '-' }}
                </td>
                <td class="px-4 py-3">
                  <span :class="['px-2 py-1 text-xs font-medium rounded-full', getStatusColor(bet.status)]">
                    {{ bet.status }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span :class="getResultColor(bet.result)">
                    {{ bet.result }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex space-x-2">
                    <!-- View button - Updated to use router -->
                    <button
                      @click="viewBetDetails(bet)"
                      class="text-blue-600 hover:text-blue-800"
                      title="View Details"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
  
                    <!-- Edit button - Updated to use router -->
                    <button
                      @click="editBet(bet)"
                      class="text-yellow-600 hover:text-yellow-800"
                      title="Edit Bet"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
  
                    <!-- Approve button - only for WAITING bets -->
                    <template v-if="bet.status === 'WAITING'">
                      <button
                        @click="handleApprove(bet.id, 'WON')"
                        :disabled="processingId === bet.id"
                        class="text-green-600 hover:text-green-800 disabled:opacity-50"
                        title="Approve as WON"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        @click="handleApprove(bet.id, 'LOST')"
                        :disabled="processingId === bet.id"
                        class="text-red-600 hover:text-red-800 disabled:opacity-50"
                        title="Approve as LOST"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </template>
  
                    <!-- Delete button -->
                    <button
                      @click="handleDelete(bet.id)"
                      :disabled="processingId === bet.id"
                      class="text-red-600 hover:text-red-800 disabled:opacity-50"
                      title="Delete Bet"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
  
          <div v-if="filteredBets.length === 0" class="text-center py-8 text-gray-500">
            No bets found
          </div>
        </div>
      </template>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router' // Import useRouter
  import { useBets } from '../../composables/useBets'
  import api from '../../../services/api'
  
  // Initialize router
  const router = useRouter()
  
  // Remove emits since we're using router directly
  // const emit = defineEmits(['refresh', 'select-bet', 'edit'])
  
  // Use the bets composable
  const {
    allBets,
    isLoading,
    error,
    fetchUserBets,
    formatCurrency
  } = useBets()
  
  // Local state
  const processingId = ref(null)
  const filter = ref('all')
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'WAITING': return 'bg-yellow-100 text-yellow-800'
      case 'SETTLED': return 'bg-green-100 text-green-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  const getResultColor = (result) => {
    switch(result) {
      case 'WON': return 'text-green-600 font-semibold'
      case 'LOST': return 'text-red-600 font-semibold'
      default: return 'text-yellow-600'
    }
  }
  
  const filteredBets = computed(() => {
    if (filter.value === 'all') {
      return allBets.value
    }
    return allBets.value.filter(bet => bet.status === filter.value.toUpperCase())
  })
  
  const setFilter = (value) => {
    filter.value = value
  }
  
  // New method for viewing bet details
  const viewBetDetails = (bet) => {
    router.push({
      name: 'bet-details',
      params: { id: bet.id }
    })
  }
  
  // New method for editing bet
  const editBet = (bet) => {
    router.push({
      name: 'edit-bet',
      params: { id: bet.id }
    })
  }
  
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bet?')) return
    
    processingId.value = id
    try {
      await api.delete(`/bets/${id}/`) // Fixed endpoint - was /betList/${id}/
      await fetchUserBets() // Refresh from composable
    } catch (error) {
      console.error('Error deleting bet:', error)
      alert('Failed to delete bet')
    } finally {
      processingId.value = null
    }
  } 
  
  const handleApprove = async (id, result) => {
    processingId.value = id
    try {
      await api.post(`/bets/${id}/approve/`, { result })
      await fetchUserBets() // Refresh from composable
    } catch (error) {
      console.error('Error approving bet:', error)
      alert('Failed to approve bet')
    } finally {
      processingId.value = null
    }
  }
  
  // Fetch bets on mount
  onMounted(() => {
    fetchUserBets()
  })
  </script>