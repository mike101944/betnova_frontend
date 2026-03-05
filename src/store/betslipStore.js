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
    }
  },
  
  actions: {
    addToBetslip(selection) {
      const exists = this.sportsBets.some(bet => bet.id === selection.id)
      if (!exists) {
        this.sportsBets.push(selection)
        // Optional: Save to localStorage
        this.saveToLocalStorage()
      }
    },
    
    removeFromBetslip(selectionId) {
      const index = this.sportsBets.findIndex(bet => bet.id === selectionId)
      if (index !== -1) {
        this.sportsBets.splice(index, 1)
        this.saveToLocalStorage()
      }
    },
    
    removeSportsBet(index) {
      this.sportsBets.splice(index, 1)
      this.saveToLocalStorage()
    },
    
    clearBetslip() {
      this.sportsBets = []
      this.saveToLocalStorage()
    },
    
    setStakeAmount(amount) {
      this.stakeAmount = amount
    },
    
    // LocalStorage persistence
    saveToLocalStorage() {
      localStorage.setItem('betslip_store', JSON.stringify({
        sportsBets: this.sportsBets,
        stakeAmount: this.stakeAmount
      }))
    },
    
    loadFromLocalStorage() {
      const saved = localStorage.getItem('betslip_store')
      if (saved) {
        const data = JSON.parse(saved)
        this.sportsBets = data.sportsBets || []
        this.stakeAmount = data.stakeAmount || 100
      }
    }
  }
})