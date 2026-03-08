<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router'
import { useBets } from '../composables/useBets'
import Loader from '../../assets/loader/default-spinner-BIEd0VkD.gif'

const router = useRouter();
const { settledBets, isLoading, error, fetchUserBets, formatCurrency } = useBets()

// Fetch bets on mount
onMounted(async () => {
  await fetchUserBets()
})

const goToBetDetails = (bet) => {
    router.push({
        path: `/bets/regular/${bet.id}`,
        state: {
            allBets: settledBets.value,
            currentBet: bet
        }
    });
}

// Compute statistics
const wonCount = computed(() => {
  return settledBets.value.filter(bet => bet.result === 'WON').length;
});

const lostCount = computed(() => {
  return settledBets.value.filter(bet => bet.result === 'LOST').length;
});

const totalWon = computed(() => {
  return settledBets.value
    .filter(bet => bet.result === 'WON')
    .reduce((sum, bet) => sum + parseFloat(bet.potentialReturn || 0), 0);
});

const hasData = computed(() => {
  return settledBets.value && settledBets.value.length > 0
})
</script>

<template>
  <div data-v-beccd7ea="" class="bets-list-container">
    <!-- LOADER SECTION -->
    <div v-if="isLoading" class="loading-container">
      <img :src="Loader" alt="Loading..." />
    </div>

    <!-- ERROR SECTION -->
    <div v-else-if="error" class="error-container">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <div v-else>
      <section data-v-beccd7ea="" aria-hidden="false" class="tab-section">
        <!-- Statistics Summary -->
        <div v-if="hasData" class="stats-summary">
          <div class="stat-card">
            <span class="stat-label">Total Settled</span>
            <span class="stat-value">{{ settledBets.length }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Won</span>
            <span class="stat-value text-green-600">{{ wonCount }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Lost</span>
            <span class="stat-value text-red-600">{{ lostCount }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Total Won</span>
            <span class="stat-value text-green-600">{{ formatCurrency(totalWon) }}</span>
          </div>
        </div>

        <!-- No Data State -->
        <div v-if="!hasData" data-v-34417751="" class="bet" data-test-id="bet-settled-9336337628" data-test-class="bet-settled">
          <div class="empty-state">
            No settled bets found
          </div>
        </div>

        <!-- Bets List -->
        <div v-else>
          <div 
            v-for="bet in settledBets" 
            :key="bet.id"
            @click="goToBetDetails(bet)"
            data-v-34417751="" 
            class="bet cursor-pointer" 
            data-test-id="bet-settled-9336337628" 
            data-test-class="bet-settled"
          >
            <div data-v-34417751="" class="bet-line bet-header">
              <div data-v-34417751="" class="header-container">
                <div data-v-34417751="" class="header-title">
                  <span data-v-34417751="" class="time">{{ new Date(bet.placedAt).toLocaleTimeString() }},&nbsp;</span> 
                  <span data-v-34417751="" class="date">{{ new Date(bet.placedAt).toLocaleDateString() }}</span>
                  <span data-v-34417751="" class="bet-live-now"></span>
                </div>
                <div data-v-34417751="" class="id" data-test-id="bet-id">
                  ID: #{{ String(bet.id).slice(0,8) }}
                </div>
              </div>
            </div>
            
            <div data-v-34417751="" class="bet-line bet-status">
              <div data-v-34417751="" class="result-container">
                <span data-v-34417751="" class="result-text result-text-grey">Result:</span> 
                <span 
                  data-v-34417751="" 
                  class="status-text" 
                  :class="bet.result === 'WON' ? 'positive' : 'negative'"
                >
                  {{ bet.result }}
                </span>
              </div>
            </div>
            
            <div data-v-34417751="" class="bet-status-line"></div>
            
            <div data-v-34417751="" class="bet-line bet-body">
              <div data-v-34417751="" class="bet-detail">
                <span data-v-34417751="" class="label">STAKE</span>
                <div data-v-34417751="" class="currency-container">
                  <div data-v-34417751="" class="currency value"> 
                    <span class="amount">{{ bet.stake }}</span>
                  </div>
                </div>
              </div>
              
              <div data-v-34417751="" class="bet-detail">
                <span data-v-34417751="" class="label">ODDS</span> 
                <span data-v-34417751="" class="value">{{ bet.totalOdds }}</span>
              </div>
              
              <div data-v-34417751="" class="bet-detail end">
                <span data-v-34417751="" class="label">PAYOUT</span>
                <div data-v-34417751="" class="currency-container bold-symbol">
                  <div data-v-34417751="" class="currency value"> 
                    <span class="symbol contrast">TSh</span>
                    <span class="amount">{{ bet.result === 'WON' ? bet.potentialReturn : 0 }}</span>
                  </div>
                </div> 
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.loading-container{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400px; 
}
.loading-container img{
    height: 32px;
    width: 32px;
}
.error-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400px;
    color: #ef4444;
}
.stats-summary {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-bottom: 20px;
    padding: 10px;
    background: #f9fafb;
    border-radius: 8px;
}
.stat-card {
    text-align: center;
    padding: 8px;
    background: white;
    border-radius: 6px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
.stat-label {
    display: block;
    font-size: 11px;
    color: #6b7280;
    margin-bottom: 4px;
}
.stat-value {
    display: block;
    font-size: 16px;
    font-weight: 700;
    color: #1f2937;
}
.text-green-600 { color: #059669; }
.text-red-600 { color: #dc2626; }
.cursor-pointer { cursor: pointer; }

.bets-list-container[data-v-beccd7ea] {
    padding: 20px 12px;
}
section {
    display: block;
    unicode-bidi: isolate;
}
.hide-lose-container[data-v-beccd7ea] {
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
    display: flex;
}
.text-small {
    font-size: 12px;
}
.hide-lose-container .toggle-container[data-v-beccd7ea] {
    width: 35px;
    height: 20px;
}
.toggle-container[data-v-f36b6f6d] {
    box-sizing: border-box;
    margin: 12px 0;
}
.toggle[data-v-f36b6f6d] {
    background-color: #f4f5f0;
    border: 1px solid #e6e7e2;
    border-radius: 12px;
    width: 100%;
    height: 100%;
    padding: 1px;
    display: inline-flex;
}
.toggle button.active[data-v-f36b6f6d] {
    color: #252a2d;
    background-color: #fff;
    border: 1px solid #e6e7e2;
    font-weight: 600;
}
.toggle button.no-padding[data-v-f36b6f6d] {
    padding: 0;
}
.toggle button[data-v-f36b6f6d] {
    color: #8e9398;
    cursor: pointer;
    background: 0 0;
    border: none;
    border-radius: 10px;
    flex: 1;
    height: 100%;
    padding: 8px;
    transition: background-color .2s;
}
.toggle button.no-padding[data-v-f36b6f6d] {
    padding: 0;
}
.toggle button[data-v-f36b6f6d] {
    color: #8e9398;
    cursor: pointer;
    background: 0 0;
    border: none;
    border-radius: 10px;
    flex: 1;
    height: 100%;
    padding: 8px;
    transition: background-color .2s;
}

.bet[data-v-34417751] {
    color: #252a2d;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    font-size: 12px;
    line-height: 16px;
    font-weight: 400;
}
.bet-line.bet-header[data-v-34417751] {
    background-color: #f4f5f0;
    border-bottom: 1px solid #e6e7e2;
    align-items: flex-start;
    padding: 10px 12px;
    display: flex;
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
}
.bet-line.bet-header .header-container[data-v-34417751] {
    flex-direction: row;
    flex-grow: 1;
    justify-content: space-between;
    align-items: center;
    display: flex;
}
.bet .header-title[data-v-34417751] {
    align-items: center;
    display: flex;
}
.bet-line.bet-header .time[data-v-34417751]{
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
}
.bet-line.bet-header .date[data-v-34417751]{
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
}
.bet-line.bet-header .id[data-v-34417751] {
    color: #8e9398;
    text-align: right;
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
}
.bet-line.bet-status[data-v-34417751] {
    color: #ff7a00;
    text-align: right;
    white-space: nowrap;
    fill: #ff7a00;
    justify-content: space-between;
    padding: 10px 12px;
    font-weight: 700;
    display: flex;
}
.bet-line.bet-status .result-container[data-v-34417751] {
    flex-flow: wrap;
    flex-grow: 1;
    justify-content: space-between;
    align-items: center;
    display: flex;
    overflow: hidden;
}
.bet-line.bet-status .result-container .result-text-grey[data-v-34417751] {
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    color: #8e9398;
}
.bet-line.bet-status .result-container .result-text[data-v-34417751] {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
.bet-line .positive[data-v-34417751] {
    color: #0AF0B5;
}
.bet-line .negative[data-v-34417751] {
    color: #ef4444;
}
.bet-line .status-text[data-v-34417751] {
    font-weight: 700;
    font-size: 14px;
    line-height: 18px;
}
.type-win[data-v-891f4695] {
    color: #252a2d;
    background: #0AF0B5;
}
.mode-medium[data-v-891f4695] {
    vertical-align: text-bottom;
    width: 16px;
    height: 16px;
    margin: 0 0 0 8px;
}
.badge {
    text-align: center;
    color: #252a2d;
    background: #fff border-box;
    border: 0;
    border-radius: 0;
    font-size: 13px;
    line-height: 16px;
    font-weight: 400;
    display: inline-block;
}

.bet-status-line[data-v-34417751] {
    border-bottom: 1px solid #e6e7e2;
    margin-left: 12px;
    margin-right: 12px;
}
.bet-line[data-v-34417751]:last-child {
    margin-bottom: 0;
}
.bet-line.bet-body[data-v-34417751] {
    flex-wrap: wrap;
    display: flex;
    margin: 12px 12px;
}
.bet-line .bet-detail[data-v-34417751] {
    flex-direction: column;
    flex: 1;
    align-items: flex-start;
    gap: 1px;
    padding-right: 4px;
    font-weight: 700;
    display: flex;
}
.bet-line .bet-detail .label[data-v-34417751] {
    color: #8e9398;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
}
.bet-line .bet-detail .currency-container[data-v-34417751] {
    align-items: center;
    display: flex;
}
.bet-line .bet-detail .value[data-v-34417751]{
    font-size: 14px;
    line-height: 18px;
    font-weight: 400;
}
.bet-line .bet-detail.end[data-v-34417751] {
    align-items: flex-end;
    padding-right: 0;
}
.bet-line .bet-detail .bold-symbol .value[data-v-34417751]{
    font-weight: 700;
    font-size: 14px;
    line-height: 18px;
}
.bet-line .bet-detail .currency.value[data-v-34417751] .symbol {
    color: #aaaeb0;
    font-size: 12px;
    margin-right: 2px;
}
</style>