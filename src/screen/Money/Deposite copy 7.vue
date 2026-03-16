<script setup>
import { ref, computed, onUnmounted,watch } from 'vue';
import { useAuthStore } from '../../store/authStore'
import api from '../../services/api'

// Constants
const minDeposit = 100;
const maxDeposit = 3000000;

// Quick amount presets
const quickAmounts = [5000, 10000, 20000, 50000, 100000, 500000];

// State
const authStore = useAuthStore()
const amount = ref(null)
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const selectedPaymentMethod = ref('mpesa')
const showConfirmation = ref(false)
const termsAccepted = ref(false)

// Payment tracking
const isCheckingPayment = ref(false)
const paymentStatus = ref('')
let checkInterval = null
let orderId = ref('')

// Get user phone number from auth store
const userPhone = computed(() => {
    return authStore.user?.phone_number || 'Not available'
})

// Format balance
const formatBalance = (amount) => {
  return new Intl.NumberFormat('sw-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount || 0)
}

// Format phone number for display
const formattedPhone = computed(() => {
    const phone = userPhone.value
    if (phone && phone !== 'Not available') {
        // Format: +255 XXX XXX XXX
        return phone.replace(/(\d{3})(\d{3})(\d{3})/, '+255 $1 $2 $3')
    }
    return phone
})

// Validate amount
const isAmountValid = computed(() => {
    if (!amount.value) return false;
    const numAmount = Number(amount.value);
    return numAmount >= minDeposit && numAmount <= maxDeposit;
})

// Get amount as number
const numericAmount = computed(() => Number(amount.value) || 0)

// Calculate bonus (10% bonus on deposits over 1000)
const bonusAmount = computed(() => {
    if (numericAmount.value >= 1000) {
        return Math.floor(numericAmount.value * 0.1);
    }
    return 0;
})

// Total to be credited
const totalCredit = computed(() => numericAmount.value + bonusAmount.value)

// Check if form is valid
const isFormValid = computed(() => {
    return isAmountValid.value && termsAccepted.value;
})

// Set quick amount
const setQuickAmount = (value) => {
    amount.value = value;
    errorMessage.value = '';
}

// Watch amount for real-time validation
watch(amount, (newValue) => {
    if (newValue && !isAmountValid.value) {
        if (numericAmount.value < minDeposit) {
            errorMessage.value = `Minimum deposit is ${minDeposit.toLocaleString()} TSh`;
        } else if (numericAmount.value > maxDeposit) {
            errorMessage.value = `Maximum deposit is ${maxDeposit.toLocaleString()} TSh`;
        }
    } else {
        errorMessage.value = '';
    }
})

// Handle deposit
const handleDeposit = async () => {
    if (!isFormValid.value) return;
    showConfirmation.value = true;
}

// Clear payment checking
const clearPaymentCheck = () => {
    if (checkInterval) {
        clearInterval(checkInterval);
        checkInterval = null;
    }
    isCheckingPayment.value = false;
    loading.value = false;
}

// Confirm deposit
const confirmDeposit = async () => {
    loading.value = true;
    errorMessage.value = '';
    successMessage.value = '';
    showConfirmation.value = false;
    
    try {
        // Send deposit request to backend
        const response = await api.post('/auth/deposit', { 
            amount: numericAmount.value
        });
        
        // Get order ID from response
        orderId.value = response.data.data.order_id;
        
        // Show payment initiation message
        successMessage.value = 'Payment initiated! Please check your phone and enter your PIN.';
        
        // Start payment checking
        isCheckingPayment.value = true;
        paymentStatus.value = 'Waiting for payment confirmation...';
        
        console.log('Deposit initiated:', response.data);
        
        // Start checking payment status every 3 seconds
        let checkCount = 0;
        const maxChecks = 40; // 40 * 3 seconds = 2 minutes
        
        checkInterval = setInterval(async () => {
            checkCount++;
            paymentStatus.value = `Waiting for payment confirmation... (${checkCount * 3}s)`;
            
            try {
                const statusRes = await api.get(`/auth/payment-status/${orderId.value}`);
                
                console.log('Status check:', statusRes.data);
                
                if (statusRes.data.data.status === 'completed') {
                    clearPaymentCheck();
                    
                    // Payment completed - refresh balance
                    await authStore.fetchUserBalance();
                    
                    // Show success message with amount
                    const depositedAmount = numericAmount.value;
                    const bonus = bonusAmount.value;
                    
                    if (bonus > 0) {
                        successMessage.value = `🎉 Deposit successful! ${formatBalance(depositedAmount)} added + ${formatBalance(bonus)} bonus!`;
                    } else {
                        successMessage.value = `✅ Deposit successful! ${formatBalance(depositedAmount)} has been added to your account.`;
                    }
                    
                    // Clear form
                    amount.value = null;
                    termsAccepted.value = false;
                    
                    // Auto hide success message after 5 seconds
                    setTimeout(() => {
                        successMessage.value = '';
                    }, 5000);
                    
                } else if (statusRes.data.data.status === 'failed') {
                    clearPaymentCheck();
                    errorMessage.value = '❌ Payment failed. Please try again.';
                }
                
                // Stop checking after maxChecks
                if (checkCount >= maxChecks) {
                    clearPaymentCheck();
                    errorMessage.value = '⏰ Payment confirmation timeout. Please check your transaction in history or contact support.';
                }
                
            } catch (statusError) {
                console.error('Status check error:', statusError);
                // Don't stop checking on error, just continue
            }
        }, 3000);
        
    } catch (error) {
        console.error('Deposit failed:', error);
        
        clearPaymentCheck();
        
        if (error.response) {
            errorMessage.value = error.response.data.message || 'Deposit failed. Please try again.';
        } else if (error.request) {
            errorMessage.value = 'Network error. Please check your connection.';
        } else {
            errorMessage.value = 'An error occurred. Please try again.';
        }
    }
}

// Cancel deposit
const cancelDeposit = () => {
    showConfirmation.value = false;
}

// Clean up interval when component is unmounted
onUnmounted(() => {
    clearPaymentCheck();
});
</script>

<template>
    <div class="h-full p-5 flex items-center justify-center">
        <div class="max-w-[600px] w-full mx-auto">
            <!-- Header -->
            <div class="text-center mb-6">
                <h2 class="text-white text-3xl font-bold mb-2">Deposit Funds</h2>
                <p class="text-white/90 text-sm">Add money to your betting account</p>
            </div>

            <!-- Main Content -->
            <div class="bg-white rounded-2xl p-6 shadow-2xl">
                <!-- Balance Card -->
                <div class="bg-gradient-to-br from-sky-400 to-sky-700 rounded-xl p-5 mb-6 text-white">
                    <div class="text-sm opacity-90 mb-2">Your Balance</div>
                    <div class="text-3xl font-bold">{{ formatBalance(authStore.userBalance) }}</div>
                </div>

                <!-- Success Message -->
                <transition name="fade">
                    <div v-if="successMessage" 
                         class="flex items-center gap-3 p-4 rounded-xl mb-5 text-sm"
                         :class="successMessage.includes('successful') ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-blue-100 text-blue-800 border border-blue-200'">
                        <svg v-if="successMessage.includes('successful')" class="w-5 h-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                        <svg v-else class="w-5 h-5 flex-shrink-0 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                        </svg>
                        {{ successMessage }}
                    </div>
                </transition>

                <!-- Error Message -->
                <transition name="fade">
                    <div v-if="errorMessage" class="flex items-center gap-3 p-4 rounded-xl mb-5 text-sm bg-red-100 text-red-800 border border-red-200">
                        <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        </svg>
                        {{ errorMessage }}
                    </div>
                </transition>

                <!-- Payment Methods -->
                <div class="mb-6">
                    <h3 class="text-base font-semibold text-gray-800 mb-3">Payment Method</h3>
                    <div class="grid grid-cols-4 gap-3">
                        <button 
                            class="flex flex-col items-center gap-2 p-3 bg-gray-100 border-2 border-transparent rounded-xl cursor-pointer transition-all hover:bg-gray-200"
                            :class="{ 'border-indigo-500 bg-white shadow-md': selectedPaymentMethod === 'mpesa' }"
                            @click="selectedPaymentMethod = 'mpesa'"
                        >
                            <span class="text-xs font-medium text-gray-800">M-Pesa</span>
                        </button>
                        <button 
                            class="flex flex-col items-center gap-2 p-3 bg-gray-100 border-2 border-transparent rounded-xl cursor-pointer transition-all hover:bg-gray-200"
                            :class="{ 'border-indigo-500 bg-white shadow-md': selectedPaymentMethod === 'tigo' }"
                            @click="selectedPaymentMethod = 'tigo'"
                        >
                            <span class="text-xs font-medium text-gray-800">Tigo Pesa</span>
                        </button>
                        <button 
                            class="flex flex-col items-center gap-2 p-3 bg-gray-100 border-2 border-transparent rounded-xl cursor-pointer transition-all hover:bg-gray-200"
                            :class="{ 'border-indigo-500 bg-white shadow-md': selectedPaymentMethod === 'airtel' }"
                            @click="selectedPaymentMethod = 'airtel'"
                        >
                            <span class="text-xs font-medium text-gray-800">Airtel Money</span>
                        </button>
                        <button 
                            class="flex flex-col items-center gap-2 p-3 bg-gray-100 border-2 border-transparent rounded-xl cursor-pointer transition-all hover:bg-gray-200"
                            :class="{ 'border-indigo-500 bg-white shadow-md': selectedPaymentMethod === 'card' }"
                            @click="selectedPaymentMethod = 'card'"
                        >
                            <svg class="w-8 h-8 text-indigo-500" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M4 6h16v2H4V6zm2-4h12v2H6V2zm16 7v10H2V9h20zm-2 2H4v6h16v-6z"/>
                            </svg>
                            <span class="text-xs font-medium text-gray-800">Card</span>
                        </button>
                    </div>
                </div>

                <!-- Phone Number Display -->
                <div class="bg-gray-100 rounded-xl p-4 mb-6">
                    <div class="text-xs text-gray-500 mb-1">Mobile Number</div>
                    <div class="text-lg font-semibold text-gray-800 mb-1">{{ formattedPhone }}</div>
                    <p class="text-xs text-gray-500">You will receive a prompt on this number</p>
                </div>

                <!-- Quick Amount Selector -->
                <div class="mb-6">
                    <h3 class="text-base font-semibold text-gray-800 mb-3">Quick Select</h3>
                    <div class="grid grid-cols-3 gap-2">
                        <button 
                            v-for="quickAmount in quickAmounts" 
                            :key="quickAmount"
                            class="p-3 bg-gray-100 border-2 border-transparent rounded-xl text-sm font-medium text-gray-800 cursor-pointer transition-all hover:bg-gray-200"
                            :class="{ 'border-indigo-500 bg-white text-indigo-500': Number(amount) === quickAmount }"
                            @click="setQuickAmount(quickAmount)"
                        >
                            {{ quickAmount.toLocaleString() }} TSh
                        </button>
                    </div>
                </div>

                <!-- Amount Input -->
                <div class="mb-5">
                    <label class="block text-sm font-medium text-gray-800 mb-2">Enter Amount</label>
                    <div class="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden transition-all focus-within:border-indigo-500">
                        <span class="p-3 bg-gray-100 font-medium text-gray-500 border-r-2 border-gray-200">TSh</span>
                        <input 
                            v-model="amount"
                            type="text"
                            inputmode="numeric"
                            pattern="[0-9]*"
                            placeholder="0"
                            :disabled="loading || isCheckingPayment"
                            class="flex-1 p-3 border-none outline-none text-base font-medium"
                            @keypress="(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                    e.preventDefault();
                                }
                            }"
                        >
                    </div>
                    <div class="mt-2 text-xs text-gray-500">
                        Min: {{ minDeposit.toLocaleString() }} | Max: {{ maxDeposit.toLocaleString() }}
                    </div>
                </div>

                <!-- Bonus Display -->
                <transition name="slide">
                    <div v-if="bonusAmount > 0 && !isCheckingPayment" class="flex items-center gap-4 p-4 bg-gradient-to-br from-pink-400 to-amber-800 rounded-xl mb-5 text-white">
                        <div class="text-3xl">🎁</div>
                        <div>
                            <div class="text-sm font-medium opacity-90 mb-1">Welcome Bonus!</div>
                            <div class="text-xl font-bold mb-1">+{{ bonusAmount.toLocaleString() }} TSh</div>
                            <div class="text-xs opacity-90">10% bonus on deposits over 1,000 TSh</div>
                        </div>
                    </div>
                </transition>

                <!-- Payment Status -->
                <transition name="fade">
                    <div v-if="isCheckingPayment" 
                         class="mb-5 p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <div class="flex items-center gap-3">
                            <svg class="w-6 h-6 text-blue-500 animate-spin" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                            </svg>
                            <div>
                                <div class="font-medium text-blue-800">{{ paymentStatus }}</div>
                                <div class="text-xs text-blue-600 mt-1">
                                    • Enter your PIN on the phone when prompted<br>
                                    • Do not close this page
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>

                <!-- Total Summary -->
                <div class="bg-gray-50 rounded-xl p-4 mb-5">
                    <div class="flex justify-between mb-2 text-sm text-gray-500">
                        <span>Deposit Amount:</span>
                        <span>{{ numericAmount.toLocaleString() }} TSh</span>
                    </div>
                    <div class="flex justify-between mb-2 text-sm text-green-600 font-medium">
                        <span>Bonus:</span>
                        <span>+{{ bonusAmount.toLocaleString() }} TSh</span>
                    </div>
                    <div class="flex justify-between pt-2 mt-2 border-t border-gray-200 text-base font-bold text-gray-800">
                        <span>Total Credit:</span>
                        <span>{{ totalCredit.toLocaleString() }} TSh</span>
                    </div>
                </div>

                <!-- Terms Agreement -->
                <label class="flex items-center gap-3 mb-5 cursor-pointer relative">
                    <input type="checkbox" v-model="termsAccepted" class="absolute opacity-0 h-0 w-0" :disabled="loading || isCheckingPayment">
                    <span class="relative inline-block w-5 h-5 bg-gray-100 border-2 border-gray-200 rounded-md transition-all"
                          :class="{ 'bg-indigo-500 border-indigo-500': termsAccepted }">
                        <span v-if="termsAccepted" class="absolute left-[6px] top-[2px] w-[5px] h-[10px] border-solid border-white border-0 border-r-2 border-b-2 rotate-45"></span>
                    </span>
                    <span class="text-sm text-gray-800">
                        I agree to the <a href="#" class="text-indigo-500 no-underline font-medium hover:underline">Terms and Conditions</a>
                    </span>
                </label>

                <!-- Deposit Button -->
                <button 
                    class="w-full p-4 bg-gradient-to-br from-sky-400 to-sky-800 border-none rounded-xl text-white text-base font-bold cursor-pointer transition-all mb-5 relative disabled:opacity-50 disabled:cursor-not-allowed hover:not(:disabled):translate-y-[-2px] hover:not(:disabled):shadow-xl"
                    :class="{ 'cursor-wait': loading || isCheckingPayment }"
                    :disabled="!isFormValid || loading || isCheckingPayment"
                    @click="handleDeposit"
                >
                    <span v-if="loading" class="inline-block w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span v-else-if="isCheckingPayment">Processing Payment...</span>
                    <span v-else>Deposit Now</span>
                </button>

                <!-- Security Note -->
                <div class="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                    </svg>
                    <span>Secure transaction. Your information is encrypted.</span>
                </div>
            </div>
        </div>

        <!-- Confirmation Modal -->
        <transition name="modal">
            <div v-if="showConfirmation" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] backdrop-blur-sm" @click="cancelDeposit">
                <div class="bg-white rounded-2xl p-6 max-w-[400px] w-[90%] max-h-[90vh] overflow-y-auto shadow-2xl" @click.stop>
                    <h3 class="text-xl font-bold text-gray-800 mb-4 text-center">Confirm Deposit</h3>
                    <div class="mb-6">
                        <p class="text-gray-500 mb-4 text-sm">Please confirm your deposit details:</p>
                        <div class="bg-gray-100 rounded-xl p-4">
                            <div class="flex justify-between mb-3 text-sm text-gray-800">
                                <span>Amount:</span>
                                <strong>{{ numericAmount.toLocaleString() }} TSh</strong>
                            </div>
                            <div class="flex justify-between mb-3 text-sm text-gray-800">
                                <span>Bonus:</span>
                                <strong class="text-green-600">+{{ bonusAmount.toLocaleString() }} TSh</strong>
                            </div>
                            <div class="flex justify-between pt-3 mt-3 border-t border-gray-200 text-base font-bold text-gray-800">
                                <span>Total:</span>
                                <strong>{{ totalCredit.toLocaleString() }} TSh</strong>
                            </div>
                            <div class="flex justify-between mt-3 text-sm text-gray-800">
                                <span>Payment Method:</span>
                                <strong>{{ selectedPaymentMethod.toUpperCase() }}</strong>
                            </div>
                            <div class="flex justify-between mt-3 text-sm text-gray-800">
                                <span>Phone:</span>
                                <strong>{{ formattedPhone }}</strong>
                            </div>
                        </div>
                        <p class="text-xs text-gray-500 mt-4 text-center">
                            You will receive a payment prompt on your phone
                        </p>
                    </div>
                    <div class="flex gap-3">
                        <button class="flex-1 p-3 bg-gray-100 rounded-lg text-sm font-medium text-gray-500 cursor-pointer transition-all hover:bg-gray-200" @click="cancelDeposit">Cancel</button>
                        <button class="flex-1 p-3 bg-gradient-to-br from-indigo-500 to-purple-700 rounded-lg text-sm font-medium text-white cursor-pointer transition-all hover:translate-y-[-2px] hover:shadow-lg" @click="confirmDeposit">Confirm</button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<style scoped>
/* Animations */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
    transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
    opacity: 0;
    transform: translateY(-20px);
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

/* Custom animations */
@keyframes spin {
    to { transform: rotate(360deg); }
}

.animate-spin {
    animation: spin 1s linear infinite;
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: .5;
    }
}
</style>