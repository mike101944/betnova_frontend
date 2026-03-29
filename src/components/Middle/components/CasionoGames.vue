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
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400'
  },
  {
    id: 4,
    title: 'Roulette',
    image: 'https://images.unsplash.com/photo-1586985289906-406988974504?w=400'
  },
  {
    id: 5,
    title: 'Poker',
    image: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=400'
  },
  {
    id: 6,
    title: 'Baccarat',
    image: 'https://images.unsplash.com/photo-1561414927-6d86591d0c4f?w=400'
  },
  {
    id: 7,
    title: 'Crash Game',
    image: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=400'
  },
  {
    id: 8,
    title: 'Live Casino',
    image: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=400'
  },
  {
    id: 9,
    title: 'Jackpot',
    image: 'https://images.unsplash.com/photo-1596451190630-186aff535bf2?w=400'
  },
  {
    id: 10,
    title: 'Spin & Win',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400'
  }
])
</script>

<template>
  <div class="w-full overflow-x-auto scroll-smooth">
    <div class="flex gap-2 p-1 min-w-min bg-white opacity-70">

      <div 
        v-for="game in cards" 
        :key="game.id"
        class="relative flex-shrink-0 h-[120px] w-[90px] rounded-xl overflow-hidden
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