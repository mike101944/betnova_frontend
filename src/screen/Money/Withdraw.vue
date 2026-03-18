<script setup>
import { ref, computed, onUnmounted, watch } from 'vue';
import { useAuthStore } from '../../store/authStore'
import api from '../../services/api'

// Constants
const minWithdraw = 5000; // Minimum withdrawal amount
const maxWithdraw = 1000000; // Maximum withdrawal amount

// Quick amount presets
const quickAmounts = [10000, 20000, 50000, 100000, 200000, 500000];

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
const isProcessing = ref(false)
const transactionStatus = ref('')
let processingTimeout = null

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
    return numAmount >= minWithdraw && numAmount <= maxWithdraw;
})

// Get amount as number
const numericAmount = computed(() => Number(amount.value) || 0)

// Check if user has sufficient balance
const hasSufficientBalance = computed(() => {
    return numericAmount.value <= (authStore.userBalance || 0)
})

// Check if form is valid
const isFormValid = computed(() => {
    return isAmountValid.value && hasSufficientBalance.value && termsAccepted.value;
})

// Set quick amount
const setQuickAmount = (value) => {
    amount.value = value;
    errorMessage.value = '';
}

// Watch amount for real-time validation
watch(amount, (newValue) => {
    if (!newValue) {
        errorMessage.value = '';
        return;
    }
    
    const numAmount = Number(newValue);
    
    if (numAmount < minWithdraw) {
        errorMessage.value = `Minimum withdrawal is ${minWithdraw.toLocaleString()} TSh`;
    } else if (numAmount > maxWithdraw) {
        errorMessage.value = `Maximum withdrawal is ${maxWithdraw.toLocaleString()} TSh`;
    } else if (numAmount > (authStore.userBalance || 0)) {
        errorMessage.value = `Insufficient balance. Your balance is ${formatBalance(authStore.userBalance)}`;
    } else {
        errorMessage.value = '';
    }
})

// Handle withdrawal
const handleWithdraw = async () => {
    if (!isFormValid.value) return;
    showConfirmation.value = true;
}

// Clear processing state
const clearProcessing = () => {
    if (processingTimeout) {
        clearTimeout(processingTimeout);
        processingTimeout = null;
    }
    isProcessing.value = false;
    loading.value = false;
    transactionStatus.value = '';
}

// Confirm withdrawal
const confirmWithdrawal = async () => {
    loading.value = true;
    errorMessage.value = '';
    successMessage.value = '';
    showConfirmation.value = false;
    
    try {
        // Send withdrawal request to backend
        const response = await api.post('/auth/withdraw', { 
            amount: numericAmount.value,
            payment_method: selectedPaymentMethod.value
        });
        
        // Show processing message
        isProcessing.value = true;
        transactionStatus.value = 'processing';
        successMessage.value = 'Withdrawal request received! Processing your transaction...';
        
        console.log('Withdrawal initiated:', response.data);
        
        // Simulate processing (in real app, you'd check status from backend)
        processingTimeout = setTimeout(() => {
            // This would be replaced with actual status check from backend
            isProcessing.value = false;
            
            // Update user balance after successful withdrawal
            authStore.fetchUserBalance();
            
            successMessage.value = `✅ Withdrawal successful! ${formatBalance(numericAmount.value)} has been sent to your ${selectedPaymentMethod.toUpperCase()} account.`;
            
            // Clear form
            amount.value = null;
            termsAccepted.value = false;
            
            // Auto hide success message after 5 seconds
            setTimeout(() => {
                successMessage.value = '';
            }, 5000);
            
        }, 5000); // Simulate 5 second processing
        
    } catch (error) {
        console.error('Withdrawal failed:', error);
        
        clearProcessing();
        
        if (error.response) {
            errorMessage.value = error.response.data.message || 'Withdrawal failed. Please try again.';
        } else if (error.request) {
            errorMessage.value = 'Network error. Please check your connection.';
        } else {
            errorMessage.value = 'An error occurred. Please try again.';
        }
    }
}

// Cancel withdrawal
const cancelWithdrawal = () => {
    showConfirmation.value = false;
}

// Clean up timeout when component is unmounted
onUnmounted(() => {
    clearProcessing();
});
</script>

<template>
    <div class="h-full p-5 flex items-center justify-center">
        <div class=" w-full ">
            

            <!-- Main Content -->
            <div class="bg-white rounded-2xl p-3 shadow-2xl">
                <!-- Balance Card -->
                <div class="bg-gradient-to-br from-sky-400 to-teal-600 rounded-xl p-2 flex flex-col items-center justify-center mb-2 text-white">
                    <div class="text-sm opacity-90 mb-2">Available Balance</div>
                    <div class="text-xs font-bold">{{ formatBalance(authStore.userBalance) }}</div>
                </div>

                <!-- Success Message -->
                <transition name="fade">
                    <div v-if="successMessage" 
                         class="flex items-center gap-3 p-4 rounded-xl mb-5 text-sm"
                         :class="successMessage.includes('successful') || successMessage.includes('✅') ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-blue-100 text-blue-800 border border-blue-200'">
                        <svg v-if="successMessage.includes('successful') || successMessage.includes('✅')" class="w-5 h-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
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
                    <h3 class=" font-semibold text-sm text-gray-800 mb-2">Withdraw To</h3>
                    <div class="grid grid-cols-4 gap-3">
                        <button 
                            class="flex flex-col items-center gap-2 p-1 bg-gray-100 border-2 border-transparent rounded-xl cursor-pointer transition-all hover:bg-gray-200"
                            :class="{ 'border-amber-500 bg-white shadow-md': selectedPaymentMethod === 'mpesa' }"
                            @click="selectedPaymentMethod = 'mpesa'"
                        >
                            <span class="text-xs font-medium text-gray-800">M-Pesa</span>
                        </button>
                        <button 
                            class="flex flex-col items-center gap-2 p-1 bg-gray-100 border-2 border-transparent rounded-xl cursor-pointer transition-all hover:bg-gray-200"
                            :class="{ 'border-amber-500 bg-white shadow-md': selectedPaymentMethod === 'tigo' }"
                            @click="selectedPaymentMethod = 'tigo'"
                        >
                            <span class="text-xs font-medium text-gray-800">Tigo Pesa</span>
                        </button>
                        <button 
                            class="flex flex-col items-center gap-2 p-1 bg-gray-100 border-2 border-transparent rounded-xl cursor-pointer transition-all hover:bg-gray-200"
                            :class="{ 'border-amber-500 bg-white shadow-md': selectedPaymentMethod === 'airtel' }"
                            @click="selectedPaymentMethod = 'airtel'"
                        >
                            <span class="text-xs font-medium text-gray-800">Airtel Money</span>
                        </button>
                        <button 
                            class="flex flex-col items-center gap-2 p-1 bg-gray-100 border-2 border-transparent rounded-xl cursor-pointer transition-all hover:bg-gray-200 opacity-50 cursor-not-allowed"
                            disabled
                        >
                            <svg class="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M4 6h16v2H4V6zm2-4h12v2H6V2zm16 7v10H2V9h20zm-2 2H4v6h16v-6z"/>
                            </svg>
                            <span class="text-xs font-medium text-gray-500">Card</span>
                        </button>
                    </div>
                    <p class="text-xs text-gray-500 mt-2">* Card withdrawal coming soon</p>
                </div>

                <!-- Phone Number Display -->
                <div class="bg-gray-100 rounded-xl p-2 mb-2">
                    <div class="text-xs text-gray-500 mb-1">Withdraw To</div>
                    <div class="text-xs font-semibold text-gray-800 mb-1">{{ formattedPhone }}</div>
                    <p class="text-xs text-gray-500">Funds will be sent to this number</p>
                </div>

                <!-- Quick Amount Selector -->
                <div class="mb-3">
                    <h3 class="text-sm font-semibold text-gray-800 mb-1">Quick Select</h3>
                    <div class="grid grid-cols-3 gap-2">
                        <button 
                            v-for="quickAmount in quickAmounts" 
                            :key="quickAmount"
                            class="p-1 bg-gray-100 border-2 border-transparent rounded-xl text-xs font-medium text-gray-800 cursor-pointer transition-all hover:bg-gray-200"
                            :class="{ 'border-amber-500 bg-white text-amber-500': Number(amount) === quickAmount }"
                            @click="setQuickAmount(quickAmount)"
                        >
                            {{ quickAmount.toLocaleString() }} TSh
                        </button>
                    </div>
                </div>

                <!-- Amount Input -->
                <div class="mb-2">
                    <label class="block text-xs font-medium text-gray-800 mb-2">Enter Amount</label>
                    <div class="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden transition-all focus-within:border-sky-500">
                        <span class="p-1 bg-gray-100 font-medium text-gray-500 border-r-2 border-gray-200 text-xs">TSh</span>
                        <input 
                            v-model="amount"
                            type="text"
                            inputmode="numeric"
                            pattern="[0-9]*"
                            placeholder="0"
                            :disabled="loading || isProcessing"
                            class="flex-1 p-1 border-none outline-none text-xs font-medium"
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

                <!-- Insufficient Balance Warning -->
                <transition name="fade">
                    <div v-if="amount && !hasSufficientBalance && isAmountValid" 
                         class="flex items-center gap-3 p-3 bg-red-50 rounded-xl mb-5 text-xs text-red-700 border border-red-100">
                        <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                        <span class="text-xs">Insufficient balance. Please enter a lower amount.</span>
                    </div>
                </transition>

                <!-- Processing Status -->
                <transition name="fade">
                    <div v-if="isProcessing" 
                         class="mb-2 p-2 bg-sky-50 rounded-xl border border-sky-200">
                        <div class="flex items-center gap-3">
                            <svg class="w-6 h-6 text-sky-500 animate-spin" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                            </svg>
                            <div>
                                <div class="font-medium text-sky-800">Processing withdrawal...</div>
                                <div class="text-xs text-sky-600 mt-1">
                                    • Funds will be sent to your {{ selectedPaymentMethod.toUpperCase() }} account<br>
                                    • This may take a few moments
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>

                <!-- Withdrawal Summary -->
                <div class="bg-gray-50 rounded-xl p-2 mb-2">
                    <div class="flex justify-between mb-2 text-sm text-gray-500">
                        <span class="text-xs">Withdrawal Amount:</span>
                        <span class="text-xs">{{ numericAmount.toLocaleString() }} TSh</span>
                    </div>
                    <div class="flex justify-between mb-2 text-sm text-gray-500">
                        <span class="text-xs">Processing Fee:</span>
                        <span class="text-sky-600">Free</span>
                    </div>
                    <div class="flex justify-between pt-2 mt-2 border-t border-gray-200 text-base font-bold text-gray-800">
                        <span class="text-xs">You'll Receive:</span>
                        <span class="text-xs">{{ numericAmount.toLocaleString() }} TSh</span>
                    </div>
                </div>

                <!-- Terms Agreement -->
                <label class="flex items-center gap-3 mb-3 cursor-pointer relative">
                    <input type="checkbox" v-model="termsAccepted" class="absolute opacity-0 h-0 w-0" :disabled="loading || isProcessing">
                    <span class="relative inline-block w-5 h-5 bg-gray-100 border-2 border-gray-200 rounded-md transition-all"
                          :class="{ 'bg-sky-500 border-sky-500': termsAccepted }">
                        <span v-if="termsAccepted" class="absolute left-[6px] top-[2px] w-[5px] h-[10px] border-solid border-white border-0 border-r-2 border-b-2 rotate-45"></span>
                    </span>
                    <span class="text-sm text-gray-800">
                        I confirm the withdrawal details are correct
                    </span>
                </label>

                <!-- Withdraw Button -->
                <button 
                    class="w-full p-4 bg-gradient-to-br from-sky-400 to-teal-600 border-none rounded-xl text-white text-base font-bold cursor-pointer transition-all mb-5 relative disabled:opacity-50 disabled:cursor-not-allowed hover:not(:disabled):translate-y-[-2px] hover:not(:disabled):shadow-xl"
                    :class="{ 'cursor-wait': loading || isProcessing }"
                    :disabled="!isFormValid || loading || isProcessing"
                    @click="handleWithdraw"
                >
                    <span v-if="loading" class="inline-block w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span v-else-if="isProcessing">Processing...</span>
                    <span v-else>Withdraw Now</span>
                </button>

                <!-- Security Note -->
                <div class="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                    </svg>
                    <span>Secure withdrawal. Funds sent to your mobile money.</span>
                </div>
            </div>
        </div>

        <!-- Confirmation Modal -->
        <transition name="modal">
            <div v-if="showConfirmation" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] backdrop-blur-sm" @click="cancelWithdrawal">
                <div class="bg-white rounded-2xl p-6 max-w-[400px] w-[90%] max-h-[90vh] overflow-y-auto shadow-2xl" @click.stop>
                    <h3 class="text-xl font-bold text-gray-800 mb-4 text-center">Confirm Withdrawal</h3>
                    <div class="mb-6">
                        <p class="text-gray-500 mb-4 text-sm">Please confirm your withdrawal details:</p>
                        <div class="bg-gray-100 rounded-xl p-4">
                            <div class="flex justify-between mb-3 text-sm text-gray-800">
                                <span>Amount:</span>
                                <strong>{{ numericAmount.toLocaleString() }} TSh</strong>
                            </div>
                            <div class="flex justify-between mb-3 text-sm text-gray-800">
                                <span>Fee:</span>
                                <strong class="text-green-600">Free</strong>
                            </div>
                            <div class="flex justify-between pt-3 mt-3 border-t border-gray-200 text-base font-bold text-gray-800">
                                <span>You'll Receive:</span>
                                <strong>{{ numericAmount.toLocaleString() }} TSh</strong>
                            </div>
                            <div class="flex justify-between mt-3 text-sm text-gray-800">
                                <span>Withdraw To:</span>
                                <strong>{{ selectedPaymentMethod.toUpperCase() }}</strong>
                            </div>
                            <div class="flex justify-between mt-3 text-sm text-gray-800">
                                <span>Phone:</span>
                                <strong>{{ formattedPhone }}</strong>
                            </div>
                        </div>
                        <p class="text-xs text-gray-500 mt-4 text-center">
                            Funds will be sent to your mobile money account
                        </p>
                    </div>
                    <div class="flex gap-3">
                        <button class="flex-1 p-3 bg-gray-100 rounded-lg text-sm font-medium text-gray-500 cursor-pointer transition-all hover:bg-gray-200" @click="cancelWithdrawal">Cancel</button>
                        <button class="flex-1 p-3 bg-gradient-to-br from-amber-400 to-orange-600 rounded-lg text-sm font-medium text-white cursor-pointer transition-all hover:translate-y-[-2px] hover:shadow-lg" @click="confirmWithdrawal">Confirm</button>
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