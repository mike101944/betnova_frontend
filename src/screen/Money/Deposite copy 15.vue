<script setup>
import { ref, computed, onUnmounted, watch } from 'vue';
import { useAuthStore } from '../../store/authStore'
import api from '../../services/api'

// Constants
const minDeposit = 135000.00;
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



// Deposit modal
const showMinimumDepositModal = ref(false);
const minimumDepositMessage = computed(() => {
    return `⚠️ The minimum deposit amount is ${minDeposit.toLocaleString()} TSh. Please enter a valid amount.`;
});
// Payment tracking (simplified for Payou redirect)
const isRedirecting = ref(false)
let redirectTimeout = null

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
        const cleaned = phone.replace(/\D/g, '')
        if (cleaned.startsWith('255') && cleaned.length === 12) {
            return `+${cleaned.slice(0,3)} ${cleaned.slice(3,6)} ${cleaned.slice(6,9)} ${cleaned.slice(9,12)}`
        }
        return phone
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
            // Badala ya errorMessage, fungua modal
            showMinimumDepositModal.value = true;
        } else if (numericAmount.value > maxDeposit) {
            errorMessage.value = `Maximum deposit is ${maxDeposit.toLocaleString()} TSh`;
        } else {
            errorMessage.value = '';
        }
    } else {
        errorMessage.value = '';
        showMinimumDepositModal.value = false;
    }
})

// Handle deposit
const handleDeposit = async () => {
    if (!isFormValid.value) return;
    showConfirmation.value = true;
}

// Clear redirect timeout
const clearRedirectCheck = () => {
    if (redirectTimeout) {
        clearTimeout(redirectTimeout);
        redirectTimeout = null;
    }
    isRedirecting.value = false;
    loading.value = false;
}

// Confirm deposit - UPDATED FOR PAYOU (REDIRECT METHOD)
const confirmDeposit = async () => {
    loading.value = true;
    errorMessage.value = '';
    successMessage.value = '';
    showConfirmation.value = false;
    
    try {
        // Send deposit request to backend (Payou)
        const response = await api.post('/auth/deposit', { 
            amount: numericAmount.value
        });
        
        // Get payment URL and order_id from response
        const paymentUrl = response.data.data?.paymentUrl || response.data.paymentUrl;
        const orderId = response.data.data?.order_id || response.data.order_id;
        
        if (!paymentUrl) {
            throw new Error('No payment URL received');
        }
        
        // ============ STORE ORDER_ID IN SESSION STORAGE ============
        if (orderId) {
            sessionStorage.setItem('last_payou_order', orderId);
            console.log('✅ Order_id stored:', orderId);
        }
        
        console.log('Deposit initiated with Payou:', response.data);
        
        // Show redirect message
        successMessage.value = '🔄 Unaielekezwa kwenye ukurasa wa malipo...';
        isRedirecting.value = true;
        
        // Redirect to Payou payment page after short delay
        redirectTimeout = setTimeout(() => {
            window.location.href = paymentUrl;
        }, 1500);
        
    } catch (error) {
        console.error('Deposit failed:', error);
        
        clearRedirectCheck();
        
        if (error.response) {
            errorMessage.value = error.response.data.message || 'Deposit failed. Please try again.';
        } else if (error.request) {
            errorMessage.value = 'Network error. Please check your connection.';
        } else {
            errorMessage.value = error.message || 'An error occurred. Please try again.';
        }
    } finally {
        loading.value = false;
    }
}

// Cancel deposit
const cancelDeposit = () => {
    showConfirmation.value = false;
}

// Refresh balance when page becomes visible again (after redirect back)
const handleVisibilityChange = () => {
    if (!document.hidden && authStore.isLoggedIn) {
        // Page became visible again - user probably returned from Payou
        console.log('Page visible again, refreshing balance...');
        authStore.fetchUserBalance();
        
        // Show a message that they can check transaction history
        successMessage.value = '✅ Ikiwa umekamilisha malipo, salio litaongezeka mara moja. Angalia historia yako.';
        setTimeout(() => {
            if (successMessage.value.includes('Ikiwa umekamilisha')) {
                successMessage.value = '';
            }
        }, 8000);
    }
}

// Listen for page visibility changes (user returning from Payou)
document.addEventListener('visibilitychange', handleVisibilityChange);

// Clean up when component is unmounted
onUnmounted(() => {
    clearRedirectCheck();
    document.removeEventListener('visibilitychange', handleVisibilityChange);
});
</script>

<template>
    <div class="h-full p-2 flex items-center justify-center">
        <div class="max-w-[600px] w-full mx-auto">
            <!-- Header -->
            <div class="text-center mb-3">
                <h2 class="text-white text-sm font-bold mb-2">Deposit Funds</h2>
                <p class="text-white/90 text-xs">Add money to your betting account</p>
            </div>

            <!-- Main Content -->
            <div class="bg-white rounded-2xl p-6 shadow-2xl">
                <!-- Balance Card -->
                <div class="bg-gradient-to-br from-sky-400 to-teal-700 rounded-xl p-2 mb-3 flex flex-col items-center justify-center text-white">
                    <div class="text-sm opacity-90">Your Balance</div>
                    <div class="text-sm font-bold">{{ formatBalance(authStore.userBalance) }}</div>
                </div>

                <!-- Success Message -->
                <transition name="fade">
                    <div v-if="successMessage" 
                         class="flex items-center gap-3 p-3 rounded-xl mb-3 text-sm"
                         :class="successMessage.includes('✅') ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-blue-100 text-blue-800 border border-blue-200'">
                        <svg v-if="successMessage.includes('✅')" class="w-5 h-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                        <svg v-else class="w-5 h-5 flex-shrink-0 animate-spin" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
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

                <!-- Payment Methods -->
                <div class="mb-3">
                    <h3 class="text-sm font-semibold text-gray-800 mb-2">Payment Method</h3>
                    <div class="grid grid-cols-4 gap-2">
                        <button 
                            class="flex flex-col items-center gap-1 p-2 bg-gray-100 border-2 border-transparent rounded-xl cursor-pointer transition-all hover:bg-gray-200"
                            :class="{ 'border-indigo-500 bg-white shadow-md': selectedPaymentMethod === 'mpesa' }"
                            @click="selectedPaymentMethod = 'mpesa'"
                        >
                            <span class="text-xs font-medium text-gray-800">M-Pesa</span>
                        </button>
                        <button 
                            class="flex flex-col items-center gap-1 p-2 bg-gray-100 border-2 border-transparent rounded-xl cursor-pointer transition-all hover:bg-gray-200"
                            :class="{ 'border-indigo-500 bg-white shadow-md': selectedPaymentMethod === 'tigo' }"
                            @click="selectedPaymentMethod = 'tigo'"
                        >
                            <span class="text-xs font-medium text-gray-800">Tigo Pesa</span>
                        </button>
                        <button 
                            class="flex flex-col items-center gap-1 p-2 bg-gray-100 border-2 border-transparent rounded-xl cursor-pointer transition-all hover:bg-gray-200"
                            :class="{ 'border-indigo-500 bg-white shadow-md': selectedPaymentMethod === 'airtel' }"
                            @click="selectedPaymentMethod = 'airtel'"
                        >
                            <span class="text-xs font-medium text-gray-800">Airtel</span>
                        </button>
                        <button 
                            class="flex flex-col items-center gap-1 p-2 bg-gray-100 border-2 border-transparent rounded-xl cursor-pointer transition-all hover:bg-gray-200"
                            :class="{ 'border-indigo-500 bg-white shadow-md': selectedPaymentMethod === 'card' }"
                            @click="selectedPaymentMethod = 'card'"
                        >
                            <svg class="w-5 h-5 text-indigo-500" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M4 6h16v2H4V6zm2-4h12v2H6V2zm16 7v10H2V9h20zm-2 2H4v6h16v-6z"/>
                            </svg>
                            <span class="text-xs font-medium text-gray-800">Card</span>
                        </button>
                    </div>
                </div>

                <!-- Phone Number Display -->
                <div class="bg-gray-100 rounded-xl p-3 mb-3">
                    <div class="text-xs text-gray-500 mb-1">Mobile Number</div>
                    <div class="text-sm font-semibold text-gray-800">{{ formattedPhone }}</div>
                    <p class="text-xs text-gray-500 mt-1">You will be redirected to choose payment method</p>
                </div>

                <!-- Quick Amount Selector -->
                <div class="mb-3">
                    <h3 class="text-sm font-semibold text-gray-800 mb-2">Quick Select</h3>
                    <div class="grid grid-cols-3 gap-2">
                        <button 
                            v-for="quickAmount in quickAmounts" 
                            :key="quickAmount"
                            class="p-2 bg-gray-100 border-2 border-transparent rounded-xl text-xs font-medium text-gray-800 cursor-pointer transition-all hover:bg-gray-200"
                            :class="{ 'border-indigo-500 bg-white text-indigo-500': Number(amount) === quickAmount }"
                            @click="setQuickAmount(quickAmount)"
                        >
                            {{ quickAmount.toLocaleString() }} TSh
                        </button>
                    </div>
                </div>

                <!-- Amount Input -->
                <div class="mb-3">
                    <label class="block text-sm font-medium text-gray-800 mb-2">Enter Amount</label>
                    <div class="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden transition-all focus-within:border-indigo-500">
                        <span class="px-3 py-2 bg-gray-100 font-medium text-sm text-gray-500 border-r-2 border-gray-200">TSh</span>
                        <input 
                            v-model="amount"
                            type="text"
                            inputmode="numeric"
                            pattern="[0-9]*"
                            placeholder="0"
                            :disabled="loading || isRedirecting"
                            class="flex-1 px-3 py-2 border-none outline-none text-sm font-medium"
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
                    <div v-if="bonusAmount > 0 && !isRedirecting && !successMessage" class="flex items-center gap-3 p-3 bg-gradient-to-br from-pink-400 to-amber-800 rounded-xl mb-4 text-white">
                        <div class="text-2xl">🎁</div>
                        <div>
                            <div class="text-xs font-medium opacity-90 mb-1">Welcome Bonus!</div>
                            <div class="text-base font-bold mb-1">+{{ bonusAmount.toLocaleString() }} TSh</div>
                            <div class="text-xs opacity-90">10% bonus on deposits over 1,000 TSh</div>
                        </div>
                    </div>
                </transition>

                <!-- Redirect Status -->
                <transition name="fade">
                    <div v-if="isRedirecting" 
                         class="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
                        <div class="flex items-center gap-3">
                            <svg class="w-5 h-5 text-blue-500 animate-spin" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                            </svg>
                            <div>
                                <div class="font-medium text-blue-800 text-sm">Unaelekezwa kwenye ukurasa wa malipo...</div>
                                <div class="text-xs text-blue-600 mt-1">
                                    • Chagua Airtel, Tigo, au Vodacom<br>
                                    • Ingiza namba yako ya simu<br>
                                    • Thibitisha kwa PIN
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>

                <!-- Total Summary -->
                <div class="bg-gray-50 rounded-xl p-3 mb-4">
                    <div class="flex justify-between mb-2 text-sm text-gray-500">
                        <span class="text-xs">Deposit Amount:</span>
                        <span class="text-xs">{{ numericAmount.toLocaleString() }} TSh</span>
                    </div>
                    <div class="flex justify-between mb-2 text-sm text-green-600 font-medium">
                        <span class="text-xs">Bonus:</span>
                        <span class="text-xs">+{{ bonusAmount.toLocaleString() }} TSh</span>
                    </div>
                    <div class="flex justify-between pt-2 mt-2 border-t border-gray-200 text-base font-bold text-gray-800">
                        <span class="text-xs">Total Credit:</span>
                        <span class="text-xs">{{ totalCredit.toLocaleString() }} TSh</span>
                    </div>
                </div>

                <!-- Terms Agreement -->
                <label class="flex items-center gap-3 mb-4 cursor-pointer">
                    <input type="checkbox" v-model="termsAccepted" class="hidden" :disabled="loading || isRedirecting">
                    <span class="relative inline-block w-5 h-5 bg-gray-100 border-2 border-gray-200 rounded-md transition-all"
                          :class="{ 'bg-indigo-500 border-indigo-500': termsAccepted }">
                        <span v-if="termsAccepted" class="absolute left-[5px] top-[1px] w-[5px] h-[9px] border-solid border-white border-0 border-r-2 border-b-2 rotate-45"></span>
                    </span>
                    <span class="text-xs text-gray-800">
                        I agree to the <a href="#" class="text-indigo-500 no-underline font-medium hover:underline">Terms and Conditions</a>
                    </span>
                </label>

                <!-- Deposit Button -->
                <button 
                    class="w-full py-3 bg-gradient-to-br from-sky-400 to-sky-800 border-none rounded-xl text-white text-sm font-bold cursor-pointer transition-all mb-3 disabled:opacity-50 disabled:cursor-not-allowed hover:disabled:translate-y-0 hover:translate-y-[-2px] hover:shadow-xl"
                    :disabled="!isFormValid || loading || isRedirecting"
                    @click="handleDeposit"
                >
                    <span v-if="loading" class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span v-else-if="isRedirecting">Redirecting...</span>
                    <span v-else>Deposit Now</span>
                </button>

                <!-- Security Note -->
                <div class="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                    </svg>
                    <span>Secure transaction via Payou. You will be redirected.</span>
                </div>
            </div>
        </div>

        <!-- Confirmation Modal -->
        <transition name="modal">
            <div v-if="showConfirmation" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] backdrop-blur-sm" @click="cancelDeposit">
                <div class="bg-white rounded-2xl p-5 max-w-[380px] w-[90%] max-h-[90vh] overflow-y-auto shadow-2xl" @click.stop>
                    <h3 class="text-lg font-bold text-gray-800 mb-3 text-center">Confirm Deposit</h3>
                    <div class="mb-4">
                        <p class="text-gray-500 mb-3 text-xs text-center">Please confirm your deposit details:</p>
                        <div class="bg-gray-100 rounded-xl p-3">
                            <div class="flex justify-between mb-2 text-xs text-gray-800">
                                <span>Amount:</span>
                                <strong>{{ numericAmount.toLocaleString() }} TSh</strong>
                            </div>
                            <div class="flex justify-between mb-2 text-xs text-gray-800">
                                <span>Bonus:</span>
                                <strong class="text-green-600">+{{ bonusAmount.toLocaleString() }} TSh</strong>
                            </div>
                            <div class="flex justify-between pt-2 mt-2 border-t border-gray-200 text-sm font-bold text-gray-800">
                                <span>Total:</span>
                                <strong>{{ totalCredit.toLocaleString() }} TSh</strong>
                            </div>
                            <div class="flex justify-between mt-2 text-xs text-gray-800">
                                <span>Payment Method:</span>
                                <strong>{{ selectedPaymentMethod.toUpperCase() }}</strong>
                            </div>
                            <div class="flex justify-between mt-2 text-xs text-gray-800">
                                <span>Phone:</span>
                                <strong>{{ formattedPhone }}</strong>
                            </div>
                        </div>
                        <p class="text-xs text-gray-500 mt-3 text-center">
                            Utakaelekezwa kwenye ukurasa wa malipo. Chagua Airtel, Tigo, au Vodacom.
                        </p>
                    </div>
                    <div class="flex gap-2">
                        <button class="flex-1 py-3 bg-gray-100 rounded-lg text-xs font-medium text-gray-500 cursor-pointer transition-all hover:bg-gray-200" @click="cancelDeposit">Cancel</button>
                        <button class="flex-1 py-3 bg-gradient-to-br from-indigo-500 to-purple-700 rounded-lg text-xs font-medium text-white cursor-pointer transition-all hover:translate-y-[-1px] hover:shadow-lg" @click="confirmDeposit">Confirm</button>
                    </div>
                </div>
            </div>
        </transition>
    </div>

    <!-- Minimum Deposit Modal (POPUP) -->
<transition name="modal">
    <div v-if="showMinimumDepositModal" 
         class="fixed inset-0 bg-black/60 flex items-center justify-center z-[1100] backdrop-blur-sm p-4"
         @click="showMinimumDepositModal = false">
        <div class="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center transform transition-all" 
             @click.stop>
            <!-- Icon -->
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>

            <!-- Title -->
            <h3 class="text-xl font-bold text-gray-800 mb-2">Insufficient Deposit Amount</h3>
            
            <!-- Message -->
            <p class="text-gray-600 text-sm mb-6">
                {{ minimumDepositMessage }}
            </p>

            <!-- Button -->
            <button @click="showMinimumDepositModal = false"
                    class="w-full py-3 bg-red-400 cursor-pointer hover:bg-red-700 text-white font-semibold rounded-xl transition duration-200">
                Understood, Adjust Amount
            </button>
        </div>
    </div>
</transition>
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

.animate-spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
</style>