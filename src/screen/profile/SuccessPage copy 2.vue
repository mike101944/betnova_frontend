<template>
    <div class="bg-gray-100 h-full flex items-center justify-center p-4">
        <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Debugging Payou Redirect</h2>
            
            <!-- Show all URL params -->
            <div class="mb-4">
                <h3 class="font-bold text-gray-700 mb-2">URL Query Parameters:</h3>
                <pre class="bg-gray-100 p-3 rounded-lg text-xs overflow-auto">{{ JSON.stringify(route.query, null, 2) }}</pre>
            </div>
            
            <!-- Show full URL -->
            <div class="mb-4">
                <h3 class="font-bold text-gray-700 mb-2">Full URL:</h3>
                <pre class="bg-gray-100 p-3 rounded-lg text-xs overflow-auto break-all">{{ route.fullPath }}</pre>
            </div>
            
            <!-- Show all route params -->
            <div class="mb-4">
                <h3 class="font-bold text-gray-700 mb-2">Route Params:</h3>
                <pre class="bg-gray-100 p-3 rounded-lg text-xs overflow-auto">{{ JSON.stringify(route.params, null, 2) }}</pre>
            </div>
            
            <button 
                @click="goToDeposit"
                class="w-full py-3 bg-sky-500 text-white font-semibold rounded-lg"
            >
                Go Back to Deposit
            </button>
        </div>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

console.log('Full URL:', window.location.href)
console.log('Query params:', route.query)
console.log('Route params:', route.params)

const goToDeposit = () => {
    router.push('/deposit')
}
</script>