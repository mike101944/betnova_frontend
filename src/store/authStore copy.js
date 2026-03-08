// stores/authStore.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import * as authService from '../services/auth.service'
import api from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const accessToken = ref(localStorage.getItem('access_token') || null)
  const refreshToken = ref(localStorage.getItem('refresh_token') || null)
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => {
    return !!accessToken.value && !!user.value
  })

  const isLoggedIn = computed(() => isAuthenticated.value)

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
          phone_number: response.data.phone_number
        }
        
        // Set default auth header for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`
        
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
    accessToken.value = null
    refreshToken.value = null
    
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    
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

  const checkAuth = async () => {
    if (accessToken.value) {
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken.value}`
      
      try {
        // Verify token by fetching profile
        const response = await authService.getProfile()
        if (response.data && response.data.user) {
          user.value = response.data.user
          return true
        }
      } catch (err) {
        console.error('Auth check failed:', err)
        // Try to refresh token
        const refreshed = await refreshAccessToken()
        if (!refreshed) {
          await logout()
        }
        return refreshed
      }
    }
    return false
  }

  return {
    // State
    user,
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
    checkAuth
  }
})