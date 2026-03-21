// composables/useUserData.js
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../../store/authStore'
import { ref, onMounted, watch } from 'vue'

export function useUserData() {
  const authStore = useAuthStore()
  const { user, userBalance, transactions } = storeToRefs(authStore)
  const loading = ref(false)
  const error = ref(null)

  const refreshUserData = async () => {
    // Don't fetch if not authenticated
    if (!authStore.isAuthenticated) {
      console.log('⏭️ Skipping data fetch - user not authenticated')
      return
    }

    loading.value = true
    error.value = null
    
    console.log(' Refreshing user data...')
    
    try {
      // Try to fetch each piece of data independently
      // This way if one fails, others can still succeed
      
      // 1. Fetch balance (most important)
      try {
        await authStore.fetchUserBalance()
        console.log('✅ Balance fetched successfully')
      } catch (balanceError) {
        console.error('❌ Failed to fetch balance:', balanceError)
        error.value = 'Failed to load balance'
      }
      
      // 2. Fetch profile (optional)
      try {
        await authStore.fetchUserProfile()
        console.log('✅ Profile fetched successfully')
      } catch (profileError) {
        // Profile might not be implemented yet - don't show error to user
        console.log('ℹ️ Profile fetch skipped:', profileError?.message || 'Not implemented')
      }
      
      // 3. Fetch transactions (optional)
      try {
        await authStore.fetchTransactions()
        console.log('✅ Transactions fetched successfully')
      } catch (transactionsError) {
        // Transactions might not be implemented yet - don't show error to user
        console.log('ℹ️ Transactions fetch skipped:', transactionsError?.message || 'Not implemented')
      }
      
    } catch (err) {
      console.error('❌ Error in refreshUserData:', err)
      error.value = 'Failed to load user data'
    } finally {
      loading.value = false
    }
  }

  // Watch for authentication changes
  watch(
    () => authStore.isAuthenticated,
    (newValue) => {
      if (newValue) {
        console.log('🔑 User authenticated - fetching data')
        refreshUserData()
      } else {
        // Clear data when user logs out
        user.value = null
        userBalance.value = 0
        transactions.value = []
        error.value = null
      }
    }
  )

  // Fetch data on mount if already authenticated
  onMounted(() => {
    if (authStore.isAuthenticated) {
      console.log('📱 Component mounted - user already authenticated')
      refreshUserData()
    } else {
      console.log('📱 Component mounted - user not authenticated')
    }
  })

  return {
    // State
    user,
    balance: userBalance,
    transactions,
    loading,
    error,
    
    // Methods
    refreshUserData
  }
}