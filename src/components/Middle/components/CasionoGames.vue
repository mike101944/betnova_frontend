<script setup>
import { ref } from 'vue'

const cards = ref([
  { id: 1, title: 'Aviator', image: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=400', live: true, multiplier: '2.5x' },
  { id: 2, title: 'Slots', image: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=400' },
  { id: 3, title: 'Blackjack', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400' },
  { id: 4, title: 'Roulette', image: 'https://images.unsplash.com/photo-1586985289906-406988974504?w=400', live: true },
  { id: 5, title: 'Poker', image: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=400' },
  { id: 6, title: 'Baccarat', image: 'https://images.unsplash.com/photo-1561414927-6d86591d0c4f?w=400' },
  { id: 7, title: 'Crash', image: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=400', multiplier: '1.8x' },
  { id: 8, title: 'Live Casino', image: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=400', live: true },
  { id: 9, title: 'Jackpot', image: 'https://images.unsplash.com/photo-1596451190630-186aff535bf2?w=400' },
  { id: 10, title: 'Spin & Win', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400' }
])
</script>

<template>
  <div class="w-full overflow-x-auto scroll-smooth">
    <div class="flex gap-3 p-2 min-w-min bg-[#0f172a]">

      <div 
        v-for="game in cards" 
        :key="game.id"
        class="group relative flex-shrink-0 h-[130px] w-[100px] rounded-xl overflow-hidden
               shadow-lg cursor-pointer transition-all duration-300"
      >
        <!-- IMAGE -->
        <img 
          :src="game.image" 
          class="absolute inset-0 w-full h-full object-cover 
                 group-hover:scale-110 transition duration-500"
        />

        <!-- DARK OVERLAY -->
        <div class="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition"></div>

        <!-- GLOW EFFECT -->
        <div class="absolute inset-0 rounded-xl ring-0 group-hover:ring-2 ring-green-400 transition"></div>

        <!-- LIVE BADGE -->
        <div 
          v-if="game.live"
          class="absolute top-1 left-1 bg-red-600 text-white text-[10px] px-1.5 py-[1px] rounded flex items-center gap-1"
        >
          🔴 LIVE
        </div>

        <!-- MULTIPLIER -->
        <div 
          v-if="game.multiplier"
          class="absolute top-1 right-1 bg-green-500 text-black text-[10px] px-1.5 py-[1px] rounded font-bold"
        >
          {{ game.multiplier }}
        </div>

        <!-- PLAY BUTTON -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="opacity-0 group-hover:opacity-100 transition">
            <div class="bg-white/80 rounded-full p-2">
              ▶️
            </div>
          </div>
        </div>

        <!-- TITLE -->
        <div class="absolute bottom-1 left-2 right-2 text-white text-xs font-semibold truncate">
          {{ game.title }}
        </div>

      </div>

    </div>
  </div>
</template>