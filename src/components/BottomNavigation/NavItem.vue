<template>
    <div class="flex flex-col items-center transition-all duration-300"
         :class="{
           'translate-y-[-12px]': active,
           'translate-y-0': !active
         }"
         style="width: 70px;">
      <button
        @click="handleClick"
        class="flex flex-col items-center justify-center w-full transition-all duration-300"
      >
        <!-- Icon with scale animation -->
        <div class="relative">
          <!-- Render emoji moja kwa moja kwa Sports, vinginevyo tumia SVG -->
          <span v-if="isSportsIcon" class="text-xl transition-all duration-300 block"
                :class="[
                  active ? 'scale-110 text-[#0AF0B5]' : 'scale-100 text-gray-400'
                ]">
            ⚽
          </span>
          <svg
            v-else
            class="w-6 h-6 transition-all duration-300"
            :class="[
              active ? 'scale-110 text-[#0AF0B5]' : 'scale-100 text-gray-400'
            ]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path :d="icon" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          
          <!-- Active indicator dot (smaller) -->
          <div
            v-if="active"
            class="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#0AF0B5] rounded-full"
          ></div>
        </div>
        
        <!-- Label -->
        <span
          class="text-[10px] font-medium mt-1 transition-all duration-300"
          :class="active ? 'text-[#0AF0B5]' : 'text-gray-400'"
        >
          {{ label }}
        </span>
      </button>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    icon: { type: String, required: true },
    label: { type: String, required: true },
    active: { type: Boolean, default: false },
    index: { type: Number, required: true }
  })
  
  const emit = defineEmits(['click'])
  
  // Check if this is the Sports item (using emoji instead of SVG)
  const isSportsIcon = computed(() => {
    return props.label.toLowerCase() === 'sports'
  })
  
  const handleClick = () => {
    emit('click', props.label.toLowerCase(), props.index)
  }
  </script>