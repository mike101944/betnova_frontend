<template>
    <Transition name="fade">
      <div v-if="visible" 
           class="fixed top-5 right-1 min-w-[320px] max-w-[450px] z-[9999] rounded-xl shadow-lg"
           :class="typeClasses">
        <div class="flex items-start p-2 gap-2">
          <!-- Icon -->
          <div class="flex-shrink-0 w-5 h-5" :class="iconColorClasses">
            <svg v-if="type === 'success'" viewBox="0 0 20 20" fill="currentColor" class="w-full h-full">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <svg v-else-if="type === 'error'" viewBox="0 0 20 20" fill="currentColor" class="w-full h-full">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <svg v-else-if="type === 'warning'" viewBox="0 0 20 20" fill="currentColor" class="w-full h-full">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <svg v-else viewBox="0 0 20 20" fill="currentColor" class="w-full h-full">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
  
          <!-- Message -->
          <div class="flex-1 text-sm leading-relaxed" :class="textColorClasses">
            <p class="m-0">{{ message }}</p>
          </div>
  
          <!-- Close Button -->
          <button @click="close" 
                  class="flex-shrink-0 p-1 rounded hover:bg-black/5 transition-colors duration-200"
                  :class="textColorClasses">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </template>
  
  <script setup>
  import { ref, watch, computed } from 'vue'
  
  const props = defineProps({
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
    },
    message: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      default: 5000
    },
    show: {
      type: Boolean,
      default: false
    }
  })
  
  const emit = defineEmits(['update:show', 'close'])
  const visible = ref(props.show)
  let timeout = null
  
  // Type-based classes
  const typeClasses = computed(() => {
    const classes = {
      success: 'bg-green-50 border-l-4 border-green-500 text-green-800',
      error: 'bg-red-50 border-l-4 border-red-500 text-red-800',
      warning: 'bg-amber-50 border-l-4 border-amber-500 text-amber-800',
      info: 'bg-blue-50 border-l-4 border-blue-500 text-blue-800'
    }
    return classes[props.type]
  })
  
  const iconColorClasses = computed(() => {
    const classes = {
      success: 'text-green-500',
      error: 'text-red-500',
      warning: 'text-amber-500',
      info: 'text-blue-500'
    }
    return classes[props.type]
  })
  
  const textColorClasses = computed(() => {
    const classes = {
      success: 'text-green-800',
      error: 'text-red-800',
      warning: 'text-amber-800',
      info: 'text-blue-800'
    }
    return classes[props.type]
  })
  
  watch(() => props.show, (newVal) => {
    visible.value = newVal
    if (newVal && props.duration > 0) {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        close()
      }, props.duration)
    }
  })
  
  const close = () => {
    visible.value = false
    emit('update:show', false)
    emit('close')
  }
  </script>
  
  <style scoped>
  /* Animation - Tailwind doesn't have these */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: translateX(20px);
  }
  </style>