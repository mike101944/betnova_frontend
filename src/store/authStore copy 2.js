// stores/authStore.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const userBalance = ref(0)
  const transactions = ref([])
  const accessToken = ref(localStorage.getItem('access_token') || null)
  const refreshToken = ref(localStorage.getItem('refresh_token') || null)
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => {
    return !!accessToken.value
  })

  const isLoggedIn = computed(() => isAuthenticated.value)

  // Actions
  const register = async (phoneNumber, password) => {
    if (isLoading.value) return { success: false, message: 'Already processing' }
    
    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.post('/auth/register', {
        phone_number: phoneNumber,
        password: password
      })
      
      return { success: true, data: response.data }
    } catch (err) {
      console.error('Registration error:', err)
      const errorMessage = err.response?.data?.message || 'Registration failed'
      error.value = errorMessage
      return { success: false, message: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const login = async (credentials) => {
    if (isLoading.value) {
      return { success: false, message: 'Login already in progress' }
    }
    
    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.post('/auth/login', {
        phone_number: credentials.phoneNumber,
        password: credentials.password
      })
      
      const userData = response.data.data
      
      // Save tokens
      accessToken.value = userData.accessToken
      refreshToken.value = userData.refreshToken
      
      localStorage.setItem('access_token', userData.accessToken)
      localStorage.setItem('refresh_token', userData.refreshToken)
      
      // Save user
      user.value = {
        id: userData.id,
        phone_number: userData.phone_number
      }
      localStorage.setItem('user', JSON.stringify(user.value))
      
      // Fetch balance
      await fetchUserBalance()
      
      return { success: true, data: user.value }
      
    } catch (err) {
      console.error('Login error:', err)
      
      let errorMessage = 'Invalid phone number or password'
      if (err.response?.status === 401) errorMessage = 'Invalid credentials'
      else if (err.response?.status === 404) errorMessage = 'Account not found'
      else if (err.response?.data?.message) errorMessage = err.response.data.message
      
      error.value = errorMessage
      return { success: false, message: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    userBalance.value = 0
    transactions.value = []
    accessToken.value = null
    refreshToken.value = null
    
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    
    delete api.defaults.headers.common['Authorization']
    
    window.location.href = '/'
  }

  const fetchUserBalance = async () => {
    if (!accessToken.value) return false
    
    try {
      const response = await api.get('/auth/balance')
      if (response.data?.data?.balance !== undefined) {
        userBalance.value = response.data.data.balance
        return true
      }
      return false
    } catch (err) {
      console.error('Failed to fetch balance:', err)
      return false
    }
  }

  const fetchUserProfile = async () => {
    if (!accessToken.value) return false
    
    try {
      const response = await api.get('/auth/profile')
      if (response.data?.data) {
        user.value = { ...user.value, ...response.data.data }
        return true
      }
      return false
    } catch (err) {
      console.error('Failed to fetch profile:', err)
      return false
    }
  }

  const checkAuth = () => {
    const token = localStorage.getItem('access_token')
    const savedUser = localStorage.getItem('user')
    
    if (token && savedUser) {
      accessToken.value = token
      user.value = JSON.parse(savedUser)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUserBalance()
      return true
    }
    return false
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
    checkAuth,
    fetchUserBalance,
    fetchUserProfile
  }
})