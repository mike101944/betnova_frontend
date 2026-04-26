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
// export const getTransactions = async () => { 
//   try {
//     const response = await api.get('/auth/transactions') 
//     return response.data
//   } catch (error) {
//     throw handleError(error)
//   }
// }

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




/**
 * Forgot password - Request password reset
 * @param {string} phone_number 
 */
export const forgotPassword = async (phone_number) => {
  try {
    const response = await api.post('/auth/forgot-password', { phone_number })
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

/**
 * Reset password using userId
 * @param {string} userId 
 * @param {string} newPassword 
 * @param {string} confirmPassword 
 */
export const resetPassword = async (userId, newPassword, confirmPassword) => {
  try {
    const response = await api.post('/auth/reset-password', { 
      userId, 
      newPassword, 
      confirmPassword 
    })
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

/**
 * Change password directly using phone number (one step)
 * @param {string} phone_number 
 * @param {string} newPassword 
 * @param {string} confirmPassword 
 */
export const changePasswordByPhone = async (phone_number, newPassword, confirmPassword) => {
  try {
    const response = await api.post('/auth/change-password', { 
      phone_number, 
      newPassword, 
      confirmPassword 
    })
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}



/**
 * ADMIN: Get all users
 * @param {number} limit - Number of users per page
 * @param {number} offset - Number of users to skip
 */
export const adminGetAllUsers = async (limit = 100, offset = 0) => {
  try {
    const response = await api.get('/admin/users', { params: { limit, offset } });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * ADMIN: Get user by phone number
 * @param {string} phone_number 
 */
export const adminGetUserByPhone = async (phone_number) => {
  try {
    const response = await api.get(`/admin/users/phone/${phone_number}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * ADMIN: Set exact balance for a user
 * @param {string} phone_number 
 * @param {number} balance 
 */
export const adminSetBalance = async (phone_number, balance) => {
  try {
    const response = await api.put(`/admin/users/phone/${phone_number}/balance`, { balance });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * ADMIN: Add balance to a user
 * @param {string} phone_number 
 * @param {number} amount 
 */
export const adminAddBalance = async (phone_number, amount) => {
  try {
    const response = await api.post(`/admin/users/phone/${phone_number}/balance/add`, { amount });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * ADMIN: Deduct balance from a user
 * @param {string} phone_number 
 * @param {number} amount 
 */
export const adminDeductBalance = async (phone_number, amount) => {
  try {
    const response = await api.post(`/admin/users/phone/${phone_number}/balance/deduct`, { amount });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * ADMIN: Delete user by phone number
 * @param {string} phone_number 
 */
export const adminDeleteUser = async (phone_number) => {
  try {
    const response = await api.delete(`/admin/users/phone/${phone_number}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};