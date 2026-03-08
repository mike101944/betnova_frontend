// services/bet.service.js
import api from './api'

class BetService {
  /**
   * Place a new bet
   * @param {Object} betData - { selections, stake }
   */
  async placeBet(betData) {
    try {
      const response = await api.post('/bets', betData)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Load bet by booking code
   * @param {string} bookingCode - e.g., "BETABC123"
   */
  async loadBetByBookingCode(bookingCode) {
    try {
      const response = await api.get(`/bets/load/${bookingCode}`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Get user's bets with pagination
   * @param {Object} params - { status, result, limit, offset }
   */
  async getUserBets(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.status) queryParams.append('status', params.status)
      if (params.result) queryParams.append('result', params.result)
      if (params.limit) queryParams.append('limit', params.limit)
      if (params.offset) queryParams.append('offset', params.offset)
      
      const url = `/bets/user${queryParams.toString() ? '?' + queryParams.toString() : ''}`
      const response = await api.get(url)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Get bet by ID
   * @param {string|number} betId
   */
  async getBetById(betId) {
    try {
      const response = await api.get(`/bets/${betId}`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Generate new booking code for existing bet
   * @param {string|number} betId
   */
  async generateBookingCode(betId) {
    try {
      const response = await api.post(`/bets/${betId}/generate-booking-code`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Cancel bet (before settlement)
   * @param {string|number} betId
   */
  async cancelBet(betId) {
    try {
      const response = await api.patch(`/bets/${betId}/cancel`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Get user bet statistics
   */
  async getUserBetStats() {
    try {
      const response = await api.get('/bets/stats')
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default new BetService()