<!-- AdminEditBet.vue -->
<template>
    <div class="p-6 max-w-4xl mx-auto">
      <div class="flex justify-between bg-blue-100 items-center mb-2 px-2 py-3 rounded-lg">
        <div>
          <button @click="goBack" class="text-blue-600 hover:text-blue-800 mb-2">← Back to Admin Dashboard</button>
          <h1 class="text-2xl font-bold">Edit Bet #{{ bet?.id }}</h1>
          <p class="text-gray-600">User: {{ bet?.user?.phone_number }} | Status: 
            <span :class="bet?.status === 'OPEN' ? 'text-green-600 font-semibold' : 'text-red-600'">
              {{ bet?.status }}
            </span>
          </p>
        </div>
        <button @click="saveChanges" :disabled="saving" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
          {{ saving ? 'Saving...' : '💾 Save Changes' }}
        </button>
      </div>
  
      <div v-if="bet?.status !== 'OPEN'" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p class="text-red-600">⚠️ This bet is already {{ bet?.status?.toLowerCase() }} and cannot be edited.</p>
      </div>
  
      <div v-if="bet && bet.status === 'OPEN'" class="space-y-4">
        <div v-for="(selection, idx) in selections" :key="idx" class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md">
          <div class="flex justify-between items-start mb-3">
            <h3 class="font-semibold text-gray-800">Selection #{{ idx + 1 }}</h3>
            <button @click="removeSelection(idx)" class="text-red-500 hover:text-red-700" title="Remove">🗑️</button>
          </div>
  
          <div class="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label class="block text-xs text-gray-500 mb-1">Home Team</label>
              <input v-model="selection.homeTeam" type="text" class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">Away Team</label>
              <input v-model="selection.awayTeam" type="text" class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
  
          <div class="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label class="block text-xs text-gray-500 mb-1">League</label>
              <input v-model="selection.league" type="text" class="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">Match Time</label>
              <input v-model="selection.time" type="text" class="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
          </div>
  
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs text-gray-500 mb-1">Selection (Any value allowed)</label>
              <input 
                v-model="selection.selection" 
                list="selectionOptions"
                type="text"
                class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                placeholder="1, X, 2, 0-2, Over 2.5, GG, BTTS, etc..."
              />
              <datalist id="selectionOptions">
                <option value="1">🏠 Home Win (1)</option>
                <option value="X">🤝 Draw (X)</option>
                <option value="2">✈️ Away Win (2)</option>
                <option value="0-2">0-2 (Correct Score)</option>
                <option value="1-1">1-1 (Correct Score)</option>
                <option value="Over 2.5">Over 2.5 Goals</option>
                <option value="Under 2.5">Under 2.5 Goals</option>
                <option value="GG">Both Teams to Score (GG)</option>
              </datalist>
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">Odds</label>
              <input v-model="selection.odds" type="number" step="0.01" min="1.01" class="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
          </div>
        </div>
  
        <button @click="addSelection" class="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500">
          + Add Selection
        </button>
  
        <div class="bg-gray-50 rounded-lg p-4 mt-4">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-sm text-gray-500">Selections</p>
              <p class="text-xl font-bold">{{ selections.length }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Total Odds</p>
              <p class="text-xl font-bold text-yellow-600">{{ calculateTotalOdds().toFixed(2) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Stake</p>
              <p class="text-xl font-bold">{{ formatCurrency(bet.stake) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">New Payout</p>
              <p class="text-xl font-bold text-green-600">{{ formatPotentialReturn() }}</p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Error Display Section -->
      <div v-if="errorMessage" class="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
        {{ errorMessage }}
        <button @click="errorMessage = ''" class="ml-2 text-white font-bold">×</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import api from '../../services/api'
  
  const router = useRouter()
  const route = useRoute()
  const bet = ref(null)
  const selections = ref([])
  const saving = ref(false)
  const errorMessage = ref('')
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('sw-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount || 0)
  }
  
  const calculateTotalOdds = () => {
    let total = 1
    selections.value.forEach(sel => { 
      const odds = parseFloat(sel.odds)
      if (!isNaN(odds) && odds > 0) {
        total *= odds
      }
    })
    return total
  }
  
  const formatPotentialReturn = () => {
    if (!bet.value) return 'TZS 0'
    return formatCurrency(bet.value.stake * calculateTotalOdds())
  }
  
  const addSelection = () => {
    selections.value.push({ 
      homeTeam: '', 
      awayTeam: '', 
      league: '', 
      selection: '1', 
      odds: '2.00', 
      time: '',
      match: ''
    })
  }
  
  const removeSelection = (index) => {
    if (selections.value.length > 1) {
      selections.value.splice(index, 1)
    } else {
      errorMessage.value = 'Cannot remove last selection'
      setTimeout(() => { errorMessage.value = '' }, 3000)
    }
  }
  
  const fetchBet = async () => {
    try {
      console.log('🔍 Fetching bet ID:', route.params.id)
      // ✅ FIXED: Use correct URL pattern /admin/:id (not /admin/adminBets/:id)
      const response = await api.get(`/admin/${route.params.id}`)
      console.log('📦 API Response:', response.data)
      
      if (response.data.success) {
        bet.value = response.data.data
        
        let selectionsData = response.data.data.selections
        console.log('📋 Raw selections data type:', typeof selectionsData)
        
        if (typeof selectionsData === 'string') {
          selectionsData = JSON.parse(selectionsData)
          console.log('🔓 Parsed selections from string:', selectionsData)
        }
        
        selections.value = (selectionsData || []).map(sel => ({
          homeTeam: sel.homeTeam || sel.match?.split(' vs ')[0] || '',
          awayTeam: sel.awayTeam || sel.match?.split(' vs ')[1] || '',
          league: sel.league || '',
          selection: sel.selection || '1',
          odds: sel.odds?.toString() || '2.00',
          time: sel.time || '',
          match: sel.match || ''
        }))
        
        console.log('✅ Final selections array:', selections.value)
      } else {
        errorMessage.value = 'Failed to load bet data'
      }
    } catch (error) { 
      console.error('❌ Error fetching bet:', error)
      errorMessage.value = `Failed to load bet: ${error.response?.data?.message || error.message}`
      setTimeout(() => { errorMessage.value = '' }, 5000)
    }
  }
  
  const saveChanges = async () => {
    errorMessage.value = ''
    
    for (let i = 0; i < selections.value.length; i++) {
      const sel = selections.value[i]
      
      if (!sel.selection || sel.selection.trim() === '') {
        errorMessage.value = `Selection ${i + 1}: Please enter selection outcome`
        setTimeout(() => { errorMessage.value = '' }, 3000)
        return
      }
      
      const oddsValue = parseFloat(sel.odds)
      if (isNaN(oddsValue) || oddsValue <= 1) {
        errorMessage.value = `Selection ${i + 1}: Invalid odds (must be > 1)`
        setTimeout(() => { errorMessage.value = '' }, 3000)
        return
      }
    }
    
    saving.value = true
    
    try {
      const formattedSelections = selections.value.map(sel => ({
        match: sel.match || `${sel.homeTeam || 'TBD'} vs ${sel.awayTeam || 'TBD'}`,
        selection: sel.selection.trim(),
        odds: parseFloat(sel.odds).toFixed(2),
        league: sel.league || 'Unknown League',
        time: sel.time || new Date().toLocaleString(),
        homeTeam: sel.homeTeam || '',
        awayTeam: sel.awayTeam || ''
      }))
      
      console.log('📤 Sending data to backend:', {
        url: `/admin/${bet.value.id}/selections`,
        selections: formattedSelections
      })
      
      // ✅ FIXED: Use correct URL pattern /admin/:id/selections
      const response = await api.put(`/admin/${bet.value.id}/selections`, { 
        selections: formattedSelections 
      })
      
      console.log('✅ Save response:', response.data)
      
      if (response.data.success) {
        alert('Bet updated successfully!')
        router.push('/admin')
      } else {
        errorMessage.value = response.data.message || 'Failed to update bet'
        setTimeout(() => { errorMessage.value = '' }, 3000)
      }
    } catch (error) {
      console.error('❌ Save error:', error)
      
      let errorText = 'Failed to update'
      if (error.response?.data?.message) {
        errorText = error.response.data.message
      } else if (error.message) {
        errorText = error.message
      }
      
      errorMessage.value = `Update failed: ${errorText}`
      setTimeout(() => { errorMessage.value = '' }, 5000)
    } finally { 
      saving.value = false 
    }
  }
  
  const goBack = () => router.push('/admin')
  
  onMounted(() => {
    console.log('🚀 AdminEditBet component mounted')
    fetchBet()
  })
  </script>
  
  <style scoped>
  input, select {
    transition: all 0.2s ease;
  }
  
  input:focus, select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
  </style>