<!-- views/auth/ForgotPassword.vue -->
<template>
    <div class="h-full bg-transparent p-5 flex items-center justify-center flex-col text-[#252a2d] relative">
      <div class="w-full max-w-md bg-white p-6 rounded-2xl shadow-2xl">
        
        <div class="text-center mb-6">
          <h2 class="text-2xl font-bold text-sky-600">Reset User Password</h2>
          <p class="text-gray-500 text-sm mt-1">
            {{ resetStep === 1 ? 'Enter user phone number to reset password' : 'Create a new password for user' }}
          </p>
        </div>
  
        <!-- Success Message -->
        <div v-if="resetMessage" 
          class="bg-green-50 text-green-600 border border-green-200 rounded p-3 mb-4 text-center text-sm">
          {{ resetMessage }}
        </div>
  
        <!-- Error Message -->
        <div v-if="resetError" 
          class="bg-red-50 text-red-600 border border-red-200 rounded p-3 mb-4 text-center text-sm">
          {{ resetError }}
        </div>
  
        <!-- Step 1: Request Reset -->
        <div v-if="resetStep === 1">
          <div class="mb-4">
            <label class="block text-[#252a2d] mb-1.5 text-sm">
              User Phone Number
            </label>
            <div class="flex items-center w-full border border-gray-200 bg-white rounded-md">
              <span class="fi fi-tz w-6 h-4 mx-2" title="TZ"></span>
              <span class="text-[#252a2d] text-sm mr-1 whitespace-nowrap">+255</span>
              <input v-model="resetPhoneNumber" 
                type="tel" 
                placeholder="e.g., 789564432"
                :disabled="isResetLoading"
                class="flex-1 min-w-0 py-2 px-0 border-none bg-transparent outline-none text-sm" />
            </div>
            <p class="text-xs text-gray-400 mt-1">Enter the phone number of the user whose password you want to reset</p>
          </div>
  
          <button @click="handleForgotPasswordRequest" 
            :disabled="!isResetPhoneValid || isResetLoading"
            class="w-full font-bold py-2.5 px-5 rounded-md transition-all"
            :class="[
              !isResetPhoneValid || isResetLoading
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-teal-300 text-sky-800 hover:bg-teal-400'
            ]">
            <span v-if="!isResetLoading">FIND USER</span>
            <span v-else class="animate-pulse">SEARCHING...</span>
          </button>
        </div>
  
        <!-- Step 2: Reset Password -->
        <div v-if="resetStep === 2">
          <div class="mb-4">
            <div class="bg-blue-50 rounded-lg p-3 mb-4 text-center">
              <p class="text-sm text-blue-700">Resetting password for:</p>
              <p class="font-bold text-blue-800">{{ resetPhoneNumber }}</p>
            </div>
          </div>

          <!-- New Password -->
          <div class="mb-4">
            <label class="block text-[#252a2d] mb-1.5 text-sm">
              New Password
            </label>
            <div class="flex items-center border bg-white px-2 rounded-md"
              :class="[
                newPassword && !isNewPasswordValid ? 'border-red-500 bg-red-50' : 
                isNewPasswordValid && newPassword ? 'border-teal-300 bg-teal-50' : 
                'border-gray-200'
              ]">
              <input v-model="newPassword" 
                :type="showResetPassword ? 'text' : 'password'"
                placeholder="Enter new password"
                :disabled="isResetLoading"
                class="flex-1 min-w-0 py-2 px-0 border-none bg-transparent outline-none text-sm" />
              <span class="flex items-center text-gray-500 ml-2 cursor-pointer" 
                @click="toggleResetPassword">
                <svg v-if="!showResetPassword" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="2"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 1 12 1 12C2.24389 9.6819 3.96914 7.65663 6.06 6.06M9.9 4.24C10.5883 4.0789 11.2931 3.99834 12 4C19 4 23 12 23 12C22.393 13.1356 21.6691 14.2047 20.84 15.19M14.12 14.12C13.8454 14.4147 13.5141 14.6512 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9781 15.0744C11.5753 15.0815 11.1752 15.0074 10.8016 14.8565C10.4281 14.7056 10.0887 14.481 9.80385 14.1962C9.51897 13.9113 9.29439 13.5719 9.1435 13.1984C8.99262 12.8248 8.91853 12.4247 8.92563 12.0219C8.93274 11.6191 9.02091 11.2218 9.18488 10.8538C9.34884 10.4858 9.58525 10.1546 9.88 9.88M19 19L5 5" stroke="currentColor" stroke-width="2"/>
                </svg>
              </span>
            </div>
            <div class="text-gray-500 mt-1 text-xs">Minimum 4 characters</div>
          </div>
  
          <!-- Confirm Password -->
          <div class="mb-6">
            <label class="block text-[#252a2d] mb-1.5 text-sm">
              Confirm Password
            </label>
            <div class="flex items-center border bg-white px-2 rounded-md"
              :class="[
                confirmPassword && !isConfirmPasswordValid ? 'border-red-500 bg-red-50' : 
                isConfirmPasswordValid && confirmPassword ? 'border-teal-300 bg-teal-50' : 
                'border-gray-200'
              ]">
              <input v-model="confirmPassword" 
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Confirm new password"
                :disabled="isResetLoading"
                class="flex-1 min-w-0 py-2 px-0 border-none bg-transparent outline-none text-sm" />
              <span class="flex items-center text-gray-500 ml-2 cursor-pointer" 
                @click="toggleConfirmPassword">
                <svg v-if="!showConfirmPassword" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="2"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 1 12 1 12C2.24389 9.6819 3.96914 7.65663 6.06 6.06M9.9 4.24C10.5883 4.0789 11.2931 3.99834 12 4C19 4 23 12 23 12C22.393 13.1356 21.6691 14.2047 20.84 15.19M14.12 14.12C13.8454 14.4147 13.5141 14.6512 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9781 15.0744C11.5753 15.0815 11.1752 15.0074 10.8016 14.8565C10.4281 14.7056 10.0887 14.481 9.80385 14.1962C9.51897 13.9113 9.29439 13.5719 9.1435 13.1984C8.99262 12.8248 8.91853 12.4247 8.92563 12.0219C8.93274 11.6191 9.02091 11.2218 9.18488 10.8538C9.34884 10.4858 9.58525 10.1546 9.88 9.88M19 19L5 5" stroke="currentColor" stroke-width="2"/>
                </svg>
              </span>
            </div>
            <div v-if="confirmPassword && !isConfirmPasswordValid && newPassword !== confirmPassword" 
              class="text-red-500 text-xs mt-1">
              Passwords do not match
            </div>
          </div>
  
          <button @click="handleResetPassword" 
            :disabled="!isResetFormValid || isResetLoading"
            class="w-full font-bold py-2.5 px-5 rounded-md transition-all"
            :class="[
              !isResetFormValid || isResetLoading
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-teal-300 text-sky-800 hover:bg-teal-400'
            ]">
            <span v-if="!isResetLoading">RESET PASSWORD</span>
            <span v-else class="animate-pulse">PROCESSING...</span>
          </button>
        </div>
  
        <!-- Back to Dashboard -->
        <div class="text-center mt-4">
          <router-link to="/admin" class="text-sm text-sky-600 hover:text-sky-800">
            ← Back to Admin Dashboard
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '../../store/authStore'
  
  const router = useRouter()
  const authStore = useAuthStore()
  
  // State
  const resetPhoneNumber = ref('')
  const resetUserId = ref('')
  const newPassword = ref('')
  const confirmPassword = ref('')
  const resetStep = ref(1)
  const resetMessage = ref('')
  const resetError = ref('')
  const isResetLoading = ref(false)
  
  // Validations
  const isResetPhoneValid = computed(() => {
    return resetPhoneNumber.value.length >= 9 && /^\d+$/.test(resetPhoneNumber.value)
  })
  
  const isNewPasswordValid = computed(() => {
    return newPassword.value.length >= 4
  })
  
  const isConfirmPasswordValid = computed(() => {
    return confirmPassword.value.length >= 4 && newPassword.value === confirmPassword.value
  })
  
  const isResetFormValid = computed(() => {
    if (resetStep.value === 1) {
      return isResetPhoneValid.value
    }
    return isNewPasswordValid.value && isConfirmPasswordValid.value
  })
  
  // Toggle password visibility
  const showResetPassword = ref(false)
  const toggleResetPassword = () => {
    showResetPassword.value = !showResetPassword.value
  }
  
  const showConfirmPassword = ref(false)
  const toggleConfirmPassword = () => {
    showConfirmPassword.value = !showConfirmPassword.value
  }
  
  // Handle Forgot Password - Step 1: Find user (NO ADMIN RESTRICTION)
  const handleForgotPasswordRequest = async () => {
    if (!isResetPhoneValid.value || isResetLoading.value) return
    
    resetError.value = ''
    resetMessage.value = ''
    isResetLoading.value = true
    
    // ✅ NO ADMIN CHECK - Admin can reset ANY user's password
    
    try {
      const result = await authStore.forgotPassword(resetPhoneNumber.value)
      
      if (result.success) {
        resetMessage.value = 'User found! You can now reset their password.'
        resetStep.value = 2
        resetUserId.value = result.userId
        resetError.value = ''
      } else {
        resetError.value = result.message || 'Phone number not found. Please check and try again.'
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      resetError.value = error.message || 'An error occurred. Please try again.'
    } finally {
      isResetLoading.value = false
    }
  }
  
  // Handle Reset Password - Step 2: Set New Password for user
  const handleResetPassword = async () => {
    if (!isResetFormValid.value || isResetLoading.value) return
    
    resetError.value = ''
    resetMessage.value = ''
    isResetLoading.value = true
    
    try {
      const result = await authStore.resetPassword(
        resetUserId.value, 
        newPassword.value, 
        confirmPassword.value
      )
      
      if (result.success) {
        resetMessage.value = `Password reset successfully for ${resetPhoneNumber.value}! Redirecting to dashboard...`
        
        setTimeout(() => {
          router.push('/admin')
        }, 2000)
      } else {
        resetError.value = result.message || 'Failed to reset password. Please try again.'
      }
    } catch (error) {
      console.error('Reset password error:', error)
      resetError.value = error.message || 'An error occurred. Please try again.'
    } finally {
      isResetLoading.value = false
    }
  }
  </script>
  
  <style scoped>
  .fi {
    width: 1.33333em;
    line-height: 1em;
    display: inline-block;
    position: relative;
    background-size: contain;
    background-position: 50%;
    background-repeat: no-repeat;
  }
  
  .fi-tz {
    background-image: url(/src/assets/img/flags/tz-BjLtHeil.svg);
  }
  </style>