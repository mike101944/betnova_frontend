<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/authStore'

const router = useRouter()
const authStore = useAuthStore()

// Reactive states
const phoneNumber = ref('')
const password = ref('')
const showPassword = ref(false)
const keepLoggedIn = ref(true)
const errorMessage = ref('')

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

// Toggle password visibility
const togglePassword = () => {
  showPassword.value = !showPassword.value
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
      // Redirect to home page
      router.push('/')
    } else {
      errorMessage.value = result.message || 'Login failed. Please try again.'
    }
  } catch (error) {
    console.error('Login error:', error)
    errorMessage.value = error.message || 'An unexpected error occurred'
  }
}

// Go to register page
const goToRegister = () => {
  router.push('/join-now')
}
</script>

<template>
  <form @submit.prevent="handleLogin" class="login-form">
    <!-- Error Message Display -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <!-- Phone Number Input -->
    <div class="country-code-container" data-test-id="loginFormPhoneNumber">
      <div class="input-field phone-number-input">
        <label for="login-form-phoneNumber" class="form">
          Mobile number
          <span class="optional optional-slot"></span>
        </label>
        <div class="input-field-wrapper input-icon-undefined">
          <span class="fi fi-tz flag" title="TZ"></span>
          <span class="country-code">+255</span>
          <input v-model="phoneNumber" data-test-id="loginFormPhoneNumber" id="login-form-phoneNumber"
            :class="{ valid: isPhoneValid && phoneNumber, error: phoneNumber && !isPhoneValid }" name="phoneNumber"
            type="tel" placeholder="" @input="errorMessage = ''" :disabled="authStore.isLoading" />
        </div>
        <div class="help-text">
          Enter your phone number without the country code (e.g., 712345678).
        </div>
      </div>
    </div>

    <!-- Password Input -->
    <div class="input-field" autocomplete="new-password">
      <label for="login-form-password-input" class="form">
        Password
        <span @click="togglePassword" class="optional underline" data-test-id="handle-show-password-button">
          {{ showPassword ? 'Hide' : 'Show' }}
        </span>
      </label>
      <div class="input-field-wrapper input-icon-undefined">
        <input v-model="password" :type="showPassword ? 'text' : 'password'" id="login-form-password-input"
          :class="{ valid: isPasswordValid && password, error: password && !isPasswordValid }" placeholder=""
          autocomplete="new-password" name="password-input" @input="errorMessage = ''"
          :disabled="authStore.isLoading" />
      </div>
      <div class="help-text">
        Min. 4 Characters
      </div>
    </div>

    <!-- Keep Me Logged In Checkbox -->
    <span class="checkbox">
      <input v-model="keepLoggedIn" id="keepLoggedIn" class="checkbox-input" type="checkbox"
        data-test-id="on-input-button" :disabled="authStore.isLoading" />
      <label class="checkbox-label" for="keepLoggedIn">
        <span class="checkbox-label-extra-space">
          <span class="checkbox-input-custom with-border">
            <div v-if="keepLoggedIn" class="icon-checkbox">
              <svg class="svg-icon" style="vertical-align: text-top;">
                <use xlink:href="#icon-checkbox"></use>
              </svg>
            </div>
          </span>
        </span>
        <span class="checkbox-label-wrapper">
          <span>Keep me logged in on this device</span>
        </span>
      </label>
    </span>

    <!-- Login Button -->
    <button :disabled="!isFormValid || authStore.isLoading" type="submit" data-test-id="logInButton"
      class="button button-submit button-full">
      <span v-if="!authStore.isLoading">LOG IN</span>
      <span v-else class="loading-text">LOGGING IN...</span>
    </button>

    <!-- Forgot Password Link -->
    <a href="#" class="info underline text-mid bold" data-test-id="nav-forgot-password-link"
      @click.prevent="console.log('Forgot password clicked')">
      Forgot Password?
    </a>

    <!-- Join Now Link -->
    <span class="join-now-text">
      Don't have an account?
      <a href="#" class="bold underline" data-test-id="track-link-click-link" @click.prevent="goToRegister">
        Join Now
      </a>
    </span>
  </form>
</template>

<style scoped>
/* Your existing styles remain exactly the same */
.error-message {
  background-color: #fee;
  color: #c33;
  border: 1px solid #fcc;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 16px;
  text-align: center;
  font-size: 14px;
}

.loading-text {
  display: inline-block;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.6;
  }
}

/* All your existing styles remain exactly the same */
.login-form {
  flex-flow: column;
  display: flex;
  width: 100%;
}

.country-code-container,
.phone-number-input {
  width: 100%;
}

.input-field {
  margin-bottom: 16px;
}

.input-field label {
  width: 100%;
}

label.form {
  color: #252a2d;
  margin: 0 0 6px;
}

label {
  color: #252a2d;
  margin: 5px 0;
  display: inline-block;
}

p,
.page-error,
.notify,
label,
.info {
  font-weight: 400;
}

.button-text.medium,
.notify,
label,
.info {
  font-size: 14px;
  line-height: 18px;
}

.input-field .optional {
  float: right;
  color: #8e9398;
  font-size: 14px;
  cursor: pointer;
}

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

.phone-number-input .input-field-wrapper {
  background-color: #e6e7e2;
  border-radius: 2px 5px 5px 2px;
  align-items: center;
  width: 100%;
  display: flex;
  position: relative;
  background-color: #fff;
  border: 1px solid #e6e7e2;
}

.phone-number-input .flag {
  flex: 0 0 24px;
  width: 24px;
  height: 16px;
  margin: 0 8px 0 12px;
  z-index: 2;
}

.phone-number-input .country-code {
  color: #252a2d;
  font-size: 14px;
  font-weight: 400;
  margin-right: 4px;
  white-space: nowrap;
  z-index: 2;
}

.phone-number-input input {
  flex: 1;
  min-width: 0;
  border: none !important;
  background: transparent !important;
  padding: 7px 10px 7px 0 !important;
  font: 14px / 1.1rem Roboto-flex, Helvetica, Arial, sans-serif;
  outline: none;
}

.phone-number-input input:focus {
  border: none !important;
  box-shadow: none;
}

.phone-number-input .input-field-wrapper:has(input.valid) {
  border-color: #39ecdd;
  background-color: #f9ffe6;
}

.phone-number-input .input-field-wrapper:has(input.error) {
  border-color: #ff4444;
  background-color: #fff6f6;
}

.input-field-wrapper {
  display: flex;
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

.input-field-wrapper input {
  width: 100%;
  max-width: 100%;
  flex: 1;
  min-width: 0;
  box-sizing: border-box;
  padding: 7px 10px;
  border: 1px solid #e6e7e2;
  border-radius: 0;
  outline: 0;
  font: 14px / 1.1rem Roboto-flex, Helvetica, Arial, sans-serif;
  transition: none;
}

input[type="password"],
input[type="text"] {
  box-sizing: border-box;
  height: auto;
  line-height: 1.1rem;
}

.input-field-wrapper input.valid {
  border-color: #39ecdd;
  background-color: #f9ffe6;
}

.input-field-wrapper input.error {
  border-color: #ff4444;
  background-color: #fff6f6;
}

.input-field .help-text {
  color: #8e9398;
  margin-top: 6px;
  font-size: 12px;
  line-height: 16px;
}

.underline:not([class*=button]) {
  text-decoration: underline;
}

.checkbox {
  color: #252a2d;
  cursor: pointer;
  margin: 0 0 20px;
  font-size: 14px;
  font-weight: 400;
}

.checkbox-input {
  display: none;
}

.checkbox-label {
  align-items: flex-start;
  margin: 0;
  display: flex;
}

.checkbox-label-extra-space {
  margin: -8px 0 -8px -8px;
  padding: 8px;
}

.checkbox-input:checked+.checkbox-label .checkbox-input-custom {
  background: #39ecdd;
  border-color: #39ecdd;
}

.checkbox-input-custom.with-border {
  border: 1px solid #aaaeb0;
}

.checkbox-input-custom {
  background: #fff;
  border-radius: 2px;
  justify-content: center;
  align-items: center;
  width: 16px;
  height: 16px;
  display: flex;
}

.checkbox-input-custom .icon-checkbox {
  width: 10px;
  height: 10px;
  line-height: 18px;
}

.checkbox-input-custom .icon-checkbox svg {
  fill: #fff;
  width: 100%;
  height: 100%;
}

.checkbox-label-wrapper {
  width: 100%;
}

.button-full {
  width: 100% !important;
  max-width: none !important;
  display: block !important;
  box-sizing: border-box !important;
}

.button-submit {
  color: #252a2d;
  fill: #252a2d;
  background-color: #39ecdd;
}

.button {
  cursor: pointer;
  font-family: inherit;
  font-weight: 700;
  font-size: 14px;
  -webkit-appearance: none;
  box-sizing: border-box;
  text-align: center;
  text-transform: uppercase;
  border: 0;
  border-radius: 0;
  padding: 10px 20px;
  display: inline-block;
}

.button:disabled {
  cursor: not-allowed;
  color: #8e9398;
  fill: #8e9398;
  background: #e6e7e2;
}

.login-form .info {
  margin: 16px 0 8px;
  display: block;
}

a.underline:not([class*=button]) {
  text-decoration: underline;
}

.info {
  color: #252a2d;
  margin: 1rem 0;
}

.text-mid {
  text-align: center;
}

.bold {
  font-weight: 700;
}

.login-form .join-now-text {
  text-align: center;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  margin-top: 16px;
  display: block;
}

a {
  cursor: pointer;
  user-select: none;
  color: inherit;
  text-decoration: none;
}
</style>