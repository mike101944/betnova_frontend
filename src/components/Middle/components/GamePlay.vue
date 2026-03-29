<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const gameId = route.params.id

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="w-full h-screen bg-black flex flex-col">

    <!-- HEADER -->
    <div class="flex items-center justify-between p-3 bg-[#111] text-white">
      <button @click="goBack" class="text-sm bg-zinc-700 px-3 py-1 rounded">
        ⬅ Back
      </button>

      <div class="font-bold">
        Game #{{ gameId }}
      </div>

      <div class="text-green-400 text-sm">
        ● LIVE
      </div>
    </div>

    <!-- GAME AREA -->
    <div class="flex-1 bg-black flex items-center justify-center">

      <!-- OPTION 1: IFRAME (REAL GAME) -->
      <!-- Replace src with real casino provider URL -->
      <iframe 
        src="https://example.com/casino-game"
        class="w-full h-full border-none"
      ></iframe>

      <!-- OPTION 2: PLACEHOLDER -->
      <!--
      <div class="text-white text-center">
        <h1 class="text-2xl mb-2">🎮 Game {{ gameId }}</h1>
        <p>Game will load here (API / iframe)</p>
      </div>
      -->

    </div>

  </div>
</template>