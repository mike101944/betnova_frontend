<template>
    <div class="bg-white rounded-xl shadow-sm p-4 md:p-6">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-2 text-gray-600">Loading bet details...</p>
      </div>
  
      <!-- Error State -->
      <div v-else-if="error" class="text-center py-8 text-red-600">
        <p>{{ error }}</p>
        <button 
          @click="fetchBetDetails"
          class="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
  
      <!-- Bet Details -->
      <template v-else-if="bet">
        <!-- Header with Grid - Responsive -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <!-- Left side - Back button and title -->
          <div class="flex items-center space-x-4">
            <button
              @click="goBack"
              class="text-gray-600 hover:text-gray-800 flex-shrink-0"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div class="min-w-0">
              <h2 class="text-xl md:text-2xl font-bold text-gray-800 truncate">
                Bet Details - {{ bet.id }}
              </h2>
              <p class="text-xs md:text-sm text-gray-500">
                {{ formatDate(bet.createdAt) }}
              </p>
            </div>
          </div>
          
          <!-- Right side - Action buttons -->
          <div class="flex flex-wrap gap-2 lg:justify-end">
            <button
              @click="showRawData = !showRawData"
              class="px-3 md:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-xs md:text-sm whitespace-nowrap"
            >
              {{ showRawData ? 'Hide Raw Data' : 'View Raw Data' }}
            </button>
            <button
              @click="editBet"
              class="px-3 md:px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-xs md:text-sm whitespace-nowrap"
            >
              Edit Bet
            </button>
            <button
              @click="handleDelete"
              :disabled="loading"
              class="px-3 md:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-300 text-xs md:text-sm whitespace-nowrap"
            >
              Delete
            </button>
          </div>
        </div>
  
        <!-- Raw JSON Data Display -->
        <div v-if="showRawData" class="mb-6 p-4 bg-gray-800 rounded-lg">
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-lg font-semibold text-white">Raw Response from Server:</h3>
            <button
              @click="copyToClipboard"
              class="text-xs bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700"
            >
              Copy
            </button>
          </div>
          <pre class="text-xs text-green-400 overflow-auto max-h-96 p-2 bg-gray-900 rounded">{{ JSON.stringify(bet, null, 2) }}</pre>
        </div>
  
        <!-- Approve Error Display -->
        <div v-if="approveError" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-600 text-sm">{{ approveError }}</p>
        </div>
  
        <!-- Summary Cards - Grid responsive -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div class="bg-blue-50 p-4 rounded-lg">
            <p class="text-sm text-blue-600 font-medium">Stake</p>
            <p class="text-xl lg:text-2xl font-bold text-blue-800 break-words">
              {{ formatCurrency(parseFloat(bet.stake || 0)) }}
            </p>
          </div>
          
          <div class="bg-green-50 p-4 rounded-lg">
            <p class="text-sm text-green-600 font-medium">Odds</p>
            <p class="text-xl lg:text-2xl font-bold text-green-800">{{ bet.totalOdds || 'N/A' }}</p>
          </div>
          
          <div class="bg-purple-50 p-4 rounded-lg">
            <p class="text-sm text-purple-600 font-medium">Total Odds</p>
            <p class="text-xl lg:text-2xl font-bold text-purple-800">
              {{ bet.totalOdds || 'N/A' }}
            </p>
          </div>
          
          <div class="bg-yellow-50 p-4 rounded-lg">
            <p class="text-sm text-yellow-600 font-medium">Payout</p>
            <p class="text-xl lg:text-2xl font-bold text-yellow-800 break-words">
              {{ bet.potentialReturn ? formatCurrency(bet.potentialReturn) : 'Pending' }}
            </p>
          </div>
        </div>
  
        <!-- Status and Result - Grid responsive -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="border rounded-lg p-4">
            <p class="text-sm text-gray-500 mb-2">Status</p>
            <div class="flex flex-wrap items-center gap-2">
              <span :class="[
                'px-3 py-1 rounded-full text-sm font-medium',
                bet.status === 'OPEN' || bet.status === 'WAITING' ? 'bg-yellow-100 text-yellow-800' : 
                bet.status === 'SETTLED' ? 'bg-green-100 text-green-800' :
                bet.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              ]">
                {{ bet.status || 'N/A' }}
              </span>
              <span v-if="bet.result" :class="[
                'px-3 py-1 rounded-full text-sm font-medium',
                bet.result === 'WON' ? 'bg-green-100 text-green-800' : 
                bet.result === 'LOST' ? 'bg-red-100 text-red-800' : 
                'bg-yellow-100 text-yellow-800'
              ]">
                {{ bet.result }}
              </span>
            </div>
          </div>
          
          <div class="border rounded-lg p-4">
            <p class="text-sm text-gray-500 mb-2">Booking Code</p>
            <p class="text-lg font-semibold font-mono">{{ bet.bookingCode || 'N/A' }}</p>
          </div>
        </div>
  
        <!-- Selections Section - FIXED: Parse JSON string -->
        <div v-if="parsedSelections.length > 0" class="mb-6">
          <h3 class="text-lg font-semibold mb-4">
            Selections ({{ parsedSelections.length }})
          </h3>
          <div class="space-y-4">
            <div 
              v-for="(selection, index) in parsedSelections" 
              :key="index" 
              class="border-2 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex flex-col sm:flex-row justify-between items-start gap-2 mb-3">
                <div class="min-w-0 flex-1">
                  <p class="font-bold text-gray-800 break-words">
                    {{ selection.match || 'Match' }}
                  </p>
                  <p class="text-sm text-gray-500">{{ selection.league || '' }}</p>
                  <p class="text-xs text-gray-400">{{ selection.time || '' }}</p>
                </div>
                <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                  Odds: {{ selection.odds }}
                </span>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div class="bg-gray-50 p-3 rounded break-words">
                  <span class="text-gray-500">Selection:</span>
                  <span class="ml-2 font-medium">{{ selection.selection }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Additional Details - Grid responsive -->
        <div class="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 class="text-lg font-semibold mb-3">Additional Information</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="min-w-0">
              <p class="text-xs text-gray-500">Bet ID</p>
              <p class="text-sm font-mono truncate">{{ bet.id }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Created</p>
              <p class="text-sm">{{ formatDate(bet.createdAt) }}</p>
            </div>
            <div v-if="bet.settledAt">
              <p class="text-xs text-gray-500">Settled</p>
              <p class="text-sm">{{ formatDate(bet.settledAt) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Booking Active</p>
              <p class="text-sm">{{ bet.isBookingCodeActive ? 'Yes' : 'No' }}</p>
            </div>
          </div>
        </div>
  
        <!-- Approve Buttons - Only for OPEN/WAITING bets -->
        <div v-if="bet.status === 'OPEN' || bet.status === 'WAITING'" class="flex flex-col sm:flex-row gap-4">
          <button
            @click="handleApprove('WON')"
            :disabled="loading"
            class="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-300 font-medium px-4 transition-colors"
          >
            {{ loading ? 'Processing...' : '✅ Approve as WON' }}
          </button>
          <button
            @click="handleApprove('LOST')"
            :disabled="loading"
            class="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-300 font-medium px-4 transition-colors"
          >
            {{ loading ? 'Processing...' : '❌ Approve as LOST' }}
          </button>
        </div>
  
        <!-- Loading indicator -->
        <div v-if="loading" class="mt-4 text-center text-gray-600">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-2">Processing request...</p>
        </div>
      </template>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useBets } from '../../composables/useBets'
  import api from '../../../services/api'
  
  const route = useRoute()
  const router = useRouter()
  
  // Use the bets composable
  const { 
    formatCurrency,
    fetchUserBets,
    getBetDetails
  } = useBets()
  
  // Local state
  const bet = ref(null)
  const loading = ref(false)
  const showRawData = ref(false)
  const approveError = ref('')
  const isLoading = ref(false)
  const error = ref(null)
  
  // Get bet ID from route params
  const betId = route.params.id
  
  // Computed property to parse selections JSON string
  const parsedSelections = computed(() => {
    if (!bet.value || !bet.value.selections) return []
    
    try {
      // Parse the JSON string from selections field
      const selections = JSON.parse(bet.value.selections)
      return Array.isArray(selections) ? selections : []
    } catch (e) {
      console.error('Error parsing selections:', e)
      return []
    }
  })
  
  // Fetch bet details
  const fetchBetDetails = async () => {
    if (!betId) {
      error.value = 'No bet ID provided'
      return
    }
    
    isLoading.value = true
    error.value = null
    
    try {
      const betData = await getBetDetails(betId)
      if (betData) {
        bet.value = betData
      } else {
        error.value = 'Failed to load bet details'
      }
    } catch (err) {
      console.error('Error fetching bet details:', err)
      error.value = err.message || 'Failed to load bet details'
    } finally {
      isLoading.value = false
    }
  }
  
  // Navigation methods
  const goBack = () => {
    router.push('/betList')
  }
  
  const editBet = () => {
    router.push(`/bet/${betId}/edit`)
  }
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString()
  }
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(bet.value, null, 2))
      alert('Copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }
  
  const handleApprove = async (result) => {
    loading.value = true
    approveError.value = ''
    
    try {
      console.log(`📤 Sending approve request for bet ${bet.value.id} with result: ${result}`)
      
      const response = await api.patch(`/bets/${bet.value.id}/approve/`, { result })
      
      console.log('✅ APPROVE RESPONSE:', response.data)
      
      alert(`Bet approved as ${result}!`)
      
      // Refresh data
      await fetchUserBets()
      
      // Navigate back to bet list
      router.push('/betList')
      
    } catch (error) {
      console.error('❌ Error approving bet:', error)
      
      let errorMessage = 'Failed to approve bet'
      
      if (error.response) {
        errorMessage = error.response.data?.error || 
                       error.response.data?.message || 
                       JSON.stringify(error.response.data) || 
                       errorMessage
        
        approveError.value = errorMessage
      } else if (error.request) {
        errorMessage = 'No response from server'
      } else {
        errorMessage = error.message
      }
      
      alert(errorMessage)
    } finally {
      loading.value = false
    }
  }
  
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this bet?')) return
    
    loading.value = true
    try {
      await api.delete(`/bets/${bet.value.id}/`)
      
      // Refresh data
      await fetchUserBets()
      
      // Navigate back to bet list
      router.push('/betList')
      alert('Bet deleted successfully!')
    } catch (error) {
      console.error('Error deleting bet:', error)
      alert('Failed to delete bet')
    } finally {
      loading.value = false
    }
  }
  
  // Fetch bet details on mount
  onMounted(() => {
    fetchBetDetails()
  })
  </script>