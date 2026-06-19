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
      <!-- Click outside to close - background click -->
      <div 
        v-if="show" 
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
        @click="$emit('close')"
      >
        <!-- Dark Background with Stars -->
        <div class="absolute inset-0 bg-transparent pointer-events-none">
          <!-- Stars Background -->
          <div class="absolute inset-0">
            <div v-for="i in 100" :key="i" class="star" :style="getStarStyle(i)"></div>
          </div>
        </div>
        
        <div 
          class="relative max-w-md w-full mx-4"
          @click.stop
        >
          <!-- Animated Background Glow -->
          <div class="absolute -inset-1 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 rounded-3xl blur-xl opacity-50 animate-pulse"></div>
          
          <!-- Main Card - Remove overflow-hidden so close button can be outside -->
          <div class="relative bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-3xl shadow-2xl border border-yellow-500/30">
            
            <!-- Close Button - Top Right Corner (outside the card) -->
            <button 
              @click="$emit('close')"
              class="absolute -top-3 -right-3 z-20 w-8 h-8 cursor-pointer rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 border border-yellow-500/50 shadow-lg"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            
            <!-- Confetti Animation Background -->
            <div class="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
              <div v-for="i in 40" :key="i" class="confetti" :style="getConfettiStyle(i)"></div>
            </div>
            
            <!-- Golden Rings Decoration -->
            <div class="absolute -top-16 -right-16 w-32 h-32 rounded-full border-4 border-yellow-500/20"></div>
            <div class="absolute -bottom-16 -left-16 w-32 h-32 rounded-full border-4 border-yellow-500/20"></div>
            
            <!-- Multiple Trophies Decoration Top -->
            <div class="absolute -top-10 left-1/2 transform -translate-x-1/2 flex gap-4">
              <div class="relative">
                <div class="w-14 h-14 bg-gradient-to-b from-yellow-500 to-amber-700 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                  <TrophyIcon class="w-8 h-8 text-yellow-300 drop-shadow-lg" />
                </div>
              </div>
              <div class="relative animate-bounce delay-150">
                <div class="w-14 h-14 bg-gradient-to-b from-yellow-500 to-amber-700 rounded-full flex items-center justify-center shadow-2xl">
                  <TrophyIcon class="w-8 h-8 text-yellow-300 drop-shadow-lg" />
                </div>
              </div>
              <div class="relative animate-bounce delay-300">
                <div class="w-14 h-14 bg-gradient-to-b from-yellow-500 to-amber-700 rounded-full flex items-center justify-center shadow-2xl">
                  <TrophyIcon class="w-8 h-8 text-yellow-300 drop-shadow-lg" />
                </div>
              </div>
            </div>
            
            <!-- Fireworks Sparkles -->
            <div class="absolute top-4 right-12 text-2xl animate-ping">✨</div>
            <div class="absolute top-8 right-16 text-xl animate-pulse delay-150">⭐</div>
            <div class="absolute bottom-4 left-4 text-2xl animate-ping delay-300">✨</div>
            <div class="absolute top-20 left-2 text-lg animate-pulse delay-500">🌟</div>
            <div class="absolute bottom-20 right-2 text-lg animate-ping delay-700">✨</div>
            
            <!-- Content -->
            <div class="p-6 pt-16 text-center relative z-10">
              <!-- Champion Badge with Trophy -->
              <div class="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-600 to-amber-600 text-white px-5 py-2 rounded-full text-sm font-bold mb-4 shadow-lg border border-yellow-400/50">
                <TrophyIcon class="w-4 h-4 text-yellow-300" />
                <span>🏆 YOUR A CHAMPION 🏆</span>
                <TrophyIcon class="w-4 h-4 text-yellow-300" />
              </div>
              
              <!-- Title with Trophy Icons -->
              <h2 class="text-xl font-black bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent mb-2 flex items-center justify-center gap-2">
                <TrophyIcon class="w-8 h-8 text-yellow-500" />
                CONGRATULATIONS!
                <TrophyIcon class="w-8 h-8 text-yellow-500" />
              </h2>
             
              
              <!-- Winning Prize Card -->
              <div class="relative mb-6">
                <div class="absolute inset-0 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-2xl blur-lg opacity-60"></div>
                <div class="relative bg-transparent rounded-2xl p-1 shadow-2xl border border-yellow-300/50">
                  <!-- Trophy Icons Top -->
                  <div class="flex items-center justify-center gap-2 mb-3">
                    <TrophyIcon class="w-6 h-6 text-yellow-200 drop-shadow" />
                    <TrophyIcon class="w-8 h-8 text-yellow-200 drop-shadow" />
                    <TrophyIcon class="w-6 h-6 text-yellow-200 drop-shadow" />
                  </div>
                  
                  <p class="text-white/90 font-bold text-sm uppercase tracking-wider mb-1">YOU WON</p>
                  <p class="text-xl font-black text-white drop-shadow-lg mb-2">
                    {{ formatMoney(win?.potentialReturn) }}
                  </p>
                  
                  <!-- Trophy Icons Bottom -->
                  <div class="flex items-center justify-center gap-2 mb-3">
                    <TrophyIcon class="w-4 h-4 text-yellow-200" />
                    <TrophyIcon class="w-5 h-5 text-yellow-200" />
                    <TrophyIcon class="w-4 h-4 text-yellow-200" />
                  </div>
                  
                
                </div>
              </div>
              
              <!-- Trophy Line Decoration -->
              <div class="flex items-center justify-center gap-2">
                <TrophyIcon class="w-3 h-3 text-yellow-600/50" />
                <TrophyIcon class="w-4 h-4 text-yellow-500/50" />
                <TrophyIcon class="w-5 h-5 text-yellow-400/50" />
                <TrophyIcon class="w-4 h-4 text-yellow-500/50" />
                <TrophyIcon class="w-3 h-3 text-yellow-600/50" />
              </div>
            </div>
            
            <!-- Bottom Decoration -->
            <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500 rounded-b-3xl"></div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { TrophyIcon } from '@heroicons/vue/24/solid'

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

// Star background styles
const getStarStyle = (index) => {
  return {
    position: 'absolute',
    width: `${Math.random() * 3 + 1}px`,
    height: `${Math.random() * 3 + 1}px`,
    backgroundColor: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    borderRadius: '50%',
    animation: `starTwinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
    animationDelay: `${Math.random() * 5}s`
  }
}

// Confetti animation styles
const getConfettiStyle = (index) => {
  const colors = ['#FFD700', '#FFA500', '#FF6347', '#FFD700', '#FFA500', '#FFD700', '#FFC107']
  return {
    position: 'absolute',
    width: `${Math.random() * 10 + 4}px`,
    height: `${Math.random() * 10 + 4}px`,
    backgroundColor: colors[Math.floor(Math.random() * colors.length)],
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    borderRadius: '2px',
    animation: `confettiFall ${Math.random() * 3 + 2}s linear infinite`,
    animationDelay: `${Math.random() * 5}s`,
    opacity: Math.random() * 0.8 + 0.2,
    transform: `rotate(${Math.random() * 360}deg)`
  }
}

// Play celebration sound effect
const playCelebrationSound = () => {
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

@keyframes starTwinkle {
  0%, 100% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
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

.delay-500 {
  animation-delay: 0.5s;
}

.delay-700 {
  animation-delay: 0.7s;
}
</style>