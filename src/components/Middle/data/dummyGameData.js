import Papa from 'papaparse'
import csvFile from '../../../screen/sport/matokeo_betpawa_final_removeNAN.csv?raw'

const parsed = Papa.parse(csvFile, {
  header: true,
  skipEmptyLines: true,
  transformHeader: h => h.trim()
}).data

const gamesData = parsed
  .filter(item => item.homeTeam)
  .map((item, index) => ({
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
    market: Number(item.market) || 0,
    bothTeamsToScoreYesOdds: item.bothTeamsToScoreYesOdds || '',
    bothTeamsToScoreNoOdds: item.bothTeamsToScoreNoOdds || '',
    doubleChance1x: item.doubleChance1x || '',
    doubleChance12: item.doubleChance12 || '',
    doubleChance2x: item.doubleChance2x || '',
  }))

export default gamesData