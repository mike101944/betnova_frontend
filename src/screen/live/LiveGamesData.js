// LiveGamesData.js
import { ref, computed, watch } from 'vue'
import Papa from 'papaparse'
import { GameData } from '../../assets/DataManager/DataManager'

// ========== LIVE GAME STATE MANAGEMENT ==========
class LiveGameManager {
  constructor() {
    this.liveGames = ref([])
    this.completedGames = ref([])
    this.upcomingGames = ref([])
    this.intervals = new Map() // Store intervals per game
  }

  // Get current EAT time
  getCurrentEAT() {
    const now = new Date()
    return new Date(now.toLocaleString("en-US", { timeZone: "Africa/Nairobi" }))
  }

  // Parse game date/time from CSV
  parseGameDateTime(dateStr, timeStr) {
    if (!dateStr || !timeStr) return null
    
    try {
      const dateMatch = dateStr.match(/(\d{1,2})\/(\d{1,2})/)
      if (!dateMatch) return null
      
      const day = parseInt(dateMatch[1])
      const month = parseInt(dateMatch[2]) - 1
      const year = new Date().getFullYear()
      
      const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
      if (!timeMatch) return null
      
      let hours = parseInt(timeMatch[1])
      const minutes = parseInt(timeMatch[2])
      const ampm = timeMatch[3].toUpperCase()
      
      if (ampm === 'PM' && hours !== 12) hours += 12
      if (ampm === 'AM' && hours === 12) hours = 0
      
      const gameDate = new Date(year, month, day, hours, minutes)
      
      if (gameDate < new Date(year, 0, 1) && month === 11) {
        gameDate.setFullYear(year - 1)
      }
      
      return gameDate
    } catch (error) {
      console.error('Error parsing date/time:', error)
      return null
    }
  }

  // Check if game should be live now
  isGameLiveNow(game) {
    const gameDateTime = this.parseGameDateTime(game.date, game.time)
    if (!gameDateTime) return false
    
    const currentEAT = this.getCurrentEAT()
    const gameEndTime = new Date(gameDateTime.getTime() + (93 * 60 * 1000)) // 90 + 3 minutes injury time
    
    // Game is live if current time is between start time and end time
    return currentEAT >= gameDateTime && currentEAT <= gameEndTime
  }

  // Check if game is upcoming (not started yet)
  isUpcoming(game) {
    const gameDateTime = this.parseGameDateTime(game.date, game.time)
    if (!gameDateTime) return false
    return this.getCurrentEAT() < gameDateTime
  }

  // Check if game is completed (finished)
  isCompleted(game) {
    const gameDateTime = this.parseGameDateTime(game.date, game.time)
    if (!gameDateTime) return false
    const gameEndTime = new Date(gameDateTime.getTime() + (93 * 60 * 1000)) // 90 + 3 minutes
    return this.getCurrentEAT() > gameEndTime
  }

  // Calculate current minute of live game from start time to now
  calculateCurrentMinute(game) {
    const gameDateTime = this.parseGameDateTime(game.date, game.time)
    if (!gameDateTime) return 0
    
    const currentEAT = this.getCurrentEAT()
    const elapsedMs = currentEAT - gameDateTime.getTime()
    let elapsedMinutes = Math.floor(elapsedMs / (60 * 1000))
    
    // Limit to 93 minutes (90 + 3 injury time)
    if (elapsedMinutes > 93) {
      return 93
    }
    
    return elapsedMinutes
  }

  // Get half time status based on actual minutes
  getHalfTimeStatus(minute) {
    if (minute >= 45 && minute < 50) return 'HALF TIME'
    if (minute >= 50) return 'SECOND HALF'
    return 'FIRST HALF'
  }

  // Generate random but consistent live stats based on game ID and minute
  generateLiveStats(game, minute) {
    const seed = game.eventId || game.id
    const rnd = (min, max) => {
      const val = ((seed * (minute + 1)) % 10000) / 10000
      return min + val * (max - min)
    }
    
    // Generate stats that increase as minute progresses
    const progress = Math.min(minute / 90, 1)
    
    return {
      homeShots: Math.floor(rnd(2, 15) * (0.5 + progress)),
      awayShots: Math.floor(rnd(1, 12) * (0.5 + progress)),
      homeShotsOnTarget: Math.floor(rnd(1, 8) * (0.3 + progress)),
      awayShotsOnTarget: Math.floor(rnd(0, 7) * (0.3 + progress)),
      homePossession: Math.floor(rnd(40, 60)),
      awayPossession: 100 - Math.floor(rnd(40, 60)),
      homeYellowCards: Math.floor(rnd(0, 3) * progress),
      awayYellowCards: Math.floor(rnd(0, 3) * progress),
      homeRedCards: Math.floor(rnd(0, 1) * (progress * 0.5)),
      awayRedCards: Math.floor(rnd(0, 1) * (progress * 0.5))
    }
  }

  // Generate goal events based on minute and team strength
  generateGoals(game, minute) {
    const homeStrength = this.getTeamStrength(game.homeTeam)
    const awayStrength = this.getTeamStrength(game.awayTeam)
    
    let homeGoals = 0
    let awayGoals = 0
    
    // Simulate goals based on team strength and minute
    const effectiveMinute = Math.min(minute, 90)
    const homeGoalProb = 0.018 * homeStrength * (effectiveMinute / 90)
    const awayGoalProb = 0.018 * awayStrength * (effectiveMinute / 90)
    
    for (let m = 0; m <= effectiveMinute; m += 5) {
      if (Math.random() < homeGoalProb) homeGoals++
      if (Math.random() < awayGoalProb) awayGoals++
    }
    
    return { homeGoals, awayGoals }
  }

  // Simple team strength (1-5)
  getTeamStrength(teamName) {
    const strengths = {
      'Manchester United': 4, 'Manchester City': 5, 'Liverpool': 5,
      'Arsenal': 4, 'Chelsea': 4, 'Tottenham': 3.5, 'Real Madrid': 5,
      'Barcelona': 4.5, 'Atletico Madrid': 4, 'Bayern Munich': 5,
      'Borussia Dortmund': 4, 'Paris SG': 4.5, 'Juventus': 4,
      'Inter Milan': 4, 'AC Milan': 3.5
    }
    return strengths[teamName] || 3
  }

  // Update live game simulation
  updateLiveGame(game) {
    const minute = this.calculateCurrentMinute(game)
    const halfTimeStatus = this.getHalfTimeStatus(minute)
    const stats = this.generateLiveStats(game, minute)
    const goals = this.generateGoals(game, minute)
    
    // Check if game just finished (after 93 minutes)
    if (minute >= 93 && game.status !== 'FINISHED') {
      this.completeGame(game)
      return null
    }
    
    return {
      ...game,
      isLive: true,
      minute: minute,
      halfTimeStatus: halfTimeStatus,
      homeScore: goals.homeGoals,
      awayScore: goals.awayGoals,
      stats: stats,
      possession: {
        home: stats.homePossession,
        away: stats.awayPossession
      },
      lastUpdated: new Date().toISOString(),
      status: minute >= 45 && minute < 50 ? 'HALF_TIME' : 'LIVE'
    }
  }

  // Complete game (move to completed list)
  completeGame(game) {
    if (this.intervals.has(game.id)) {
      clearInterval(this.intervals.get(game.id))
      this.intervals.delete(game.id)
    }
    
    const completedGame = {
      ...game,
      isLive: false,
      isCompleted: true,
      status: 'FINISHED',
      minute: 90
    }
    
    // Remove from live games
    const liveIndex = this.liveGames.value.findIndex(g => g.id === game.id)
    if (liveIndex !== -1) {
      this.liveGames.value.splice(liveIndex, 1)
    }
    
    // Add to completed games
    this.completedGames.value.push(completedGame)
    
    // Keep only last 20 completed games
    if (this.completedGames.value.length > 20) {
      this.completedGames.value.shift()
    }
  }

  // Start live simulation for a game
  startLiveGame(game) {
    if (this.intervals.has(game.id)) return
    
    // Check if game should be live
    if (!this.isGameLiveNow(game)) return
    
    // Add to live games if not already there
    const exists = this.liveGames.value.some(g => g.id === game.id)
    if (!exists) {
      // Calculate initial minute based on current time
      const initialMinute = this.calculateCurrentMinute(game)
      const initialHalfTimeStatus = this.getHalfTimeStatus(initialMinute)
      const initialStats = this.generateLiveStats(game, initialMinute)
      const initialGoals = this.generateGoals(game, initialMinute)
      
      const initialGame = {
        ...game,
        isLive: true,
        minute: initialMinute,
        halfTimeStatus: initialHalfTimeStatus,
        homeScore: initialGoals.homeGoals,
        awayScore: initialGoals.awayGoals,
        stats: initialStats,
        possession: {
          home: initialStats.homePossession,
          away: initialStats.awayPossession
        },
        status: initialMinute >= 45 && initialMinute < 50 ? 'HALF_TIME' : 'LIVE'
      }
      this.liveGames.value.push(initialGame)
    }
    
    // Start interval to update game every minute
    const interval = setInterval(() => {
      const gameIndex = this.liveGames.value.findIndex(g => g.id === game.id)
      if (gameIndex !== -1) {
        const updatedGame = this.updateLiveGame(this.liveGames.value[gameIndex])
        if (updatedGame) {
          this.liveGames.value[gameIndex] = updatedGame
        }
      }
    }, 60000) // Update every minute
    
    this.intervals.set(game.id, interval)
  }

  // Load and process all games from CSV
  async loadGames() {
    return new Promise((resolve) => {
      Papa.parse(GameData, {
        header: true,
        skipEmptyLines: true,
        transformHeader: h => h.trim(),
        complete: (results) => {
          const allGames = results.data
            .filter(item => item.homeTeam)
            .map((item, index) => ({
              id: Number(item.id) || index + 1,
              eventId: Number(item.eventId) || Math.floor(Math.random() * 100000000),
              time: item.Time || item.time || '',
              date: item.Date || item.date || '',
              homeTeam: item.homeTeam || '',
              awayTeam: item.awayTeam || '',
              league: item.league || '',
              homeOdds: item.homeOdds || (Math.random() * 2 + 1.5).toFixed(2),
              drawOdds: item.drawOdds || (Math.random() * 2 + 2.5).toFixed(2),
              awayOdds: item.awayOdds || (Math.random() * 2 + 1.8).toFixed(2),
              market: Number(item.market) || Math.floor(Math.random() * (67 - 16 + 1) + 16),
              isLive: false,
              status: 'UPCOMING'
            }))
          
          // Separate games by status
          allGames.forEach(game => {
            if (this.isCompleted(game)) {
              this.completedGames.value.push(game)
            } else if (this.isGameLiveNow(game)) {
              this.startLiveGame(game)
            } else if (this.isUpcoming(game)) {
              this.upcomingGames.value.push(game)
            }
          })
          
          // Sort upcoming games by date/time
          this.upcomingGames.value.sort((a, b) => {
            const dateA = this.parseGameDateTime(a.date, a.time)
            const dateB = this.parseGameDateTime(b.date, b.time)
            return dateA - dateB
          })
          
          resolve({
            liveGames: this.liveGames,
            upcomingGames: this.upcomingGames,
            completedGames: this.completedGames
          })
        }
      })
    })
  }

  // Check for new games that should go live (call every minute)
  checkForNewLiveGames() {
    this.upcomingGames.value.forEach(game => {
      if (this.isGameLiveNow(game)) {
        // Remove from upcoming
        const index = this.upcomingGames.value.findIndex(g => g.id === game.id)
        if (index !== -1) {
          this.upcomingGames.value.splice(index, 1)
        }
        // Start live
        this.startLiveGame(game)
      }
    })
  }

  // Clean up intervals on unmount
  cleanup() {
    this.intervals.forEach((interval) => {
      clearInterval(interval)
    })
    this.intervals.clear()
  }
}

// Create singleton instance
const liveGameManager = new LiveGameManager()

// Start checking for new live games every minute
setInterval(() => {
  liveGameManager.checkForNewLiveGames()
}, 60000)

// Export the manager and reactive refs
export const liveGames = liveGameManager.liveGames
export const upcomingGames = liveGameManager.upcomingGames
export const completedGames = liveGameManager.completedGames
export const loadGames = () => liveGameManager.loadGames()
export const cleanupLiveGames = () => liveGameManager.cleanup()

export default liveGameManager