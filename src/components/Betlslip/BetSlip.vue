<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useAuthStore } from '../../store/authStore'
import api from '../../services/api'

// Active tab
const activeTab = ref('sports')
const bookingCode = ref('')
const stakeAmount = ref('')

// Auth store
const authStore = useAuthStore()

// Loading and error states
const isLoading = ref(false)
const error = ref(null)
const success = ref(null)
const loadingMessage = ref('')

// Modal state
const showBalanceModal = ref(false)
const modalMessage = ref('')

// Sports Bets - Load from localStorage
const sportsBets = ref([])

// Virtuals Bets
const virtualsBets = ref([])

// Force update key for iOS/Safari
const forceUpdateKey = ref(0)


// Booking code modal state
const showBookingCodeModal = ref(false)
const generatedBookingCode = ref('')
const bookingCodeExpiresAt = ref('')
const isCreatingCode = ref(false)


// Detect iOS/Safari
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

// Check if user is authenticated
const isAuthenticated = computed(() => {
  return authStore.isAuthenticated
})

// Get user balance from auth store
const userBalance = computed(() => {
  return authStore.userBalance || 0
})

// Check if user has sufficient balance
const insufficientBalance = computed(() => {
  const stake = parseFloat(stakeAmount.value) || 0
  return stake > userBalance.value
})

// Check if stake is valid (minimum 100)
const isValidStake = computed(() => {
  const stake = parseFloat(stakeAmount.value) || 0
  return stake >= 135000
})

// Check if balance exceeds minimum withdrawal threshold
const hasExceededWithdrawalLimit = computed(() => {
  return userBalance.value >= 5000000
})

// Format balance
const formatBalance = (amount) => {
  return new Intl.NumberFormat('sw-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount || 0)
}

// Save to localStorage with iOS/Safari compatibility
const saveToLocalStorage = (bets) => {
  try {
    const dataToSave = JSON.stringify(bets)
    localStorage.setItem('betslip_selections', dataToSave)

    // iOS/Safari compatible custom event
    if (window.CustomEvent) {
      try {
        const event = new CustomEvent('betslip-update', { detail: bets })
        window.dispatchEvent(event)
      } catch (e) {
        // Fallback for older iOS
        const event = document.createEvent('CustomEvent')
        event.initCustomEvent('betslip-update', true, true, bets)
        window.dispatchEvent(event)
      }
    }

    // Force storage event for cross-tab communication
    try {
      const storageEvent = new StorageEvent('storage', {
        key: 'betslip_selections',
        newValue: dataToSave,
        oldValue: localStorage.getItem('betslip_selections')
      })
      window.dispatchEvent(storageEvent)
    } catch (e) {
      // Fallback: manually trigger handleStorageChange
      handleStorageChange({ key: 'betslip_selections' })
    }

    // Force Vue to update for iOS
    forceUpdateKey.value++
  } catch (e) {
    console.error('Error saving to localStorage:', e)
  }
}

// Load from localStorage with iOS/Safari compatibility
const loadFromLocalStorage = () => {
  try {
    const savedBets = localStorage.getItem('betslip_selections')
    if (savedBets) {
      const parsed = JSON.parse(savedBets)
      if (JSON.stringify(sportsBets.value) !== JSON.stringify(parsed)) {
        sportsBets.value = parsed
        console.log('Bets loaded from localStorage:', sportsBets.value)
        // Force re-render for iOS
        nextTick(() => {
          forceUpdateKey.value++
        })
      }
    } else {
      if (sportsBets.value.length > 0) {
        sportsBets.value = []
      }
    }
  } catch (e) {
    console.error('Error parsing saved bets:', e)
    sportsBets.value = []
  }
}

// iOS/Safari compatible event handler
const handleBetslipUpdate = (event) => {
  console.log('handleBetslipUpdate called:', event)

  // Handle different event formats for iOS compatibility
  let bets = null

  if (event.detail) {
    bets = event.detail
  } else if (event.detail && typeof event.detail === 'object') {
    bets = event.detail
  } else if (event && typeof event === 'object') {
    bets = event
  }

  // Check if bets is in the detail property (for older iOS)
  if (bets && bets.detail && !Array.isArray(bets)) {
    bets = bets.detail
  }

  if (bets && Array.isArray(bets)) {
    if (JSON.stringify(sportsBets.value) !== JSON.stringify(bets)) {
      sportsBets.value = bets
      console.log('Betslip updated from event:', sportsBets.value)
      // Force re-render for iOS
      nextTick(() => {
        forceUpdateKey.value++
      })
    }
  } else if (bets && typeof bets === 'string') {
    try {
      const parsed = JSON.parse(bets)
      if (Array.isArray(parsed)) {
        sportsBets.value = parsed
        nextTick(() => {
          forceUpdateKey.value++
        })
      }
    } catch (e) {
      console.error('Error parsing bets from event:', e)
    }
  }
}

// Handle storage changes with iOS compatibility
const handleStorageChange = (event) => {
  if (event.key === 'betslip_selections' || event.key === null) {
    // Small delay for iOS to ensure storage is written
    setTimeout(() => {
      loadFromLocalStorage()
    }, 50)
  }
}

// Watch sportsBets and save changes
watch(sportsBets, (newBets) => {
  if (newBets && Array.isArray(newBets)) {
    saveToLocalStorage(newBets)
  }
}, { deep: true })

// Computed properties with force update key for iOS
const sportsSelections = computed(() => {
  // Force recomputation when forceUpdateKey changes (iOS fix)
  forceUpdateKey.value
  return sportsBets.value
})

const totalSportsOdds = computed(() => {
  if (sportsSelections.value.length === 0) return 0
  return sportsSelections.value.reduce((product, bet) => {
    return product * parseFloat(bet.odds)
  }, 1)
})

const totalSportsReturns = computed(() => {
  const stake = parseFloat(stakeAmount.value) || 0
  return stake * totalSportsOdds.value
})

const virtualsSelections = computed(() => virtualsBets.value)

const totalVirtualsOdds = computed(() => {
  if (virtualsSelections.value.length === 0) return 0
  return virtualsSelections.value.reduce((product, bet) => {
    return product * parseFloat(bet.odds)
  }, 1)
})

const totalVirtualsReturns = computed(() => {
  const stake = parseFloat(stakeAmount.value) || 0
  return stake * totalVirtualsOdds.value
})

const currentSelectionsCount = computed(() => {
  return activeTab.value === 'sports'
    ? sportsSelections.value.length
    : virtualsSelections.value.length
})

const currentTotalOdds = computed(() => {
  return activeTab.value === 'sports' ? totalSportsOdds.value : totalVirtualsOdds.value
})

const currentTotalReturns = computed(() => {
  return activeTab.value === 'sports' ? totalSportsReturns.value : totalVirtualsReturns.value
})

const canPlaceBet = computed(() => {
  const stake = parseFloat(stakeAmount.value) || 0
  return currentSelectionsCount.value > 0 &&
    stake >= 135000 &&
    !isLoading.value &&
    isAuthenticated.value &&
    !insufficientBalance.value &&
    !hasExceededWithdrawalLimit.value
})

// Methods
const removeSportsBet = (index) => {
  const newBets = [...sportsBets.value]
  newBets.splice(index, 1)
  sportsBets.value = newBets
  // Force update for iOS
  nextTick(() => {
    forceUpdateKey.value++
  })
}

const removeVirtualBet = (index) => {
  virtualsBets.value.splice(index, 1)
}

// Auto-hide success message after 3 seconds
const showSuccessMessage = (message) => {
  success.value = message
  setTimeout(() => {
    success.value = null
  }, 3000)
}

// Close modal
const closeModal = () => {
  showBalanceModal.value = false
  modalMessage.value = ''
}

// Show withdrawal warning modal
const showWithdrawalWarningModal = () => {
  modalMessage.value = '⚠️ Withdrawal Required! Your account balance has reached the minimum withdrawal threshold. Please contact your agent/broker to process your withdrawal before placing new bets.'
  showBalanceModal.value = true
}

// Force reload bets from localStorage (iOS fix)
const forceReloadBets = () => {
  loadFromLocalStorage()
  nextTick(() => {
    forceUpdateKey.value++
  })
}

// Create booking code from current selections
const createBookingCode = async () => {
  const selections = activeTab.value === 'sports'
    ? sportsSelections.value
    : virtualsSelections.value

  if (selections.length === 0) {
    error.value = 'No selections to create booking code'
    setTimeout(() => { error.value = null }, 3000)
    return
  }

  // if (!isAuthenticated.value) {
  //   error.value = 'Please login to create booking code'
  //   setTimeout(() => { error.value = null }, 3000)
  //   return
  // }

  isCreatingCode.value = true

  try {
    // Format selections for API
    const formattedSelections = selections.map(selection => ({
      matchId: selection.id || selection.match,
      match: selection.match,
      matchName: selection.match,
      league: selection.league,
      selection: selection.selection,
      odds: parseFloat(selection.odds),
      matchTime: selection.time
    }))

    const response = await api.post('/booking-codes/create', {
      selections: formattedSelections
    })

    if (response.data.success) {
      generatedBookingCode.value = response.data.data.bookingCode
      bookingCodeExpiresAt.value = response.data.data.expiresAt
      showBookingCodeModal.value = true
      showSuccessMessage(' Booking code created successfully!')
    } else {
      error.value = response.data.message || 'Failed to create booking code'
      setTimeout(() => { error.value = null }, 3000)
    }
  } catch (err) {
    console.error('Error creating booking code:', err)
    if (err.response?.data?.message) {
      error.value = err.response.data.message
    } else {
      error.value = 'Failed to create booking code. Please try again.'
    }
    setTimeout(() => { error.value = null }, 3000)
  } finally {
    isCreatingCode.value = false
  }
}

// Copy booking code to clipboard
const copyBookingCode = async () => {
  try {
    await navigator.clipboard.writeText(generatedBookingCode.value)
    showSuccessMessage(' Booking code copied to clipboard!')
  } catch (err) {
    // Fallback for older browsers
    const textarea = document.createElement('textarea')
    textarea.value = generatedBookingCode.value
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    showSuccessMessage(' Booking code copied to clipboard!')
  }
}

// Close booking code modal
const closeBookingCodeModal = () => {
  showBookingCodeModal.value = false
  generatedBookingCode.value = ''
  bookingCodeExpiresAt.value = ''
}

// Clear all selections
const clearAllSelections = () => {
  if (activeTab.value === 'sports') {
    sportsBets.value = []
  } else {
    virtualsBets.value = []
  }
  saveToLocalStorage(sportsBets.value)
  showSuccessMessage('All selections cleared')
}


// Load booking code
const loadBookingCode = async () => {
  error.value = null

  if (!bookingCode.value || !bookingCode.value.trim()) {
    error.value = 'Please enter a booking code'
    setTimeout(() => { error.value = null }, 3000)
    return
  }

  const cleanCode = bookingCode.value.trim().toUpperCase()
  bookingCode.value = cleanCode

  isLoading.value = true
  loadingMessage.value = 'Loading selections from booking code...'

  try {
    console.log('Loading booking code:', cleanCode)

    const response = await api.get(`/booking-codes/${encodeURIComponent(cleanCode)}/load`)

    console.log('Full response:', response.data)

    if (response.data.success) {
      let selectionsData = response.data.data?.selections || []

      if (typeof selectionsData === 'string') {
        try {
          selectionsData = JSON.parse(selectionsData)
          console.log('Parsed selections from string:', selectionsData)
        } catch (e) {
          console.error('Failed to parse selections string:', e)
          selectionsData = []
        }
      }

      console.log('Selections data:', selectionsData)

      if (selectionsData && Array.isArray(selectionsData) && selectionsData.length > 0) {
        const loadedBets = selectionsData.map((selection, index) => ({
          id: `${Date.now()}-${index}-${Math.random()}`,
          match: selection.match || selection.matchName || selection.matchId || 'Unknown Match',
          league: selection.league || 'Unknown League',
          time: selection.matchTime || selection.time || 'Today',
          odds: selection.odds ? String(selection.odds) : '1.00',
          selection: selection.selection || 'Unknown',
          isFromBookingCode: true  // <--- ADD THIS FLAG
        }))

        sportsBets.value = loadedBets
        bookingCode.value = ''
        showSuccessMessage(` Successfully loaded ${loadedBets.length} selection(s)!`)
        stakeAmount.value = ''

        nextTick(() => {
          forceUpdateKey.value++
        })

        saveToLocalStorage(loadedBets)

      } else {
        console.error('No selections found. Response:', response.data)
        error.value = ' No selections found in this booking code'
        setTimeout(() => { error.value = null }, 3000)
      }
    } else {
      error.value = response.data.message || 'Failed to load booking code'
      setTimeout(() => { error.value = null }, 3000)
    }
  } catch (err) {
    console.error('Error loading booking code:', err)

    if (err.response) {
      const statusCode = err.response.status
      const errorData = err.response.data
      const errorMessage = errorData?.message || errorData?.error || ''

      if (statusCode === 404) {
        error.value = ' Booking code not found. Please check and try again.'
      } else if (statusCode === 400) {
        if (errorMessage.toLowerCase().includes('expired')) {
          error.value = ' This booking code has expired (5 hours limit)'
        } else {
          error.value = ` ${errorMessage || 'Cannot load this booking code'}`
        }
      } else {
        error.value = ` Server error (${statusCode}). Please try again later.`
      }
    } else if (err.request) {
      error.value = ' Network error. Please check your connection.'
    } else {
      error.value = err.message || ' Failed to load booking code. Please try again.'
    }

    setTimeout(() => { error.value = null }, 5000)
  } finally {
    isLoading.value = false
    loadingMessage.value = ''
  }
}

// Place bet using API with balance check
const placeBet = async () => {
  // Check if user has exceeded withdrawal limit - show modal immediately
  if (hasExceededWithdrawalLimit.value) {
    showWithdrawalWarningModal()
    return
  }

  if (!canPlaceBet.value) return

  const selections = activeTab.value === 'sports'
    ? sportsSelections.value
    : virtualsSelections.value

  if (selections.length === 0) {
    error.value = 'No selections to place'
    setTimeout(() => { error.value = null }, 3000)
    return
  }

  const stake = parseFloat(stakeAmount.value)
  if (stake < 135000.00) {
    error.value = 'Minimum stake is 135000.00 Tsh'
    setTimeout(() => { error.value = null }, 3000)
    return
  }

  isLoading.value = true
  loadingMessage.value = 'Placing your bet...'
  error.value = null

  try {
    const formattedSelections = selections.map(selection => ({
      match: selection.match,
      selection: selection.selection,
      odds: parseFloat(selection.odds),
      league: selection.league,
      time: selection.time
    }))

    const response = await api.post('/bets', {
      selections: formattedSelections,
      stake: stake
    })

    if (response.data.success) {
      await authStore.fetchUserBalance()
      // showSuccessMessage(` Bet placed successfully! Code: ${response.data.data.bookingCode}`)
      showSuccessMessage(` Bet placed successfully!`)

      if (activeTab.value === 'sports') {
        sportsBets.value = []
      } else {
        virtualsBets.value = []
      }

      stakeAmount.value = ''

      // Clear localStorage
      localStorage.removeItem('betslip_selections')

      // iOS compatible event dispatch
      try {
        const clearEvent = new CustomEvent('bets-cleared')
        window.dispatchEvent(clearEvent)
      } catch (e) {
        const clearEvent = document.createEvent('CustomEvent')
        clearEvent.initCustomEvent('bets-cleared', true, true, null)
        window.dispatchEvent(clearEvent)
      }

      // Force iOS update
      nextTick(() => {
        forceUpdateKey.value++
      })
    }
  } catch (err) {
    console.error('Error placing bet:', err)

    if (err.response?.data?.message) {
      error.value = err.response.data.message
    } else if (err.message) {
      error.value = err.message
    } else {
      error.value = 'Failed to place bet. Please try again.'
    }
    setTimeout(() => { error.value = null }, 3000)
  } finally {
    isLoading.value = false
    loadingMessage.value = ''
  }
}

// Lifecycle hooks with iOS/Safari optimizations
onMounted(() => {
  console.log('Component mounted - iOS:', isIOS, 'Safari:', isSafari)

  // Load bets
  loadFromLocalStorage()

  if (isAuthenticated.value) {
    authStore.fetchUserBalance()
  }

  // Set up event listeners with iOS compatibility
  window.addEventListener('storage', handleStorageChange)
  window.addEventListener('betslip-update', handleBetslipUpdate)

  // iOS/Safari: Also listen for page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      // Page became visible again - reload bets
      setTimeout(() => {
        loadFromLocalStorage()
        nextTick(() => {
          forceUpdateKey.value++
        })
      }, 200)
    }
  })

  // iOS/Safari: Periodic check for localStorage changes (every 1 second)
  let lastStoredValue = localStorage.getItem('betslip_selections')
  const intervalId = setInterval(() => {
    const currentValue = localStorage.getItem('betslip_selections')
    if (currentValue !== lastStoredValue) {
      lastStoredValue = currentValue
      loadFromLocalStorage()
      nextTick(() => {
        forceUpdateKey.value++
      })
    }
  }, 1000)

  // Clean up interval on unmount
  const originalUnmount = onBeforeUnmount
  originalUnmount(() => {
    clearInterval(intervalId)
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('storage', handleStorageChange)
  window.removeEventListener('betslip-update', handleBetslipUpdate)
  document.removeEventListener('visibilitychange', () => { })
})
</script>


<template>
  <div class="flex flex-col bg-gray-300 h-full w-full overflow-hidden">
    <!-- Modal Popup for Withdrawal Warning -->
    <div v-if="showBalanceModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all animate-modal-pop">
        <!-- Modal Header -->
        <div class="bg-gradient-to-r from-sky-800 to-sky-950 rounded-t-xl px-6 py-4">
          <div class="flex items-center gap-3">
            <div class="bg-white rounded-full p-2">
              <svg class="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">
                </path>
              </svg>
            </div>
            <h2 class="text-sm font-bold text-white">Withdrawal Required</h2>
          </div>
        </div>

        <!-- Modal Body -->
        <div class="px-6 py-2">
          <div class="mb-2">
            <div class="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <div class="flex justify-between items-center mb-2">
                <span class="text-xs text-amber-700 font-medium">Current Balance:</span>
                <span class="text-xs font-bold text-amber-800">{{ formatBalance(userBalance) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-xs text-amber-700 font-medium">Withdrawal Threshold:</span>
                <span class="text-xs font-bold text-amber-800">{{ formatBalance(5000000) }}</span>
              </div>
            </div>

            <div class="text-gray-700">
              <p class="leading-relaxed text-xs">{{ modalMessage }}</p>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-0 pb-2 bg-gray-50 rounded-b-xl flex gap-3">
          <button @click="closeModal"
            class="flex-1 px-4 text-xs py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-medium transition-colors duration-200">
            Close
          </button>
          <button @click="closeModal"
            class="flex-1 px-2 text-xs py-2 bg-gradient-to-r from-sky-900 to-teal-900 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg font-medium transition-colors duration-200">
            Contact Support
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Messages -->
    <Transition name="fade">
      <div v-if="success"
        class="fixed top-4 right-4 z-50 bg-sky-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        {{ success }}
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="error"
        class="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
        {{ error }}
      </div>
    </Transition>

    <!-- Loading Overlay -->
    <div v-if="isLoading" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600 mx-auto"></div>
        <p class="text-gray-700 mt-3">{{ loadingMessage }}</p>
      </div>
    </div>

    <!-- Header -->
    <div class="flex-shrink-0">
      <div class="max-w-2xl mt-4 mx-auto mb-4 px-3">
        <!-- Authenticated Header -->
        <div v-if="isAuthenticated"
          class="bg-sky-50 border flex items-center justify-between border-sky-200 rounded-lg px-4 py-2 w-full">
          <div>
            <p class="text-xs text-sky-700">Your Balance</p>
            <p class="text-lg font-bold text-sky-600">{{ formatBalance(userBalance) }}</p>
          </div>
          <div>
            <router-link to="/bets"
              class="bg-gradient-to-r from-sky-600 to-teal-700 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2">
                </path>
              </svg>
              My Bets
            </router-link>
          </div>
        </div>

        <!-- Unauthenticated Header -->
        <div v-if="!isAuthenticated"
          class="bg-sky-50 border flex items-center justify-between border-sky-200 rounded-lg px-4 py-2 w-full">
          <div>
            <p class="text-gray-600 mt-1">Review and place your bets</p>
          </div>
          <div>
            <router-link to="/login"
              class="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
              Login
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content - iOS fixes applied with custom classes -->
    <div class="flex-1 flex flex-col min-h-0 overflow-hidden">

      <!-- Tabs -->
      <div class="flex border-b border-gray-200 bg-gray-50 flex-shrink-0">
        <button @click="activeTab = 'sports'"
          class="flex-1 py-2 px-6 text-sm md:text-base font-medium transition-all duration-200"
          :class="activeTab === 'sports' ? 'text-sky-600 bg-white border-b-2 border-sky-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'">
          <div class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5" :class="activeTab === 'sports' ? 'text-sky-600' : 'text-gray-400'" fill="none"
              stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 8v13m0-13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v13m12 0h-6m6 0a2 2 0 002-2V6a2 2 0 00-2-2h-2.5M9 5h3M6 12h6M6 16h6">
              </path>
            </svg>
            <span>Sports</span>
            <span class="text-xs bg-sky-100 text-sky-700 px-2 py-1 rounded-full">{{ sportsBets.length }}</span>
          </div>
        </button>

        <button @click="activeTab = 'virtuals'"
          class="flex-1 py-2 px-6 text-sm md:text-base font-medium transition-all duration-200"
          :class="activeTab === 'virtuals' ? 'text-sky-600 bg-white border-b-2 border-sky-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'">
          <div class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5" :class="activeTab === 'virtuals' ? 'text-sky-600' : 'text-gray-400'" fill="none"
              stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
              </path>
            </svg>
            <span>Virtuals</span>
            <span class="text-xs bg-sky-100 text-sky-700 px-2 py-1 rounded-full">{{ virtualsBets.length }}</span>
          </div>
        </button>
      </div>

      <!-- Warning Messages - Only show insufficient balance warning here, withdrawal warning is now modal only -->
      <div class="flex-shrink-0 px-4">
        <div v-if="isAuthenticated && insufficientBalance && currentSelectionsCount > 0"
          class="mb-4 bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded relative">
          <strong class="font-bold">💰 Insufficient Balance! </strong>
          <span class="block sm:inline">You need Tsh {{ (parseFloat(stakeAmount) - userBalance).toFixed(0) }} more to
            place this bet.</span>
          <router-link to="/deposite"
            class="ml-2 inline-block bg-sky-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-700 mt-2 text-center">
            Deposit Now
          </router-link>
        </div>

        <div v-if="stakeAmount && !isValidStake && currentSelectionsCount > 0"
          class="mb-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded relative">
          <strong class="font-bold">Invalid Stake! </strong>
          <span class="block sm:inline">Minimum stake is 135000.00 Tsh</span>
        </div>
      </div>

      <!-- Scrollable Content - iOS scroll fix -->
      <div class="scrollable-ios flex-1 px-4 pb-20 pt-4">

        <!-- Sports Tab -->
        <div v-if="activeTab === 'sports'" class="space-y-6">
          <div v-if="sportsBets.length === 0" class="space-y-4">
            <div class="bg-sky-50 border border-sky-200 rounded-lg p-4">
              <p class="text-sm text-sky-800 mb-3">Load your bets using a booking code</p>
              <div class="flex gap-2">
                <input type="text" v-model="bookingCode" placeholder="Enter booking code (e.g., BETABC123)"
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                  @keyup.enter="loadBookingCode" :disabled="isLoading">
                <button @click="loadBookingCode" :disabled="isLoading || !bookingCode"
                  class="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                  {{ isLoading ? 'Loading...' : 'Load' }}
                </button>
              </div>
              <p class="text-xs text-gray-500 mt-2">Only open and pending bets can be loaded</p>
            </div>

            <div class="text-center py-8">
              <svg class="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2">
                </path>
              </svg>
              <p class="text-gray-500 font-medium">Your bet slip is empty</p>
              <p class="text-sm text-gray-400 mt-1">Add bets from the sports events page</p>
            </div>
          </div>

          <div v-else class="space-y-4">
            <!-- Action Buttons Row - Create Booking Code (Right) & Clear All (Left) -->
            <div v-if="currentSelectionsCount > 0"
              class="flex flex-row-reverse  justify-between items-center px-0  bg-transparent ">
              <button @click="clearAllSelections"
                class="px-1 py-1.5 bg-gray-300 underline cursor-pointer text-red-700 text-xs font-medium rounded-lg transition-colors duration-200 flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                  </path>
                </svg>
                Clear All
              </button>

              <button @click="createBookingCode" :disabled="isCreatingCode"
                class=" py-2 px-2 underline bg-sky-100 cursor-pointer text-sky-800 text-xs font-medium rounded transition-colors duration-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed">
                <!-- <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg> -->
                {{ isCreatingCode ? 'Creating...' : 'Booking Code' }}
              </button>
            </div>
            <div v-for="(bet, index) in sportsBets" :key="bet.id"
              class="group relative bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-all duration-200">


              <button @click="removeSportsBet(index)"
                class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>

              <div class="flex justify-between items-start mb-2">
                <div>
                  <h3 class="font-semibold text-sm text-gray-800">{{ bet.match }}</h3>
                  <p class="text-xs text-gray-500 mt-1">{{ bet.league }}</p>
                </div>
                <span class="bg-sky-100 text-sky-700 text-xs font-medium px-2 py-1 rounded-full">1X2</span>
              </div>


              <div class="mt-2 flex items-center gap-2">
                <span class="text-xs text-gray-600">Selected:</span>
                <span class="text-sm font-medium bg-sky-100 text-sky-700 px-2 py-1 rounded">
                  <span v-if="bet.isFromBookingCode">####****</span>
                  <span v-else>{{ bet.selection }} @ {{ bet.odds }}</span>
                </span>
                <span class="text-xs text-gray-500 ml-auto">{{ bet.time }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Virtuals Tab -->
        <div v-else class="space-y-6">
          <div v-if="virtualsBets.length > 0" class="space-y-4">
            <div v-for="(bet, index) in virtualsBets" :key="bet.id"
              class="group relative bg-gradient-to-r from-sky-50 to-white rounded-lg border border-purple-200 p-4 hover:shadow-md transition-all duration-200">
              <button @click="removeVirtualBet(index)"
                class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>

              <div class="flex justify-between items-start mb-3">
                <div>
                  <h3 class="font-semibold text-gray-800">{{ bet.match }}</h3>
                  <p class="text-xs text-gray-500 mt-1">{{ bet.league }} • {{ bet.time }}</p>
                </div>
                <span class="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded-full">Virtual</span>
              </div>

              <div class="mt-3 flex items-center gap-2">
                <span class="text-sm text-gray-600">Selected:</span>
                <span class="text-sm font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
                  <!-- {{ bet.selection }} @ {{ bet.odds }} -->####****
                </span>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-12">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
              </path>
            </svg>
            <p class="text-gray-500 font-medium">No virtual bets selected</p>
            <p class="text-sm text-gray-400 mt-1">Add bets from the virtual sports page</p>
          </div>
        </div>

        <!-- Bottom Section -->
        <div v-if="currentSelectionsCount > 0" class="border-t border-gray-200 bg-gray-50 p-4 mt-6 rounded-lg">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Enter Stake Amount (Min: 135000.00 Tsh)</label>
            <div class="flex gap-2">
              <input type="number" v-model="stakeAmount" placeholder="Enter amount" min="135000" step="100"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                :disabled="isLoading">
              <span
                class="inline-flex items-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-medium">
                Tsh
              </span>
            </div>
            <p v-if="stakeAmount && stakeAmount < 135000.00" class="text-xs text-red-500 mt-1">
              Minimum stake is 135000.00 Tsh
            </p>
          </div>

          <div class="bg-white rounded-lg p-4 mb-4 space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Total Selections:</span>
              <span class="font-bold text-gray-900">{{ currentSelectionsCount }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Total Odds:</span>
              <span class="font-bold text-sky-600">{{ currentTotalOdds.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between items-center pt-2 border-t border-gray-200">
              <span class="text-base font-medium">Potential Returns:</span>
              <span class="text-lg font-bold text-sky-600">Tsh {{ currentTotalReturns.toFixed(2) }}</span>
            </div>
          </div>


           <!-- Modal for Booking Code -->
           <div v-if="showBookingCodeModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm" @click.self="closeBookingCodeModal">
              <div class="bg-white rounded-xl  shadow-2xl max-w-sm w-full transform transition-all animate-modal-pop relative">
                <!-- Close Icon - Top Right Corner Absolute -->
                <button 
                  @click="closeBookingCodeModal" 
                  class="absolute -top-3 -right-3 bg-white cursor-pointer rounded-full p-1 shadow-lg hover:bg-gray-100 transition-colors duration-200 z-10"
                >
                  <svg class="w-5 h-5 text-gray-500 hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
                
                <!-- Modal Header -->
                <div class="bg-gradient-to-r from-sky-900 to-teal-950 rounded-t-xl px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="bg-white rounded-full p-1">
                      <svg class="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                    <h2 class="text-sm font-bold text-white">Your Booking Code</h2>
                  </div>
                </div>
                
                <!-- Modal Body -->
                <div class="px-3 py-2">
                  <div class="text-center mb-2">
                    <p class="text-xs text-gray-500 mb-2">Share this code with friends to load your selections</p>
                    <div class="bg-gray-100 rounded-lg p-2 ">
                      <p class="text-xl font-mono font-bold text-sky-600 tracking-wider">{{ generatedBookingCode }}</p>
                    </div>
                    <!-- <div class="flex justify-between items-center text-xs text-gray-500 mt-2">
                      <span>Expires:</span>
                      <span class="font-medium text-amber-600">{{ new Date(bookingCodeExpiresAt).toLocaleString() }}</span>
                    </div> -->
                  </div>
                </div>
                
                <!-- Modal Footer -->
                <div class="px-3 py-4 bg-white rounded-b-xl flex gap-3">
                
                  <button 
                    @click="copyBookingCode"
                    class="flex-1 px-4 py-2 bg-white  text-gray-700 cursor-pointer text-sm rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                    </svg>
                    Copy Code
                  </button>
                </div>
              </div>
            </div>

          <!-- CONDITION 1: User not logged in -->
          <div v-if="!isAuthenticated" class="mb-2">
            <router-link to="/login"
              class="block w-full py-3 bg-sky-600 text-white font-bold rounded-lg text-center hover:bg-sky-700 transition-colors">
              Login to Place Bet
            </router-link>
          </div>

          <!-- CONDITION 2: User logged in but has withdrawal limit -->
          <div v-else-if="hasExceededWithdrawalLimit" class="mb-2">
            <button @click="showWithdrawalWarningModal"
              class="block w-full py-3 bg-sky-800 text-white font-bold rounded-lg text-center hover:bg-sky-950 cursor-pointer transition-colors">
              ⚠️ Withdrawal Required - Click for Info
            </button>
          </div>

          <!-- CONDITION 3: User logged in but insufficient balance -->
          <div v-else-if="insufficientBalance" class="mb-2">
            <router-link to="/deposite"
              class="block w-full py-3 bg-orange-600 text-white font-bold rounded-lg text-center hover:bg-orange-700 transition-colors">
              Deposit to Continue
            </router-link>
          </div>

          <!-- CONDITION 4: User logged in and can place bet -->
          <button v-else @click="placeBet" :disabled="!canPlaceBet || isLoading"
            class="w-full py-3 cursor-pointer bg-gradient-to-r from-sky-600 to-teal-600 text-white font-bold rounded-lg shadow-lg hover:from-sky-700 hover:to-teal-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="isLoading">Placing Bet...</span>
            <span v-else>Place Bet ({{ activeTab }})</span>
          </button>

          <p class="text-xs text-gray-500 text-center mt-4">
            By placing a bet, you agree to our <a href="#" class="text-sky-600 hover:underline">Terms & Conditions</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Fade animation for toasts */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Modal popup animation */
@keyframes modalPop {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-modal-pop {
  animation: modalPop 0.3s ease-out;
}

/* iOS scroll fix - Tailwind haisupport hizi properties */
.scrollable-ios {
  -webkit-overflow-scrolling: touch;
  overflow-y: auto;
  min-height: 0;
}

/* iOS height fix */
.h-full {
  height: 100vh;
  height: -webkit-fill-available;
}

/* Spin animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>