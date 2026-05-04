<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/authStore'

const router = useRouter()
const authStore = useAuthStore()

// Registration form data
const phoneNumber = ref('')
const password = ref('')
const acceptTerms = ref(true)
const errorMessage = ref('')
const keepLoggedIn = ref(false)

// Forgot Password State
const showForgotPassword = ref(false)
const resetPhoneNumber = ref('')
const resetUserId = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const resetStep = ref(1) // 1: request, 2: reset password
const resetMessage = ref('')
const resetError = ref('')
const isResetLoading = ref(false)





// Form validation
const isPhoneValid = computed(() => {
  return phoneNumber.value.length >= 9 && /^\d+$/.test(phoneNumber.value)
})

const isPasswordValid = computed(() => {
  return password.value.length >= 4
})

const isFormValid = computed(() => {
  return isPhoneValid.value && isPasswordValid.value
})

// Forgot password validations
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
const showPassword = ref(false)
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

// Toggle reset password visibility
const showResetPassword = ref(false)
const toggleResetPassword = () => {
  showResetPassword.value = !showResetPassword.value
}

const showConfirmPassword = ref(false)
const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

// Handle login submission
const handleLogin = async (e) => {
  e.preventDefault()

  if (!isFormValid.value || authStore.isLoading) return

  errorMessage.value = ''

  try {
    const result = await authStore.login({
      phoneNumber: phoneNumber.value,
      password: password.value
    }, keepLoggedIn.value)

    if (result.success) {
      router.push('/')
    } else {
      errorMessage.value = result.message || 'Login failed. Please try again.'
    }
  } catch (error) {
    console.error('Login error:', error)
    errorMessage.value = error.message || 'An unexpected error occurred'
  }
}

// Handle Forgot Password - Step 1: Request Reset
const handleForgotPasswordRequest = async () => {
  if (!isResetPhoneValid.value || isResetLoading.value) return
  
  resetError.value = ''
  resetMessage.value = ''
  isResetLoading.value = true
  
  try {
    const result = await authStore.forgotPassword(resetPhoneNumber.value)
    
    if (result.success) {
      resetMessage.value = 'Account found! You can now reset your password.'
      resetStep.value = 2
      // Store userId for next step
      resetUserId.value = result.userId
      // Clear phone number field after successful verification
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

// Handle Reset Password - Step 2: Set New Password
const handleResetPassword = async () => {
  if (!isResetFormValid.value || isResetLoading.value) return
  
  resetError.value = ''
  resetMessage.value = ''
  isResetLoading.value = true
  
  try {
    // Use the stored userId from step 1
    const result = await authStore.resetPassword(
      resetUserId.value, 
      newPassword.value, 
      confirmPassword.value
    )
    
    if (result.success) {
      resetMessage.value = 'Password reset successfully! You can now login with your new password.'
      
      // Auto close after 2 seconds and go back to login
      setTimeout(() => {
        closeForgotPassword()
        // Optional: Auto fill phone number
        phoneNumber.value = resetPhoneNumber.value
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



// Check if current entered phone number is admin
const isAdminLogin = computed(() => {
  const adminPhoneNumbers = ['683307420', '696684997', '672572874', '745211365', '749003366', '690802328']
  return adminPhoneNumbers.includes(phoneNumber.value)
})


// Close forgot password modal and reset state
const closeForgotPassword = () => {
  showForgotPassword.value = false
  resetStep.value = 1
  resetPhoneNumber.value = ''
  resetUserId.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  resetMessage.value = ''
  resetError.value = ''
  isResetLoading.value = false
}

// Open forgot password modal
const openForgotPassword = () => {
  showForgotPassword.value = true
  resetStep.value = 1
  resetError.value = ''
  resetMessage.value = ''
}

// Navigate to register
const goToRegister = () => {
  router.push('/register')
}
</script>

<template>
  <div class="h-full bg-transparent p-5 flex items-center justify-center flex-col text-[#252a2d] relative">
    <div class="w-full max-w-md bg-white p-6 rounded-2xl shadow-2xl">
      
      <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-2 items-center pb-6">
        <span class="font-semibold text-2xl text-sky-500 drop-shadow-lg">Welcome</span>
        <span class="text-[12px] typing-animation">Login to continue</span>
      </div>

      <!-- Form with @submit.prevent (prevents page reload) -->
      <form @submit.prevent="handleLogin" class="w-full">
        
        <!-- Error Message -->
        <div v-if="errorMessage" 
          class="bg-red-50 text-red-600 border border-red-200 rounded p-3 mb-4 text-center text-sm">
          {{ errorMessage }}
        </div>

        <!-- Phone Number Input -->
        <div class="mb-4" data-test-id="joinNowPhoneNumber">
          <label for="registration-form-phoneNumber" class="block text-[#252a2d] mb-1.5 text-sm">
            Mobile number
          </label>
          <div class="flex items-center w-full border border-gray-200 bg-white rounded-md">
            <span class="fi fi-tz w-6 h-4 mx-2" title="TZ"></span>
            <span class="text-[#252a2d] text-sm mr-1 whitespace-nowrap">+255</span>
            <input v-model="phoneNumber" 
              data-test-id="joinNowPhoneNumber" 
              id="registration-form-phoneNumber"
              name="phoneNumber"
              type="tel" 
              @input="errorMessage = ''" 
              :disabled="authStore.isLoading"
              class="flex-1 min-w-0 py-2 px-0 border-none bg-transparent outline-none text-sm" />
          </div>
          <div class="text-gray-500 mt-1.5 text-xs">
            Enter your phone number (e.g., 789564432).
          </div>
        </div>

        <!-- Password Input with Lock and Eye Icons -->
        <div class="mb-4">
          <label for="registration-form-password" class="block text-[#252a2d] mb-1.5 text-sm">
            Password
          </label>
          <div class="flex items-center border bg-white px-2 rounded-md"
            :class="[
              password && !isPasswordValid ? 'border-red-500 bg-red-50' : 
              isPasswordValid && password ? 'border-teal-300 bg-teal-50' : 
              'border-gray-200'
            ]">
            
            <!-- Lock Icon - Left -->
            <span class="flex items-center text-gray-500 mr-2"
              :class="{
                'text-[#252a2d]': isPasswordValid && password,
                'text-red-500': password && !isPasswordValid
              }">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" 
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" 
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            
            <!-- Password Input -->
            <input v-model="password" 
              :type="showPassword ? 'text' : 'password'" 
              id="registration-form-password"
              placeholder=""
              autocomplete="current-password" 
              name="password" 
              @input="errorMessage = ''" 
              :disabled="authStore.isLoading"
              class="flex-1 min-w-0 py-2 px-0 border-none bg-transparent outline-none text-sm" />
            
            <!-- Eye/Eye-off Icon - Right -->
            <span class="flex items-center text-gray-500 ml-2 cursor-pointer hover:text-[#252a2d]" 
              @click="togglePassword"
              :class="{
                'text-[#252a2d]': isPasswordValid && password,
                'text-red-500': password && !isPasswordValid
              }">
              <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" 
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 1 12 1 12C2.24389 9.6819 3.96914 7.65663 6.06 6.06M9.9 4.24C10.5883 4.0789 11.2931 3.99834 12 4C19 4 23 12 23 12C22.393 13.1356 21.6691 14.2047 20.84 15.19M14.12 14.12C13.8454 14.4147 13.5141 14.6512 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9781 15.0744C11.5753 15.0815 11.1752 15.0074 10.8016 14.8565C10.4281 14.7056 10.0887 14.481 9.80385 14.1962C9.51897 13.9113 9.29439 13.5719 9.1435 13.1984C8.99262 12.8248 8.91853 12.4247 8.92563 12.0219C8.93274 11.6191 9.02091 11.2218 9.18488 10.8538C9.34884 10.4858 9.58525 10.1546 9.88 9.88M19 19L5 5" 
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </div>
          <div class="text-gray-500 mt-1.5 text-xs">
            Min. 4 Characters
          </div>
        </div>

        <!-- Forgot Password Link -->
        

        <!-- Keep Me Logged In Checkbox -->
        <div class="mb-4 flex items-center justify-between">
          <label class="flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              v-model="keepLoggedIn" 
              class="form-checkbox h-4 w-4 text-teal-500 rounded border-gray-300"
              :disabled="authStore.isLoading"
            />
            <span class="ml-2 text-sm text-gray-600">Keep me logged in</span>
          </label>
          <div class=" text-right">
            <!-- <a href="#" @click.prevent="openForgotPassword"  -->
          <a href="#"  
           
            class="text-sm text-sky-600 hover:text-sky-800 underline">
            Forgot Password?
          </a>
        </div>
        </div>

        <!-- Submit Button with Pulse Animation -->
        <button type="submit" 
          class="w-full font-bold text-sm uppercase py-2.5 px-5 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-default rounded-md"
          :class="[
            !isFormValid || authStore.isLoading 
              ? 'bg-gray-200 text-gray-500' 
              : 'bg-teal-300 text-[#252a2d] hover:bg-teal-400 animate-softPulse'
          ]"
          :disabled="!isFormValid || authStore.isLoading">
          <span v-if="!authStore.isLoading" class="inline-block font-bold text-[14px] text-sky-800">LOGIN</span>
          <span v-else class="inline-block animate-pulse">PROCESSING...</span>
        </button>

        <!-- Register Link -->
        <span class="block text-center mt-4 text-xs">
          Don't have an account?
          <a href="#" class="underline font-bold text-sky-600 hover:text-sky-800" @click.prevent="goToRegister">
            Register
          </a>
        </span>
      </form>
    </div>

    <!-- Forgot Password Modal -->
    <div v-if="showForgotPassword" class="fixed inset-0 bg-sky-800 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        
        <!-- Close Button -->
        <button @click="closeForgotPassword" 
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <!-- Header -->
        <div class="text-center mb-6">
          <h2 class="text-2xl font-bold text-sky-600">Reset Password</h2>
          <p class="text-gray-500 text-sm mt-1">
            {{ resetStep === 1 ? 'Enter your phone number to reset password' : 'Create a new password' }}
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
              Phone Number
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
          </div>

          <button @click="handleForgotPasswordRequest" 
            :disabled="!isResetPhoneValid || isResetLoading"
            class="w-full font-bold py-2.5 px-5 rounded-md transition-all"
            :class="[
              !isResetPhoneValid || isResetLoading
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-teal-300 text-sky-800 hover:bg-teal-400'
            ]">
            <span v-if="!isResetLoading">CONTINUE</span>
            <span v-else class="animate-pulse">PROCESSING...</span>
          </button>
        </div>

        <!-- Step 2: Reset Password -->
        <div v-if="resetStep === 2">
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
                <svg v-if="!showResetPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="2"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                <svg v-if="!showConfirmPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="2"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      </div>
    </div>
  </div>
</template>

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

/* Handshake Animation */
@keyframes handshake {
  0% { transform: rotate(0deg); }
  10% { transform: rotate(10deg); }
  20% { transform: rotate(-10deg); }
  30% { transform: rotate(8deg); }
  40% { transform: rotate(-8deg); }
  50% { transform: rotate(4deg); }
  60% { transform: rotate(-4deg); }
  70% { transform: rotate(0deg); }
  100% { transform: rotate(0deg); }
}

.animate-handshake {
  display: inline-block;
  animation: handshake 2s ease-in-out infinite;
  transform-origin: center center;
}

/* Typing Animation */
.typing-animation {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid currentColor;
  width: 0;
  animation: typing 3s steps(20, end) infinite, 
             blink-caret 0.75s step-end infinite;
}

@keyframes typing {
  0%, 100% { width: 0; }
  30%, 70% { width: 140px; }
}

@keyframes blink-caret {
  from, to { border-color: transparent; }
  50% { border-color: currentColor; }
}

/* Soft Pulse Animation for Button */
@keyframes softPulse {
  0%, 100% { 
    opacity: 1;
    box-shadow: 0 0 5px rgba(57, 236, 221, 0.2);
  }
  50% { 
    opacity: 0.9;
    box-shadow: 0 0 15px rgba(57, 236, 221, 0.5);
  }
}

.animate-softPulse {
  animation: softPulse 2s ease-in-out infinite;
}
</style>