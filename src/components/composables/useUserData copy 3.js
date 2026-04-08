// composables/useUserData.js
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../../store/authStore'
import { ref, onMounted, watch, computed } from 'vue'

export function useUserData() {
  const authStore = useAuthStore()
  const { user, userBalance, transactions } = storeToRefs(authStore)
  const loading = ref(false)
  const error = ref(null)
  const lastFetchTime = ref(null)
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes cache

  // Computed property to check if data is stale
  const isDataStale = computed(() => {
    if (!lastFetchTime.value) return true
    return Date.now() - lastFetchTime.value > CACHE_DURATION
  })

  // Computed property to check if we have cached data
  const hasCachedData = computed(() => {
    return userBalance.value !== 0 && userBalance.value !== null && userBalance.value !== undefined
  })

  const refreshUserData = async (forceRefresh = false) => {
    // Don't fetch if not authenticated
    if (!authStore.isAuthenticated) {
      console.log('⏭️ Skipping data fetch - user not authenticated')
      return
    }

    // If we have cached data and not forcing refresh, skip API call
    if (!forceRefresh && hasCachedData.value && !isDataStale.value) {
      console.log('📦 Using cached data - last fetch:', new Date(lastFetchTime.value).toLocaleTimeString())
      return
    }

    // If already loading, don't trigger another request
    if (loading.value) {
      console.log('⏳ Data fetch already in progress')
      return
    }

    loading.value = true
    error.value = null
    
    console.log('🔄 Refreshing user data from API...')
    
    try {
      // Track if any data was successfully fetched
      let hasSuccessfulFetch = false
      
      // 1. Fetch balance (most important)
      try {
        const balanceFetched = await authStore.fetchUserBalance()
        if (balanceFetched) {
          console.log('✅ Balance fetched successfully')
          hasSuccessfulFetch = true
        } else {
          console.log('⚠️ Balance fetch returned false')
        }
      } catch (balanceError) {
        console.error('❌ Failed to fetch balance:', balanceError)
        error.value = 'Failed to load balance'
        
        // If we have cached balance, keep using it
        if (!hasCachedData.value) {
          error.value = 'Unable to load balance. Please check your connection.'
        }
      }
      
      // 2. Fetch profile (optional)
      try {
        const profileFetched = await authStore.fetchUserProfile()
        if (profileFetched) {
          console.log('✅ Profile fetched successfully')
          hasSuccessfulFetch = true
        } else {
          console.log('ℹ️ Profile fetch returned false')
        }
      } catch (profileError) {
        // Profile might not be implemented yet - don't show error to user
        console.log('ℹ️ Profile fetch skipped:', profileError?.message || 'Not implemented')
      }
      
      // 3. Fetch transactions (optional)
      try {
        const transactionsFetched = await authStore.fetchTransactions()
        if (transactionsFetched) {
          console.log('✅ Transactions fetched successfully')
          hasSuccessfulFetch = true
        } else {
          console.log('ℹ️ Transactions fetch returned false')
        }
      } catch (transactionsError) {
        // Transactions might not be implemented yet - don't show error to user
        console.log('ℹ️ Transactions fetch skipped:', transactionsError?.message || 'Not implemented')
      }
      
      // Update last fetch time if any data was fetched successfully
      if (hasSuccessfulFetch) {
        lastFetchTime.value = Date.now()
        console.log('📊 Data refresh completed at:', new Date(lastFetchTime.value).toLocaleTimeString())
      } else {
        console.log('⚠️ No data was successfully fetched')
      }
      
    } catch (err) {
      console.error('❌ Error in refreshUserData:', err)
      error.value = 'Failed to load user data'
    } finally {
      loading.value = false
    }
  }

  // Force refresh (ignore cache)
  const forceRefreshUserData = async () => {
    console.log('🔄 Force refreshing user data (ignoring cache)...')
    return await refreshUserData(true)
  }

  // Clear cached data (useful for logout)
  const clearCachedData = () => {
    console.log('🧹 Clearing cached user data')
    user.value = null
    userBalance.value = 0
    transactions.value = []
    error.value = null
    lastFetchTime.value = null
  }

  // Watch for authentication changes
  watch(
    () => authStore.isAuthenticated,
    (newValue, oldValue) => {
      if (newValue && !oldValue) {
        console.log('🔑 User authenticated - fetching fresh data')
        // On new login, force refresh to get latest data
        forceRefreshUserData()
      } else if (!newValue && oldValue) {
        // Clear data when user logs out
        console.log('🚪 User logged out - clearing data')
        clearCachedData()
      }
    },
    { immediate: false }
  )

  // Fetch data on mount if already authenticated and no cached data
  onMounted(() => {
    if (authStore.isAuthenticated) {
      console.log('📱 Component mounted - user already authenticated')
      
      // If we have cached balance, show it immediately and refresh in background
      if (hasCachedData.value) {
        console.log('💾 Found cached balance:', userBalance.value)
        
        // If cached data is stale, refresh in background
        if (isDataStale.value) {
          console.log('⏰ Cached data is stale, refreshing in background...')
          // Refresh in background without blocking UI
          refreshUserData(true).catch(err => {
            console.error('Background refresh failed:', err)
          })
        } else {
          console.log('✅ Using fresh cached data')
        }
      } else {
        // No cached data, fetch immediately
        console.log('🔄 No cached data found, fetching...')
        refreshUserData()
      }
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
    lastFetchTime,
    hasCachedData,
    isDataStale,
    
    // Methods
    refreshUserData,
    forceRefreshUserData,
    clearCachedData
  }
}