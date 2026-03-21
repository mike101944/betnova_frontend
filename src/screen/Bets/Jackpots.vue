<script setup>
import {ref,onMounted} from 'vue'
import Loader from '../../assets/loader/default-spinner-BIEd0VkD.gif'


const isLoading = ref(false)

onMounted(()=>{
    isLoading.value = true
    setTimeout(() => {
        isLoading.value = false
    }, 1000); // Simulate loading for 1 second
})

</script>

<template>
 <div data-v-beccd7ea="" class="bets-list-container">

        <!-- LOADER SECTION -->
        <div v-if="isLoading" class="loading-container">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>

            <div v-else>
                <section data-v-beccd7ea="" aria-hidden="false" class="tab-section">
                    <div data-v-34417751="" data-v-beccd7ea="">
                        <div data-v-34417751="" class="no-data-text">
                            <div data-v-994d5d7e="" data-v-beccd7ea="" class="empty-betslip-open"><svg
                                    data-v-02f45589="" data-v-994d5d7e="" class="svg-icon empty-betslip-icon"
                                    style="vertical-align: middle;"><!---->
                                    <use data-v-02f45589="" xlink:href="#icon-betslip-illustration"></use>
                                </svg> <span data-v-994d5d7e="" class="caption">You have no previous Jackpot tickets.</span>
                                <div data-v-994d5d7e="" class="empty-betslip-button"><a data-v-994d5d7e=""
                                        href="/events" class="empty-betslip-button-link"
                                        data-test-id="emptyBetslipBtn">Browse Matches</a></div>
                            </div>
                        </div>
                    </div>
                </section>
                </div>
            </div>
</template>



<style  scoped>
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
    background-color: #0AF0B5;
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

</style>