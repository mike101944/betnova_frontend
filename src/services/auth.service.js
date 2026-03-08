// services/auth.service.js
import api from './api'

/**
 * Register new user
 * @param {Object} data - { phone_number, password }
 */
export const register = async (data) => {
  try {
    const response = await api.post('/auth/register', data)
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

/**
 * Login user
 * @param {Object} data - { phone_number, password }
 */
export const login = async (data) => {
  try {
    const response = await api.post('/auth/login', data)
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

/**
 * Refresh access token
 * @param {string} refreshToken
 */
export const refreshToken = async (refreshToken) => {
  try {
    const response = await api.post('/auth/refresh', { refreshToken })
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

/**
 * Get user profile - FIXED: from /profile to /auth/profile
 */
export const getProfile = async () => {
  try {
    const response = await api.get('/auth/profile') // Changed from '/profile'
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

/**
 * Get user balance - FIXED: from /account/balance to /auth/balance
 */
export const getBalance = async () => { // Added async
  try {
    const response = await api.get('/auth/balance') // Changed from '/account/balance'
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

/**
 * Get user transactions - FIXED: from /account/transactions to /auth/transactions
 */
export const getTransactions = async () => { // Added async
  try {
    const response = await api.get('/auth/transactions') // Changed from '/account/transactions'
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

/**
 * Deposit money
 * @param {number} amount 
 */
export const deposit = async (amount) => {
  try {
    const response = await api.post('/auth/deposit', { amount })
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

/**
 * Withdraw money
 * @param {number} amount 
 */
export const withdraw = async (amount) => {
  try {
    const response = await api.post('/auth/withdraw', { amount })
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

/**
 * Handle errors (internal function - not exported)
 */
const handleError = (error) => {
  if (error.response) {
    // Server responded with error
    throw {
      status: error.response.status,
      message: error.response.data.message || 'Server error occurred',
      data: error.response.data
    }
  } else if (error.request) {
    // Request made but no response
    throw {
      status: 503,
      message: 'Cannot connect to server. Please check your internet connection.'
    }
  } else {
    // Something else happened
    throw {
      status: 500,
      message: error.message || 'An unexpected error occurred'
    }
  }
}