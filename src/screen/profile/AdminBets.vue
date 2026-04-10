<template>
  <div class="bg-white shadow-sm p-6">
    <!-- Admin Header -->
    <div class="mb-6 pb-4 border-b border-gray-200">
      <h1 class="text-2xl font-bold text-gray-800">Admin Dashboard - All Bets</h1>
      <p class="text-sm text-gray-500 mt-1">Manage, approve, and edit all user bets</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-2 text-gray-600">Loading bets...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8 text-red-600">
      <p>{{ error }}</p>
      <button @click="fetchAllBets" class="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Retry
      </button>
    </div>

    <!-- Bets List -->
    <template v-else>
      <!-- Filters -->
      <div class="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div class="flex space-x-2">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            @click="setFilter(tab.value)"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              filter === tab.value ? tab.activeClass : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            {{ tab.label }}
            <span v-if="tab.count !== undefined" class="ml-1 text-xs">({{ tab.count }})</span>
          </button>
        </div>

        <!-- Search -->
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by phone or bet ID..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <!-- Stats Summary -->
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div class="bg-blue-50 rounded-lg p-3 text-center">
          <p class="text-xs text-blue-600">Total Bets</p>
          <p class="text-xl font-bold text-blue-700">{{ stats.totalBets || 0 }}</p>
        </div>
        <div class="bg-yellow-50 rounded-lg p-3 text-center">
          <p class="text-xs text-yellow-600">Pending</p>
          <p class="text-xl font-bold text-yellow-700">{{ stats.pendingBets || 0 }}</p>
        </div>
        <div class="bg-green-50 rounded-lg p-3 text-center">
          <p class="text-xs text-green-600">Won</p>
          <p class="text-xl font-bold text-green-700">{{ stats.wonBets || 0 }}</p>
        </div>
        <div class="bg-red-50 rounded-lg p-3 text-center">
          <p class="text-xs text-red-600">Lost</p>
          <p class="text-xl font-bold text-red-700">{{ stats.lostBets || 0 }}</p>
        </div>
        <!-- <div class="bg-purple-50 rounded-lg p-3 text-center">
          <p class="text-xs text-purple-600">Total Paid</p>
          <p class="text-xl font-bold text-purple-700">{{ formatCurrency(stats.totalPaidOut) }}</p>
        </div> -->
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User Phone</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bet ID</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date/Time</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Picks</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stake</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Odds</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payout</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Result</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="bet in filteredBets" :key="bet.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-sm text-gray-900">{{ bet.user?.phone_number || 'N/A' }}</td>
              <td class="px-4 py-3 text-sm font-mono text-gray-500">{{ bet.id }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">
                <div>{{ formatDate(bet.createdAt).date }}</div>
                <div class="text-xs">{{ formatDate(bet.createdAt).time }}</div>
              </td>
              <td class="px-4 py-3">
                <span class="bg-gray-100 px-2 py-1 rounded-full text-xs">{{ getSelectionsCount(bet) }} picks</span>
              </td>
              <td class="px-4 py-3 text-sm font-medium">{{ formatCurrency(bet.stake) }}</td>
              <td class="px-4 py-3 text-sm font-semibold text-yellow-700">{{ Number(bet.totalOdds).toFixed(2) }}</td>
              <td class="px-4 py-3 text-sm font-semibold" :class="bet.result === 'WON' ? 'text-green-600' : 'text-gray-900'">
                {{ formatCurrency(bet.potentialReturn) }}
              </td>
              <td class="px-4 py-3">
                <span :class="['px-2 py-1 text-xs font-medium rounded-full', getStatusColor(bet.status)]">
                  {{ bet.status }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span :class="getResultColor(bet.result)">{{ bet.result || 'PENDING' }}</span>
              </td>
              <td class="px-4 py-3">
                <div class="flex space-x-2">
                  <!-- View Details -->
                  <button @click="viewBetDetails(bet)" class="text-blue-600 hover:text-blue-800" title="View Details">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>

                  <!-- Edit Button -->
                  <button @click="editBet(bet)" class="text-yellow-600 hover:text-yellow-800" title="Edit Bet">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  <!-- Approve buttons -->
                  <template v-if="bet.status === 'OPEN' && bet.result === 'PENDING'">
                    <button @click="handleApprove(bet.id, 'WON')" :disabled="processingId === bet.id" class="text-green-600 hover:text-green-800 disabled:opacity-50" title="Approve as WON">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button @click="handleApprove(bet.id, 'LOST')" :disabled="processingId === bet.id" class="text-red-600 hover:text-red-800 disabled:opacity-50" title="Approve as LOST">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </template>

                  <!-- Delete button -->
                  <button @click="handleDelete(bet.id)" :disabled="processingId === bet.id" class="text-red-600 hover:text-red-800 disabled:opacity-50" title="Delete Bet">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
              
            </tr>
          </tbody>
        </table>
        <div v-if="filteredBets.length === 0" class="text-center py-8 text-gray-500">No bets found</div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../services/api'

const router = useRouter()

const allBets = ref([])
const isLoading = ref(false)
const error = ref(null)
const processingId = ref(null)
const filter = ref('all')
const searchQuery = ref('')
const stats = ref({ totalBets: 0, pendingBets: 0, wonBets: 0, lostBets: 0, totalPaidOut: 0 })

const tabs = computed(() => [
  { value: 'all', label: 'All', activeClass: 'bg-blue-600 text-white', count: allBets.value.length },
  { value: 'OPEN', label: 'Pending', activeClass: 'bg-yellow-600 text-white', count: allBets.value.filter(b => b.status === 'OPEN').length },
  { value: 'SETTLED', label: 'Settled', activeClass: 'bg-green-600 text-white', count: allBets.value.filter(b => b.status === 'SETTLED').length }
])

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('sw-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount || 0)
}

const formatDate = (dateString) => {
  if (!dateString) return { time: 'N/A', date: 'N/A' }
  const date = new Date(dateString)
  return { time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), date: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }
}

const getSelectionsCount = (bet) => {
  if (!bet.selections) return 0
  if (Array.isArray(bet.selections)) return bet.selections.length
  try { return JSON.parse(bet.selections).length } catch { return 0 }
}

const getStatusColor = (status) => {
  switch(status) {
    case 'OPEN': return 'bg-yellow-100 text-yellow-800'
    case 'SETTLED': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getResultColor = (result) => {
  switch(result) {
    case 'WON': return 'text-green-600 font-semibold'
    case 'LOST': return 'text-red-600 font-semibold'
    default: return 'text-yellow-600'
  }
}

const filteredBets = computed(() => {
  let bets = allBets.value
  if (filter.value !== 'all') bets = bets.filter(bet => bet.status === filter.value)
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    bets = bets.filter(bet => bet.id?.toLowerCase().includes(query) || bet.user?.phone_number?.includes(query))
  }
  return bets
})

const fetchAllBets = async () => {
  isLoading.value = true
  try {
    const response = await api.get('/admin')
    if (response.data.success) allBets.value = response.data.data.bets
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to fetch bets'
  } finally {
    isLoading.value = false
  }
}

const fetchStats = async () => {
  try {
    const response = await api.get('/admin/stats')
    if (response.data.success) stats.value = response.data.data
  } catch (err) { console.error(err) }
}

const handleApprove = async (id, result) => {
  processingId.value = id
  try {
    await api.patch(`/admin/${id}/approve`, { result })
    await fetchAllBets()
    await fetchStats()
    alert(`Bet ${result === 'WON' ? 'approved as WON - Balance updated!' : 'approved as LOST'}`)
  } catch (error) { alert(error.response?.data?.message || 'Failed to approve bet') }
  finally { processingId.value = null }
}

const handleDelete = async (id) => {
  if (!confirm('Delete this bet?')) return
  processingId.value = id
  try {
    await api.delete(`/admin/${id}`)
    await fetchAllBets()
    await fetchStats()
    alert('Bet deleted')
  } catch (error) { alert('Failed to delete') }
  finally { processingId.value = null }
}

// const viewBetDetails = (bet) => router.push({ name: 'admin-bet-details', params: { id: bet.id } })
// const editBet = (bet) => router.push({ name: 'admin-bet-edit', params: { id: bet.id } })
const viewBetDetails = (bet) => router.push({ 
  name: 'admin-bet-details', 
  params: { id: bet.id } 
})  // Hii itakwenda kwenye /admin/123 ✅ SAHIHI

const editBet = (bet) => router.push({ 
  name: 'admin-bet-edit', 
  params: { id: bet.id } 
})

const setFilter = (value) => filter.value = value

let refreshInterval
onMounted(() => {
  fetchAllBets()
  fetchStats()
  refreshInterval = setInterval(() => { fetchAllBets(); fetchStats() }, 30000)
})
onUnmounted(() => { if (refreshInterval) clearInterval(refreshInterval) })
</script>