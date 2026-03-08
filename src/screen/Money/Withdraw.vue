<script setup>
import { ref, computed } from 'vue';

// Logic ya kiasi cha pesa
const amount = ref(null);
const minWithdraw = 100;
const maxWithdraw = 3000000;

// Logic ya ku-enable/disable button kulingana na kiasi
const isInvalid = computed(() => {
    if (!amount.value) return true;
    return amount.value < minWithdraw || amount.value > maxWithdraw;
});

const handleWithdraw = () => {
    if (!isInvalid.value) {
        console.log('Kiasi kinachotolewa:', amount.value);
        // Ongeza API call yako hapa
    }
};
</script>

<template>
    <div data-v-3cb9dec9="" class="withdraw router-view" params="[object Object]">
        <div data-v-c9b60287="" data-v-3cb9dec9="">
            <div data-v-907442d3="" class="header-container">
                <h2 data-v-907442d3="">Withdraw </h2>
            </div>
            <div data-v-c9b60287="" class="withdraw-component">
                <div data-v-c9b60287="" class="withdraw-form-wrapper">
                    <div data-v-c9b60287="">
                        <div data-v-4b7cd401="" data-v-c9b60287="" class="withdraw-form">
                            <form data-v-4b7cd401="" class="form" @submit.prevent="handleWithdraw">
                                <div data-v-3e7e08c6="" data-v-d7674060="" data-v-4b7cd401="" class="user-phone withdraw-phone">
                                    <div data-v-3e7e08c6="" class="table">
                                        
                                        <div data-v-3e7e08c6="" class="row-cell align-middle user-phone-number">
                                            <div data-v-3e7e08c6="" class="user-phone-info-wrapper">
                                                <div data-v-3e7e08c6="" class="user-phone-info">
                                                    <div data-v-3e7e08c6="" class="user-phone-label">Your mobile number</div>
                                                    <div data-v-3e7e08c6="">+255 750</div>
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
                                            inputmode="text"
                                            id="withdraw-form-amount" 
                                            name="amount" 
                                            type="text" 
                                        >
                                    </div>
                                    <div data-v-1a892a33="" class="help-text">Min: 100, Max: 3,000,000</div>
                                </div>
                                <button 
                                    data-v-cb45c6b7="" 
                                    data-v-4b7cd401=""
                                    class="button button-primary button-full" 
                                    :disabled="isInvalid"
                                    type="submit"
                                >
                                    Withdraw
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
/* Hizi hapa ni styles zako ulizozitoa, nimebakiza data-v selectors kama zilivyo */

.withdraw[data-v-3cb9dec9] {
    padding: 20px;
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
    background-color: #9ce800;
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
</style>