// stores/authStore.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import * as authService from '../services/auth.service'
import api from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  // State - Load from localStorage on initialization
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const userBalance = ref(Number(localStorage.getItem('userBalance') || 0))
  const transactions = ref(JSON.parse(localStorage.getItem('transactions') || '[]'))
  const accessToken = ref(localStorage.getItem('access_token') || null)
  const refreshToken = ref(localStorage.getItem('refresh_token') || null)
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => {
    return !!accessToken.value && !!user.value
  })

  const isLoggedIn = computed(() => isAuthenticated.value)

  // Helper function to persist data to localStorage
  const persistToStorage = () => {
    if (user.value) {
      localStorage.setItem('user', JSON.stringify(user.value))
    } else {
      localStorage.removeItem('user')
    }
    
    if (userBalance.value !== undefined && userBalance.value !== null) {
      localStorage.setItem('userBalance', userBalance.value.toString())
    } else {
      localStorage.removeItem('userBalance')
    }
    
    if (transactions.value && transactions.value.length > 0) {
      localStorage.setItem('transactions', JSON.stringify(transactions.value))
    } else {
      localStorage.removeItem('transactions')
    }
  }

  // Actions
  const register = async (phoneNumber, password) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await authService.register({
        phone_number: phoneNumber,
        password: password
      })
      
      if (response.data) {
        return { success: true, data: response.data }
      }
      
      return { success: false, message: 'Registration failed' }
    } catch (err) {
      console.error('Registration error:', err)
      error.value = err.message || 'Registration failed'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const login = async (credentials, keepLoggedIn = true) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await authService.login({
        phone_number: credentials.phoneNumber,
        password: credentials.password
      })
      
      if (response.data) {
        // Save tokens
        accessToken.value = response.data.accessToken
        refreshToken.value = response.data.refreshToken
        
        localStorage.setItem('access_token', response.data.accessToken)
        localStorage.setItem('refresh_token', response.data.refreshToken)
        
        // Set user info
        user.value = {
          id: response.data.id,
          phone_number: response.data.phone_number,
          ...(response.data.user || {})
        }
        
        // Set default auth header for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`
        
        // Fetch user balance after login
        await fetchUserBalance()
        
        // Fetch user profile
        await fetchUserProfile()
        
        // Persist all data to localStorage
        persistToStorage()
        
        return { success: true, data: user.value }
      }
      
      return { success: false, message: 'Login failed' }
    } catch (err) {
      console.error('Login error:', err)
      error.value = err.message || 'Invalid credentials'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    user.value = null
    userBalance.value = 0
    transactions.value = []
    accessToken.value = null
    refreshToken.value = null
    
    // Clear all localStorage items
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    localStorage.removeItem('userBalance')
    localStorage.removeItem('transactions')
    
    // Remove auth header
    delete api.defaults.headers.common['Authorization']
  }

  const refreshAccessToken = async () => {
    if (!refreshToken.value) {
      await logout()
      return false
    }
    
    try {
      const response = await authService.refreshToken(refreshToken.value)
      
      if (response.data) {
        accessToken.value = response.data.accessToken
        localStorage.setItem('access_token', response.data.accessToken)
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`
        return true
      }

      return false
    } catch (err) {
      console.error('Token refresh error:', err)
      await logout()
      return false
    }
  }

  const fetchUserBalance = async () => {
    if (!accessToken.value) {
      console.log('No access token, cannot fetch balance')
      return false
    }
    
    try {
      const response = await api.get('/auth/balance')
      if (response.data?.data?.balance !== undefined) {
        userBalance.value = response.data.data.balance
        persistToStorage() // Persist after balance update
        return true
      } else if (response.data?.balance !== undefined) {
        userBalance.value = response.data.balance
        persistToStorage() // Persist after balance update
        return true
      }
      return false
    } catch (err) {
      console.error('Failed to fetch balance:', err)
      // Don't clear balance on error, keep cached value
      return false
    }
  }

  const fetchUserProfile = async () => {
    if (!accessToken.value) {
      console.log('No access token, cannot fetch profile')
      return false
    }
    
    try {
      const response = await authService.getProfile()
      if (response.data && response.data.user) {
        user.value = { ...user.value, ...response.data.user }
        persistToStorage() // Persist after profile update
        return true
      } else if (response.data) {
        user.value = { ...user.value, ...response.data }
        persistToStorage() // Persist after profile update
        return true
      }
      return false
    } catch (err) {
      console.error('Failed to fetch profile:', err)
      return false
    }
  }

  // const fetchTransactions = async (limit = 10, offset = 0) => {
  //   if (!accessToken.value) {
  //     console.log('No access token, cannot fetch transactions')
  //     return false
  //   }
    
  //   try {
  //     const response = await api.get('/auth/transactions', {
  //       params: { limit, offset }
  //     })
      
  //     if (response.data?.data) {
  //       transactions.value = response.data.data
  //       persistToStorage() 
  //       return true
  //     } else if (response.data?.transactions) {
  //       transactions.value = response.data.transactions
  //       persistToStorage() 
  //       return true
  //     }
  //     return false
  //   } catch (err) {
  //     console.error('Failed to fetch transactions:', err)
  //     return false
  //   }
  // }

  const updateBalance = (newBalance) => {
    userBalance.value = newBalance
    persistToStorage() // Persist balance update
  }

  const checkAuth = async () => {
    if (accessToken.value) {
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken.value}`
      
      try {
        // Verify token by fetching profile
        const response = await authService.getProfile()
        if (response.data && response.data.user) {
          user.value = response.data.user
          persistToStorage() // Persist after auth check
          
          // Fetch fresh balance in background
          await fetchUserBalance()
          return true
        } else if (response.data) {
          user.value = response.data
          persistToStorage() // Persist after auth check
          
          // Fetch fresh balance in background
          await fetchUserBalance()
          return true
        }
      } catch (err) {
        console.error('Auth check failed:', err)
        // Try to refresh token
        const refreshed = await refreshAccessToken()
        if (!refreshed) {
          await logout()
        } else {
          // If token refreshed, fetch fresh data
          await fetchUserBalance()
          await fetchUserProfile()
        }
        return refreshed
      }
    }
    return false
  }
  // ADD THESE ACTIONS TO authStore.js (inside the store)

// Forgot password - Step 1 (request reset)
const forgotPassword = async (phoneNumber) => {
  isLoading.value = true
  error.value = null
  
  try {
    const response = await authService.forgotPassword(phoneNumber)
    
    if (response.success !== false) {
      return { 
        success: true, 
        message: response.message || 'Password reset initiated',
        userId: response.userId 
      }
    }
    
    return { success: false, message: response.message || 'Request failed' }
  } catch (err) {
    console.error('Forgot password error:', err)
    error.value = err.message || 'Failed to process request'
    return { success: false, message: error.value }
  } finally {
    isLoading.value = false
  }
}

// Reset password - Step 2 (using userId)
const resetPassword = async (userId, newPassword, confirmPassword) => {
  isLoading.value = true
  error.value = null
  
  try {
    const response = await authService.resetPassword(userId, newPassword, confirmPassword)
    
    if (response.success !== false) {
      return { 
        success: true, 
        message: response.message || 'Password reset successful' 
      }
    }
    
    return { success: false, message: response.message || 'Reset failed' }
  } catch (err) {
    console.error('Reset password error:', err)
    error.value = err.message || 'Failed to reset password'
    return { success: false, message: error.value }
  } finally {
    isLoading.value = false
  }
}

// Change password by phone (one step alternative)
const changePasswordByPhone = async (phoneNumber, newPassword, confirmPassword) => {
  isLoading.value = true
  error.value = null
  
  try {
    const response = await authService.changePasswordByPhone(phoneNumber, newPassword, confirmPassword)
    
    if (response.success !== false) {
      return { 
        success: true, 
        message: response.message || 'Password changed successfully' 
      }
    }
    
    return { success: false, message: response.message || 'Change failed' }
  } catch (err) {
    console.error('Change password error:', err)
    error.value = err.message || 'Failed to change password'
    return { success: false, message: error.value }
  } finally {
    isLoading.value = false
  }
}

  // Initialize auth header if token exists
  if (accessToken.value) {
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken.value}`
  }

  return {
    // State
    user,
    userBalance,
    transactions,
    accessToken,
    refreshToken,
    isLoading,
    error,
    
    // Getters
    isAuthenticated,
    isLoggedIn,
    // Actions
    register,
    login,
    logout,
    refreshAccessToken,
    checkAuth,
    fetchUserBalance,
    fetchUserProfile,
    // fetchTransactions,
    updateBalance,

  forgotPassword,       
  resetPassword,        
  changePasswordByPhone  
  }
})