<!-- CustomAlert.vue -->

<template>
    <Transition name="fade">
      <div v-if="visible" class="custom-alert" :class="typeClass">
        <div class="alert-content">
          <div class="alert-icon">
            <svg v-if="type === 'success'" class="icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <svg v-else-if="type === 'error'" class="icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <svg v-else-if="type === 'warning'" class="icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <svg v-else class="icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="alert-message">
            <p>{{ message }}</p>
          </div>
          <button @click="close" class="alert-close">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  
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
  
  // Computed class for alert type
  const typeClass = {
    'alert-success': props.type === 'success',
    'alert-error': props.type === 'error',
    'alert-warning': props.type === 'warning',
    'alert-info': props.type === 'info'
  }
  </script>
  
  <style scoped>
  .custom-alert {
    position: fixed;
    top: 20px;
    right: 20px;
    min-width: 320px;
    max-width: 450px;
    z-index: 9999;
    border-radius: 12px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  }
  
  .alert-content {
    display: flex;
    align-items: flex-start;
    padding: 16px;
    gap: 12px;
  }
  
  .alert-icon {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
  }
  
  .icon {
    width: 100%;
    height: 100%;
  }
  
  .alert-message {
    flex: 1;
    font-size: 14px;
    line-height: 1.5;
  }
  
  .alert-message p {
    margin: 0;
  }
  
  .alert-close {
    flex-shrink: 0;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
  }
  
  .alert-close:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  /* Type Colors */
  .alert-success {
    background-color: #f0fdf4;
    border-left: 4px solid #22c55e;
    color: #166534;
  }
  
  .alert-success .icon {
    color: #22c55e;
  }
  
  .alert-error {
    background-color: #fef2f2;
    border-left: 4px solid #ef4444;
    color: #991b1b;
  }
  
  .alert-error .icon {
    color: #ef4444;
  }
  
  .alert-warning {
    background-color: #fffbeb;
    border-left: 4px solid #f59e0b;
    color: #92400e;
  }
  
  .alert-warning .icon {
    color: #f59e0b;
  }
  
  .alert-info {
    background-color: #eff6ff;
    border-left: 4px solid #3b82f6;
    color: #1e40af;
  }
  
  .alert-info .icon {
    color: #3b82f6;
  }
  
  /* Animation */
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