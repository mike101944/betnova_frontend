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
const keepLoggedIn = ref(false)

const showForgotPassword = ref(false)
const resetPhoneNumber = ref('')
const resetUserId = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const resetStep = ref(1)
const resetMessage = ref('')
const resetError = ref('')
const isResetLoading = ref(false)

const phoneError = ref('')

const isPhoneValid = computed(() => {
  return phoneNumber.value.length === 9 && /^\d+$/.test(phoneNumber.value)
})

const isPasswordValid = computed(() => {
  return password.value.length >= 4
})

const isFormValid = computed(() => {
  return isPhoneValid.value && isPasswordValid.value
})

const isResetPhoneValid = computed(() => {
  return resetPhoneNumber.value.length === 9 && /^\d+$/.test(resetPhoneNumber.value)
})

const isNewPasswordValid = computed(() => {
  return newPassword.value.length >= 4
})

const isConfirmPasswordValid = computed(() => {
  return confirmPassword.value.length >= 4 && newPassword.value === confirmPassword.value
})

const isResetFormValid = computed(() => {
  if (resetStep.value === 1) return isResetPhoneValid.value
  return isNewPasswordValid.value && isConfirmPasswordValid.value
})

const showPassword = ref(false)
const togglePassword = () => { showPassword.value = !showPassword.value }

const showResetPassword = ref(false)
const toggleResetPassword = () => { showResetPassword.value = !showResetPassword.value }

const showConfirmPassword = ref(false)
const toggleConfirmPassword = () => { showConfirmPassword.value = !showConfirmPassword.value }

const handlePhoneInput = (e) => {
  errorMessage.value = ''
  phoneError.value = ''
  let raw = e.target.value.replace(/\D/g, '')
  if (raw.startsWith('0')) {
    phoneError.value = 'Invalid format — remove the leading 0 (e.g. 683307426)'
    raw = raw.slice(1)
  }
  if (raw.length > 9) raw = raw.slice(0, 9)
  phoneNumber.value = raw
  e.target.value = raw
}

const handleResetPhoneInput = (e) => {
  resetError.value = ''
  let raw = e.target.value.replace(/\D/g, '')
  if (raw.startsWith('0')) raw = raw.slice(1)
  if (raw.length > 9) raw = raw.slice(0, 9)
  resetPhoneNumber.value = raw
  e.target.value = raw
}

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
    errorMessage.value = error.message || 'An unexpected error occurred'
  }
}

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
      resetUserId.value = result.userId
      resetError.value = ''
    } else {
      resetError.value = result.message || 'Phone number not found. Please check and try again.'
    }
  } catch (error) {
    resetError.value = error.message || 'An error occurred. Please try again.'
  } finally {
    isResetLoading.value = false
  }
}

const handleResetPassword = async () => {
  if (!isResetFormValid.value || isResetLoading.value) return
  resetError.value = ''
  resetMessage.value = ''
  isResetLoading.value = true
  try {
    const result = await authStore.resetPassword(resetUserId.value, newPassword.value, confirmPassword.value)
    if (result.success) {
      resetMessage.value = 'Password reset successfully! You can now login with your new password.'
      setTimeout(() => {
        closeForgotPassword()
        phoneNumber.value = resetPhoneNumber.value
      }, 2000)
    } else {
      resetError.value = result.message || 'Failed to reset password. Please try again.'
    }
  } catch (error) {
    resetError.value = error.message || 'An error occurred. Please try again.'
  } finally {
    isResetLoading.value = false
  }
}

const isAdminLogin = computed(() => {
  const adminPhoneNumbers = ['683307420', '696684997', '672572874', '745211365', '749003366', '690802328']
  return adminPhoneNumbers.includes(phoneNumber.value)
})

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

const openForgotPassword = () => {
  showForgotPassword.value = true
  resetStep.value = 1
  resetError.value = ''
  resetMessage.value = ''
}

const goToRegister = () => {
  router.push('/register')
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

      <!-- Card -->
      <div class="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl shadow-black/20 overflow-hidden">

        <!-- Top accent bar -->
        <div class="h-1 bg-gradient-to-r from-sky-400 via-sky-500 to-teal-400"></div>

        <div class="p-7">

          <!-- Header -->
          <div class="mb-6">
            <h1 class="text-2xl font-bold text-slate-800 mb-0.5">Welcome Back</h1>
            <span class="text-sm text-slate-400 typing-animation">Login to continue</span>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage"
            class="bg-red-50 text-red-600 border border-red-200 rounded-xl p-3 mb-5 text-sm flex items-center gap-2 justify-center">
            <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {{ errorMessage }}
          </div>

          <!-- Admin Badge -->
          <!-- <div v-if="isAdminLogin"
            class="bg-sky-50 border border-sky-200 text-sky-700 rounded-xl p-3 mb-5 text-sm flex items-center gap-2 justify-center">
            <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
            Admin account detected
          </div> -->

          <form @submit.prevent="handleLogin" class="space-y-5">

            <!-- Phone Number -->
            <div data-test-id="joinNowPhoneNumber">
              <label for="login-phoneNumber" class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Mobile Number
              </label>
              <div class="flex items-center w-full border-2 rounded-xl transition-all duration-200"
                :class="phoneNumber && !isPhoneValid
                  ? 'border-red-300 bg-red-50'
                  : phoneNumber && isPhoneValid
                    ? 'border-sky-400 bg-sky-50'
                    : 'border-slate-200 bg-slate-50 focus-within:border-sky-400 focus-within:bg-white'">
                <div class="flex items-center gap-1.5 px-3 py-2.5 border-r-2 border-inherit flex-shrink-0">
                  <span class="fi fi-tz w-5 h-4" title="TZ"></span>
                  <span class="text-slate-600 text-sm font-medium">+255</span>
                </div>
                <input
                  :value="phoneNumber"
                  id="login-phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  inputmode="numeric"
                  placeholder="683 307 426"
                  @input="handlePhoneInput"
                  :disabled="authStore.isLoading"
                  class="flex-1 min-w-0 py-2.5 px-3 bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-300" />
                <div v-if="isPhoneValid" class="pr-3">
                  <svg class="w-4 h-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div v-else-if="phoneNumber && !isPhoneValid" class="pr-3">
                  <svg class="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </div>
              </div>
              <div class="mt-1.5 ml-1 flex items-center gap-1">
                <svg v-if="phoneError" class="w-3 h-3 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p class="text-xs" :class="phoneError ? 'text-red-400' : 'text-slate-400'">
                  {{ phoneError || `${phoneNumber.length}/9 digits — e.g. 683307426` }}
                </p>
              </div>
            </div>

            <!-- Password -->
            <div>
              <label for="login-password" class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Password
              </label>
              <div class="flex items-center border-2 rounded-xl transition-all duration-200"
                :class="password && !isPasswordValid
                  ? 'border-red-300 bg-red-50'
                  : isPasswordValid && password
                    ? 'border-teal-400 bg-teal-50'
                    : 'border-slate-200 bg-slate-50 focus-within:border-sky-400 focus-within:bg-white'">
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
                  id="login-password"
                  placeholder="Enter your password"
                  autocomplete="current-password"
                  name="password"
                  @input="errorMessage = ''"
                  :disabled="authStore.isLoading"
                  class="flex-1 min-w-0 py-2.5 px-3 bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-300" />
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
              <p class="text-xs text-slate-400 mt-1.5 ml-1">Minimum 4 characters</p>
            </div>

            <!-- Keep logged in + Forgot Password -->
            <div class="flex items-center justify-between">
              <label class="flex items-center gap-2 cursor-pointer group">
                <div class="relative">
                  <input type="checkbox" v-model="keepLoggedIn" :disabled="authStore.isLoading" class="sr-only peer" />
                  <div class="w-8 h-4 bg-slate-200 rounded-full peer-checked:bg-sky-500 transition-colors duration-200"></div>
                  <div class="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform duration-200 peer-checked:translate-x-4"></div>
                </div>
                <span class="text-xs text-slate-500 group-hover:text-slate-700 transition-colors">Keep me logged in</span>
              </label>
              <!-- <a href="#" @click.prevent="openForgotPassword"
                class="text-xs font-semibold text-sky-500 hover:text-sky-700 transition-colors underline underline-offset-2">
                Forgot password?
              </a> -->
               <a href="#" 
                class="text-xs font-semibold text-sky-500 hover:text-sky-700 transition-colors underline underline-offset-2">
                Forgot password?
              </a>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="!isFormValid || authStore.isLoading"
              class="w-full py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-300"
              :class="isFormValid && !authStore.isLoading
                ? 'bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 hover:-translate-y-0.5 active:translate-y-0 login-pulse'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'">
              <span v-if="!authStore.isLoading">Login</span>
              <span v-else class="flex items-center justify-center gap-2">
                <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Processing...
              </span>
            </button>

          </form>

          <!-- Register Link -->
          <p class="text-center mt-5 text-xs text-slate-400">
            Don't have an account?
            <a href="#" @click.prevent="goToRegister" class="text-sky-500 font-bold hover:text-sky-600 underline underline-offset-2 transition-colors">
              Register
            </a>
          </p>

        </div>
      </div>

      <p class="text-center text-sky-400/40 text-xs mt-5">Secure & encrypted login</p>
    </div>

    <!-- Forgot Password Modal -->
    <Teleport to="body">
      <div v-if="showForgotPassword"
        class="fixed inset-0 bg-sky-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-3xl shadow-2xl shadow-black/30 w-full max-w-sm overflow-hidden">

          <!-- Modal top bar -->
          <div class="h-1 bg-gradient-to-r from-sky-400 via-sky-500 to-teal-400"></div>

          <div class="p-6">

            <!-- Modal header -->
            <div class="flex items-start justify-between mb-5">
              <div>
                <h2 class="text-lg font-bold text-slate-800">Reset Password</h2>
                <p class="text-xs text-slate-400 mt-0.5">
                  {{ resetStep === 1 ? 'Enter your registered phone number' : 'Create a new secure password' }}
                </p>
              </div>
              <button @click="closeForgotPassword"
                class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all flex-shrink-0">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- Step indicator -->
            <div class="flex items-center gap-2 mb-5">
              <div class="flex items-center gap-1.5">
                <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                  :class="resetStep >= 1 ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-400'">1</div>
                <span class="text-xs" :class="resetStep >= 1 ? 'text-sky-600 font-medium' : 'text-slate-400'">Verify</span>
              </div>
              <div class="flex-1 h-px" :class="resetStep >= 2 ? 'bg-sky-400' : 'bg-slate-200'"></div>
              <div class="flex items-center gap-1.5">
                <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                  :class="resetStep >= 2 ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-400'">2</div>
                <span class="text-xs" :class="resetStep >= 2 ? 'text-sky-600 font-medium' : 'text-slate-400'">New Password</span>
              </div>
            </div>

            <!-- Success Message -->
            <div v-if="resetMessage"
              class="bg-teal-50 text-teal-700 border border-teal-200 rounded-xl p-3 mb-4 text-xs flex items-center gap-2">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {{ resetMessage }}
            </div>

            <!-- Error Message -->
            <div v-if="resetError"
              class="bg-red-50 text-red-600 border border-red-200 rounded-xl p-3 mb-4 text-xs flex items-center gap-2">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {{ resetError }}
            </div>

            <!-- Step 1: Phone Number -->
            <div v-if="resetStep === 1" class="space-y-4">
              <div>
                <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                <div class="flex items-center w-full border-2 rounded-xl transition-all duration-200"
                  :class="resetPhoneNumber && !isResetPhoneValid
                    ? 'border-red-300 bg-red-50'
                    : resetPhoneNumber && isResetPhoneValid
                      ? 'border-sky-400 bg-sky-50'
                      : 'border-slate-200 bg-slate-50 focus-within:border-sky-400 focus-within:bg-white'">
                  <div class="flex items-center gap-1.5 px-3 py-2.5 border-r-2 border-inherit flex-shrink-0">
                    <span class="fi fi-tz w-5 h-4" title="TZ"></span>
                    <span class="text-slate-600 text-sm font-medium">+255</span>
                  </div>
                  <input
                    :value="resetPhoneNumber"
                    type="tel"
                    inputmode="numeric"
                    placeholder="683 307 426"
                    :disabled="isResetLoading"
                    @input="handleResetPhoneInput"
                    class="flex-1 min-w-0 py-2.5 px-3 bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-300" />
                  <div v-if="isResetPhoneValid" class="pr-3">
                    <svg class="w-4 h-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                </div>
                <p class="text-xs text-slate-400 mt-1.5 ml-1">{{ resetPhoneNumber.length }}/9 digits</p>
              </div>

              <button @click="handleForgotPasswordRequest"
                :disabled="!isResetPhoneValid || isResetLoading"
                class="w-full py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-300"
                :class="isResetPhoneValid && !isResetLoading
                  ? 'bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-md shadow-sky-500/20'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'">
                <span v-if="!isResetLoading">Continue</span>
                <span v-else class="flex items-center justify-center gap-2">
                  <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Checking...
                </span>
              </button>
            </div>

            <!-- Step 2: New Password -->
            <div v-if="resetStep === 2" class="space-y-4">

              <!-- New Password -->
              <div>
                <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">New Password</label>
                <div class="flex items-center border-2 rounded-xl transition-all duration-200"
                  :class="newPassword && !isNewPasswordValid
                    ? 'border-red-300 bg-red-50'
                    : isNewPasswordValid && newPassword
                      ? 'border-teal-400 bg-teal-50'
                      : 'border-slate-200 bg-slate-50 focus-within:border-sky-400 focus-within:bg-white'">
                  <span class="pl-3 flex items-center flex-shrink-0"
                    :class="isNewPasswordValid && newPassword ? 'text-teal-500' : newPassword && !isNewPasswordValid ? 'text-red-400' : 'text-slate-400'">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  </span>
                  <input v-model="newPassword"
                    :type="showResetPassword ? 'text' : 'password'"
                    placeholder="Enter new password"
                    :disabled="isResetLoading"
                    class="flex-1 min-w-0 py-2.5 px-3 bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-300" />
                  <button type="button" @click="toggleResetPassword"
                    class="pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors">
                    <svg v-if="!showResetPassword" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  </button>
                </div>
                <p class="text-xs text-slate-400 mt-1.5 ml-1">Minimum 4 characters</p>
              </div>

              <!-- Confirm Password -->
              <div>
                <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Confirm Password</label>
                <div class="flex items-center border-2 rounded-xl transition-all duration-200"
                  :class="confirmPassword && !isConfirmPasswordValid
                    ? 'border-red-300 bg-red-50'
                    : isConfirmPasswordValid && confirmPassword
                      ? 'border-teal-400 bg-teal-50'
                      : 'border-slate-200 bg-slate-50 focus-within:border-sky-400 focus-within:bg-white'">
                  <span class="pl-3 flex items-center flex-shrink-0"
                    :class="isConfirmPasswordValid && confirmPassword ? 'text-teal-500' : confirmPassword && !isConfirmPasswordValid ? 'text-red-400' : 'text-slate-400'">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  </span>
                  <input v-model="confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    placeholder="Confirm new password"
                    :disabled="isResetLoading"
                    class="flex-1 min-w-0 py-2.5 px-3 bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-300" />
                  <button type="button" @click="toggleConfirmPassword"
                    class="pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors">
                    <svg v-if="!showConfirmPassword" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  </button>
                </div>
                <p v-if="confirmPassword && newPassword !== confirmPassword" class="text-xs text-red-400 mt-1.5 ml-1">
                  Passwords do not match
                </p>
                <p v-else class="text-xs text-slate-400 mt-1.5 ml-1">Must match new password</p>
              </div>

              <button @click="handleResetPassword"
                :disabled="!isResetFormValid || isResetLoading"
                class="w-full py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-300"
                :class="isResetFormValid && !isResetLoading
                  ? 'bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-md shadow-sky-500/20'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'">
                <span v-if="!isResetLoading">Reset Password</span>
                <span v-else class="flex items-center justify-center gap-2">
                  <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Resetting...
                </span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </Teleport>

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
  animation: typing 3s steps(18, end) infinite, blink-caret 0.75s step-end infinite;
}
@keyframes typing {
  0%, 100% { width: 0; }
  30%, 70% { width: 130px; }
}
@keyframes blink-caret {
  from, to { border-color: transparent; }
  50% { border-color: #0ea5e9; }
}

@keyframes login-pulse {
  0%, 100% { box-shadow: 0 4px 20px rgba(14, 165, 233, 0.3); }
  50% { box-shadow: 0 4px 30px rgba(14, 165, 233, 0.6); }
}
.login-pulse {
  animation: login-pulse 2s ease-in-out infinite;
}
</style>