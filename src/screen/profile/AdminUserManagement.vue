
<!-- AdminUserManagement -->
<template>
    <div>
      <!-- Header with Actions -->
      <div class="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div class="flex space-x-2">
          <button
            @click="showAddBalanceModal = true"
            class="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
          >
            <svg class="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Balance
          </button>
          <button
            @click="showDeductBalanceModal = true"
            class="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
          >
            <svg class="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
            Deduct Balance
          </button>
        </div>
  
        <!-- Search -->
        <div class="relative">
          <input
            v-model="searchPhoneNumber"
            type="text"
            placeholder="Search by phone number..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            @keyup.enter="searchUser"
          />
          <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
  
      <!-- Users Table -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone Number</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance (TZS)</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined Date</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Updated</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-sm text-gray-900 font-mono">{{ user.phone_number }}</td>
              <td class="px-4 py-3 text-sm font-semibold" :class="user.balance < 1000 ? 'text-red-600' : 'text-green-600'">
                {{ formatCurrency(user.balance) }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ formatDate(user.created_at) }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ formatDate(user.updated_at) }}</td>
              <td class="px-4 py-3">
                <div class="flex space-x-2">
                  <button @click="viewUser(user)" class="text-blue-600 hover:text-blue-800" title="View User">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button @click="openSetBalanceModal(user)" class="text-purple-600 hover:text-purple-800" title="Set Balance">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button @click="openAddBalanceModal(user)" class="text-green-600 hover:text-green-800" title="Add Balance">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <button @click="openDeductBalanceModal(user)" class="text-red-600 hover:text-red-800" title="Deduct Balance">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                    </svg>
                  </button>
                  <button @click="confirmDeleteUser(user)" class="text-red-600 hover:text-red-800" title="Delete User">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="users.length === 0 && !isLoading">
              <td colspan="5" class="px-4 py-8 text-center text-gray-500">No users found</td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Pagination -->
      <div class="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
        <div class="text-sm text-gray-500">
          Showing {{ users.length }} of {{ totalUsers }} users
        </div>
        <div class="flex space-x-2">
          <button
            @click="changePage(offset - limit)"
            :disabled="offset === 0"
            class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            @click="changePage(offset + limit)"
            :disabled="offset + limit >= totalUsers"
            class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
  
      <!-- ============ MODALS ============ -->
  
      <!-- View User Modal -->
     <div v-if="showViewModal" class="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-[1000] backdrop-blur-md transition-all duration-300" @click.self="closeViewModal">
  <div class="bg-white rounded-2xl max-w-[380px] w-[92%] max-h-[90vh] overflow-y-auto shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border border-slate-100 transform transition-all">
    
    <div class="relative px-4 pt-8 pb-6 rounded-t-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900">
      <button @click="closeViewModal" class="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/15 active:scale-95 transition-all bg-white/5 backdrop-blur-sm" aria-label="Close modal">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/20 shadow-inner bg-gradient-to-tr from-blue-500 to-violet-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>

      <p class="text-white text-xl font-semibold tracking-wide text-center">{{ selectedUser?.phone_number?.startsWith('0') ? '+255' + selectedUser.phone_number.slice(1) : '+255' + selectedUser?.phone_number }}</p>
      <p class="text-slate-400 font-mono text-[12px] tracking-widest text-center mt-1 select-all ">ID: {{ selectedUser?.id }}</p>
    </div>

    <div v-if="selectedUser" class="px-6 py-6 space-y-5">
      
      <div class="rounded-2xl p-4 flex items-center justify-between border transition-colors"
           :class="selectedUser.balance < 1000 ? 'bg-rose-50/60 border-rose-100' : 'bg-emerald-50/60 border-emerald-100'">
        <div>
          <p class="text-[10px] uppercase tracking-wider font-bold mb-1"
             :class="selectedUser.balance < 1000 ? 'text-rose-500' : 'text-emerald-600'">
            Account Balance
          </p>
          <p class="text-2xl font-bold tracking-tight" 
             :class="selectedUser.balance < 1000 ? 'text-rose-600' : 'text-emerald-700'">
            {{ formatCurrency(selectedUser.balance) }}
          </p>
        </div>
        <div class="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm" 
             :class="selectedUser.balance < 1000 ? 'bg-white text-rose-500' : 'bg-white text-emerald-600'">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
      </div>

      <div class="space-y-1">
        <div class="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span class="text-sm font-medium text-slate-500">Member since</span>
          </div>
          <span class="text-sm font-semibold text-slate-800">{{ formatFullDate(selectedUser.created_at) }}</span>
        </div>

        <div class="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <span class="text-sm font-medium text-slate-500">Last updated</span>
          </div>
          <span class="text-sm font-semibold text-slate-800">{{ formatFullDate(selectedUser.updated_at) }}</span>
        </div>
      </div>

      <button @click="closeViewModal" class="w-full bg-slate-100 text-slate-700 py-3 rounded-xl font-semibold text-sm hover:bg-slate-200 active:scale-[0.99] transition-all mt-2 focus:outline-none focus:ring-2 focus:ring-slate-300">
        Close
      </button>
    </div>
  </div>
</div>
  
      <!-- Set Balance Modal -->
      <div v-if="showSetBalanceModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="closeSetBalanceModal">
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 class="text-xl font-bold mb-4">Set Balance for {{ selectedUser?.phone_number }}</h2>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">New Balance (TZS)</label>
            <input
              v-model.number="balanceAmount"
              type="number"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new balance"
            />
          </div>
          <div class="flex space-x-3">
            <button @click="closeSetBalanceModal" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button @click="submitSetBalance" :disabled="isProcessing" class="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50">
              {{ isProcessing ? 'Processing...' : 'Set Balance' }}
            </button>
          </div>
        </div>
      </div>
  
      <!-- Add Balance Modal -->
      <div v-if="showAddBalanceModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] backdrop-blur-sm" @click.self="closeAddBalanceModal">
        <div class="bg-white rounded-2xl p-5 max-w-[380px] w-[90%] max-h-[90vh] overflow-y-auto shadow-2xl">
          <h2 class="text-xl font-bold mb-4">Add Balance</h2>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              v-model="targetPhoneNumber"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter phone number"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Amount (TZS)</label>
            <input
              v-model.number="balanceAmount"
              type="number"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount to add"
            />
          </div>
          <div class="flex space-x-3">
            <button @click="closeAddBalanceModal" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button @click="submitAddBalance" :disabled="isProcessing" class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
              {{ isProcessing ? 'Processing...' : 'Add Balance' }}
            </button>
          </div>
        </div>
      </div>
  
      <!-- Deduct Balance Modal -->
      <div v-if="showDeductBalanceModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] backdrop-blur-sm" @click.self="closeDeductBalanceModal">
        <div class="bg-white rounded-2xl p-5 max-w-[380px] w-[90%] max-h-[90vh] overflow-y-auto shadow-2xl">
          <h2 class="text-xl font-bold mb-4">Deduct Balance</h2>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              v-model="targetPhoneNumber"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter phone number"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Amount (TZS)</label>
            <input
              v-model.number="balanceAmount"
              type="number"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount to deduct"
            />
          </div>
          <div class="flex space-x-3">
            <button @click="closeDeductBalanceModal" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button @click="submitDeductBalance" :disabled="isProcessing" class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
              {{ isProcessing ? 'Processing...' : 'Deduct Balance' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useAuthStore } from '../../store/authStore'
  
  const authStore = useAuthStore()
  
  const users = ref([])
  const totalUsers = ref(0)
  const isLoading = ref(false)
  const isProcessing = ref(false)
  const offset = ref(0)
  const limit = ref(20)
  const searchPhoneNumber = ref('')
  const selectedUser = ref(null)
  
  // Modal states
  const showViewModal = ref(false)
  const showSetBalanceModal = ref(false)
  const showAddBalanceModal = ref(false)
  const showDeductBalanceModal = ref(false)
  const targetPhoneNumber = ref('')
  const balanceAmount = ref(0)
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('sw-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount || 0)
  }
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }
  
  const formatFullDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleString('en-GB')
  }
  
  const fetchUsers = async () => {
    isLoading.value = true
    try {
      const result = await authStore.adminGetAllUsers(limit.value, offset.value)
      if (result.success) {
        users.value = result.users || []
        totalUsers.value = result.total || 0
      } else {
        alert(result.message)
      }
    } catch (error) {
      console.error('Fetch users error:', error)
      alert('Failed to fetch users')
    } finally {
      isLoading.value = false
    }
  }
  
  const searchUser = async () => {
    if (!searchPhoneNumber.value) {
      await fetchUsers()
      return
    }
    
    isLoading.value = true
    try {
      const result = await authStore.adminGetUserByPhone(searchPhoneNumber.value)
      if (result.success) {
        users.value = [result.user]
        totalUsers.value = 1
      } else {
        alert(result.message)
        users.value = []
        totalUsers.value = 0
      }
    } catch (error) {
      console.error('Search user error:', error)
      alert('User not found')
      users.value = []
      totalUsers.value = 0
    } finally {
      isLoading.value = false
    }
  }
  
  const changePage = (newOffset) => {
    if (newOffset >= 0 && newOffset < totalUsers.value) {
      offset.value = newOffset
      fetchUsers()
    }
  }
  
  const viewUser = (user) => {
    selectedUser.value = user
    showViewModal.value = true
  }
  
  const closeViewModal = () => {
    showViewModal.value = false
    selectedUser.value = null
  }
  
  const openSetBalanceModal = (user) => {
    selectedUser.value = user
    balanceAmount.value = user.balance
    showSetBalanceModal.value = true
  }
  
  const closeSetBalanceModal = () => {
    showSetBalanceModal.value = false
    selectedUser.value = null
    balanceAmount.value = 0
  }
  
  const submitSetBalance = async () => {
    if (!balanceAmount.value || balanceAmount.value < 0) {
      alert('Please enter a valid balance amount')
      return
    }
    
    isProcessing.value = true
    try {
      const result = await authStore.adminSetBalance(selectedUser.value.phone_number, balanceAmount.value)
      if (result.success) {
        alert(result.message)
        closeSetBalanceModal()
        fetchUsers()
      } else {
        alert(result.message)
      }
    } catch (error) {
      alert('Failed to set balance')
    } finally {
      isProcessing.value = false
    }
  }
  
  const openAddBalanceModal = (user) => {
    selectedUser.value = user
    targetPhoneNumber.value = user.phone_number
    balanceAmount.value = 0
    showAddBalanceModal.value = true
  }
  
  const closeAddBalanceModal = () => {
    showAddBalanceModal.value = false
    selectedUser.value = null
    targetPhoneNumber.value = ''
    balanceAmount.value = 0
  }
  
  const submitAddBalance = async () => {
    if (!targetPhoneNumber.value) {
      alert('Phone number is required')
      return
    }
    if (!balanceAmount.value || balanceAmount.value <= 0) {
      alert('Please enter a valid amount greater than 0')
      return
    }
    
    isProcessing.value = true
    try {
      const result = await authStore.adminAddBalance(targetPhoneNumber.value, balanceAmount.value)
      if (result.success) {
        alert(result.message)
        closeAddBalanceModal()
        fetchUsers()
      } else {
        alert(result.message)
      }
    } catch (error) {
      alert('Failed to add balance')
    } finally {
      isProcessing.value = false
    }
  }
  
  const openDeductBalanceModal = (user) => {
    selectedUser.value = user
    targetPhoneNumber.value = user.phone_number
    balanceAmount.value = 0
    showDeductBalanceModal.value = true
  }
  
  const closeDeductBalanceModal = () => {
    showDeductBalanceModal.value = false
    selectedUser.value = null
    targetPhoneNumber.value = ''
    balanceAmount.value = 0
  }
  
  const submitDeductBalance = async () => {
    if (!targetPhoneNumber.value) {
      alert('Phone number is required')
      return
    }
    if (!balanceAmount.value || balanceAmount.value <= 0) {
      alert('Please enter a valid amount greater than 0')
      return
    }
    
    isProcessing.value = true
    try {
      const result = await authStore.adminDeductBalance(targetPhoneNumber.value, balanceAmount.value)
      if (result.success) {
        alert(result.message)
        closeDeductBalanceModal()
        fetchUsers()
      } else {
        alert(result.message)
      }
    } catch (error) {
      alert('Failed to deduct balance')
    } finally {
      isProcessing.value = false
    }
  }
  
  const confirmDeleteUser = async (user) => {
    if (confirm(`Are you sure you want to delete user ${user.phone_number}? This action cannot be undone.`)) {
      isProcessing.value = true
      try {
        const result = await authStore.adminDeleteUser(user.phone_number)
        if (result.success) {
          alert(result.message)
          fetchUsers()
        } else {
          alert(result.message)
        }
      } catch (error) {
        alert('Failed to delete user')
      } finally {
        isProcessing.value = false
      }
    }
  }
  
  onMounted(() => {
    fetchUsers()
  })
  </script>