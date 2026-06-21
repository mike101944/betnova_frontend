<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/authStore'

const router = useRouter()
const authStore = useAuthStore()

const phoneNumber = ref('')
const password = ref('')
const acceptTerms = ref(true)
const errorMessage = ref('')
const promoCode = ref('')
const applyingCode = ref(false)

const isPhoneValid = computed(() => {
  return phoneNumber.value.length >= 9 && /^\d+$/.test(phoneNumber.value)
})

const isPasswordValid = computed(() => {
  return password.value.length >= 4
})

const isFormValid = computed(() => {
  return isPhoneValid.value && isPasswordValid.value && acceptTerms.value
})

const showPassword = ref(false)
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const passwordStrength = computed(() => {
  const len = password.value.length
  if (len === 0) return 0
  if (len < 4) return 1
  if (len < 7) return 2
  if (len < 10) return 3
  return 4
})

const strengthColor = computed(() => {
  const colors = ['', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-teal-400']
  return colors[passwordStrength.value]
})

const strengthLabel = computed(() => {
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  return labels[passwordStrength.value]
})

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

const promoApplied = ref(false)
const applyPromoCode = () => {
  if (!promoCode.value.trim()) return
  applyingCode.value = true
  setTimeout(() => {
    applyingCode.value = false
    promoApplied.value = true
  }, 800)
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-sky-950 via-sky-900 to-slate-900 flex items-center justify-center p-4">
    
    <!-- Decorative background circles -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-32 -left-32 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-sky-300/5 rounded-full blur-2xl"></div>
    </div>

    <div class="relative w-full max-w-md">
      
      <!-- Logo / Brand area -->
      <!-- <div class="text-center mb-6">
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-500 shadow-lg shadow-sky-500/30 mb-3">
          <svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <p class="text-sky-300/70 text-sm">Create your account to get started</p>
      </div> -->

      <!-- Card -->
      <div class="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl shadow-black/20 overflow-hidden">
        
        <!-- Card top accent bar -->
        <div class="h-1 bg-gradient-to-r from-sky-400 via-sky-500 to-teal-400"></div>

        <div class="p-7">

          <!-- Header -->
          <div class="mb-6">
            <h1 class="text-2xl font-bold text-slate-800 mb-0.5">Welcome Back</h1>
            <div class="flex items-center gap-2">
              <span class="text-sm text-slate-400 typing-animation">Create your account now</span>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage"
            class="bg-red-50 text-red-600 border border-red-200 rounded-xl p-3 mb-5 text-center text-sm flex items-center gap-2 justify-center">
            <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {{ errorMessage }}
          </div>

          <form @submit.prevent="handleRegister" class="space-y-5">

            <!-- Phone Number -->
            <div data-test-id="joinNowPhoneNumber">
              <label for="registration-form-phoneNumber" class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Mobile Number
              </label>
              <div class="flex items-center w-full border-2 rounded-xl transition-all duration-200"
                :class="phoneNumber && !isPhoneValid 
                  ? 'border-red-300 bg-red-50' 
                  : phoneNumber && isPhoneValid 
                    ? 'border-sky-400 bg-sky-50' 
                    : 'border-slate-200 bg-slate-50 focus-within:border-sky-400 focus-within:bg-white'">
                <!-- Flag + prefix -->
                <div class="flex items-center gap-1.5 px-3 py-2.5 border-r-2 border-inherit flex-shrink-0">
                  <span class="fi fi-tz w-5 h-4" title="TZ"></span>
                  <span class="text-slate-600 text-sm font-medium">+255</span>
                </div>
                <input
                  v-model="phoneNumber"
                  data-test-id="joinNowPhoneNumber"
                  id="registration-form-phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="789 564 432"
                  @input="errorMessage = ''"
                  :disabled="authStore.isLoading"
                  class="flex-1 min-w-0 py-2.5 px-3 bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-300" />
                <!-- Valid check icon -->
                <div v-if="isPhoneValid" class="pr-3">
                  <svg class="w-4 h-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
              </div>
              <p class="text-xs text-slate-400 mt-1.5 ml-1">Enter digits only (e.g., 789564432)</p>
            </div>

            <!-- Password -->
            <div>
              <label for="registration-form-password" class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Password
              </label>
              <div class="flex items-center border-2 rounded-xl transition-all duration-200"
                :class="password && !isPasswordValid 
                  ? 'border-red-300 bg-red-50' 
                  : isPasswordValid && password 
                    ? 'border-teal-400 bg-teal-50' 
                    : 'border-slate-200 bg-slate-50 focus-within:border-sky-400 focus-within:bg-white'">
                <!-- Lock icon -->
                <span class="pl-3 flex items-center flex-shrink-0"
                  :class="isPasswordValid && password ? 'text-teal-500' : password && !isPasswordValid ? 'text-red-400' : 'text-slate-400'">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                </span>
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  id="registration-form-password"
                  placeholder="Min. 4 characters"
                  autocomplete="new-password"
                  name="password"
                  @input="errorMessage = ''"
                  :disabled="authStore.isLoading"
                  class="flex-1 min-w-0 py-2.5 px-3 bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-300" />
                <!-- Eye toggle -->
                <button type="button" @click="togglePassword"
                  class="pr-3 flex items-center flex-shrink-0 transition-colors"
                  :class="isPasswordValid && password ? 'text-teal-400 hover:text-teal-600' : 'text-slate-400 hover:text-slate-600'">
                  <svg v-if="!showPassword" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                </button>
              </div>

              <!-- Strength bar -->
              <div v-if="password" class="mt-2">
                <div class="flex gap-1 mb-1">
                  <div v-for="i in 4" :key="i"
                    class="h-1 flex-1 rounded-full transition-all duration-300"
                    :class="i <= passwordStrength ? strengthColor : 'bg-slate-200'">
                  </div>
                </div>
                <p class="text-xs ml-1" :class="{
                  'text-red-400': passwordStrength === 1,
                  'text-orange-400': passwordStrength === 2,
                  'text-yellow-500': passwordStrength === 3,
                  'text-teal-500': passwordStrength === 4,
                }">{{ strengthLabel }}</p>
              </div>
              <p v-else class="text-xs text-slate-400 mt-1.5 ml-1">Minimum 4 characters</p>
            </div>

            <!-- Promo Code -->
            <div class="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-2">
              <div class="flex items-center gap-1.5 mb-1">
                <svg class="w-3.5 h-3.5 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                </svg>
                <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Promo Code</span>
              </div>
              <p class="text-xs text-slate-400 mb-1">Enter your code to unlock exclusive bonuses</p>
              <div class="flex gap-2">
                <input
                  v-model="promoCode"
                  type="text"
                  placeholder="e.g. SUNBET100"
                  :disabled="promoApplied"
                  class="flex-1 h-10 px-3 rounded-xl border-2 border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-300 uppercase tracking-widest outline-none transition-all focus:border-sky-400 disabled:opacity-60" />
                <button
                  type="button"
                  :disabled="applyingCode || promoApplied"
                  @click="applyPromoCode"
                  class="h-10 px-4 rounded-xl text-xs font-bold uppercase tracking-wide transition-all duration-200 flex-shrink-0"
                  :class="promoApplied 
                    ? 'bg-teal-500 text-white' 
                    : 'bg-sky-500 hover:bg-sky-600 text-white disabled:opacity-50'">
                  <span v-if="applyingCode" class="animate-pulse">···</span>
                  <span v-else-if="promoApplied" class="flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                    Applied
                  </span>
                  <span v-else>Apply</span>
                </button>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="!isFormValid || authStore.isLoading"
              class="w-full py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-300"
              :class="isFormValid && !authStore.isLoading
                ? 'bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 hover:-translate-y-0.5 active:translate-y-0 register-pulse'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'">
              <span v-if="!authStore.isLoading">Create Account</span>
              <span v-else class="flex items-center justify-center gap-2">
                <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Processing...
              </span>
            </button>

          </form>

          <!-- Login Link -->
          <p class="text-center mt-5 text-xs text-slate-400">
            Already have an account?
            <a href="#" @click.prevent="goToLogin" class="text-sky-500 font-bold hover:text-sky-600 underline underline-offset-2 transition-colors">
              Log In
            </a>
          </p>

        </div>
      </div>

      <!-- Bottom tagline -->
      <p class="text-center text-sky-400/40 text-xs mt-5">Secure & encrypted registration</p>
    </div>
  </div>
</template>

<style scoped>
.fi {
  display: inline-block;
  background-size: contain;
  background-position: 50%;
  background-repeat: no-repeat;
}
.fi-tz {
  background-image: url(/src/assets/img/flags/tz-BjLtHeil.svg);
}

.typing-animation {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid #0ea5e9;
  width: 0;
  animation: typing 3s steps(21, end) infinite, blink-caret 0.75s step-end infinite;
}
@keyframes typing {
  0%, 100% { width: 0; }
  30%, 70% { width: 160px; }
}
@keyframes blink-caret {
  from, to { border-color: transparent; }
  50% { border-color: #0ea5e9; }
}

@keyframes register-pulse {
  0%, 100% { box-shadow: 0 4px 20px rgba(14, 165, 233, 0.3); }
  50% { box-shadow: 0 4px 30px rgba(14, 165, 233, 0.6); }
}
.register-pulse {
  animation: register-pulse 2s ease-in-out infinite;
}
</style>