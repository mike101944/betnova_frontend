<template>
    <button
      @click="handleClick"
      class="flex flex-col items-center justify-center py-2 px-3 relative group transition-all duration-300"
      :class="[
        active ? 'text-[#0AF0B5]' : 'text-gray-400 hover:text-gray-300'
      ]"
    >
      <!-- Icon with scale animation -->
      <div class="relative">
        <svg
          class="w-6 h-6 transition-all duration-300"
          :class="active ? 'scale-110' : 'scale-100 group-hover:scale-105'"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path :d="icon" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        
        <!-- Active indicator dot -->
        <div
          v-if="active"
          class="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#0AF0B5] rounded-full animate-pulse"
        ></div>
      </div>
      
      <!-- Label with fade animation -->
      <span
        class="text-xs font-medium mt-1 transition-all duration-300"
        :class="active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'"
      >
        {{ label }}
      </span>
  
      <!-- Background glow on active -->
      <div
        v-if="active"
        class="absolute inset-0 bg-[#0AF0B5]/5 rounded-lg -z-10"
      ></div>
    </button>
  </template>
  
  <script setup>
  const props = defineProps({
    icon: { type: String, required: true },
    label: { type: String, required: true },
    active: { type: Boolean, default: false },
    index: { type: Number, required: true },
    activeIndex: { type: Number, required: true }
  })
  
  const emit = defineEmits(['click'])
  
  const handleClick = () => {
    emit('click', props.label.toLowerCase(), props.index)
  }
  </script>
  
  <style scoped>
  /* No additional styles needed - using Tailwind */
  </style>