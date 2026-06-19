<!-- components/WinningNotificationModal.vue -->
<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div class="relative max-w-md w-full mx-4">
          <!-- Animated Background Glow -->
          <div class="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 rounded-3xl blur-xl opacity-75 animate-pulse"></div>
          
          <!-- Main Card -->
          <div class="relative bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-3xl shadow-2xl overflow-hidden">
            
            <!-- Confetti Animation Background -->
            <div class="absolute inset-0 pointer-events-none">
              <div v-for="i in 30" :key="i" class="confetti" :style="getConfettiStyle(i)"></div>
            </div>
            
            <!-- Trophy Decoration Top -->
            <div class="absolute -top-8 left-1/2 transform -translate-x-1/2">
              <div class="relative">
                <div class="w-20 h-20 bg-gradient-to-b from-yellow-400 to-amber-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                  <svg class="w-12 h-12 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L15 8.5L22 9.5L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9.5L9 8.5L12 2Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
                    <path d="M12 2L15 8.5L22 9.5L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9.5L9 8.5L12 2Z" fill="url(#trophyGradient)"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <!-- Fireworks Sparkles -->
            <div class="absolute top-4 right-4 text-2xl animate-ping">✨</div>
            <div class="absolute top-8 right-8 text-xl animate-pulse delay-150">⭐</div>
            <div class="absolute bottom-4 left-4 text-2xl animate-ping delay-300">✨</div>
            
            <!-- Content -->
            <div class="p-6 pt-12 text-center relative z-10">
              <!-- Champion Badge -->
              <div class="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-4 py-1.5 rounded-full text-sm font-bold mb-4 shadow-lg">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15 8.5L22 9.5L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9.5L9 8.5L12 2Z"/>
                </svg>
                <span>CHAMPIONS WIN!</span>
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15 8.5L22 9.5L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9.5L9 8.5L12 2Z"/>
                </svg>
              </div>
              
              <!-- Title -->
              <h2 class="text-4xl font-black bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">
                CONGRATULATIONS!
              </h2>
              <p class="text-amber-700 font-semibold mb-4">🎯 WORLD CUP CHAMPION! 🎯</p>
              
              <!-- Winning Prize Card -->
              <div class="relative mb-6">
                <div class="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl blur-md opacity-50"></div>
                <div class="relative bg-gradient-to-br from-yellow-300 to-amber-500 rounded-2xl p-5 shadow-xl">
                  <div class="flex items-center justify-center gap-3 mb-2">
                    <svg class="w-8 h-8 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L15 8.5L22 9.5L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9.5L9 8.5L12 2Z"/>
                    </svg>
                    <p class="text-white font-bold text-lg">YOU WON</p>
                    <svg class="w-8 h-8 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L15 8.5L22 9.5L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9.5L9 8.5L12 2Z"/>
                    </svg>
                  </div>
                  <p class="text-5xl font-black text-white drop-shadow-lg">
                    {{ formatMoney(win?.potentialReturn) }}
                  </p>
                  <div class="flex items-center justify-center gap-4 mt-3">
                    <div class="text-center">
                      <p class="text-xs text-white/80">Stake</p>
                      <p class="text-sm font-bold text-white">{{ formatMoney(win?.stake) }}</p>
                    </div>
                    <div class="w-px h-8 bg-white/30"></div>
                    <div class="text-center">
                      <p class="text-xs text-white/80">Odds</p>
                      <p class="text-sm font-bold text-white">{{ win?.totalOdds }}x</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Booking Code Card -->
              <div class="bg-white/80 backdrop-blur rounded-xl p-3 mb-4 border border-amber-200">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-500">Booking Code</span>
                  <div class="flex items-center gap-2">
                    <code class="font-mono font-bold text-amber-700 text-sm">{{ win?.bookingCode }}</code>
                    <button 
                      @click="copyBookingCode"
                      class="p-1 hover:bg-amber-100 rounded transition"
                      title="Copy code"
                    >
                      <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Action Buttons -->
              <div class="flex gap-3">
                <button 
                  @click="shareWin"
                  class="flex-1 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                  </svg>
                  Share
                </button>
                <button 
                  @click="$emit('close')"
                  class="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
                >
                  <span>Awesome! 🏆</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- Bottom Decoration -->
            <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400"></div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

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

const copyBookingCode = () => {
  if (props.win?.bookingCode) {
    navigator.clipboard.writeText(props.win.bookingCode)
    // Optional: Show toast notification
    alert('Booking code copied!')
  }
}

const shareWin = () => {
  if (navigator.share) {
    navigator.share({
      title: 'I won a bet! 🎉',
      text: `I just won ${formatMoney(props.win?.potentialReturn)} on my bet! Booking code: ${props.win?.bookingCode}`,
      url: window.location.href
    }).catch(() => {})
  } else {
    copyBookingCode()
    alert('Share your winning code: ' + props.win?.bookingCode)
  }
}

// Confetti animation styles
const getConfettiStyle = (index) => {
  const colors = ['#FFD700', '#FFA500', '#FF6347', '#FFDAB9', '#FFE4B5']
  return {
    position: 'absolute',
    width: `${Math.random() * 8 + 4}px`,
    height: `${Math.random() * 8 + 4}px`,
    backgroundColor: colors[Math.floor(Math.random() * colors.length)],
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    borderRadius: '50%',
    animation: `confettiFall ${Math.random() * 3 + 2}s linear infinite`,
    animationDelay: `${Math.random() * 5}s`,
    opacity: Math.random() * 0.7 + 0.3
  }
}

// Play celebration sound effect (optional)
const playCelebrationSound = () => {
  // You can add a simple beep or cheer sound if needed
  // For now, we'll use a simple browser beep alternative
  if (window.AudioContext) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()
    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)
    oscillator.frequency.value = 880
    gainNode.gain.value = 0.1
    oscillator.start()
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 1)
    oscillator.stop(audioCtx.currentTime + 1)
  }
}

// Play celebration when modal shows
watch(() => props.show, (newVal) => {
  if (newVal) {
    playCelebrationSound()
  }
})
</script>

<style scoped>
@keyframes confettiFall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce {
  animation: bounce 1s ease-in-out infinite;
}

.delay-150 {
  animation-delay: 0.15s;
}

.delay-300 {
  animation-delay: 0.3s;
}
</style>

