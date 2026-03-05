
<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import WiningCupImage from '../../../assets/media/main_trophy_bronze_b8a77b5e1a.webp' 
import WiningCupImageBackground from '../../../assets/media/Property_1_Bronze_confetti_b5028c1425.webp' 
const route = useRoute()
const router = useRouter()
const betId = route.params.id

const currentBet = ref(null)

const isTaxDetailsOpen = ref(false)

const toggleTaxDetail = ()=>{
    isTaxDetailsOpen.value = !isTaxDetailsOpen.value
}

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
    


  <div data-v-7f504cc4="" v-if="currentBet" class="single-betslip router-view">
     
        <div data-v-7f504cc4="" class="header">
            <div data-v-7f504cc4="" @click="goBack"  data-test-id="single-betslip-back-button" class="back">
                <svg data-v-02f45589=""  
                    data-v-7f504cc4="" class="svg-icon icon" style="vertical-align: middle;">
                    <use data-v-02f45589="" xlink:href="#arrow_left"></use>
                </svg></div>
            <div data-v-7f504cc4="" class="betslip-title">
                <div data-v-7f504cc4="" class="id" data-test-id="betSlipID">BET ID # {{ currentBet.id }}</div> 
            </div> 
        </div>
        <div data-v-7f504cc4="" class="summary">
            <div data-v-af0326d2="" data-v-7f504cc4="" class="tier-banner"><img data-v-5455027b="" data-v-af0326d2=""
                :src="WiningCupImage" class="trophy-img"> <img data-v-5455027b=""
                    data-v-af0326d2="" :src="WiningCupImageBackground" class="trophy-bg">
                <div data-v-af0326d2="" class="currency congrats-text"><span data-v-af0326d2="">Congratulations on <br>
                        <span class="win-big-text">winning big </span></span> <span class="symbol">TSh</span> <span
                        class="amount">{{ currentBet.payout }}</span> <!----></div>
            </div> <!---->
            <div data-v-7f504cc4="" class="betslip-summary-container win-tier"
                style="border-image: linear-gradient(to right, rgb(176, 96, 55), rgb(230, 149, 103), rgb(217, 111, 53), rgb(141, 69, 29), rgb(230, 149, 103)) 1 / 1 / 0 stretch;">
                <div data-v-7f504cc4="" class="summary-line">
                    <div data-v-7f504cc4="" class="label">Odds:</div>
                    <div data-v-7f504cc4="" class="value">{{ currentBet.odds }}</div>
                </div>
                <div data-v-7f504cc4="" class="summary-line selected">
                    <div data-v-7f504cc4="" class="label">Stake:</div>
                    <div data-v-7f504cc4="" class="currency value" data-test-id="stakeAmount"> <span
                            class="symbol contrast">TSh</span> {{ currentBet.stake }}<span class="amount"></span> <!----></div>
                </div> 
                <div data-v-7f504cc4="" class="summary-line selected">
                    <div data-v-7f504cc4="" class="label">Potential Winnings:</div>
                    <div data-v-7f504cc4="" class="currency value" data-test-id="possibleWinAmount"> <span
                            class="symbol contrast">TSh</span> <span class="amount">2.40</span> <!----></div>
                </div> 
                <div data-v-5d3da755="" data-v-7f504cc4="" class="tax-details">
                            <div data-v-aabe1219="" data-v-5d3da755=""
                            :class="['expansion-panel', 'minimal', 'small', 
                        isTaxDetailsOpen ? 'is-open' : '', 
                        'tax-details-expansion', 'light']"
                        >
                        <div data-v-aabe1219="" @click="toggleTaxDetail" data-test-id="toggle-open-button" class="title table pointer">
                            <div data-v-aabe1219="" class="row-cell align-middle expand-icon expand-icon-left">
                                <svg
                                    data-v-02f45589="" data-v-aabe1219="" class="svg-icon icon-size-very-small"
                                    style="vertical-align: middle;" :style="{ transform: isTaxDetailsOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
                       transition: 'transform 0.3s ease' }">
                                    <use data-v-02f45589="":xlink:href="isTaxDetailsOpen ? '#icon-arrow-up' : '#icon-arrow-down'"></use>
                                </svg></div>
                            <div data-v-aabe1219="" class="row-cell align-middle title-text">
                                <h3 data-v-aabe1219="">Tax Details:</h3>
                            </div> 
                        </div>
                        <div data-v-aabe1219="" v-show="isTaxDetailsOpen" class="expansion-panel-content" style="height: auto; opacity: 1;">
                            <div data-v-5d3da755="" class="summary-line">
                                <div data-v-5d3da755="" class="label">Gross Winnings:</div>
                                <div data-v-5d3da755="" class="currency value" data-test-id="grossWinnings"> <span
                                        class="symbol contrast">TSh</span> <span class="amount">2.40</span> <!----></div>
                            </div>
                            <div data-v-5d3da755="" class="divider"></div>
                            <div data-v-5d3da755="" class="summary-line">
                                <div data-v-5d3da755="" class="label">Withholding Tax 12%:</div>
                                <div data-v-5d3da755="" class="currency value" data-test-id="possibleWinAmount"> <span
                                        class="symbol contrast">TSh</span> <span class="amount">0.29</span> <!----></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div data-v-7f504cc4="" class="summary-line result" data-test-id="summaryLine">
                    <div data-v-7f504cc4="" class="label winning-result">Payout:</div>
                    <div data-v-7f504cc4="" class="currency value winning-result" data-test-class="betResult"
                        data-test-id="betResultWon">WON <span class="symbol">TSh</span> <span class="amount">3.11</span>
                        </div>
                </div>
            </div>
            <div data-v-7f504cc4="" class="betslip-sharing"><button data-v-7f504cc4=""
                    data-test-id="open-bet-sharing-modal-button" class="button button-primary share-win-button"><svg
                        data-v-02f45589="" data-v-7f504cc4="" class="svg-icon icon icon-size-medium"
                        style="vertical-align: middle;"><!---->
                        <use data-v-02f45589="" xlink:href="#icon-share"></use>
                    </svg> <span data-v-7f504cc4="">Share your win</span></button></div> <!----> <!----> <!----> <!---->
        </div> <!---->
        <div data-v-695b065a="" data-v-7f504cc4="" class="event" data-test-id="stakeInfo"><!----> <!---->
            <div data-v-695b065a="" class="event-line event-header"><!---->
                <div data-v-695b065a="" class="event-label">
                    <div data-v-695b065a="" class="label">
                        <div data-v-695b065a="">12:00 am <span data-v-695b065a="" class="date">Sat 30/08</span></div>
                    </div> <!----> <!---->
                </div>
                <div data-v-695b065a="" class="value odd win"><span data-v-695b065a="" class="">3.40</span> <span
                        data-v-891f4695="" data-v-695b065a="" class="badge type-win mode-circle badge-result"><!---->
                        <!----></span></div>
            </div>
            <div data-v-695b065a="" class="event-line">
                <div data-v-695b065a="" class="label">
                    <div data-v-695b065a="" class="match" data-test-id="matchName"><svg data-v-02f45589=""
                            data-v-695b065a="" class="svg-icon sport-icon" style="vertical-align: middle;"><!---->
                            <use data-v-02f45589="" xlink:href="#icon-football"></use>
                        </svg> <span data-v-95226610="" data-v-695b065a="">CS Herediano U21 - AD Municipal Liberia
                            U21</span></div>
                    <div data-v-695b065a="" class="league">U21 Liga Ulatina</div>
                    <div data-v-695b065a="" class="bold"><span data-v-695b065a="">Over/Under | Full Time (Under)
                            (1.5)</span></div>
                </div>
                <div data-v-695b065a="" class="value">
                    <div data-v-695b065a=""><span data-v-695b065a="" class="result">1-0</span></div>
                    <div data-v-695b065a="" class="event-info"><!----> <!----></div>
                </div>
            </div>
        </div> <!---->
        <div data-v-7f504cc4="" class="legend">
            <div data-v-7f504cc4="" class="lightgray placed-date">
                <div data-v-7f504cc4="">Bet placed on <span data-v-7f504cc4="" class="nowrap">Sat 30/08 at 1:21
                        am</span></div>
                <div data-v-7f504cc4="" class="summary-legend"><span data-v-891f4695="" data-v-7f504cc4=""
                        class="badge type-pending mode-circle"><!----> <!----></span> <span
                        data-v-7f504cc4="">Pending</span> <span data-v-891f4695="" data-v-7f504cc4=""
                        class="badge type-win mode-circle"><!----> <!----></span> <span data-v-7f504cc4="">Won</span>
                    <span data-v-891f4695="" data-v-7f504cc4="" class="badge type-lose mode-circle"><!---->
                        <!----></span> <span data-v-7f504cc4="">Lost</span> <span data-v-891f4695="" data-v-7f504cc4=""
                        class="badge type-cancelled mode-circle"><svg data-v-02f45589="" data-v-891f4695=""
                            class="svg-icon icon icon-size-medium" style="vertical-align: middle;"><!---->
                            <use data-v-02f45589="" xlink:href="#icon-close"></use>
                        </svg> <!----></span> <span data-v-7f504cc4="">Void</span></div>
            </div>
        </div>
        <div data-v-fb673205="" data-v-7f504cc4="" class="mybets-regulation">
            <p data-v-fb673205="" class="mybets-regulation-msg"><span data-v-fb673205="">All bets are accepted and
                    settled in accordance with our <b><a href="/terms" class="underline">Terms and Conditions</a></b>
                    and <b><a href="/rules" class="underline">Rules</a></b>.</span></p>
        </div>
    </div>
  






 



    
  </template>
  
  
  
  <style scoped>
    .expansion-panel-content {
  overflow: hidden;
  transition: max-height 0.3s ease, opacity 0.3s ease;
  max-height: 0;
  opacity: 0;
}

/* When open */
.expansion-panel-content.show {
  max-height: 200px; /* Adjust based on your content height */
  opacity: 1;
}

/* Alternative: Use v-show with transition classes */
.expansion-panel-content-enter-active,
.expansion-panel-content-leave-active {
  transition: max-height 0.3s ease, opacity 0.3s ease;
  overflow: hidden;
}

.expansion-panel-content-enter-from,
.expansion-panel-content-leave-to {
  max-height: 0;
  opacity: 0;
}

.expansion-panel-content-enter-to,
.expansion-panel-content-leave-from {
  max-height: 200px;
  opacity: 1;
}

/* Ongeza hii kwa arrow icon */
.expand-icon svg {
  transition: transform 0.3s ease;
}

/* Optional: Smooth padding for the container */
.tax-details .tax-details-expansion.light[data-v-5d3da755] {
  transition: padding-bottom 0.3s ease;
}

.tax-details .tax-details-expansion.light.is-open[data-v-5d3da755] {
  padding-bottom: 16px; /* Ongeza padding wakati inafunguka */
}

/* Optional: Add hover effect to clickable area */
.title.pointer {
  cursor: pointer;
  user-select: none;
}

.title.pointer:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

  .router-view {
    position: relative;
    min-width: 38dvw;
}
.header[data-v-7f504cc4] {
    background-color: #fff;
    border-bottom: 1px solid #e6e7e2;
    align-items: center;
    padding: 12px;
    display: flex;
    color: #252a2d;
}
.header .back[data-v-7f504cc4], .header .share[data-v-7f504cc4] {
    color: #252a2d;
    cursor: pointer;
}
.header .back .icon[data-v-7f504cc4], .header .share .icon[data-v-7f504cc4] {
    width: 16px;
    max-width: 16px;
    height: 16px;
    max-height: 16px;
}
.header .betslip-title[data-v-7f504cc4] {
    text-align: center;
    width: 100%;
    display: inline-block;
}
.header .betslip-title .id[data-v-7f504cc4] {
    justify-content: center;
    align-items: center;
    gap: 8px;
    font-weight: 700;
    display: flex;
}
.summary[data-v-7f504cc4] {
    background: #f4f5f0;
    border-bottom: 1px solid #e6e7e2;
    padding-top: 8px;
    color: #252a2d;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
}

.tier-banner[data-v-af0326d2] {
    align-items: center;
    column-gap: 16px;
    width: 100%;
    max-width: 350px;
    margin: auto;
    padding: 8px 12px 16px;
    display: flex;
    position: relative;
}
.tier-banner .trophy-img[data-v-af0326d2] {
    width: auto;
    height: 60px;
}
.tier-banner .trophy-bg[data-v-af0326d2] {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    right: 0;
}
.tier-banner .congrats-text[data-v-af0326d2] {
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
}
.tier-banner .congrats-text[data-v-af0326d2] .amount {
    text-transform: uppercase;
    font-weight: 700;
    font-size: 16px;
    line-height: 22px;


}
.tier-banner .congrats-text[data-v-af0326d2] .win-big-text{
    text-transform: uppercase;
    font-weight: 700;
    font-size: 16px;
    line-height: 22px;
}
.tier-banner .congrats-text[data-v-af0326d2] .symbol{
    text-transform: uppercase;
    font-size: 16px;
    line-height: 22px;
    font-weight: 700;

}
.tier-banner .congrats-text[data-v-af0326d2] .amount{
    text-transform: uppercase;
    font-size: 16px;
    line-height: 22px;
    font-weight: 700;

}
.win-tier[data-v-7f504cc4] {
    border-width: 3px;
}
.betslip-summary-container[data-v-7f504cc4] {
    background-color: #fff;
    border: 3px solid #e6e7e2;
    margin: 0 8px 8px;
    padding: 12px;
}
.summary .summary-line[data-v-7f504cc4] {
    justify-content: space-between;
    padding-bottom: 4px;
    display: flex;
}
.summary .summary-line .label[data-v-7f504cc4]{
    font-weight: 700;
}
.summary .summary-line .value[data-v-7f504cc4] {
    font-weight: 700;
}
.summary .summary-line[data-v-7f504cc4] {
    justify-content: space-between;
    padding-bottom: 4px;
    display: flex;
}
.summary .summary-line.selected .label[data-v-7f504cc4]{
    color: #7a8185;
    font-weight: 400;
}
.summary .summary-line.selected .value[data-v-7f504cc4] {
    color: #7a8185;
    font-weight: 400;
}
.summary .summary-line[data-v-7f504cc4] {
    justify-content: space-between;
    padding-bottom: 4px;
    display: flex;
}
.tax-details[data-v-5d3da755] {
    display: block !important;
}
.tax-details .tax-details-expansion.light[data-v-5d3da755] {
    background-color: #f2f2f3;
    border-radius: 4px;
    margin-bottom: 4px;
    padding: 8px;
}

.tax-details>div[data-v-5d3da755] {
    color: #484f52;
}
.expansion-panel.small .title[data-v-aabe1219] {
    margin-bottom: 4px;
    padding: 0;
}

.expansion-panel.minimal .title[data-v-aabe1219], .expansion-panel.small .title[data-v-aabe1219] {
    background-color: transparent;
    border-top: none;
    padding-top: 0px;
}
.expansion-panel .title[data-v-aabe1219] {
    color: #252a2d;
    -webkit-tap-highlight-color: transparent;
    fill: #252a2d;
    background: #e6e7e1;
    flex-flow: row;
    justify-content: space-between;
    align-items: center;
    padding: 16px 16px 8px;
    display: flex;
}
.table {
    width: 100%;
    display: table;
}
.expansion-panel .expand-icon-left[data-v-aabe1219] {
    margin-right: 8px;
}
.expansion-panel .expand-icon[data-v-aabe1219] {
    display: flex;
}
svg.icon-size-very-small[data-v-02f45589], img.icon-size-very-small[data-v-02f45589] {
    width: 10px;
    height: 10px;
}
.expansion-panel .title .title-text[data-v-aabe1219] {
    margin-right: auto;
}
.table .row-cell.align-middle {
    vertical-align: middle;
}
.table .row-cell {
    display: table-cell;
}
.expansion-panel.minimal .title h3[data-v-aabe1219] {
    text-transform: none;
}
.expansion-panel.minimal .title h3[data-v-aabe1219], .expansion-panel.small .title h3[data-v-aabe1219] {
    font-weight: 400;
}
.expansion-panel.small .title h3[data-v-aabe1219] {
    font-size: 12px;
    line-height: 16px;
}
.tax-details .summary-line[data-v-5d3da755] {
    justify-content: space-between;
    padding-bottom: 4px;
    display: flex;
}
.tax-details .summary-line[data-v-5d3da755] {
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
}
.tax-details .divider[data-v-5d3da755] {
    background-color: #cacdce;
    height: 1px;
    margin-bottom: 4px;
}
.summary .summary-line[data-v-7f504cc4]:last-child {
    border-bottom: none;
    padding-bottom: 0;
}
.summary .summary-line.result[data-v-7f504cc4] {
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
}
.summary .summary-line .winning-result[data-v-7f504cc4] {
    color: #8dc63f;
}
.summary .summary-line .label[data-v-7f504cc4]{
    font-weight: 700;
}
.summary-line .value[data-v-7f504cc4] {
    font-weight: 700;
}
.single-betslip .betslip-sharing[data-v-7f504cc4] {
    justify-content: center;
    padding: 4px 0 12px;
    display: flex;
}
.single-betslip .betslip-sharing .share-win-button[data-v-7f504cc4] {
    justify-content: center;
    align-items: center;
    display: flex;
}
.button-primary {
    color: #252a2d;
    fill: #252a2d;
    background-color: #9ce800;
}
.button {
    cursor: pointer;
    max-width: 300px;
    font-family: inherit;
    cursor: pointer;
    max-width: 300px;
    font-family: inherit;
    font-weight: 700;
    font-size: 14px;
    -webkit-appearance: none;
    box-sizing: border-box;
    -ms-box-sizing: border-box;
    -webkit-background-origin: border-box;
    text-align: center;
    text-transform: uppercase;
    vertical-align: middle;
    background-origin: border-box;
    -webkit-background-clip: border-box;
    background-clip: border-box;
    border: 0;
    border-radius: 0;
    padding: 10px 20px;
    display: inline-block;

}



.single-betslip .betslip-sharing .share-win-button .icon[data-v-7f504cc4] {
    margin-right: 8px;
}
svg.icon-size-medium[data-v-02f45589], img.icon-size-medium[data-v-02f45589] {
    width: 16px;
    height: 16px;
}
.event[data-v-695b065a] {
    color: #252a2d;
    border-bottom: 1px solid #e6e7e2;
    padding: 8px;
    position: relative;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
}
.event .event-line.event-header[data-v-695b065a] {
    align-items: center;
    font-weight: 400;

}
.event .event-line.event-header[data-v-695b065a] {
    font-size: 14px;
    line-height: 18px;
}
.event .event-line[data-v-695b065a] {
    justify-content: space-between;
    margin-bottom: 6px;
    display: flex;
    position: relative;
}
.event-label[data-v-695b065a] {
    flex-wrap: wrap;
    align-items: center;
    display: flex;
    position: relative;
}
.event .event-line .label[data-v-695b065a] {
    margin-right: 14px;
}
.event .event-line.event-header .date[data-v-695b065a] {
    font-weight: 700;
}
.event .event-line.event-header .odd.win[data-v-695b065a] {
    color: #8dc63f;
}
.event .event-line.event-header .odd[data-v-695b065a] {
    align-items: center;
    font-weight: 700;
    display: flex;
}
.event .event-line.event-header .badge[data-v-695b065a] {
    margin-right: 0;
}
.type-win[data-v-891f4695] {
    color: #252a2d;
    background: #8dc63f;
}
.mode-circle[data-v-891f4695] {
    vertical-align: text-bottom;
    width: 18px;
    height: 18px;
    margin: 0 7px;
}
.badge {
    text-align: center;
    color: #252a2d;
    background: #fff border-box;
    border: 0;
    border-radius: 0;
    margin-right: 7px;
    /* padding: 2px 7px; */
    display: inline-block;
    font-weight: 400;
    font-size: 13px;
    line-height: 16px;
}
.event .event-line[data-v-695b065a]:last-child {
    margin-bottom: 0;
}
.event .event-line[data-v-695b065a] {
    justify-content: space-between;
    margin-bottom: 6px;
    display: flex;
    position: relative;
}
.event .event-line .label[data-v-695b065a] {
    margin-right: 14px;
}
.event .event-line .label .match[data-v-695b065a] {
    align-items: center;
    display: flex;
}
.sport-icon[data-v-695b065a] {
    fill: #aaaeb0;
    vertical-align: text-top;
    flex-shrink: 0;
    width: 14px;
    height: 14px;
    margin-right: 4px;
    display: inline-block;
}
.event .event-line .label .league[data-v-695b065a] {
    color: #8e9398;
}
.bold {
    font-weight: 700;
}
.event .event-line .result[data-v-695b065a] {
    white-space: nowrap;
    font-weight: 700;

}
.event .event-line .result[data-v-695b065a]{
    font-size: 14px;
    line-height: 18px;
}
.event-info[data-v-695b065a] {
    text-align: right;
}
.legend[data-v-7f504cc4] {
    text-align: center;
    padding: 0 8px 8px;
}
.legend .placed-date[data-v-7f504cc4] {
    margin-top: 8px;
}
.legend .placed-date[data-v-7f504cc4]{
    font-weight: 400;
}
.legend .placed-date[data-v-7f504cc4] {
    font-size: 12px;
    line-height: 16px;
}
.lightgray {
    color: #252a2d;
}
.legend .nowrap[data-v-7f504cc4] {
    white-space: nowrap;
}
.legend .summary-legend[data-v-7f504cc4] {
    margin-top: 6px;
}
legend .summary-legend .badge[data-v-7f504cc4]:first-child {
    margin-left: 0;
}
.legend .summary-legend .badge[data-v-7f504cc4] {
    margin: 0 4px 0 12px;
}
.type-pending[data-v-891f4695], .type-pending-dark[data-v-891f4695] {
    background: #e6e7e2;
}
.mode-circle[data-v-891f4695] {
    vertical-align: text-bottom;
    width: 18px;
    height: 18px;
    margin: 0 7px;
}

.legend .summary-legend .badge[data-v-7f504cc4] {
    margin: 0 4px 0 12px;
}
.type-win[data-v-891f4695] {
    color: #252a2d;
    background: #8dc63f;
}
.mode-circle[data-v-891f4695] {
    vertical-align: text-bottom;
    width: 18px;
    height: 18px;
    margin: 0 7px;
}
.legend .summary-legend .badge[data-v-7f504cc4] {
    margin: 0 4px 0 12px;
}
.type-lose[data-v-891f4695] {
    background: #cc371b;
}
.mode-circle[data-v-891f4695] {
    vertical-align: text-bottom;
    width: 18px;
    height: 18px;
    margin: 0 7px;
}
.type-cancelled[data-v-891f4695] {
    background: #e6e7e2;
    padding: 0;
}
.mode-circle[data-v-891f4695] {
    vertical-align: text-bottom;
    width: 18px;
    height: 18px;
    margin: 0 7px;
}
.type-cancelled .icon[data-v-891f4695] {
    fill: #aaaeb0;
    width: 12px;
    height: 12px;
    margin: 0;
}
.mybets-regulation[data-v-fb673205] {
    border-top: 1px solid #e6e7e2;
    margin-top: 8px;
    padding: 8px 0;
    color: #252a2d;
}
.mybets-regulation-msg[data-v-fb673205] {
    text-align: center;
    padding: 4px 11px;
    font-style: italic;
}
.mybets-regulation-msg[data-v-fb673205] {
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
}
a.underline:not([class*=button]) {
    text-decoration: underline;
}
  </style>