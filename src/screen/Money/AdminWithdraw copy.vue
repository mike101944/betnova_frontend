<script setup>
import { ref, computed, onUnmounted, watch } from 'vue';
import { useAuthStore } from '../../store/authStore'
import api from '../../services/api'

// Constants
const minWithdraw = 1000;
const maxWithdraw = 1000000;

// Quick amount presets
const quickAmounts = [5000, 10000, 20000, 50000, 100000, 200000, 500000];

// State
const authStore = useAuthStore()
const amount = ref(null)
const phoneNumber = ref('') // Phone number for withdrawal
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const selectedProvider = ref('mpesa')
const showConfirmation = ref(false)
const termsAccepted = ref(false)

// Get user phone from auth store (for display only)
const userPhone = computed(() => {
    return authStore.user?.phone_number || ''
})

// Format balance
const formatBalance = (amount) => {
  return new Intl.NumberFormat('sw-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount || 0)
}

// Format phone number for display
const formatPhoneDisplay = (phone) => {
    if (!phone) return ''
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 10 && cleaned.startsWith('0')) {
        return `${cleaned.slice(0,4)} ${cleaned.slice(4,7)} ${cleaned.slice(7,10)}`
    }
    if (cleaned.length === 12 && cleaned.startsWith('255')) {
        return `+${cleaned.slice(0,3)} ${cleaned.slice(3,6)} ${cleaned.slice(6,9)} ${cleaned.slice(9,12)}`
    }
    return phone
}

// Validate phone number
const isPhoneValid = computed(() => {
    if (!phoneNumber.value) return false
    const cleaned = phoneNumber.value.replace(/\D/g, '')
    // Accept 10-digit (starting with 0) or 12-digit (starting with 255)
    return (cleaned.length === 10 && cleaned.startsWith('0')) || 
           (cleaned.length === 12 && cleaned.startsWith('255'))
})

// Validate amount
const isAmountValid = computed(() => {
    if (!amount.value) return false;
    const numAmount = Number(amount.value);
    return numAmount >= minWithdraw && numAmount <= maxWithdraw;
})

// Get amount as number
const numericAmount = computed(() => Number(amount.value) || 0)

// Calculate fee (2% fee, minimum 500 TZS)
const feeAmount = computed(() => {
    if (numericAmount.value === 0) return 0
    const fee = Math.ceil(numericAmount.value * 0.02) // 2% fee
    return Math.max(fee, 500) // Minimum fee 500 TZS
})

// Total to be deducted (amount + fee)
const totalDeduction = computed(() => numericAmount.value + feeAmount.value)

// Amount user will receive
const userReceives = computed(() => numericAmount.value)

// Check if user has enough balance
const hasSufficientBalance = computed(() => {
    return authStore.userBalance >= totalDeduction.value
})

// Check if form is valid
const isFormValid = computed(() => {
    return isAmountValid.value && isPhoneValid.value && hasSufficientBalance.value && termsAccepted.value;
})

// Set quick amount
const setQuickAmount = (value) => {
    amount.value = value;
    errorMessage.value = '';
}

// Format phone input as user types
const formatPhoneInput = (event) => {
    let value = event.target.value.replace(/\D/g, '')
    
    if (value.startsWith('0') && value.length > 10) {
        value = value.substring(0, 11)
    }
    if (value.startsWith('255') && value.length > 12) {
        value = value.substring(0, 12)
    }
    
    phoneNumber.value = value
}

// Watch amount for real-time validation
watch(amount, (newValue) => {
    if (newValue && !isAmountValid.value) {
        if (numericAmount.value < minWithdraw) {
            errorMessage.value = `Minimum withdrawal is ${minWithdraw.toLocaleString()} TSh`;
        } else if (numericAmount.value > maxWithdraw) {
            errorMessage.value = `Maximum withdrawal is ${maxWithdraw.toLocaleString()} TSh`;
        }
    } else if (newValue && !hasSufficientBalance.value) {
        errorMessage.value = `Insufficient balance. You need ${totalDeduction.value.toLocaleString()} TSh (including ${feeAmount.value.toLocaleString()} TSh fee)`;
    } else {
        errorMessage.value = '';
    }
})

// Watch phone validation
watch(phoneNumber, () => {
    if (phoneNumber.value && !isPhoneValid.value) {
        errorMessage.value = 'Enter valid phone number (e.g., 0683307420 or 255683307420)';
    } else if (amount.value && !hasSufficientBalance.value) {
        errorMessage.value = `Insufficient balance. You need ${totalDeduction.value.toLocaleString()} TSh (including ${feeAmount.value.toLocaleString()} TSh fee)`;
    } else {
        errorMessage.value = '';
    }
})

// Handle withdraw
const handleWithdraw = async () => {
    if (!isFormValid.value) return;
    showConfirmation.value = true;
}

// Confirm withdraw
const confirmWithdraw = async () => {
    loading.value = true;
    errorMessage.value = '';
    successMessage.value = '';
    showConfirmation.value = false;
    
    // Format phone number to international format
    let formattedPhone = phoneNumber.value.replace(/\D/g, '')
    if (formattedPhone.startsWith('0')) {
        formattedPhone = '255' + formattedPhone.substring(1)
    }
    
    try {
        // Send withdraw request to backend
        const response = await api.post('/auth/withdrawAdmin', { 
            amount: numericAmount.value,
            phone: formattedPhone
        });
        
        console.log('Withdraw response:', response.data);
        
        if (response.data.success || response.status === 200) {
            // Show success message
            successMessage.value = response.data.message || `✅ Withdrawal successful! ${formatBalance(numericAmount.value)} has been sent to ${formatPhoneDisplay(phoneNumber.value)}`;
            
            // Refresh user balance
            await authStore.fetchUserBalance();
            
            // Clear form
            amount.value = null;
            phoneNumber.value = '';
            termsAccepted.value = false;
            
            // Auto hide success message after 5 seconds
            setTimeout(() => {
                successMessage.value = '';
            }, 5000);
        } else {
            errorMessage.value = response.data.message || 'Withdrawal failed. Please try again.';
        }
        
    } catch (error) {
        console.error('Withdraw failed:', error);
        
        if (error.response) {
            errorMessage.value = error.response.data.message || 'Withdrawal failed. Please try again.';
        } else if (error.request) {
            errorMessage.value = 'Network error. Please check your connection.';
        } else {
            errorMessage.value = 'An error occurred. Please try again.';
        }
    } finally {
        loading.value = false;
    }
}

// Cancel withdraw
const cancelWithdraw = () => {
    showConfirmation.value = false;
}

// Clean up
onUnmounted(() => {
    // Any cleanup if needed
});
</script>

<template>
    <div class="h-full p-2 flex items-center justify-center">
        <div class="max-w-[600px] w-full mx-auto">
            <!-- Header -->
            <div class="text-center mb-3">
                <h2 class="text-white text-sm font-bold mb-2">Withdraw Funds</h2>
                <p class="text-white/90 text-xs">Withdraw money from your betting account</p>
            </div>

            <!-- Main Content -->
            <div class="bg-white rounded-2xl p-6 shadow-2xl">
                <!-- Balance Card -->
                <div class="bg-gradient-to-br from-sky-600 to-sky-900 rounded-xl p-2 mb-3 flex flex-col items-center justify-center text-white">
                    <div class="text-sm opacity-90">Available Balance</div>
                    <div class="text-sm font-bold">{{ formatBalance(authStore.userBalance) }}</div>
                </div>

                <!-- Success Message -->
                <transition name="fade">
                    <div v-if="successMessage" 
                         class="flex items-center gap-3 p-3 rounded-xl mb-3 text-sm bg-green-100 text-green-800 border border-green-200">
                        <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                        {{ successMessage }}
                    </div>
                </transition>

                <!-- Error Message -->
                <transition name="fade">
                    <div v-if="errorMessage" class="flex items-center gap-3 p-3 rounded-xl mb-3 text-sm bg-red-100 text-red-800 border border-red-200">
                        <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        </svg>
                        {{ errorMessage }}
                    </div>
                </transition>

                <!-- Mobile Network Selection -->
                <div class="mb-3">
                    <h3 class="text-sm font-semibold text-gray-800 mb-2">Select Network</h3>
                    <div class="grid grid-cols-3 gap-2">
                        <button 
                            class="flex flex-col items-center gap-1 p-2 bg-gray-100 border-2 border-transparent rounded-xl cursor-pointer transition-all hover:bg-gray-200"
                            :class="{ 'border-teal-500 bg-white shadow-md': selectedProvider === 'mpesa' }"
                            @click="selectedProvider = 'mpesa'"
                        >
                            <span class="text-xs font-medium text-gray-800">M-Pesa</span>
                        </button>
                        <button 
                            class="flex flex-col items-center gap-1 p-2 bg-gray-100 border-2 border-transparent rounded-xl cursor-pointer transition-all hover:bg-gray-200"
                            :class="{ 'border-teal-500 bg-white shadow-md': selectedProvider === 'tigo' }"
                            @click="selectedProvider = 'tigo'"
                        >
                            <span class="text-xs font-medium text-gray-800">Tigo Pesa</span>
                        </button>
                        <button 
                            class="flex flex-col items-center gap-1 p-2 bg-gray-100 border-2 border-transparent rounded-xl cursor-pointer transition-all hover:bg-gray-200"
                            :class="{ 'border-teal-500 bg-white shadow-md': selectedProvider === 'airtel' }"
                            @click="selectedProvider = 'airtel'"
                        >
                            <span class="text-xs font-medium text-gray-800">Airtel Money</span>
                        </button>
                    </div>
                </div>

                <!-- Phone Number Input -->
                <div class="mb-3">
                    <label class="block text-sm font-medium text-gray-800 mb-2">Phone Number to Receive Money</label>
                    <div class="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden transition-all focus-within:border-teal-500">
                        <span class="px-3 py-2 bg-gray-100 font-medium text-sm text-gray-500 border-r-2 border-gray-200">
                            <select v-model="selectedProvider" class="bg-transparent border-none outline-none text-xs font-medium">
                                <option value="mpesa">+255</option>
                                <option value="tigo">+255</option>
                                <option value="airtel">+255</option>
                            </select>
                        </span>
                        <input 
                            v-model="phoneNumber"
                            type="tel"
                            placeholder="e.g., 0682409099"
                            :disabled="loading"
                            class="flex-1 px-3 py-2 border-none outline-none text-sm font-medium"
                            @input="formatPhoneInput"
                        >
                    </div>
                    <p class="text-xs text-gray-500 mt-1">
                        Enter phone number (e.g., 0682409099 or 255682409099)
                    </p>
                </div>

                <!-- Quick Amount Selector -->
                <div class="mb-3">
                    <h3 class="text-sm font-semibold text-gray-800 mb-2">Quick Select</h3>
                    <div class="grid grid-cols-3 gap-2">
                        <button 
                            v-for="quickAmount in quickAmounts" 
                            :key="quickAmount"
                            class="p-2 bg-gray-100 border-2 border-transparent rounded-xl text-xs font-medium text-gray-800 cursor-pointer transition-all hover:bg-gray-200"
                            :class="{ 'border-teal-500 bg-white text-teal-600': Number(amount) === quickAmount }"
                            @click="setQuickAmount(quickAmount)"
                        >
                            {{ quickAmount.toLocaleString() }} TSh
                        </button>
                    </div>
                </div>

                <!-- Amount Input -->
                <div class="mb-3">
                    <label class="block text-sm font-medium text-gray-800 mb-2">Withdrawal Amount</label>
                    <div class="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden transition-all focus-within:border-teal-500">
                        <span class="px-3 py-2 bg-gray-100 font-medium text-sm text-gray-500 border-r-2 border-gray-200">TSh</span>
                        <input 
                            v-model="amount"
                            type="text"
                            inputmode="numeric"
                            pattern="[0-9]*"
                            placeholder="0"
                            :disabled="loading"
                            class="flex-1 px-3 py-2 border-none outline-none text-sm font-medium"
                            @keypress="(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                    e.preventDefault();
                                }
                            }"
                        >
                    </div>
                    <div class="mt-2 text-xs text-gray-500">
                        Min: {{ minWithdraw.toLocaleString() }} | Max: {{ maxWithdraw.toLocaleString() }}
                    </div>
                </div>

                <!-- Fee and Total Summary -->
                <div class="bg-gray-50 rounded-xl p-3 mb-4">
                    <div class="flex justify-between mb-2 text-sm text-gray-500">
                        <span class="text-xs">Withdrawal Amount:</span>
                        <span class="text-xs">{{ numericAmount.toLocaleString() }} TSh</span>
                    </div>
                    <div class="flex justify-between mb-2 text-sm text-orange-600">
                        <span class="text-xs">Processing Fee (2%):</span>
                        <span class="text-xs">- {{ feeAmount.toLocaleString() }} TSh</span>
                    </div>
                    <div class="flex justify-between pt-2 mt-2 border-t border-gray-200 text-base font-bold text-gray-800">
                        <span class="text-xs">You Will Receive:</span>
                        <span class="text-sm text-green-600">{{ userReceives.toLocaleString() }} TSh</span>
                    </div>
                    <div class="flex justify-between mt-2 text-xs text-gray-500">
                        <span class="text-xs">Total Deduction:</span>
                        <span class="text-xs">{{ totalDeduction.toLocaleString() }} TSh</span>
                    </div>
                </div>

                <!-- Insufficient Balance Warning -->
                <div v-if="amount && !hasSufficientBalance && isAmountValid" 
                     class="mb-4 p-3 bg-red-50 rounded-xl border border-red-200">
                    <div class="flex items-center gap-2 text-xs text-red-700">
                        <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                        <span>Insufficient balance! You need {{ totalDeduction.toLocaleString() }} TSh (including {{ feeAmount.toLocaleString() }} TSh fee)</span>
                    </div>
                </div>

                <!-- Terms Agreement -->
                <label class="flex items-center gap-3 mb-4 cursor-pointer">
                    <input type="checkbox" v-model="termsAccepted" class="hidden" :disabled="loading">
                    <span class="relative inline-block w-5 h-5 bg-gray-100 border-2 border-gray-200 rounded-md transition-all"
                          :class="{ 'bg-teal-500 border-teal-500': termsAccepted }">
                        <span v-if="termsAccepted" class="absolute left-[5px] top-[1px] w-[5px] h-[9px] border-solid border-white border-0 border-r-2 border-b-2 rotate-45"></span>
                    </span>
                    <span class="text-xs text-gray-800">
                        I confirm that the phone number is correct and I agree to the <a href="#" class="text-teal-500 no-underline font-medium hover:underline">Terms and Conditions</a>
                    </span>
                </label>

                <!-- Withdraw Button -->
                <button 
                    class="w-full py-3 bg-gradient-to-br from-sky-600 to-sky-900 border-none rounded-xl text-white text-sm font-bold cursor-pointer transition-all mb-3 disabled:opacity-50 disabled:cursor-not-allowed hover:disabled:translate-y-0 hover:translate-y-[-2px] hover:shadow-xl"
                    :disabled="!isFormValid || loading"
                    @click="handleWithdraw"
                >
                    <span v-if="loading" class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span v-else>Withdraw Now</span>
                </button>

                <!-- Info Note -->
                <div class="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                    </svg>
                    <span>Processing fee: 2% (minimum 500 TZS). Money sent within 5 minutes.</span>
                </div>
            </div>
        </div>

        <!-- Confirmation Modal -->
        <transition name="modal">
            <div v-if="showConfirmation" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] backdrop-blur-sm" @click="cancelWithdraw">
                <div class="bg-white rounded-2xl p-5 max-w-[380px] w-[90%] max-h-[90vh] overflow-y-auto shadow-2xl" @click.stop>
                    <h3 class="text-lg font-bold text-gray-800 mb-3 text-center">Confirm Withdrawal</h3>
                    <div class="mb-4">
                        <p class="text-gray-500 mb-3 text-xs text-center">Please confirm your withdrawal details:</p>
                        <div class="bg-gray-100 rounded-xl p-3">
                            <div class="flex justify-between mb-2 text-xs text-gray-800">
                                <span>Network:</span>
                                <strong>{{ selectedProvider.toUpperCase() }}</strong>
                            </div>
                            <div class="flex justify-between mb-2 text-xs text-gray-800">
                                <span>Phone Number:</span>
                                <strong>{{ formatPhoneDisplay(phoneNumber) }}</strong>
                            </div>
                            <div class="flex justify-between mb-2 text-xs text-gray-800">
                                <span>Withdrawal Amount:</span>
                                <strong>{{ numericAmount.toLocaleString() }} TSh</strong>
                            </div>
                            <div class="flex justify-between mb-2 text-xs text-orange-600">
                                <span>Fee (2%):</span>
                                <strong>- {{ feeAmount.toLocaleString() }} TSh</strong>
                            </div>
                            <div class="flex justify-between pt-2 mt-2 border-t border-gray-200 text-sm font-bold text-green-600">
                                <span>You Will Receive:</span>
                                <strong>{{ userReceives.toLocaleString() }} TSh</strong>
                            </div>
                            <div class="flex justify-between mt-2 text-xs text-gray-500">
                                <span>Total Deduction:</span>
                                <strong>{{ totalDeduction.toLocaleString() }} TSh</strong>
                            </div>
                        </div>
                        <p class="text-xs text-gray-500 mt-3 text-center">
                            Money will be sent to {{ formatPhoneDisplay(phoneNumber) }} via {{ selectedProvider.toUpperCase() }}
                        </p>
                    </div>
                    <div class="flex gap-2">
                        <button class="flex-1 py-3 bg-gray-100 rounded-lg text-xs font-medium text-gray-500 cursor-pointer transition-all hover:bg-gray-200" @click="cancelWithdraw">Cancel</button>
                        <button class="flex-1 py-3 bg-gradient-to-br from-teal-600 to-green-700 rounded-lg text-xs font-medium text-white cursor-pointer transition-all hover:translate-y-[-1px] hover:shadow-lg" @click="confirmWithdraw">Confirm Withdraw</button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
    transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
    transform: scale(0.9);
}

.animate-spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
</style>