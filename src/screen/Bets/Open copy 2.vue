<script setup>
import { ref, onMounted, computed } from 'vue'
import { useBets } from '../composables/useBets'
import Loader from '../../assets/loader/default-spinner-BIEd0VkD.gif'

const { openBets, isLoading, error, fetchUserBets, formatCurrency } = useBets()

// Fetch bets on mount
onMounted(async () => {
  await fetchUserBets()
})

// Computed property for hasData
const hasData = computed(() => {
  return openBets.value && openBets.value.length > 0
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
      <!-- HAS DATA SECTION -->
      <section data-v-beccd7ea="" aria-hidden="false" class="tab-section" v-if="hasData">
        <div data-v-34417751="" data-v-beccd7ea="">
          <div 
            v-for="bet in openBets" 
            :key="bet.id"
            data-v-34417751="" 
            class="bet" 
            data-test-id="bet-pending-10655410033" 
            data-test-class="bet-pending"
          >
            <div data-v-34417751="" class="bet-line bet-header">
              <div data-v-34417751="" class="header-container">
                <div data-v-34417751="" class="header-title">
                  <span data-v-34417751="" class="time">{{ new Date(bet.createdAt ).toLocaleTimeString() }},&nbsp; </span> 
                  <span data-v-34417751="" class="date">{{ new Date(bet.createdAt ).toLocaleDateString() }}</span>
                  <span data-v-34417751="" class="bet-live-now"></span>
                </div>
                <div data-v-34417751="" class="id" data-test-id="bet-id">ID: #{{ bet.id.toString().slice(0,8) }} </div>
              </div>
            </div>
            
            <div data-v-34417751="" class="bet-line bet-status">
              <div class="outcome">{{ bet.selections?.length || 0 }}/{{ bet.selections?.length || 0 }} </div>
              <div data-v-beccd7ea="" class="cashout-container">
                <span data-v-beccd7ea="" class="cashout-title">Cashout</span> 
                <span data-v-beccd7ea="" class="cashout-icon">
                  <svg data-v-02f45589="" data-v-beccd7ea="" class="svg-icon icon-size-small" style="vertical-align: middle;">
                    <title data-v-02f45589="">Cashout</title>
                    <use data-v-02f45589="" xlink:href="#icon-cashoutable"></use>
                  </svg>
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
                    <span class="amount">{{ bet.potentialReturn }}</span>
                  </div>
                </div> 
              </div>
            </div>
          </div>
        </div> 
      </section>

      <!-- NO DATA SECTION -->
      <section data-v-beccd7ea="" aria-hidden="false" class="tab-section" v-else>
        <div data-v-34417751="" data-v-beccd7ea="">
          <div data-v-34417751="" class="no-data-text">
            <div data-v-994d5d7e="" data-v-beccd7ea="" class="empty-betslip-open">
              <svg data-v-02f45589="" data-v-994d5d7e="" class="svg-icon empty-betslip-icon" style="vertical-align: middle;">
                <use data-v-02f45589="" xlink:href="#icon-betslip-illustration"></use>
              </svg> 
              <span data-v-994d5d7e="" class="caption">There are currently no open betslips.</span>
              <div data-v-994d5d7e="" class="empty-betslip-button">
                <a data-v-994d5d7e="" href="/events" class="empty-betslip-button-link" data-test-id="emptyBetslipBtn">
                  Browse Matches
                </a>
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
.bets-list-container[data-v-beccd7ea] {
    padding: 20px 12px;
}
section {
    display: block;
    unicode-bidi: isolate;
}
.no-data-text[data-v-34417751] {
    text-align: center;
    margin: 14px;
}
.no-data-text[data-v-34417751], .bet-line.bet-header .time[data-v-34417751], .bet-line .bet-detail .value[data-v-34417751] {
    font-weight: 400;
}
.no-data-text[data-v-34417751] {
    font-size: 16px;
    line-height: 22px;
}
.empty-betslip-open[data-v-994d5d7e] {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 12px;
    margin-top: 40px;
    display: flex;
}
.empty-betslip-open .empty-betslip-icon[data-v-994d5d7e] {
    width: 100px;
    height: 80px;
    margin-bottom: 4px;
}
svg[data-v-02f45589], img[data-v-02f45589] {
    width: 32px;
    height: 32px;
}
/* ... rest of your existing styles ... */



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
    .bets-list-container[data-v-beccd7ea] {
    padding: 20px 12px;
}
section {
    display: block;
    unicode-bidi: isolate;
}
.no-data-text[data-v-34417751] {
    text-align: center;
    margin: 14px;
}
.no-data-text[data-v-34417751], .bet-line.bet-header .time[data-v-34417751], .bet-line .bet-detail .value[data-v-34417751] {
    font-weight: 400;
}
.no-data-text[data-v-34417751] {
    font-size: 16px;
    line-height: 22px;
}
.empty-betslip-open[data-v-994d5d7e] {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 12px;
    margin-top: 40px;
    display: flex;
}
.empty-betslip-open .empty-betslip-icon[data-v-994d5d7e] {
    width: 100px;
    height: 80px;
    margin-bottom: 4px;
}
svg[data-v-02f45589], img[data-v-02f45589] {
    width: 32px;
    height: 32px;
}
.no-data-text[data-v-34417751] {
    text-align: center;
    margin: 14px;
}
.no-data-text[data-v-34417751], .bet-line.bet-header .time[data-v-34417751], .bet-line .bet-detail .value[data-v-34417751] {
    font-weight: 400;
}
.no-data-text[data-v-34417751] {
    font-size: 16px;
    line-height: 22px;
}
.no-data-text[data-v-34417751], .bet-line.bet-header .time[data-v-34417751], .bet-line .bet-detail .value[data-v-34417751] {
    font-weight: 400;
}
.no-data-text[data-v-34417751] {
    font-size: 16px;
    line-height: 22px;
}
.empty-betslip-open .empty-betslip-button[data-v-994d5d7e] {
    justify-content: center;
    align-items: center;
    display: flex;
}
.no-data-text[data-v-34417751], .bet-line.bet-header .time[data-v-34417751], .bet-line .bet-detail .value[data-v-34417751] {
    font-weight: 400;
}
.no-data-text[data-v-34417751] {
    text-align: center;
    margin: 14px;
}
.no-data-text[data-v-34417751] {
    font-size: 16px;
    line-height: 22px;
}
.empty-betslip-open .empty-betslip-button-link[data-v-994d5d7e] {
    text-transform: uppercase;
    user-select: none;
    cursor: pointer;
    color: #252a2d;
    background-color: #39ecdd;
    justify-content: center;
    align-self: stretch;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 7px 12px;
    display: flex;
}
.empty-betslip-open .empty-betslip-button-link[data-v-994d5d7e] {
    font-size: 14px;
    font-weight: 700;
    line-height: 18px;
}






.bet-line.bet-header[data-v-34417751] {
  background-color: #f4f5f0;
  border-bottom: 1px solid #e6e7e2;
  align-items: flex-start;
  padding: 10px 12px;
  display: flex;
}
.bet[data-v-34417751] {
  color: #252a2d;
  border: 1px solid #e6e7e2;
  margin-bottom: 12px;
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
  font-size: 14px;
  line-height: 18px;
  font-weight: 400;
}
.bet-line.bet-header .date[data-v-34417751]{
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
}
.bet-live-now[data-v-34417751] {
  width: 16px;
  height: 16px;
  margin-left: 8px;
}
.bet-line.bet-header .id[data-v-34417751] {
  color: #8e9398;
  text-align: right;
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
}
.bet-line.bet-status[data-v-34417751] {
  color: #ecc239;
  text-align: right;
  white-space: nowrap;
  fill: #39ecdd;
  justify-content: space-between;
  padding: 10px 12px;
  font-weight: 700;
  display: flex;
}
.outcome {
  font-size: 14px;
  font-weight: 700;
  line-height: 18px;
}
.cashout-container[data-v-beccd7ea] {
  background-color: #f4f5f0;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  padding: 2px 4px;
  display: flex;
}
.cashout-container .cashout-title[data-v-beccd7ea] {
  color: #252a2d;
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: 14px;
}
.cashout-container .cashout-icon[data-v-beccd7ea] {
  align-items: center;
  width: 14px;
  height: 14px;
  display: flex;
}
.cashout-container .cashout-icon svg[data-v-beccd7ea] {
  width: 100%;
  height: 100%;
}
svg.icon-size-small[data-v-02f45589], img.icon-size-small[data-v-02f45589] {
  width: 14px;
  height: 14px;
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
  margin: 12px 12px ;
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
  font-weight: 500;
  color: #8e9398;
  font-size: 12px;
  line-height: 16px;
}
.bet-line .bet-detail .currency-container[data-v-34417751] {
  align-items: center;
  display: flex;
}
.bet-line .bet-detail .value[data-v-34417751] {
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
}
.bet-line .bet-detail.end[data-v-34417751] {
  align-items: flex-end;
  padding-right: 0;
}
.bet-line .bet-detail .currency-container[data-v-34417751] {
  align-items: center;
  display: flex;
}
.bet-line .bet-detail .currency.value[data-v-34417751] .symbol {
  color: #aaaeb0;
  font-size: 12px;
}
</style>