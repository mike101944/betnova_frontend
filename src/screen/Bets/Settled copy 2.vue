<script setup>
    import {ref,computed,onMounted} from 'vue';
    import { useRouter } from 'vue-router'
    import settledBetsData from './assets/settledBetsData';
    

    // load data
  const router = useRouter();

    const settledBets = ref([]);
    onMounted(()=>{
        settledBets.value = settledBetsData;

        // store in localStorage

        localStorage.setItem('settledBets', JSON.stringify(settledBets.value));
    })

const goToBetDetails = (bet) => {
  router.push({
    path: `/bets/regular/${bet.id}`,
    // Pass ALL data kama state
    state: { 
      allBets: settledBets.value,
      currentBet: bet
    }
  })
}

    // compute propertise for statistics

    const wonCount = computed(() => {
  return settledBets.value.filter(bet => bet.result === 'WON').length;
});

const lostCount = computed(() => {
  return settledBets.value.filter(bet => bet.result === 'LOST').length;
});

const voidCount = computed(() => {
  return settledBets.value.filter(bet => bet.result === 'VOID').length;
});

</script>

<template>
 <div data-v-beccd7ea="" class="bets-list-container">
                <section data-v-beccd7ea="" aria-hidden="false" class="tab-section">
                    <div data-v-beccd7ea="" class="hide-lose-container">
                        <span data-v-beccd7ea="" class="text-small">HideLost</span>
                            
                        <div data-v-f36b6f6d="" data-v-beccd7ea="" class="toggle-container"
                            data-test-id="settled-filter-toggle">
                            <div data-v-f36b6f6d="" data-test-id="toggle-container" class="toggle"><button data-v-f36b6f6d=""
                                    data-test-id="select-button" class="active no-padding"></button><button data-v-f36b6f6d=""
                                    data-test-id="select-button" class="no-padding"></button></div>
                        </div>
                    </div>

               

                    <div >
                        <div  v-if="settledBets.length === 0"  data-v-34417751="" class="bet" data-test-id="bet-settled-9336337628" data-test-class="bet-settled">

                            <div class="empty-state">
                                No settled bets found
                            </div>

                        </div>

                        <div v-else>

                        
                            <div 
                            v-for="bet in settledBets" 
                            :key="bet.id"
                            @click="goToBetDetails(bet)"
                            
                            data-v-34417751="" class="bet" data-test-id="bet-settled-9336337628" data-test-class="bet-settled">
                           

                                    <div data-v-34417751="" class="bet-line bet-header">
                                        <div data-v-34417751="" class="header-container">
                                            <div data-v-34417751="" class="header-title"><span data-v-34417751="" class="time">
                                                    {{ bet.time }},&nbsp; </span> <span data-v-34417751="" class="date">{{ bet.date }}</span> <span
                                                    data-v-34417751="" class="bet-live-now"></span></div>
                                            <div data-v-34417751="" class="id" data-test-id="bet-id">ID: #{{ bet.id }} <!----></div>
                                        </div>
                                    </div>
                                    <div data-v-34417751="" class="bet-line bet-status">
                                        <div data-v-34417751="" class="result-container"><span data-v-34417751=""
                                                class="result-text result-text-grey">Result:
                                            </span> <span data-v-34417751="" class="positive status-text">WON <span data-v-891f4695=""
                                                    data-v-34417751="" class="badge type-win mode-medium badge-result"><!---->
                                                    </span></span></div>
                                    </div>
                                    <div data-v-34417751="" class="bet-status-line"></div>
                                    <div data-v-34417751="" class="bet-line bet-body">
                                        <div data-v-34417751="" class="bet-detail"><span data-v-34417751="" class="label">STAKE</span>
                                            <div data-v-34417751="" class="currency-container">
                                                <div data-v-34417751="" class="currency value"> <span class="amount">{{ bet.stake }}</span>
                                                    </div>
                                            </div>
                                        </div>
                                        <div data-v-34417751="" class="bet-detail"><span data-v-34417751="" class="label">ODDS</span> <span
                                                data-v-34417751="" class="value">{{ bet.odds }}</span> <!----></div>
                                        <div data-v-34417751="" class="bet-detail end"><span data-v-34417751="" class="label">PAYOUT</span>
                                            <div data-v-34417751="" class="currency-container bold-symbol">
                                                <div data-v-34417751="" class="currency value"> <span class="symbol contrast">TSh</span>
                                                    <span class="amount">{{ bet.payout }}</span> <!----></div>
                                            </div> 
                                        </div>
                                    </div>
                                    
                        </div>
                        </div>

                </div>
            
                    

                </section>
            </div>
</template>



<style lang="scss" scoped>
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
    border: 1px solid #e6e7e2;
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
    color: #8dc63f;
}
.bet-line .status-text[data-v-34417751] {
    font-weight: 700;
    font-size: 14px;
    line-height: 18px;
}
.type-win[data-v-891f4695] {
    color: #252a2d;
    background: #8dc63f;
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
    // margin-right: 7px;
    font-size: 13px;
    line-height: 16px;
    font-weight: 400;
    // padding: 2px 7px;
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
}
.bet-line .bet-detail .label[data-v-34417751] {
    font-weight: 500;
}
.bet-line .bet-detail .label[data-v-34417751], .bet[data-v-34417751] {
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
.bet-line .bet-detail.end[data-v-34417751] {
    align-items: flex-end;
    padding-right: 0;
}

.bet-line .bet-detail[data-v-34417751] {
    flex-direction: column;
    flex: 1;
    align-items: flex-start;
    gap: 1px;
    padding-left: 4px;
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