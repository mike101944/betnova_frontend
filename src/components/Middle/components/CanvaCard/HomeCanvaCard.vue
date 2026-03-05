<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// State
const currentSlide = ref(0)
const slideInterval = ref(null)

// Data
const slides = ref([
  {
    title: '',
    subtitle: '',
    image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    buttonText: 'Claim Bonus'
  },
  {
    title: 'Live Betting Experience',
    subtitle: 'Place bets in real-time as the action unfolds',
    image: 'https://images.unsplash.com/photo-1434648957308-5e6a859697e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    buttonText: 'Try Live Betting'
  },
  {
    title: 'Big Bonuses & Promotions',
    subtitle: 'Get up to 200% welcome bonus on your first deposit',
    image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    buttonText: 'Claim Bonus'
  },
  {
    title: 'Welcome to Sports Betting Pro',
    subtitle: 'Bet on your favorite sports with the best odds in the market',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    buttonText: 'Get Started'
  },
])

// Methods
const startAutoSlide = () => {
  slideInterval.value = setInterval(() => {
    nextSlide()
  }, 5000)
}

const stopAutoSlide = () => {
  if (slideInterval.value) {
    clearInterval(slideInterval.value)
    slideInterval.value = null
  }
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length
}

const goToSlide = (index) => {
  currentSlide.value = index
}

// Hover handlers
const handleMouseEnter = () => stopAutoSlide()
const handleMouseLeave = () => startAutoSlide()

// Lifecycle
onMounted(() => {
  startAutoSlide()
})

onBeforeUnmount(() => {
  stopAutoSlide()
})
</script>

<template>
  <div class="cour w-full h-32 bg-white overflow-hidden relative">
    <!-- Carousel Section -->
    <div 
      class="relative h-full"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <!-- Images -->
      <div
        v-for="(slide, index) in slides"
        :key="index"
        class="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
        :class="currentSlide === index ? 'opacity-100' : 'opacity-0'"
      >
        <!-- Image Background -->
        <div
          class="absolute inset-0 bg-cover bg-center"
          :style="{ backgroundImage: `url(${slide.image})` }"
        ></div>

        <!-- Overlay -->
        <div class="absolute inset-0 bg-transparent bg-opacity-50"></div>

        <!-- Content -->
        <div class="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
          <h2 class="text-[13px] md:text-[16px] lg:text-xl font-bold mb-4 text-center">
            {{ slide.title }}
          </h2>
          <p class="text-[12px] md:text-[14px] lg:text-xl text-center max-w-2xl">
            {{ slide.subtitle }}
          </p>
          <!-- Button imecomment kwenye original -->
        </div>
      </div>

      <!-- Navigation Dots -->
      <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        <button
          v-for="(_, index) in slides"
          :key="index"
          @click="goToSlide(index)"
          class="w-2 h-2 rounded-full transition-all duration-300"
          :class="currentSlide === index ? 'bg-orange-700 w-8' : 'bg-white bg-opacity-50 hover:bg-opacity-100'"
          :aria-label="`Go to slide ${index + 1}`"
        ></button>
      </div>

      <!-- Navigation Arrows -->
      <button
        @click="prevSlide"
        class="absolute left-4 top-1/2 transform animate-bounce cursor-pointer -translate-y-1/2 w-10 h-10 bg-gray-400 bg-opacity-30 hover:bg-opacity-50 rounded-full flex items-center justify-center text-white z-20 transition-all duration-300"
        aria-label="Previous slide"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        @click="nextSlide"
        class="absolute right-4 top-1/2 transform -translate-y-1/2 animate-bounce cursor-pointer w-10 h-10 bg-gray-400 bg-opacity-30 hover:bg-opacity-50 rounded-full flex items-center justify-center text-white z-20 transition-all duration-300"
        aria-label="Next slide"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Vue transition inaweza kuongezwa kama unataka effects zaidi */
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.5s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}
</style>