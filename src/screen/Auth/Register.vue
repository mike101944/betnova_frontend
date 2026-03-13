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

// Form validation
const isPhoneValid = computed(() => {
  return phoneNumber.value.length >= 9 && /^\d+$/.test(phoneNumber.value)
})

const isPasswordValid = computed(() => {
  return password.value.length >= 4
})

const isFormValid = computed(() => {
  return isPhoneValid.value && isPasswordValid.value && acceptTerms.value
})

// Toggle password visibility
const showPassword = ref(false)
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

// Handle registration
const handleRegister = async (e) => {
  e.preventDefault()

  if (!isFormValid.value || authStore.isLoading) return

  errorMessage.value = ''

  try {
    const result = await authStore.register(phoneNumber.value, password.value)

    if (result.success) {
      alert('Registration successful! Please login.')
      router.push('/login')
    } else {
      errorMessage.value = result.message || 'Registration failed. Please try again.'
    }
  } catch (error) {
    errorMessage.value = error.message || 'An unexpected error occurred'
  }
}

// Navigate to login
const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-5 flex items-center justify-center flex-col text-[#252a2d] relative">
    <div class="w-full max-w-md bg-white p-6 rounded-2xl shadow-2xl">
      <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-2 items-center pb-6">
  <!-- Handshake animation infinite -->
  <span class="font-semibold text-2xl text-sky-500  drop-shadow-lg ">Welcome Back</span>
  
  <!-- Typing and erasing animation -->
  <span class="text-[12px] typing-animation">Create your account Now</span>
</div>
      <form @submit.prevent="handleRegister" class="w-full  ">
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
              class="flex-1 min-w-0 py-2 px-0 border-none bg-transparent outline-none text-sm"
              :class="{
                'bg-transparent': true,
                'border-transparent': true
              }" />
          </div>
          <div class="text-gray-500 mt-1.5 text-xs">
            Enter your phone number  (e.g., 789564432).
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
              autocomplete="new-password" 
              name="password" 
              @input="errorMessage = ''" 
              :disabled="authStore.isLoading"
              class="flex-1 min-w-0 py-2 px-0 border-none bg-transparent outline-none text-sm  " />
            
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
         <!-- Submit Button -->
       

         <button type="submit" 
  class="w-full font-bold text-sm uppercase py-2.5 px-5 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-default rounded-md"
  :class="[
    !isFormValid || authStore.isLoading 
      ? 'bg-gray-200 text-gray-500' 
      : 'bg-teal-300 text-[#252a2d] hover:bg-teal-400 animate-softPulse'
  ]"
  :disabled="!isFormValid || authStore.isLoading">
  <span v-if="!authStore.isLoading" class="inline-block font-bold text-[14px] text-sky-800">REGISTER</span>
  <span v-else class="inline-block animate-pulse">PROCESSING...</span>
</button>
     

        <!-- Login Link -->
        <span class="block text-center mt-4 text-xs">
          Already have an account?
          <a href="#" class="underline font-bold" @click.prevent="goToLogin">
            Log In
          </a>
        </span>
      </form>
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

.fi-tz {
  background-image: url(/src/assets/img/flags/tz-BjLtHeil.svg);
}
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
  30%, 70% { width: 140px; } /* Adjust based on text length */
}

@keyframes blink-caret {
  from, to { border-color: transparent; }
  50% { border-color: currentColor; }
}
/* Remove any remaining custom styles */
</style>