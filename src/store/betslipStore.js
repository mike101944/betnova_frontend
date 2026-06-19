// stores/betSlipStore.js
import { defineStore } from 'pinia'

export const useBetslipStore = defineStore('betslip', {
  state: () => ({
    sportsBets: [],
    virtualsBets: [],
    stakeAmount: 100
  }),
  
  getters: {
    totalSportsOdds: (state) => {
      if (state.sportsBets.length === 0) return 0
      return state.sportsBets.reduce((product, bet) => {
        return product * parseFloat(bet.odds)
      }, 1)
    },
    
    totalSportsReturns: (state) => {
      return (parseFloat(state.stakeAmount) || 0) * state.totalSportsOdds
    },
    
    sportsSelectionsCount: (state) => state.sportsBets.length,
    
    isSelected: (state) => (eventId, selection) => {
      return state.sportsBets.some(
        bet => bet.eventId === eventId && bet.selection === selection
      )
    },
    
    // Add for virtuals if needed
    totalVirtualsOdds: (state) => {
      if (state.virtualsBets.length === 0) return 0
      return state.virtualsBets.reduce((product, bet) => {
        return product * parseFloat(bet.odds)
      }, 1)
    },
    
    totalVirtualsReturns: (state) => {
      return (parseFloat(state.stakeAmount) || 0) * state.totalVirtualsOdds
    },
    
    virtualsSelectionsCount: (state) => state.virtualsBets.length
  },
  
  actions: {
    addToBetslip(selection) {
      const exists = this.sportsBets.some(bet => bet.id === selection.id)
      if (!exists) {
        this.sportsBets.push(selection)
        // REMOVE saveToLocalStorage() - Pinia plugin itashughulikia
      }
    },
    
    removeFromBetslip(selectionId) {
      const index = this.sportsBets.findIndex(bet => bet.id === selectionId)
      if (index !== -1) {
        this.sportsBets.splice(index, 1)
        // REMOVE saveToLocalStorage()
      }
    },
    
    removeSportsBet(index) {
      this.sportsBets.splice(index, 1)
      // REMOVE saveToLocalStorage()
    },
    
    removeVirtualBet(index) {
      this.virtualsBets.splice(index, 1)
    },
    
    clearBetslip() {
      this.sportsBets = []
      this.virtualsBets = []
      // REMOVE saveToLocalStorage()
    },
    
    setStakeAmount(amount) {
      this.stakeAmount = amount
    },
    
    loadBetsFromBooking(bets) {
      this.sportsBets = bets
    },
    
    // REMOVE these two methods completely - we don't need them anymore
    // saveToLocalStorage() { ... },
    // loadFromLocalStorage() { ... }
  },
  
  // ADD THIS - Pinia persistence configuration
  persist: {
    key: 'betslip_store',  // Same key as before for compatibility
    paths: ['sportsBets', 'virtualsBets', 'stakeAmount'], // Only store these states
    storage: localStorage,  // Will work on iOS with fallback
  }
})