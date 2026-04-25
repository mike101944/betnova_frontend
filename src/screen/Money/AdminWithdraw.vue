<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/authStore'
import api from '../../services/api'

const router = useRouter();
const authStore = useAuthStore()

// Constants
const minWithdraw = 1000;
const maxWithdraw = 5000000;

// Quick amount presets
const quickAmounts = [5000, 10000, 20000, 50000, 100000, 200000, 500000];

// State
const amount = ref(null)
const phoneNumber = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const selectedProvider = ref('mpesa')
const showConfirmation = ref(false)
const isAdmin = ref(false)
const termsAccepted = ref(false)
const useOwnPhone = ref(true) // Toggle between own phone or manual entry

// Get current user balance and phone from authStore
const currentBalance = computed(() => {
    return authStore.user?.balance || 0
})

const currentPhone = computed(() => {
    // Get phone number from user data
    let phone = authStore.user?.phone_number || authStore.user?.phone || ''
    phone = '0' + phone
    return phone
})

// Debug log
console.log('Current user data:', authStore.user)
console.log('Current phone from database:', currentPhone.value)

// Check if user is admin on mount
onMounted(async () => {
    try {
        const response = await api.get('/auth/check-admin');
        isAdmin.value = response.data.isAdmin;
        
        if (!isAdmin.value) {
            router.push({ name: 'home' });
        } else {
            // Fetch latest user data including balance and phone
            await fetchUserData();
            // Set phone number from database
            if (currentPhone.value) {
                phoneNumber.value = currentPhone.value;
            }
        }
    } catch (error) {
        console.error('Admin check failed:', error);
        router.push('/');
    }
});

// Fetch latest user data
const fetchUserData = async () => {
    try {
        const response = await api.get('/auth/me');
        if (response.data) {
            authStore.user = { ...authStore.user, ...response.data };
            // Auto-fill phone number if using own phone
            if (useOwnPhone.value && response.data.phone_number) {
                phoneNumber.value = response.data.phone_number;
            }
        }
    } catch (error) {
        console.error('Failed to fetch user data:', error);
    }
};

// Toggle between own phone and manual entry
const togglePhoneSource = () => {
    useOwnPhone.value = !useOwnPhone.value;
    if (useOwnPhone.value) {
        // Use phone from database
        phoneNumber.value = currentPhone.value;
        errorMessage.value = '';
    } else {
        // Clear for manual entry
        phoneNumber.value = '';
    }
};

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

// Admin withdrawal - NO FEE
const feeAmount = computed(() => 0)

// Amount user will receive
const userReceives = computed(() => numericAmount.value)

// Check if admin has sufficient balance
const hasSufficientBalance = computed(() => {
    return currentBalance.value >= numericAmount.value;
})

// Check if form is valid
const isFormValid = computed(() => {
    return isAmountValid.value && isPhoneValid.value && termsAccepted.value && hasSufficientBalance.value;
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
        errorMessage.value = `Insufficient balance. Your balance is ${currentBalance.value.toLocaleString()} TSh`;
    } else {
        errorMessage.value = '';
    }
})

// Watch phone validation
watch(phoneNumber, () => {
    if (phoneNumber.value && !isPhoneValid.value) {
        errorMessage.value = 'Enter valid phone number (e.g., 0689902225 or 255689902225)';
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
        const response = await api.post('/auth/withdrawAdmin', { 
            amount: numericAmount.value,
            phone_number: formattedPhone
        });
        
        console.log('Admin withdraw response:', response.data);
        
        if (response.data.success || response.status === 200) {
            // UPDATE BALANCE IN AUTH STORE
            if (response.data.data && response.data.data.new_balance !== undefined) {
                if (authStore.user) {
                    authStore.user.balance = response.data.data.new_balance;
                }
                console.log('Balance updated from response:', response.data.data.new_balance);
            } else {
                await fetchUserData();
                console.log('Balance fetched from server:', currentBalance.value);
            }
            
            successMessage.value = response.data.message || ` TZS ${numericAmount.value.toLocaleString()} sent to ${formatPhoneDisplay(phoneNumber.value)}`;
            
            // Clear form but keep phone if using own phone
            amount.value = null;
            termsAccepted.value = false;
            
            if (!useOwnPhone.value) {
                phoneNumber.value = '';
            }
            
            // Auto hide success message after 5 seconds
            setTimeout(() => {
                successMessage.value = '';
            }, 5000);
        } else {
            errorMessage.value = response.data.message || 'Withdrawal failed. Please try again.';
        }
        
    } catch (error) {
        console.error('Admin withdraw failed:', error);
        
        if (error.response) {
            errorMessage.value = error.response.data.message || 'Withdrawal failed. Please try again.';
            if (error.response.data.message && error.response.data.message.includes('Insufficient')) {
                await fetchUserData();
            }
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
            
            <div class="text-center mb-3">
                <h2 class="text-white text-sm font-bold mb-2">Withdraw Funds</h2>
                <p class="text-white/90 text-xs">Withdraw money from your betting account</p>
            </div>

            

            <!-- Main Content -->
            <div class="bg-white rounded-2xl p-6 shadow-2xl">
                <!-- Balance Card -->
                <div class="bg-gradient-to-br from-sky-600 to-sky-900 rounded-xl p-2 mb-3 flex flex-col items-center justify-center text-white">
                    <div class="text-sm opacity-90">Available Balance</div>
                    <div class="text-sm font-bold">{{ currentBalance.toLocaleString() }}</div>
                </div>
               

                <!-- Success Message -->
                <transition name="fade">
                    <div v-if="successMessage" 
                         class="flex items-center gap-3 p-3 rounded-xl mb-4 text-sm bg-green-100 text-green-800 border border-green-200">
                        <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                        {{ successMessage }}
                    </div>
                </transition>

                <!-- Error Message -->
                <transition name="fade">
                    <div v-if="errorMessage" class="flex items-center gap-3 p-3 rounded-xl mb-4 text-sm bg-red-100 text-red-800 border border-red-200">
                        <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        </svg>
                        {{ errorMessage }}
                    </div>
                </transition>

                <!-- Network Selection -->
                <!-- <div class="mb-4">
                    <label class="block text-sm font-semibold text-gray-800 mb-2">Select Network</label>
                    <div class="grid grid-cols-3 gap-2">
                        <button 
                            class="py-3 bg-gray-100 border-2 rounded-xl text-sm font-medium transition-all"
                            :class="selectedProvider === 'mpesa' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-transparent'"
                            @click="selectedProvider = 'mpesa'"
                        >
                            📱 M-Pesa
                        </button>
                        <button 
                            class="py-3 bg-gray-100 border-2 rounded-xl text-sm font-medium transition-all"
                            :class="selectedProvider === 'tigo' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-transparent'"
                            @click="selectedProvider = 'tigo'"
                        >
                            📱 Tigo Pesa
                        </button>
                        <button 
                            class="py-3 bg-gray-100 border-2 rounded-xl text-sm font-medium transition-all"
                            :class="selectedProvider === 'airtel' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-transparent'"
                            @click="selectedProvider = 'airtel'"
                        >
                            📱 Airtel
                        </button>
                    </div>
                </div> -->

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

                <!-- Phone Number Input with Toggle -->
                <!-- <div class="mb-4">
                    <div class="flex justify-between items-center mb-2">
                        <label class="block text-sm font-medium text-gray-800">Recipient Phone Number</label>
                        <button 
                            @click="togglePhoneSource"
                            class="text-xs text-sky-600 hover:text-sky-700 font-medium"
                        >
                            {{ useOwnPhone ? ' Enter different number' : '📱 Use my number' }}
                        </button>
                    </div>
                    
                    <div class="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden transition-all focus-within:border-sky-500">
                        <span class="px-3 py-2 bg-gray-100 font-medium text-sm text-gray-500 border-r-2 border-gray-200">+255</span>
                        <input 
                            v-model="phoneNumber"
                            type="tel"
                            placeholder="e.g., 682409099"
                            :disabled="loading"
                            class="flex-1 px-3 py-2 border-none outline-none text-sm font-medium"
                            :class="{ 'bg-gray-50 text-gray-500': useOwnPhone }"
                            @input="formatPhoneInput"
                        />
                    </div>
                    
                    <p class="text-xs text-gray-500 mt-1">
                        <span v-if="useOwnPhone">
                             Using phone number from your account: {{ formatPhoneDisplay(currentPhone) }}
                        </span>
                        <span v-else>
                            Enter recipient phone number (e.g., 0682409099 or 682409099)
                        </span>
                    </p>
                </div> -->


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
                <div class="mb-4">
                    <label class="block text-sm font-semibold text-gray-800 mb-2">Quick Select </label>
                    <div class="grid grid-cols-3 gap-2">
                        <button 
                            v-for="quickAmount in quickAmounts" 
                            :key="quickAmount"
                            class="py-2 bg-gray-100 border-2 border-transparent rounded-xl text-xs font-medium text-gray-800 transition-all hover:bg-gray-200"
                            :class="{ 'border-sky-500 bg-sky-50 text-sky-700': Number(amount) === quickAmount }"
                            @click="setQuickAmount(quickAmount)"
                        >
                            {{ quickAmount.toLocaleString() }}
                        </button>
                    </div>
                </div>

                <!-- Amount Input -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-800 mb-2">Withdrawal Amount (TZS)</label>
                    <div class="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden transition-all focus-within:border-sky-500">
                        <span class="px-3 py-2 bg-gray-100 font-medium text-sm text-gray-500 border-r-2 border-gray-200">TSh</span>
                        <input 
                            v-model="amount"
                            type="text"
                            inputmode="numeric"
                            pattern="[0-9]*"
                            placeholder="0"
                            :disabled="loading"
                            class="flex-1 px-3 py-2 border-none outline-none text-sm font-medium"
                            @keypress="(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }"
                        >
                    </div>
                    <div class="mt-2 text-xs text-gray-500">
                        Min: {{ minWithdraw.toLocaleString() }} | Max: {{ maxWithdraw.toLocaleString() }}
                    </div>
                </div>

                <!-- Summary -->
                <div class="bg-gray-50 rounded-xl p-3 mb-4">
                    <div class="flex justify-between mb-2">
                        <span class="text-sm text-gray-600">Withdrawal Amount:</span>
                        <span class="text-sm font-bold text-gray-800">{{ numericAmount.toLocaleString() }} TSh</span>
                    </div>
                    <div class="flex justify-between mb-2">
                        <span class="text-sm text-gray-600">Processing Fee:</span>
                        <span class="text-sm text-green-600">0 TSh (Admin)</span>
                    </div>
                    <div class="flex justify-between pt-2 mt-2 border-t border-gray-200">
                        <span class="text-base font-bold text-gray-800">User Receives:</span>
                        <span class="text-base font-bold text-green-600">{{ userReceives.toLocaleString() }} TSh</span>
                    </div>
                </div>

                <!-- Terms Agreement -->
                <label class="flex items-center gap-3 mb-4 cursor-pointer">
                    <input type="checkbox" v-model="termsAccepted" class="hidden">
                    <span class="relative inline-block w-5 h-5 bg-gray-100 border-2 border-gray-200 rounded-md transition-all"
                          :class="{ 'bg-sky-500 border-sky-500': termsAccepted }">
                        <span v-if="termsAccepted" class="absolute left-[5px] top-[1px] w-[5px] h-[9px] border-solid border-white border-0 border-r-2 border-b-2 rotate-45"></span>
                    </span>
                    <span class="text-xs text-gray-700">
                        I confirm that the phone number is correct and I authorize this withdrawal
                    </span>
                </label>

                <!-- Withdraw Button -->
                <button 
                    class="w-full py-3 bg-gradient-to-br from-sky-600 to-sky-800 rounded-xl text-white text-sm font-bold transition-all mb-3 disabled:opacity-50 disabled:cursor-not-allowed hover:translate-y-[-2px] hover:shadow-xl"
                    :disabled="!isFormValid || loading"
                    @click="handleWithdraw"
                >
                    <span v-if="loading" class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span v-else> Process Withdrawal</span>
                </button>

                <!-- Info Note -->
                <div class="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                    </svg>
                    <span>Admin withdrawal - No fees. Money sent instantly.</span>
                </div>
            </div>
        </div>

        <!-- Confirmation Modal -->
        <transition name="modal">
            <div v-if="showConfirmation" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] backdrop-blur-sm" @click="cancelWithdraw">
                <div class="bg-white rounded-2xl p-5 max-w-[380px] w-[90%] shadow-2xl" @click.stop>
                    <h3 class="text-lg font-bold text-gray-800 mb-3 text-center">Confirm Admin Withdrawal</h3>
                    <div class="mb-4">
                        <div class="bg-gray-100 rounded-xl p-3">
                            <div class="flex justify-between mb-2 text-sm">
                                <span class="text-gray-600">Recipient:</span>
                                <strong class="text-gray-800">{{ formatPhoneDisplay(phoneNumber) }}</strong>
                            </div>
                            <div class="flex justify-between mb-2 text-sm">
                                <span class="text-gray-600">Network:</span>
                                <strong class="text-gray-800">{{ selectedProvider.toUpperCase() }}</strong>
                            </div>
                            <div class="flex justify-between mb-2 text-sm">
                                <span class="text-gray-600">Amount:</span>
                                <strong class="text-sky-600">{{ numericAmount.toLocaleString() }} TSh</strong>
                            </div>
                            <div class="flex justify-between pt-2 mt-2 border-t border-gray-200">
                                <span class="text-sm text-gray-600">Fee:</span>
                                <strong class="text-green-600">0 TSh (Admin)</strong>
                            </div>
                        </div>
                        <p class="text-xs text-amber-600 mt-3 text-center">
                             This will deduct TZS {{ numericAmount.toLocaleString() }} from your balance
                        </p>
                    </div>
                    <div class="flex gap-2">
                        <button class="flex-1 py-3 bg-gray-100 rounded-lg text-sm font-medium text-gray-600" @click="cancelWithdraw">Cancel</button>
                        <button class="flex-1 py-3 bg-sky-600 rounded-lg text-sm font-medium text-white" @click="confirmWithdraw">Confirm</button>
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