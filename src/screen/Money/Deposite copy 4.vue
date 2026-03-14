<script setup>
import { ref, computed, watch } from 'vue';
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

// Calculate bonus (example: 10% bonus on deposits over 1000)
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
    
    // Show confirmation dialog
    showConfirmation.value = true;
}

// Confirm deposit
const confirmDeposit = async () => {
    loading.value = true;
    errorMessage.value = '';
    successMessage.value = '';
    showConfirmation.value = false;
    
    try {
        const response = await api.post('/auth/deposit', { 
            amount: numericAmount.value,
            paymentMethod: selectedPaymentMethod.value,
            phoneNumber: userPhone.value
        });
        
        // Refresh balance after successful deposit
        await authStore.fetchUserBalance();
        
        // Show success message
        successMessage.value = 'Deposit successful! Your account has been credited.';
        
        // Clear amount after success
        amount.value = null;
        termsAccepted.value = false;
        
        // Log success (optional)
        console.log('Deposit successful:', response.data);
        
    } catch (error) {
        console.error('Deposit failed:', error);
        
        // Handle different error responses
        if (error.response) {
            errorMessage.value = error.response.data.message || 'Deposit failed. Please try again.';
        } else if (error.request) {
            errorMessage.value = 'Network error. Please check your connection.';
        } else {
            errorMessage.value = 'An error occurred. Please try again.';
        }
    } finally {
        loading.value = false;
        
        // Auto-hide success message after 5 seconds
        if (successMessage.value) {
            setTimeout(() => {
                successMessage.value = '';
            }, 5000);
        }
    }
}

// Cancel deposit
const cancelDeposit = () => {
    showConfirmation.value = false;
}
</script>

<template>
    <div class="deposit-page">
        <div class="deposit-container">
            <!-- Header -->
            <div class="deposit-header">
                <h2>Deposit Funds</h2>
                <p class="subtitle">Add money to your betting account</p>
            </div>

            <!-- Main Content -->
            <div class="deposit-content">
                <!-- Balance Card -->
                <div class="balance-card">
                    <div class="balance-label">Your Balance</div>
                    <div class="balance-amount">{{ formatBalance(authStore.userBalance) }}</div>
                    <!-- <span class="text-white text-[12px]">{{ formatBalance(authStore.userBalance) }}</span>  -->
                </div>

                <!-- Success Message -->
                <transition name="fade">
                    <div v-if="successMessage" class="message success">
                        <svg class="message-icon" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                        {{ successMessage }}
                    </div>
                </transition>

                <!-- Error Message -->
                <transition name="fade">
                    <div v-if="errorMessage" class="message error">
                        <svg class="message-icon" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        </svg>
                        {{ errorMessage }}
                    </div>
                </transition>

                <!-- Payment Methods -->
                <div class="payment-methods">
                    <h3>Payment Method</h3>
                    <div class="method-grid">
                        <button 
                            class="method-card" 
                            :class="{ active: selectedPaymentMethod === 'mpesa' }"
                            @click="selectedPaymentMethod = 'mpesa'"
                        >
                            <span>M-Pesa</span>
                        </button>
                        <button 
                            class="method-card" 
                            :class="{ active: selectedPaymentMethod === 'tigo' }"
                            @click="selectedPaymentMethod = 'tigo'"
                        >
                            <span>Tigo Pesa</span>
                        </button>
                        <button 
                            class="method-card" 
                            :class="{ active: selectedPaymentMethod === 'airtel' }"
                            @click="selectedPaymentMethod = 'airtel'"
                        >
                            <span>Airtel Money</span>
                        </button>
                        <button 
                            class="method-card" 
                            :class="{ active: selectedPaymentMethod === 'card' }"
                            @click="selectedPaymentMethod = 'card'"
                        >
                            <svg class="method-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M4 6h16v2H4V6zm2-4h12v2H6V2zm16 7v10H2V9h20zm-2 2H4v6h16v-6z"/>
                            </svg>
                            <span>Card</span>
                        </button>
                    </div>
                </div>

                <!-- Phone Number Display -->
                <div class="phone-section">
                    <div class="phone-label">Mobile Number</div>
                    <div class="phone-number">{{ formattedPhone }}</div>
                    <p class="phone-note">You will receive a prompt on this number</p>
                </div>

                <!-- Quick Amount Selector -->
                <div class="quick-amounts">
                    <h3>Quick Select</h3>
                    <div class="amount-grid">
                        <button 
                            v-for="quickAmount in quickAmounts" 
                            :key="quickAmount"
                            class="amount-chip"
                            :class="{ active: Number(amount) === quickAmount }"
                            @click="setQuickAmount(quickAmount)"
                        >
                            {{ quickAmount.toLocaleString() }} TSh
                        </button>
                    </div>
                </div>

                <!-- Amount Input -->
                <div class="amount-section">
                    <label class="amount-label">Enter Amount</label>
                    <div class="amount-input-wrapper">
                        <span class="currency">TSh</span>
                        <input 
                            v-model="amount"
                            type="text"
                            inputmode="numeric"
                            pattern="[0-9]*"
                            placeholder="0"
                            :disabled="loading"
                            @keypress="(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                    e.preventDefault();
                                }
                            }"
                        >
                    </div>
                    <div class="amount-limits">
                        Min: {{ minDeposit.toLocaleString() }} | Max: {{ maxDeposit.toLocaleString() }}
                    </div>
                </div>

                <!-- Bonus Display -->
                <transition name="slide">
                    <div v-if="bonusAmount > 0" class="bonus-card">
                        <div class="bonus-icon">🎁</div>
                        <div class="bonus-details">
                            <div class="bonus-title">Welcome Bonus!</div>
                            <div class="bonus-amount">+{{ bonusAmount.toLocaleString() }} TSh</div>
                            <div class="bonus-text">10% bonus on deposits over 1,000 TSh</div>
                        </div>
                    </div>
                </transition>

                <!-- Total Summary -->
                <div class="total-summary">
                    <div class="summary-row">
                        <span>Deposit Amount:</span>
                        <span>{{ numericAmount.toLocaleString() }} TSh</span>
                    </div>
                    <div class="summary-row bonus">
                        <span>Bonus:</span>
                        <span>+{{ bonusAmount.toLocaleString() }} TSh</span>
                    </div>
                    <div class="summary-row total">
                        <span>Total Credit:</span>
                        <span>{{ totalCredit.toLocaleString() }} TSh</span>
                    </div>
                </div>

                <!-- Terms Agreement -->
                <label class="terms-checkbox">
                    <input type="checkbox" v-model="termsAccepted">
                    <span class="checkmark"></span>
                    <span class="terms-text">
                        I agree to the <a href="#" class="terms-link">Terms and Conditions</a>
                    </span>
                </label>

                <!-- Deposit Button -->
                <button 
                    class="deposit-button"
                    :class="{ loading }"
                    :disabled="!isFormValid || loading"
                    @click="handleDeposit"
                >
                    <span v-if="loading" class="loader"></span>
                    <span v-else>Deposit Now</span>
                </button>

                <!-- Security Note -->
                <div class="security-note">
                    <svg class="lock-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                    </svg>
                    <span>Secure transaction. Your information is encrypted.</span>
                </div>
            </div>
        </div>

        <!-- Confirmation Modal -->
        <transition name="modal">
            <div v-if="showConfirmation" class="modal-overlay" @click="cancelDeposit">
                <div class="modal-content" @click.stop>
                    <h3 class="modal-title">Confirm Deposit</h3>
                    <div class="modal-body">
                        <p>Please confirm your deposit details:</p>
                        <div class="confirm-details">
                            <div class="confirm-row">
                                <span>Amount:</span>
                                <strong>{{ numericAmount.toLocaleString() }} TSh</strong>
                            </div>
                            <div class="confirm-row">
                                <span>Bonus:</span>
                                <strong class="bonus">+{{ bonusAmount.toLocaleString() }} TSh</strong>
                            </div>
                            <div class="confirm-row total">
                                <span>Total:</span>
                                <strong>{{ totalCredit.toLocaleString() }} TSh</strong>
                            </div>
                            <div class="confirm-row">
                                <span>Payment Method:</span>
                                <strong>{{ selectedPaymentMethod.toUpperCase() }}</strong>
                            </div>
                            <div class="confirm-row">
                                <span>Phone:</span>
                                <strong>{{ formattedPhone }}</strong>
                            </div>
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button class="modal-btn cancel" @click="cancelDeposit">Cancel</button>
                        <button class="modal-btn confirm" @click="confirmDeposit">Confirm</button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<style scoped>
.deposit-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.deposit-container {
    max-width: 600px;
    width: 100%;
    margin: 0 auto;
}

.deposit-header {
    text-align: center;
    margin-bottom: 24px;
}

.deposit-header h2 {
    color: white;
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 8px;
}

.deposit-header .subtitle {
    color: rgba(255, 255, 255, 0.9);
    font-size: 14px;
}

.deposit-content {
    background: white;
    border-radius: 24px;
    padding: 24px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.balance-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 24px;
    color: white;
}

.balance-label {
    font-size: 14px;
    opacity: 0.9;
    margin-bottom: 8px;
}

.balance-amount {
    font-size: 32px;
    font-weight: 700;
}

.message {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border-radius: 12px;
    margin-bottom: 20px;
    font-size: 14px;
}

.message.success {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.message.error {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}

.message-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
}

.payment-methods {
    margin-bottom: 24px;
}

.payment-methods h3 {
    font-size: 16px;
    font-weight: 600;
    color: #252a2d;
    margin-bottom: 12px;
}

.method-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
}

.method-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 12px 8px;
    background: #f4f5f0;
    border: 2px solid transparent;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.method-card:hover {
    background: #e6e7e2;
}

.method-card.active {
    border-color: #667eea;
    background: white;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.method-logo {
    width: 32px;
    height: 32px;
    object-fit: contain;
}

.method-icon {
    width: 32px;
    height: 32px;
    color: #667eea;
}

.method-card span {
    font-size: 12px;
    font-weight: 500;
    color: #252a2d;
}

.phone-section {
    background: #f4f5f0;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 24px;
}

.phone-label {
    font-size: 12px;
    color: #8e9398;
    margin-bottom: 4px;
}

.phone-number {
    font-size: 18px;
    font-weight: 600;
    color: #252a2d;
    margin-bottom: 4px;
}

.phone-note {
    font-size: 12px;
    color: #8e9398;
}

.quick-amounts {
    margin-bottom: 24px;
}

.quick-amounts h3 {
    font-size: 16px;
    font-weight: 600;
    color: #252a2d;
    margin-bottom: 12px;
}

.amount-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
}

.amount-chip {
    padding: 12px 8px;
    background: #f4f5f0;
    border: 2px solid transparent;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    color: #252a2d;
    cursor: pointer;
    transition: all 0.3s ease;
}

.amount-chip:hover {
    background: #e6e7e2;
}

.amount-chip.active {
    border-color: #667eea;
    background: white;
    color: #667eea;
}

.amount-section {
    margin-bottom: 20px;
}

.amount-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #252a2d;
    margin-bottom: 8px;
}

.amount-input-wrapper {
    display: flex;
    align-items: center;
    border: 2px solid #e6e7e2;
    border-radius: 12px;
    overflow: hidden;
    transition: border-color 0.3s ease;
}

.amount-input-wrapper:focus-within {
    border-color: #667eea;
}

.currency {
    padding: 12px 16px;
    background: #f4f5f0;
    font-weight: 500;
    color: #8e9398;
    border-right: 2px solid #e6e7e2;
}

.amount-input-wrapper input {
    flex: 1;
    padding: 12px 16px;
    border: none;
    outline: none;
    font-size: 16px;
    font-weight: 500;
}

.amount-limits {
    margin-top: 8px;
    font-size: 12px;
    color: #8e9398;
}

.bonus-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    border-radius: 12px;
    margin-bottom: 20px;
    color: white;
}

.bonus-icon {
    font-size: 32px;
}

.bonus-title {
    font-size: 14px;
    font-weight: 500;
    opacity: 0.9;
    margin-bottom: 4px;
}

.bonus-amount {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 4px;
}

.bonus-text {
    font-size: 12px;
    opacity: 0.9;
}

.total-summary {
    background: #f4f5f0;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 20px;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 14px;
    color: #8e9398;
}

.summary-row.bonus {
    color: #10b981;
    font-weight: 500;
}

.summary-row.total {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid #e6e7e2;
    font-size: 16px;
    font-weight: 700;
    color: #252a2d;
}

.terms-checkbox {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    cursor: pointer;
    position: relative;
}

.terms-checkbox input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}

.checkmark {
    position: relative;
    display: inline-block;
    width: 20px;
    height: 20px;
    background: #f4f5f0;
    border: 2px solid #e6e7e2;
    border-radius: 6px;
    transition: all 0.3s ease;
}

.terms-checkbox input:checked ~ .checkmark {
    background: #667eea;
    border-color: #667eea;
}

.checkmark:after {
    content: '';
    position: absolute;
    display: none;
    left: 6px;
    top: 2px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}

.terms-checkbox input:checked ~ .checkmark:after {
    display: block;
}

.terms-text {
    font-size: 14px;
    color: #252a2d;
}

.terms-link {
    color: #667eea;
    text-decoration: none;
    font-weight: 500;
}

.terms-link:hover {
    text-decoration: underline;
}

.deposit-button {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 12px;
    color: white;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 20px;
    position: relative;
}

.deposit-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.deposit-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.deposit-button.loading {
    cursor: wait;
}

.loader {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.security-note {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 12px;
    color: #8e9398;
}

.lock-icon {
    width: 16px;
    height: 16px;
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
}

.modal-content {
    background: white;
    border-radius: 24px;
    padding: 24px;
    max-width: 400px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.modal-title {
    font-size: 20px;
    font-weight: 700;
    color: #252a2d;
    margin-bottom: 16px;
    text-align: center;
}

.modal-body {
    margin-bottom: 24px;
}

.modal-body p {
    color: #8e9398;
    margin-bottom: 16px;
    font-size: 14px;
}

.confirm-details {
    background: #f4f5f0;
    border-radius: 12px;
    padding: 16px;
}

.confirm-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 14px;
    color: #252a2d;
}

.confirm-row.total {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #e6e7e2;
    font-weight: 700;
    font-size: 16px;
}

.confirm-row .bonus {
    color: #10b981;
}

.modal-actions {
    display: flex;
    gap: 12px;
}

.modal-btn {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.modal-btn.cancel {
    background: #f4f5f0;
    color: #8e9398;
}

.modal-btn.cancel:hover {
    background: #e6e7e2;
}

.modal-btn.confirm {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.modal-btn.confirm:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

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

/* Responsive */
@media (max-width: 480px) {
    .deposit-page {
        padding: 10px;
    }
    
    .method-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .amount-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .deposit-header h2 {
        font-size: 24px;
    }
}
</style>