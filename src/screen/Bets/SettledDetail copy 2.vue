
<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const route = useRoute()
const router = useRouter()
const betId = route.params.id

const currentBet = ref(null)

onMounted(() => {
    console.log('Looking for bet ID:', betId);
    console.log('Type of betId from route:', typeof betId);
    
 
    
    // Method 2: Try localStorage
    const storedBets = localStorage.getItem('settledBets');
    
    if (storedBets) {
        const allBets = JSON.parse(storedBets);
     
        // Try ways to find the bet
        const foundBet = allBets.find(bet => {
            
            
            // Try loose comparison
            if (bet.id == betId) { // Double equals for type coercion
                console.log('Found by loose comparison');
                return true;
            }
            
            return false;
        });
        
        if (foundBet) {
            currentBet.value = foundBet;
            console.log('Found bet:', currentBet.value);
        } else {
            console.log('Bet not found. Available IDs:', allBets.map(b => b.id));
            console.log('Looking for:', betId);
        }
    } else {
        console.log('No settledBets in localStorage');
    }
});


    
    const goBack = () => {
      router.push({ name: 'Settled' })
      
      // router.go(-1)
    }
    </script>


<template>
    <div class="settled-detail">
      <!-- Back Button -->
      <button @click="goBack" class="back-button">
        ← Back to Settled Bets
      </button>
      
      <div v-if="currentBet" class="bet-details">
    <h2>Bet Details for #{{ currentBet.id }}</h2>
    <p>{{ currentBet.match }}</p>
    <p>Stake: {{ currentBet.stake }}</p>
    <p>Odds: {{ currentBet.odds }}</p>
    <p>Payout: {{ currentBet.payout }}</p>
  </div>
    </div>
  </template>
  
  
  
  <style scoped>
  .back-button {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    margin-bottom: 20px;
    font-size: 14px;
  }
  
  .back-button:hover {
    background: #2563eb;
  }
  .bet-details{
    color:#2563eb

  }
  </style>