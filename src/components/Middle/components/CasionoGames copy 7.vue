<script setup>
import { ref, onMounted } from 'vue'

const cards = ref(20)

// You can customize card data if needed
const getCardContent = (index) => {
  return {
    id: index + 1,
    title: `Aviator ${index + 1}`,
    // Add more properties as needed
  }
}
</script>

<template>
  <div class="w-full overflow-x-auto scroll-smooth">
    <div class="flex gap-3 p-2 min-w-min bg-white">
      <div 
        v-for="i in cards" 
        :key="i"
        class="flex-shrink-0 h-[100px] w-[90px] rounded-lg bg-gradient-to-br from-zinc-600 to-zinc-700 
               hover:from-zinc-500 hover:to-zinc-600 transition-all duration-300 
               shadow-lg hover:shadow-xl cursor-pointer
               flex flex-col items-center justify-center"
      >
        <div class="text-white font-semibold text-xs">
          {{ getCardContent(i-1).title }}
        </div>
        <div class="text-zinc-300 text-sm mt-2">
          Card {{ i }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #3f3f46;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #71717a;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #a1a1aa;
}
</style>