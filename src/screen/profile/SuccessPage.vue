<template>
    <div class="bg-gray-100 h-full flex items-center justify-center p-4">
        <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 text-center">
            <!-- Loading State -->
            <div v-if="loading" class="py-8">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
                <p class="text-gray-600">Processing your deposit...</p>
            </div>

            <!-- Success State -->
            <div v-else-if="success" class="py-4">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h2 class="text-xl font-bold text-gray-800 mb-2">Deposit Successful!</h2>
                <p class="text-gray-600 mb-4">
                    Amount: <span class="font-bold text-green-600">{{ formattedAmount }} TZS</span>
                </p>
                <p class="text-gray-600 mb-6">
                    New Balance: <span class="font-bold">{{ formattedNewBalance }} TZS</span>
                </p>
                <button 
                    @click="goToDashboard"
                    class="w-full py-3 bg-gradient-to-r from-sky-500 to-sky-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                    Continue to Dashboard
                </button>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="py-4">
                <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </div>
                <h2 class="text-xl font-bold text-gray-800 mb-2">Something Went Wrong</h2>
                <p class="text-gray-600 mb-4">{{ errorMessage }}</p>
                <button 
                    @click="goToDashboard"
                    class="w-full py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all"
                >
                    Go to Dashboard
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../../services/api'
import { useAuthStore } from '../../store/authStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// State
const loading = ref(true)
const success = ref(false)
const error = ref(false)
const errorMessage = ref('')
const formattedAmount = ref('')
const formattedNewBalance = ref('')

// Get order_id from URL query parameters
const getOrderIdFromUrl = () => {
    // Payou inaweza kutuma order_id kwa njia mbalimbali
    return route.query.order_id || 
           route.query.orderId || 
           route.query.MERCHANT_ORDER_ID ||
           route.query.reference
}

// Process deposit confirmation
const processDeposit = async () => {
    const orderId = getOrderIdFromUrl()
    
    if (!orderId) {
        loading.value = false
        error.value = true
        errorMessage.value = 'No transaction reference found'
        return
    }

    try {
        // Call backend to confirm deposit and update balance
        const response = await api.post('/auth/confirm-deposit', {
            order_id: orderId
        })

        if (response.data.success) {
            success.value = true
            formattedAmount.value = response.data.amount?.toLocaleString() || '0'
            formattedNewBalance.value = response.data.new_balance?.toLocaleString() || '0'
            
            // Refresh user balance in store
            await authStore.fetchUserBalance()
        } else {
            throw new Error(response.data.message || 'Failed to process deposit')
        }
    } catch (err) {
        console.error('Deposit confirmation error:', err)
        error.value = true
        errorMessage.value = err.response?.data?.message || 'Failed to process deposit. Please contact support.'
    } finally {
        loading.value = false
    }
}

const goToDashboard = () => {
    router.push('/dashboard') // or your dashboard route
}

// Process deposit when page loads
onMounted(() => {
    processDeposit()
})
</script>

<style scoped>
.animate-spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>