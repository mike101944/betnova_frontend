// composables/useBets.js
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../store/authStore'
import api from '../../services/api'

export function useBets() {
  const authStore = useAuthStore()
  
  // State
  const allBets = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  
  // Computed properties for different bet statuses
  const openBets = computed(() => {
    return allBets.value.filter(bet => bet.status === 'OPEN')
  })
  
  const settledBets = computed(() => {
    return allBets.value.filter(bet => bet.status === 'SETTLED')
  })
  
  // Statistics for settled bets
  const settledStats = computed(() => {
    const settled = settledBets.value
    return {
      won: settled.filter(bet => bet.result === 'WON').length,
      lost: settled.filter(bet => bet.result === 'LOST').length,
      total: settled.length
    }
  })
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('sw-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0)
  }
  
  // Fetch user bets from API
  const fetchUserBets = async () => {
    if (!authStore.isAuthenticated) {
      console.log('User not authenticated, skipping bet fetch')
      return
    }
    
    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.get('/bets/user')
      console.log('Bets API response:', response.data)
      
      if (response.data.success) {
        // Extract bets from the response structure
        // Based on your API response format
        allBets.value = response.data.data?.bets || response.data.data || []
        console.log('Bets loaded:', allBets.value)
      } else {
        error.value = response.data.message || 'Failed to load bets'
      }
    } catch (err) {
      console.error('Error fetching bets:', err)
      error.value = err.response?.data?.message || 'Failed to load bets'
    } finally {
      isLoading.value = false
    }
  }
  
  // Place bet
  const placeBet = async (selections, stake) => {
    if (!authStore.isAuthenticated) {
      error.value = 'Please login to place bets'
      return { success: false, error: error.value }
    }
    
    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.post('/bets', {
        selections,
        stake
      })
      
      if (response.data.success) {
        // Refresh balance
        await authStore.fetchUserBalance()
        
        // Refresh bets list
        await fetchUserBets()
        
        return { 
          success: true, 
          data: response.data.data 
        }
      } else {
        return { success: false, error: response.data.message }
      }
    } catch (err) {
      console.error('Error placing bet:', err)
      const errorMsg = err.response?.data?.message || 'Failed to place bet'
      error.value = errorMsg
      return { success: false, error: errorMsg }
    } finally {
      isLoading.value = false
    }
  }
  
  // Get bet details
  const getBetDetails = async (betId) => {
    try {
      const response = await api.get(`/bets/${betId}`)
      if (response.data.success) {
        return response.data.data
      }
      return null
    } catch (err) {
      console.error('Error fetching bet details:', err)
      return null
    }
  }
  
  return {
    // State
    allBets,
    isLoading,
    error,
    
    // Filtered bets
    openBets,
    settledBets,
    
    // Statistics
    settledStats,
    
    // Helper functions
    formatCurrency,
    
    // API functions
    fetchUserBets,
    placeBet,
    getBetDetails
  }
}