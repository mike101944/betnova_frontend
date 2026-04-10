<template>
    <div class="p-6 max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-4">
        <button @click="goBack" class="text-blue-600 hover:text-blue-800">← Back to Admin Dashboard</button>
        <button v-if="bet?.status === 'OPEN'" @click="goToEdit" class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
          ✏️ Edit Bet
        </button>
      </div>
      
      <div v-if="bet" class="bg-white rounded-xl shadow-lg p-6">
        <h1 class="text-2xl font-bold mb-4">Bet Details #{{ bet.id }}</h1>
        
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div><strong>User Phone:</strong> {{ bet.user?.phone_number || 'N/A' }}</div>
          <div><strong>Status:</strong> <span :class="getStatusBadge(bet.status)">{{ bet.status }}</span></div>
          <div><strong>Result:</strong> <span :class="getResultBadge(bet.result)">{{ bet.result || 'PENDING' }}</span></div>
          <div><strong>Stake:</strong> {{ formatCurrency(bet.stake) }}</div>
          <div><strong>Total Odds:</strong> {{ Number(bet.totalOdds).toFixed(2) }}</div>
          <div><strong>Potential Return:</strong> {{ formatCurrency(bet.potentialReturn) }}</div>
          <div><strong>Created:</strong> {{ new Date(bet.createdAt).toLocaleString() }}</div>
          <div><strong>Settled At:</strong> {{ bet.settledAt ? new Date(bet.settledAt).toLocaleString() : 'Not settled' }}</div>
        </div>
        
        <div class="mt-6">
          <h3 class="font-bold mb-3 text-lg">Selections ({{ bet.selections?.length || 0 }} picks):</h3>
          <div v-for="(sel, idx) in bet.selections" :key="idx" class="border p-3 mb-2 rounded-lg bg-gray-50">
            <div class="flex justify-between">
              <div>
                <p class="font-semibold">{{ sel.match || `${sel.homeTeam} vs ${sel.awayTeam}` }}</p>
                <p class="text-sm text-gray-500">{{ sel.league }} | {{ sel.time }}</p>
              </div>
              <div class="text-right">
                <!-- ✅ FIXED: Show actual selection value with icons for standard ones only -->
                <p class="text-lg font-bold">
                  <template v-if="sel.selection === '1'">
                    🏠 Home (1)
                  </template>
                  <template v-else-if="sel.selection === 'X'">
                    🤝 Draw (X)
                  </template>
                  <template v-else-if="sel.selection === '2'">
                    ✈️ Away (2)
                  </template>
                  <template v-else>
                    🎯 {{ sel.selection }}
                  </template>
                </p>
                <p class="text-sm text-yellow-600">Odds: {{ sel.odds }}</p>
              </div>
            </div>
          </div>
        </div>
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
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('sw-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount || 0)
  }
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'OPEN': return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs'
      case 'SETTLED': return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs'
      default: return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs'
    }
  }
  
  const getResultBadge = (result) => {
    switch(result) {
      case 'WON': return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold'
      case 'LOST': return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold'
      default: return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs'
    }
  }
  
  const fetchBet = async () => {
    try {
      console.log('🔍 Fetching bet ID:', route.params.id)
      const response = await api.get(`/admin/${route.params.id}`)
      console.log('📦 API Response:', response.data)
      
      if (response.data.success) {
        const betData = response.data.data;
        
        // Parse selections if it's a string
        if (typeof betData.selections === 'string') {
          betData.selections = JSON.parse(betData.selections);
        }
        
        bet.value = betData;
        console.log('✅ Bet loaded:', bet.value)
        console.log('📋 Selections:', bet.value.selections)
      }
    } catch (error) {
      console.error('❌ Error fetching bet:', error);
      alert('Failed to load bet: ' + (error.response?.data?.message || error.message));
    }
  }
  
  const goBack = () => router.push('/admin')
  const goToEdit = () => router.push(`/admin/${bet.value.id}/edit`)
  
  onMounted(() => fetchBet())
  </script>