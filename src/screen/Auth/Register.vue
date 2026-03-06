<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
// import { useAuthStore } from './stores/authStore'

// const router = useRouter()
// const authStore = useAuthStore()

// Registration form data
const phoneNumber = ref('')
const password = ref('')
const acceptTerms = ref(true)
const errorMessage = ref('')
const isLoading = ref(false)

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
  
  if (!isFormValid.value || isLoading.value) return
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    // Your registration logic here
    const credentials = {
      phoneNumber: phoneNumber.value,
      password: password.value
    }
    
    // Example: const result = await authStore.register(credentials)
    console.log('Registering with:', credentials)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // On success
    router.push('/login')
    
  } catch (error) {
    errorMessage.value = error.message || 'Registration failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Navigate to login
const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <!-- FORM TU - HAKUNA TABS -->
  <form @submit.prevent="handleRegister" class="join-now">
    <!-- Error Message -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <!-- Phone Number Input - FIXED WITH FLAG -->
    <div class="country-code-container" data-test-id="joinNowPhoneNumber">
      <div class="input-field phone-number-input">
        <label for="registration-form-phoneNumber" class="form">
          Mobile number
          <span class="optional optional-slot"></span>
        </label>
        <div class="input-field-wrapper input-icon-undefined">
          <span class="fi fi-tz flag" title="TZ"></span>
          <span class="country-code">+255</span>
          <input
            v-model="phoneNumber"
            data-test-id="joinNowPhoneNumber"
            id="registration-form-phoneNumber"
            :class="{ valid: isPhoneValid, error: phoneNumber && !isPhoneValid }"
            name="phoneNumber"
            type="tel"
            @input="errorMessage = ''"
          />
        </div>
        <div class="help-text">
          Enter your phone number without the country code (e.g., 123456789).
        </div>
      </div>
    </div>

    <!-- Password Input -->
    <div class="input-field" autocomplete="new-password">
      <label for="registration-form-password" class="form">
        Password
        <span 
          @click="togglePassword"
          class="optional underline"
          data-test-id="handle-show-password-button"
        >
          {{ showPassword ? 'Hide' : 'Show' }}
        </span>
      </label>
      <div class="input-field-wrapper input-icon-undefined">
        <input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          id="registration-form-password"
          :class="{ valid: isPasswordValid, error: password && !isPasswordValid }"
          placeholder=""
          autocomplete="new-password"
          name="password"
          @input="errorMessage = ''"
        />
      </div>
      <div class="help-text">
        Min. 4 Characters
      </div>
    </div>

    <!-- Submit Button and Terms -->
    <div class="column-wrapper">
      <button
        type="submit"
        class="button button-submit button-full"
        :disabled="!isFormValid || isLoading"
      >
        <span v-if="!isLoading">JOIN NOW</span>
        <span v-else class="loading-text">PROCESSING...</span>
      </button>

      <!-- Terms & Conditions -->
      <div class="terms terms-horizontal-center">
        <span class="checkbox terms-checkbox">
          <input
            v-model="acceptTerms"
            id="checkbox"
            class="checkbox-input"
            type="checkbox"
          />
          <label class="checkbox-label" for="checkbox">
            <span class="checkbox-label-extra-space">
              <span class="checkbox-input-custom with-border">
                <div v-if="acceptTerms" class="icon-checkbox">
                  <svg class="svg-icon" style="vertical-align: text-top;">
                    <use xlink:href="#icon-checkbox"></use>
                  </svg>
                </div>
              </span>
            </span>
            <span class="checkbox-label-wrapper">
              <div class="terms-text">
                <div class="rich-text-components">
                  <p style="text-align: left;">
                    <span style="color: rgb(37, 42, 45);">By creating an account you accept the </span>
                    <span style="color: rgb(0, 0, 0);">
                      <a href="/terms" target="_self" style="text-decoration: underline;">
                        Terms and Conditions
                      </a>
                    </span>
                  </p>
                </div>
              </div>
            </span>
          </label>
        </span>
      </div>
    </div>

    <!-- Login Link -->
    <span class="login-text">
      Already have an account? 
      <a 
        href="#" 
        class="underline bold"
        @click.prevent="goToLogin"
      >
        Log In
      </a>
    </span>
  </form>
</template>

<style  scoped>
/* ===== STYLES ZA FORM TU ===== */

/* Error message */
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

/* Loading state */
.loading-text {
  display: inline-block;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}

/* Form styles */
.join-now {
  width: 100%;
}

.country-code-container, .phone-number-input {
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

p, .page-error, .notify, label, .info {
  font-weight: 400;
}

.button-text.medium, .notify, label, .info {
  font-size: 14px;
}

.input-field .optional {
  float: right;
  color: #8e9398;
  font-size: 14px;
  cursor: pointer;
}

/* ===== FLAG STYLES - IMPORTANT ===== */
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

/* ===== PHONE INPUT FIX - FLAG NA CODE ZIKO VIZURI ===== */
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
  /* Flag image is applied via .fi-tz class above */
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

/* Remove default border from input */
.phone-number-input input:focus {
  border: none !important;
  box-shadow: none;
}

/* Valid/Error states - apply to wrapper instead */
.phone-number-input .input-field-wrapper:has(input.valid) {
  border-color: #39ecdd;
  background-color: #f9ffe6;
}

.phone-number-input .input-field-wrapper:has(input.error) {
  border-color: #ff4444;
  background-color: #fff6f6;
}

/* ===== END PHONE INPUT FIX ===== */

/* Input field wrapper general */
.input-field-wrapper {
  display: flex;
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

/* ===== FIX FOR PASSWORD INPUT SHRINKING ===== */
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

/* Ensure both password and text inputs have identical box model */
input[type="password"],
input[type="text"] {
  box-sizing: border-box;
  height: auto;
  line-height: 1.1rem;
}

/* Valid state - only change border color, not box model */
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

.column-wrapper {
  flex-direction: column;
  width: 100%;
  display: flex;
}

.button-full {
  width: 100% !important;
  max-width: none !important;
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
  cursor: default;
  color: #8e9398;
  fill: #8e9398;
  background: #e6e7e2;
}

.terms-horizontal-center {
  order: 2;
  margin: 16px auto 0;
  display: flex;
  justify-content: center;
  padding-top: 25px;
}

.terms {
  color: #252a2d;
  align-items: flex-start;
  margin: 0 0 16px;
  display: flex;
  font-size: 12px;
  line-height: 16px;
}

.terms-checkbox {
  margin-top: 10px;
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
  align-items: center;
  margin: 0;
  display: flex;
  justify-content: center;
  text-align: center;
}

.checkbox-label-extra-space {
  margin: -8px 0 -8px -8px;
  padding: 8px;
}

.checkbox-input:checked + .checkbox-label .checkbox-input-custom {
  background: #d9edb2;
  border-color: #d9edb2;;
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

.terms-text {
  font-size: 12px;
  line-height: 16px;
}

.rich-text-components p {
  line-height: 1.4;
}

.join-now .login-text {
  text-align: center;
  margin-top: 16px;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  display: flex;
  align-self: center;
  justify-self: center;
}

a {
  cursor: pointer;
  user-select: none;
  color: inherit;
  text-decoration: none;
}

.bold {
  font-weight: 700;
}
</style>