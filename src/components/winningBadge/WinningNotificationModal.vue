<!-- components/WinningNotificationModal.vue -->
<template>
    <Teleport to="body">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
          <div class="text-center">
            <div class="text-6xl mb-4">🎉</div>
            <h2 class="text-2xl font-bold text-green-600 mb-2">CONGRATULATIONS!</h2>
            <p class="text-gray-600 mb-4">You've won your bet!</p>
            
            <div class="bg-green-50 rounded-lg p-4 mb-4">
              <p class="text-sm text-gray-600">You won</p>
              <p class="text-3xl font-bold text-green-600">
                {{ formatMoney(win?.potentialReturn) }}
              </p>
              <p class="text-xs text-gray-500 mt-1">
                Stake: {{ formatMoney(win?.stake) }} | Odds: {{ win?.totalOdds }}x
              </p>
            </div>
            
            <div class="text-left text-sm mb-4">
              <p class="text-gray-500">Booking Code:</p>
              <p class="font-mono font-semibold">{{ win?.bookingCode }}</p>
            </div>
            
            <button 
              @click="$emit('close')"
              class="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Awesome! 🚀
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </template>
  
  <script setup>
  const props = defineProps({
    show: Boolean,
    win: Object
  })
  
  const emit = defineEmits(['close'])
  
  const formatMoney = (amount) => {
    if (!amount) return '0 Tsh'
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0
    }).format(amount)
  }
  </script>