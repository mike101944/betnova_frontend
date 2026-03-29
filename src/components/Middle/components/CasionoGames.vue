<script setup>
import { ref } from 'vue'

const cards = ref([
  {
    id: 1,
    title: 'Aviator',
    image: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=400'
  },
  {
    id: 2,
    title: 'Slots',
    image: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=400'
  },
  {
    id: 3,
    title: 'Blackjack',
    image: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=400'
  },
  {
    id: 4,
    title: 'Roulette',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400'
  },
  {
    id: 5,
    title: 'Poker',
    image: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=400'
  }
])
</script>

<template>
  <div class="w-full overflow-x-auto scroll-smooth">
    <div class="flex gap-3 p-1 min-w-min bg-white opacity-70">

      <div 
        v-for="game in cards" 
        :key="game.id"
        class="relative flex-shrink-0 h-[120px] w-[100px] rounded-xl overflow-hidden
               shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
      >
        <!-- Background Image -->
        <img 
          :src="game.image" 
          class="absolute inset-0 w-full h-full object-cover"
        />

        <!-- Dark Overlay -->
        <div class="absolute inset-0 bg-black/50"></div>

        <!-- Title -->
        <div class="absolute bottom-2 left-2 right-2 text-white text-xs font-bold">
          {{ game.title }}
        </div>

      </div>

    </div>
  </div>
</template>