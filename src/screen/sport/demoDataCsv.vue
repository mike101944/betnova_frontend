<template>
    <div>
      <div v-if="games.length === 0">Loading...</div>
  
      <div v-for="game in games" :key="game.eventId || game.id">
        {{ game.homeTeam }} vs {{ game.awayTeam }} - {{ game.homeOdds }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import Papa from 'papaparse'
  
  // 🔥 import raw CSV (hakuna fetch)
  import csvFile from './dummy_matches_200.csv?raw'
  
  const games = ref([])
  
  // parse immediately
  const parsed = Papa.parse(csvFile, {
    header: true,
    skipEmptyLines: true,
    transformHeader: h => h.trim()
  }).data
  
  const formatted = parsed
    .filter(item => item.homeTeam)
    .map((item, index) => ({
      id: Number(item.id) || index + 1,
      eventId: Number(item.eventId) || Math.floor(Math.random() * 100000000),
      time: item.time || '',
      date: item.date || '',
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
  
  games.value = formatted
  
  console.log("✅ Final JSON:", formatted)
  </script>