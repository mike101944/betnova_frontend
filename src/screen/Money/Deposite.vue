<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '../../store/authStore'
import api from '../../services/api'

// Constants
const minDeposite = 100;
const maxDeposite = 3000000;

// State
const authStore = useAuthStore()
const amount = ref(null)
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Get user phone number from auth store
const userPhone = computed(() => {
    return authStore.user?.phone_number || 'Not available'
})

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
const isInvalid = computed(() => {
    if (!amount.value) return true;
    const numAmount = Number(amount.value);
    return numAmount < minDeposite || numAmount > maxDeposite;
})

// Handle deposit
const handleDeposite = async () => {
    if (isInvalid.value) return;
    
    loading.value = true;
    errorMessage.value = '';
    successMessage.value = '';
    
    try {
        const response = await api.post('/auth/deposit', { 
            amount: Number(amount.value) 
        });
        
        // Refresh balance after successful deposit
        await authStore.fetchUserBalance();
        
        // Show success message
        successMessage.value = 'Deposit successful!';
        
        // Clear amount after success
        amount.value = null;
        
        // Log success (optional)
        console.log('Deposit successful:', response.data);
        
    } catch (error) {
        console.error('Deposit failed:', error);
        
        // Handle different error responses
        if (error.response) {
            // Server responded with error
            errorMessage.value = error.response.data.message || 'Deposit failed. Please try again.';
        } else if (error.request) {
            // Request made but no response
            errorMessage.value = 'Network error. Please check your connection.';
        } else {
            // Something else happened
            errorMessage.value = 'An error occurred. Please try again.';
        }
    } finally {
        loading.value = false;
        
        // Auto-hide success message after 3 seconds
        if (successMessage.value) {
            setTimeout(() => {
                successMessage.value = '';
            }, 3000);
        }
    }
}
</script>

<template>
    <div data-v-3cb9dec9="" class="withdraw router-view" params="[object Object]">
        <div data-v-c9b60287="" data-v-3cb9dec9="">
            <div data-v-907442d3="" class="header-container">
                <h2 data-v-907442d3="">Deposite</h2>
            </div>
            <div data-v-c9b60287="" class="withdraw-component">
                <div data-v-c9b60287="" class="withdraw-form-wrapper">
                    <div data-v-c9b60287="">
                        <div data-v-4b7cd401="" data-v-c9b60287="" class="withdraw-form">
                            <form data-v-4b7cd401="" class="form" @submit.prevent="handleDeposite">
                                
                                <!-- Success Message -->
                                <div v-if="successMessage" class="success-message" data-v-4b7cd401>
                                    {{ successMessage }}
                                </div>
                                
                                <!-- Error Message -->
                                <div v-if="errorMessage" class="error-message" data-v-4b7cd401>
                                    {{ errorMessage }}
                                </div>
                                
                                <div data-v-3e7e08c6="" data-v-d7674060="" data-v-4b7cd401="" class="user-phone withdraw-phone">
                                    <div data-v-3e7e08c6="" class="table">
                                        
                                        <div data-v-3e7e08c6="" class="row-cell align-middle user-phone-number">
                                            <div data-v-3e7e08c6="" class="user-phone-info-wrapper">
                                                <div data-v-3e7e08c6="" class="user-phone-info">
                                                    <div data-v-3e7e08c6="" class="user-phone-label">Your mobile number</div>
                                                    <div data-v-3e7e08c6="">{{ formattedPhone }}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div data-v-1a892a33="" data-v-4b7cd401="" class="input-field withdraw-amount">
                                    <label data-v-1a892a33="" for="withdraw-form-amount" class="form">
                                        Amount 
                                        <span data-v-1a892a33="" class="optional optional-slot">
                                            <div data-v-b1b046d0="" data-v-4b7cd401="" class="withdraw-fee">
                                                <span data-v-b1b046d0="" class="label-text"> </span>
                                            </div>
                                        </span>
                                    </label>
                                    <div data-v-1a892a33="" class="input-field-wrapper input-icon-undefined">
                                        <span data-v-1a892a33="" class="currency-symbol">TSh</span>
                                        <input 
                                            v-model="amount"
                                            data-v-1a892a33="" 
                                            pattern="[0-9]*" 
                                            inputmode="numeric"
                                            id="withdraw-form-amount" 
                                            name="amount" 
                                            type="text"
                                            :disabled="loading"
                                            @keypress="(e) => {
                                                // Allow only numbers
                                                if (!/[0-9]/.test(e.key)) {
                                                    e.preventDefault();
                                                }
                                            }"
                                        >
                                    </div>
                                    <div data-v-1a892a33="" class="help-text">
                                        Min: {{ minDeposite.toLocaleString() }}, 
                                        Max: {{ maxDeposite.toLocaleString() }}
                                    </div>
                                </div>
                                
                                <button 
                                    data-v-cb45c6b7="" 
                                    data-v-4b7cd401=""
                                    class="button button-primary button-full" 
                                    :disabled="isInvalid || loading"
                                    type="submit"
                                >
                                    <span v-if="loading">Processing...</span>
                                    <span v-else>Deposit</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
/* Original styles - untouched */
.withdraw[data-v-3cb9dec9] {
    padding: 20px;
    background-color: #fff;
}

.router-view {
    position: relative;
}
.header-container[data-v-907442d3] {
    display: flex;
}
h2[data-v-907442d3] {
    font-size: 1.26rem;
}

h2[data-v-907442d3] {
    font-weight: 700;
}
h2[data-v-907442d3] {
    font-size: 18px;
    color: #252a2d;
    line-height: 24px;
}
.withdraw-form[data-v-4b7cd401] {
    background: #f4f5f0;
    margin: 10px 0;
    padding: 12px;
}
.withdraw-form form[data-v-4b7cd401] {
    flex-direction: column;
    display: flex;
}
.user-phone[data-v-d7674060] {
    background: #f4f5f0;
    margin: 10px 0;
    padding: 8px;
}

.table {
    width: 100%;
    display: table;
}
.table .row-cell.align-middle {
    vertical-align: middle;
}

.table .row-cell {
    display: table-cell;
}
.user-phone-icon[data-v-3e7e08c6] {
    width: 32px;
    height: 32px;
    padding-right: 8px;
}
.user-phone-icon img[data-v-3e7e08c6] {
    vertical-align: middle;
    width: 32px;
    height: 32px;
}

.user-phone-number[data-v-3e7e08c6] {
    width: 100%;
    font-size: 14px;
    line-height: 17px;
    color: #252a2d ;
}
.user-phone-info-wrapper[data-v-3e7e08c6] {
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    display: flex;
}
.user-phone-label[data-v-3e7e08c6] {
    color: #8e9398;
    margin: 0 0 2px;
    font-size: 12px;
    line-height: 14px;
}
.input-field[data-v-1a892a33] {
    margin-bottom: 16px;
}
.input-field label[data-v-1a892a33] {
    width: 100%;
}

label.form {
    color: #252a2d;
    margin: 0 0 6px;
}
.withdraw-amount[data-v-4b7cd401] .optional-slot {
    color: inherit;
}

.input-field .optional[data-v-1a892a33] {
    float: right;
    color: #8e9398;
    font-size: 14px;
}
.withdraw-fee[data-v-4b7cd401] {
    align-items: center;
    display: flex;
    position: relative;
}
.withdraw-fee .withdraw-fee-info-modal[data-v-4b7cd401], .withdraw-form .caption[data-v-4b7cd401], .withdraw-fee[data-v-4b7cd401] .label-text {
    font-weight: 400;
}

.withdraw-form .caption[data-v-4b7cd401], .withdraw-fee[data-v-4b7cd401] .label-text {
    font-size: 12px;
    line-height: 16px;
}
.label-text[data-v-b1b046d0] {
    margin-right: 5px;
    font-size: 14px;
    font-weight: 400;
    line-height: 18px;
}
.input-field-wrapper[data-v-1a892a33] {
    display: flex;
    position: relative;
}
.input-field .currency-symbol[data-v-1a892a33] {
    color: #8e9398;
    text-transform: uppercase;
    white-space: nowrap;
    background: #e6e7e2;
    justify-content: center;
    align-items: center;
    padding: 0 8px;
    display: flex;
}

.input-field .currency-symbol[data-v-1a892a33], .input-field .help-text[data-v-1a892a33] {
    font-weight: 400;
}
.input-field .currency-symbol[data-v-1a892a33] {
    font-size: 14px;
    line-height: 18px;
}
.input-field-wrapper input[data-v-1a892a33] {
    width: 100%;
    max-width: 100%;
}

input[type=text], input[type=password], input[type=email], input[type=url], input[type=number], input[type=date], input[type=tel], input[type=search] {
    border: 1px solid #e6e7e2;
    border-radius: 0;
    outline: 0;
    padding: 7px 10px;
    font: 14px / 1.1rem Roboto-flex, Helvetica, Arial, sans-serif;
}
.input-field .help-text[data-v-1a892a33] {
    color: #8e9398;
    margin-top: 6px;
}

.input-field .help-text[data-v-1a892a33] {
    font-size: 12px;
    line-height: 16px;
}

.disabled.button, [disabled].button, .button:disabled {
    cursor: default;
    color: #8e9398 !important;
    background: #e6e7e2 !important;
}

/* FIX: Hapa nimeondoa max-width ili iwe full width kweli */
.button-full {
    width: 100% !important;
    max-width: none !important; 
}

.button-primary {
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
    vertical-align: middle;
    border: 0;
    border-radius: 0;
    padding: 10px 20px;
    display: inline-block;
}

/* Additional styles for messages - keeping consistent with design */
.success-message {
    background-color: #d4edda;
    color: #155724;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #c3e6cb;
    font-size: 14px;
    text-align: center;
}

.error-message {
    background-color: #f8d7da;
    color: #721c24;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #f5c6cb;
    font-size: 14px;
    text-align: center;
}

/* Loading state for button */
.button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}
</style>