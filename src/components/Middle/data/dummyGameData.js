import Papa from 'papaparse'
// import csvFile from '../../../screen/sport/matokeo_betpawa_cleaned.csv?raw'
// import csvFile from '../../../screen/sport/matokeo_betpawa_clean.csv?raw'
import {GameData} from '../../../assets/DataManager/DataManager'


// ========== HELPER FUNCTIONS FOR DATE/TIME FILTERING ==========
// Get current East Africa Time (EAT) - UTC+3
const getCurrentEAT = () => {
  const now = new Date()
  // Convert to East Africa Time (UTC+3)
  const eatTime = new Date(now.toLocaleString("en-US", { timeZone: "Africa/Nairobi" }))
  return eatTime
}

// Parse date and time from CSV format: Date: "Tue 31/03", Time: "8:30 PM"
const parseGameDateTime = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return null
  
  try {
    // Extract day and month from "Tue 31/03" -> get "31/03"
    const dateMatch = dateStr.match(/(\d{1,2})\/(\d{1,2})/)
    if (!dateMatch) return null
    
    const day = parseInt(dateMatch[1])
    const month = parseInt(dateMatch[2]) - 1 // Month is 0-indexed in JS
    const year = new Date().getFullYear()
    
    // Parse time like "8:30 PM"
    const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
    if (!timeMatch) return null
    
    let hours = parseInt(timeMatch[1])
    const minutes = parseInt(timeMatch[2])
    const ampm = timeMatch[3].toUpperCase()
    
    // Convert to 24-hour format
    if (ampm === 'PM' && hours !== 12) hours += 12
    if (ampm === 'AM' && hours === 12) hours = 0
    
    // Create date object
    const gameDate = new Date(year, month, day, hours, minutes)
    
    // Handle year boundary (e.g., December to January)
    if (gameDate < new Date(year, 0, 1) && month === 11) {
      gameDate.setFullYear(year - 1)
    }
    
    return gameDate
  } catch (error) {
    console.error('Error parsing date/time:', dateStr, timeStr, error)
    return null
  }
}

// Check if game is upcoming (date and time not yet passed)
const isUpcomingGame = (game) => {
  const gameDateTime = parseGameDateTime(game.date, game.time)
  if (!gameDateTime) return false
  
  const currentEAT = getCurrentEAT()
  
  // Game should be shown ONLY if its date/time is in the future
  return gameDateTime > currentEAT
}

// Sort games by date/time (earliest first)
const sortByDateTime = (games) => {
  return [...games].sort((a, b) => {
    const dateTimeA = parseGameDateTime(a.date, a.time)
    const dateTimeB = parseGameDateTime(b.date, b.time)
    
    if (!dateTimeA && !dateTimeB) return 0
    if (!dateTimeA) return 1
    if (!dateTimeB) return -1
    
    return dateTimeA - dateTimeB
  })
}
// ==========================================

/**
 * Generate random market value
 * Values: 16-67 (inclusive) and 78
 */
const generateRandomMarket = () => {
  // Define possible market values
  const marketValues = []
  
  // Add values from 16 to 67
  for (let i = 16; i <= 67; i++) {
    marketValues.push(i)
  }
  
  // Add 78
  marketValues.push(78)
  
  // Select random value from the array
  const randomIndex = Math.floor(Math.random() * marketValues.length)
  return marketValues[randomIndex]
}

/**
 * Generate consistent random market based on event ID
 * This ensures the same event gets the same market value each time
 */
const generateConsistentMarket = (eventId) => {
  // Use eventId as seed for deterministic but still "random" looking values
  const seed = eventId || Math.floor(Math.random() * 1000000)
  const marketValues = []
  
  // Add values from 16 to 67
  for (let i = 16; i <= 67; i++) {
    marketValues.push(i)
  }
  
  // Add 78
  marketValues.push(78)
  
  // Use seed to determine index consistently
  const index = seed % marketValues.length
  return marketValues[index]
}

// Parse CSV data
const parsed = Papa.parse(GameData, {
  header: true,
  skipEmptyLines: true,
  transformHeader: h => h.trim()
}).data

const allGamesData = parsed
  .filter(item => item.homeTeam)
  .map((item, index) => {
    // Get existing market value
    let marketValue = Number(item.market) || 0
    
    // If market is empty (0 or NaN), generate random market value
    if (marketValue === 0 || isNaN(marketValue) || !item.market || item.market === '') {
      // Use consistent market generation based on event ID for stability
      const eventId = Number(item.eventId) || index
      marketValue = generateConsistentMarket(eventId)
      
      // Optional: Log when generating market values (can be removed in production)
      console.log(`Generated market value ${marketValue} for ${item.homeTeam} vs ${item.awayTeam} (Event ID: ${eventId})`)
    }
    
    return {
      id: Number(item.id) || index + 1,
      eventId: Number(item.eventId) || Math.floor(Math.random() * 100000000),
      time: item.Time || '',
      date: item.Date || '',
      homeTeam: item.homeTeam || '',
      awayTeam: item.awayTeam || '',
      league: item.league || '',
      homeOdds: item.homeOdds || '',
      drawOdds: item.drawOdds || '',
      awayOdds: item.awayOdds || '',
      market: marketValue,
      bothTeamsToScoreYesOdds: item.bothTeamsToScoreYesOdds || '',
      bothTeamsToScoreNoOdds: item.bothTeamsToScoreNoOdds || '',
      doubleChance1x: item.doubleChance1x || '',
      doubleChance12: item.doubleChance12 || '',
      doubleChance2x: item.doubleChance2x || '',
      // Add isLive flag if needed (you can set based on some condition)
      isLive: false, // Default, you can modify based on your logic
    }
  })

// Filter ONLY upcoming games (date/time not yet passed)
const gamesData = allGamesData.filter(isUpcomingGame)

// If you want sorted games
const sortedGamesData = sortByDateTime(gamesData)

// Export the filtered data
export default sortedGamesData

// Also export raw and helper functions if needed elsewhere
export { allGamesData, isUpcomingGame, parseGameDateTime, getCurrentEAT, generateRandomMarket, generateConsistentMarket }